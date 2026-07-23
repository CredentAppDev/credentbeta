const {
  registerDevice,
  pairDeviceByCode,
  getDeviceForToken,
  touchLastSeen,
  getDevicesForUser,
} = require('../models/espDeviceModel');

/**
 * Credent-owned ESP (Mino) pairing + config — Phase 1.
 * Replaces the third-party xiaozhi.me console with Credent's own flow.
 */

// POST /api/esp/register   (no user auth — the device has no account yet)
// Body: { hardware_id: string }
// Returns the 6-digit pairing code the device speaks, plus the device_token it
// must store and send back as x-device-token on later config polls.
const registerEspDevice = async (req, res) => {
  try {
    const { hardware_id } = req.body || {};
    if (!hardware_id || typeof hardware_id !== 'string' || hardware_id.length < 4) {
      return res.status(400).json({ message: 'hardware_id is required' });
    }

    const result = await registerDevice(hardware_id.trim());
    res.json({
      success: true,
      device_id: result.device_id,
      device_token: result.device_token,
      pairing_code: result.pairing_code,
      expires_at: result.expires_at,
    });
  } catch (err) {
    console.error('registerEspDevice error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/esp/pair   (no login — entering a valid 6-digit code activates it)
// Body: { code: string (6 digits) }
// If a logged-in user happens to call this (req.user set by an optional auth
// layer), the device is also attached to their account; otherwise it pairs
// anonymously.
const pairEspDevice = async (req, res) => {
  try {
    const code = String((req.body && req.body.code) || '').trim();
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ message: 'Enter the 6-digit code shown by your device' });
    }

    const ownerId = req.user ? req.user.id : null;
    const ownerRole = req.user ? req.user.role : null;
    const paired = await pairDeviceByCode(code, ownerId, ownerRole);
    if (!paired) {
      return res.status(404).json({
        message: 'That code is invalid or has expired. Power-cycle the device for a fresh code.',
      });
    }

    res.json({ success: true, device_id: paired.device_id });
  } catch (err) {
    console.error('pairEspDevice error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/esp/config/:deviceId   (device auth via x-device-token header)
// Returns the live manifest the firmware applies (the dynamic esp-source.json).
const getEspConfig = async (req, res) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const deviceToken = req.headers['x-device-token'];
    if (!deviceId || !deviceToken) {
      return res.status(401).json({ message: 'device id and x-device-token required' });
    }

    const device = await getDeviceForToken(deviceId, deviceToken);
    if (!device) {
      return res.status(401).json({ message: 'Unknown device or bad token' });
    }

    // best-effort heartbeat; never block the response on it
    touchLastSeen(deviceId).catch(() => {});

    // OTA: advertise a firmware build to the device. Opt-in via env so a deploy
    // doesn't push firmware unless you set both. The firmware compares
    // firmwareVersion against its own FIRMWARE_VERSION and, if newer, downloads
    // firmwareUrl over HTTPS and flashes it. Set these in the Render dashboard:
    //   CREDENT_FW_VERSION   e.g. 1.1.0
    //   CREDENT_FW_URL       e.g. https://github.com/CredentAppDev/credent-website/releases/download/mino-v1.1.0/credent-mino.bin
    const ota = {};
    if (process.env.CREDENT_FW_VERSION) ota.firmwareVersion = process.env.CREDENT_FW_VERSION;
    if (process.env.CREDENT_FW_URL) ota.firmwareUrl = process.env.CREDENT_FW_URL;

    res.json({
      success: true,
      device_id: device.id,
      status: device.status,         // 'unpaired' until a user pairs it
      paired: device.status === 'paired',
      config: { ...(device.role_config || {}), ...ota },  // manifest + OTA fields
    });
  } catch (err) {
    console.error('getEspConfig error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/esp/my-devices   (protect — list the caller's paired devices)
const listMyEspDevices = async (req, res) => {
  try {
    const devices = await getDevicesForUser(req.user.id, req.user.role);
    res.json({ success: true, devices });
  } catch (err) {
    console.error('listMyEspDevices error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerEspDevice,
  pairEspDevice,
  getEspConfig,
  listMyEspDevices,
};
