const express = require('express');
const router = express.Router();
const {
  getEmailSettings,
  updateEmailSettings,
  testEmailSettings,
} = require('../controllers/emailSettingsController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

router.use(protect);
router.use(isAdmin);

// @route   GET /api/email-settings
// @desc    Get current email settings
router.get('/', getEmailSettings);

// @route   PUT /api/email-settings
// @desc    Update email settings
router.put('/', updateEmailSettings);

// @route   POST /api/email-settings/test
// @desc    Send a test email
router.post('/test', testEmailSettings);

module.exports = router;