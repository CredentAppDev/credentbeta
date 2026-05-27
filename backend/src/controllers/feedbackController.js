const { body, validationResult } = require('express-validator');
const {
  insertFeedback,
  listFeedback,
  updateFeedbackStatus,
} = require('../models/feedbackModel');

const validateFeedback = [
  body('message')
    .exists({ checkFalsy: true })
    .withMessage('message is required')
    .isLength({ min: 3, max: 5000 })
    .withMessage('message must be 3–5000 characters'),
  body('category')
    .optional()
    .isIn(['bug', 'idea', 'question', 'praise', 'general'])
    .withMessage('category invalid'),
  body('severity')
    .optional()
    .isIn(['low', 'normal', 'high', 'blocker'])
    .withMessage('severity invalid'),
  body('email').optional().isEmail().withMessage('email invalid'),
];

// POST /api/feedback — any authenticated user can submit feedback.
// Anonymous submission is also allowed (no auth header) for bug reports from
// the login screen, in which case user_id stays null.
const submitFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const row = await insertFeedback({
      user_id: req.user?.id || null,
      role: req.user?.role || null,
      email: req.body.email || req.user?.email || null,
      category: req.body.category,
      severity: req.body.severity,
      message: req.body.message,
      page_context: req.body.page_context,
      app_version: req.get('x-app-version') || req.body.app_version,
      platform: req.get('x-client-platform') || req.body.platform,
      user_agent: req.get('user-agent'),
    });
    res.status(201).json({ message: 'Thanks for the feedback!', id: row.id });
  } catch (error) {
    console.error('submitFeedback error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/feedback — agent/admin only. Lists feedback for triage.
const getFeedback = async (req, res) => {
  if (!['agent', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const items = await listFeedback({
      status: req.query.status,
      limit: Math.min(Number(req.query.limit) || 100, 500),
      offset: Number(req.query.offset) || 0,
    });
    res.status(200).json({ feedback: items });
  } catch (error) {
    console.error('getFeedback error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/feedback/:id — agent/admin updates triage status.
const patchFeedback = async (req, res) => {
  if (!['agent', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const valid = ['new', 'acknowledged', 'in_progress', 'resolved', 'wontfix'];
  if (!valid.includes(req.body.status)) {
    return res.status(400).json({ message: 'status must be one of ' + valid.join(', ') });
  }
  try {
    const row = await updateFeedbackStatus(req.params.id, req.body.status);
    if (!row) return res.status(404).json({ message: 'Feedback not found' });
    res.status(200).json({ feedback: row });
  } catch (error) {
    console.error('patchFeedback error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  validateFeedback,
  submitFeedback,
  getFeedback,
  patchFeedback,
};
