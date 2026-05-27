const { upsertDeviceToken, deleteTokenByValue } = require('../models/devicePushTokenModel');

// POST /api/devices/push-token
// Auth: Bearer JWT (req.user.id, req.user.role populated by `protect`).
// Body: { platform: 'android'|'ios', token: string, voip_token?: string, app_version?: string }
const registerPushToken = async (req, res) => {
  try {
    const { platform, token, voip_token, app_version } = req.body || {};

    if (!platform || !['android', 'ios'].includes(platform)) {
      return res.status(400).json({ message: 'platform must be "android" or "ios"' });
    }
    if (!token || typeof token !== 'string' || token.length < 8) {
      return res.status(400).json({ message: 'token is required' });
    }

    await upsertDeviceToken({
      user_id: req.user.id,
      user_role: req.user.role,
      platform,
      token,
      voip_token: voip_token || null,
      app_version: app_version || null,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('registerPushToken error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/devices/push-token
// Body: { platform, token } — call this on logout so tokens stop receiving pushes.
const unregisterPushToken = async (req, res) => {
  try {
    const { platform, token } = req.body || {};
    if (!platform || !token) {
      return res.status(400).json({ message: 'platform and token required' });
    }
    await deleteTokenByValue(platform, token);
    res.json({ success: true });
  } catch (err) {
    console.error('unregisterPushToken error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerPushToken, unregisterPushToken };
