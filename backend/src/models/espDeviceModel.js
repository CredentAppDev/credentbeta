const crypto = require('crypto');
const pool = require('../config/db');

/**
 * Credent-owned ESP32 (Mino) device registry — Phase 1 of replacing the
 * third-party xiaozhi.me console with Credent's own pairing + config flow.
 *
 * Lifecycle:
 *   1. Device boots, has no account → POST /api/esp/register with its
 *      hardware_id. We create (or refresh) a row, mint a fresh 6-digit
 *      pairing_code (10-min expiry) and a long-lived device_token, and the
 *      device speaks/displays the code.
 *   2. A logged-in user types that code on the website → POST /api/esp/pair
 *      binds the device to their account (owner_user_id + owner_role).
 *   3. The device polls GET /api/esp/config/:deviceId (authenticated with its
 *      device_token) to pull its live manifest — the dynamic replacement for
 *      the static esp-source.json.
 *
 * The live voice loop (mic → ASR → LLM → MCP → TTS) is intentionally NOT part
 * of Phase 1; role_config just carries the source/voice/model/MCP settings.
 */

// Default manifest values — the dynamic version of site/esp-source.json. These
// seed role_config when a device first registers; a paired device's role can
// later override individual fields.
const DEFAULT_ROLE_CONFIG = {
  brand: 'Credent',
  deviceFamily: 'Mino',
  board: 'DFRobot ESP32-S3 AI Cam',
  assistantSource: 'Credent Emrys',
  voice: 'emrys-default',
  model: 'emrys',
  mcpToolsSource: 'Credent MCP device tools',
  mcpToolsEnabled: true,
  usesThirdPartyConsole: false,
};

const PAIRING_CODE_TTL_MINUTES = 10;

const createEspDevicesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS esp_devices (
      id              SERIAL PRIMARY KEY,
      hardware_id     VARCHAR(128) NOT NULL UNIQUE,
      device_token    VARCHAR(80)  NOT NULL UNIQUE,
      pairing_code    VARCHAR(6),
      code_expires_at TIMESTAMPTZ,
      owner_user_id   INT,
      owner_role      VARCHAR(20),
      role_config     JSONB        NOT NULL DEFAULT '{}'::jsonb,
      status          VARCHAR(16)  NOT NULL DEFAULT 'unpaired'
                       CHECK (status IN ('unpaired','paired')),
      paired_at       TIMESTAMPTZ,
      last_seen_at    TIMESTAMPTZ,
      created_at      TIMESTAMPTZ  DEFAULT NOW(),
      updated_at      TIMESTAMPTZ  DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_esp_devices_code
    ON esp_devices (pairing_code);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_esp_devices_owner
    ON esp_devices (owner_user_id, owner_role);
  `);
};

// 6-digit numeric code (leading zeros allowed, e.g. "048213").
const generatePairingCode = () =>
  crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');

// Opaque per-device secret the firmware stores and sends as x-device-token.
const generateDeviceToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Register (or re-register) a device by its hardware id. Always mints a fresh
 * pairing code + expiry so a power-cycled device can re-pair. The device_token
 * is created once and preserved across re-registrations.
 *
 * @returns {{ device_id, pairing_code, device_token, status, expires_at }}
 */
const registerDevice = async (hardwareId) => {
  const pairingCode = generatePairingCode();
  const deviceToken = generateDeviceToken();

  const { rows } = await pool.query(
    `INSERT INTO esp_devices (hardware_id, device_token, pairing_code, code_expires_at, role_config)
     VALUES ($1, $2, $3, NOW() + INTERVAL '${PAIRING_CODE_TTL_MINUTES} minutes', $4)
     ON CONFLICT (hardware_id) DO UPDATE
       SET pairing_code    = EXCLUDED.pairing_code,
           code_expires_at = EXCLUDED.code_expires_at,
           last_seen_at    = NOW(),
           updated_at      = NOW()
     RETURNING id, device_token, pairing_code, code_expires_at, status`,
    [hardwareId, deviceToken, pairingCode, JSON.stringify(DEFAULT_ROLE_CONFIG)]
  );

  const row = rows[0];
  return {
    device_id: row.id,
    pairing_code: row.pairing_code,
    device_token: row.device_token, // existing token on re-register, new on first
    status: row.status,
    expires_at: row.code_expires_at,
  };
};

/**
 * Pair an unexpired code. No login is required — entering a valid, unexpired
 * code activates the device. owner_user_id / owner_role are optional and stay
 * null for anonymous (no-account) pairing; they can be set later if the device
 * is claimed from a logged-in context. Clears the code on success so it can't
 * be reused.
 *
 * @returns {{ device_id }} on success, or null if no valid/unexpired code.
 */
const pairDeviceByCode = async (code, ownerUserId = null, ownerRole = null) => {
  const { rows } = await pool.query(
    `UPDATE esp_devices
        SET owner_user_id   = $2,
            owner_role      = $3,
            status          = 'paired',
            paired_at       = NOW(),
            pairing_code    = NULL,
            code_expires_at = NULL,
            updated_at      = NOW()
      WHERE pairing_code = $1
        AND code_expires_at > NOW()
      RETURNING id`,
    [code, ownerUserId, ownerRole]
  );
  if (rows.length === 0) return null;
  return { device_id: rows[0].id };
};

/**
 * Fetch a device's live config manifest. Authenticated by device_token so one
 * device can never read another's config.
 *
 * @returns the device row (without the token) or null if id/token mismatch.
 */
const getDeviceForToken = async (deviceId, deviceToken) => {
  const { rows } = await pool.query(
    `SELECT id, hardware_id, owner_user_id, owner_role, role_config, status, paired_at
       FROM esp_devices
      WHERE id = $1 AND device_token = $2`,
    [deviceId, deviceToken]
  );
  return rows[0] || null;
};

const touchLastSeen = async (deviceId) => {
  await pool.query(
    `UPDATE esp_devices SET last_seen_at = NOW() WHERE id = $1`,
    [deviceId]
  );
};

const getDevicesForUser = async (ownerUserId, ownerRole) => {
  const { rows } = await pool.query(
    `SELECT id, hardware_id, status, paired_at, last_seen_at
       FROM esp_devices
      WHERE owner_user_id = $1 AND owner_role = $2
      ORDER BY paired_at DESC NULLS LAST`,
    [ownerUserId, ownerRole]
  );
  return rows;
};

module.exports = {
  DEFAULT_ROLE_CONFIG,
  createEspDevicesTable,
  registerDevice,
  pairDeviceByCode,
  getDeviceForToken,
  touchLastSeen,
  getDevicesForUser,
};
