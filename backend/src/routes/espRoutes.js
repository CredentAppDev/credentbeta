const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerEspDevice,
  pairEspDevice,
  getEspConfig,
  listMyEspDevices,
} = require('../controllers/espController');

// Device-facing (no user JWT — the ESP authenticates with its own device_token)
router.post('/register', registerEspDevice);
router.get('/config/:deviceId', getEspConfig);

// Public, no-login pairing — entering a valid 6-digit code activates the device.
router.post('/pair', pairEspDevice);

// Account-scoped: list a logged-in user's claimed devices (login still required).
router.get('/my-devices', protect, listMyEspDevices);

module.exports = router;
