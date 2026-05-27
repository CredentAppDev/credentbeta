const express = require('express');
const router = express.Router();
const {
  login,
  passkeyStart,
  passkeyLogin,
  deviceLogin,
  requestNewPasskey,
  resetCurrentAgentPasskey,
  refresh,
  logout,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// ─── Validation Middleware ───────────────────────────────────────
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Passkey only — no email required
const validatePasskeyLogin = [
  body('passkey')
    .notEmpty()
    .withMessage('Passkey is required')
    .isLength({ min: 10, max: 10 })
    .withMessage('Passkey must be 10 digits'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ─── Routes ─────────────────────────────────────────────────────

// @route   POST /api/auth/login
// @desc    Admin password login
// @access  Public
router.post('/login', validateLogin, login);

// @route   POST /api/auth/passkey/start
// @desc    First passkey detection — determines whether user is agent, teacher or student
// @access  Public
router.post('/passkey/start', validatePasskeyLogin, passkeyStart);

// @route   POST /api/auth/passkey
// @desc    Agent passkey login — passkey only, no email needed
// @access  Public
router.post('/passkey', validatePasskeyLogin, passkeyLogin);

// @route   POST /api/auth/device
// @desc    Auto login using device token (after first login)
// @access  Public
router.post('/device', deviceLogin);

// @route   POST /api/auth/request-passkey
// @desc    Request a new passkey (sent to email)
// @access  Public
router.post('/request-passkey', requestNewPasskey);

// @route   POST /api/auth/agent/passkey/reset
// @desc    Agent settings passkey reset — backend generates the new passkey
// @access  Agent
router.post('/agent/passkey/reset', protect, resetCurrentAgentPasskey);

// @route   POST /api/auth/refresh
// @desc    Get new access token
// @access  Public
router.post('/refresh', refresh);

// @route   POST /api/auth/logout
// @desc    Logout and clear tokens
// @access  Public
router.post('/logout', logout);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;
