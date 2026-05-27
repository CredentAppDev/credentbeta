const express = require('express');
const { protect } = require('../middleware/auth');
const {
  validateFeedback,
  submitFeedback,
  getFeedback,
  patchFeedback,
} = require('../controllers/feedbackController');
const {
  validateCreateInvite,
  validateRedeem,
  createInvite,
  listInvites,
  revokeInvite,
  redeemInvite,
} = require('../controllers/inviteCodeController');

const router = express.Router();

// `optionalProtect` lets the request through whether or not a JWT is present.
// We use it for /feedback so testers can report bugs from the login screen too.
const optionalProtect = (req, res, next) => {
  if (!req.headers.authorization) return next();
  return protect(req, res, next);
};

// ─── Feedback ───────────────────────────────────────────────────────────────
router.post('/feedback', optionalProtect, validateFeedback, submitFeedback);
router.get('/feedback', protect, getFeedback);
router.patch('/feedback/:id', protect, patchFeedback);

// ─── Invite codes ───────────────────────────────────────────────────────────
router.post('/invites', protect, validateCreateInvite, createInvite);
router.get('/invites', protect, listInvites);
router.delete('/invites/:id', protect, revokeInvite);

// PUBLIC — testers self-register here using a code an agent shared with them.
router.post('/redeem', validateRedeem, redeemInvite);

module.exports = router;
