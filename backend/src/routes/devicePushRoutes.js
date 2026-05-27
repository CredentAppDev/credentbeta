const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { registerPushToken, unregisterPushToken } = require('../controllers/devicePushController');

router.post('/push-token', protect, registerPushToken);
router.delete('/push-token', protect, unregisterPushToken);

module.exports = router;
