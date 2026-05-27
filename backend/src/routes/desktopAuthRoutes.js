const express = require('express');
const router = express.Router();
const { initiate, verify, pendingCode } = require('../controllers/desktopAuthController');
const { protect } = require('../middleware/auth');

router.post('/initiate', initiate);
router.post('/verify', verify);
router.get('/pending-code', protect, pendingCode);

module.exports = router;
