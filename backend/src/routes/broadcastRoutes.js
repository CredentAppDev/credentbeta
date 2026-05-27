const express = require('express');
const router = express.Router();
const { sendBroadcast, getBroadcasts } = require('../controllers/broadcastController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

router.use(protect);
router.use(isAdmin);

// @route   POST /api/broadcast
// @desc    Send broadcast to all staff or specific role
router.post('/', sendBroadcast);

// @route   GET /api/broadcast
// @desc    Get broadcast history
router.get('/', getBroadcasts);

module.exports = router;