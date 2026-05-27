const pool = require('../config/db');

/**
 * Stores per-user push notification tokens.
 *
 * One row per (user_id, user_role, platform, token). The same user can have
 * several rows (e.g. an Android phone + an iPad). The `voip_token` column is
 * iOS-only and is delivered separately by PushKit; for Android it stays null.
 *
 * Tokens get rotated by Apple/Google over time, so the registration endpoint
 * uses ON CONFLICT to overwrite an existing row keyed on (platform, token).
 */
const createDevicePushTokensTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS device_push_tokens (
      id            SERIAL PRIMARY KEY,
      user_id       INT          NOT NULL,
      user_role     VARCHAR(20)  NOT NULL,
      platform      VARCHAR(16)  NOT NULL CHECK (platform IN ('android','ios')),
      token         TEXT         NOT NULL,
      voip_token    TEXT,
      app_version   VARCHAR(32),
      created_at    TIMESTAMPTZ  DEFAULT NOW(),
      updated_at    TIMESTAMPTZ  DEFAULT NOW(),
      UNIQUE (platform, token)
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_device_push_tokens_user
    ON device_push_tokens (user_id, user_role);
  `);
};

const upsertDeviceToken = async ({
  user_id,
  user_role,
  platform,
  token,
  voip_token = null,
  app_version = null,
}) => {
  await pool.query(
    `INSERT INTO device_push_tokens (user_id, user_role, platform, token, voip_token, app_version)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (platform, token) DO UPDATE
       SET user_id     = EXCLUDED.user_id,
           user_role   = EXCLUDED.user_role,
           voip_token  = COALESCE(EXCLUDED.voip_token, device_push_tokens.voip_token),
           app_version = COALESCE(EXCLUDED.app_version, device_push_tokens.app_version),
           updated_at  = NOW()`,
    [user_id, user_role, platform, token, voip_token, app_version]
  );
};

const getTokensForUser = async (user_id, user_role) => {
  const r = await pool.query(
    `SELECT platform, token, voip_token
     FROM device_push_tokens
     WHERE user_id = $1 AND user_role = $2`,
    [user_id, user_role]
  );
  return r.rows;
};

const deleteTokenByValue = async (platform, token) => {
  await pool.query(
    `DELETE FROM device_push_tokens WHERE platform = $1 AND token = $2`,
    [platform, token]
  );
};

module.exports = {
  createDevicePushTokensTable,
  upsertDeviceToken,
  getTokensForUser,
  deleteTokenByValue,
};
