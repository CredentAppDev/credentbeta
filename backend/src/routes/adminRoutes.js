const express = require('express');
const router = express.Router();
const {
  getAgents,
  getAgent,
  createAgent,
  editAgent,
  deactivateAgent,
  reactivateAgent,
  resendPasskey,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { audit } = require('../middleware/audit');

// All admin routes require login + admin role
router.use(protect);
router.use(isAdmin);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', getDashboardStats);

// @route   GET /api/admin/agents
// @desc    Get all agents
router.get('/agents', getAgents);

// @route   GET /api/admin/agents/:id
// @desc    Get single agent
router.get('/agents/:id', getAgent);

// @route   POST /api/admin/agents
// @desc    Create new agent — generates passkey and sends to email
router.post('/agents', audit('agent:created', 'user'), createAgent);

// @route   PATCH /api/admin/agents/:id
// @desc    Edit agent info or role
router.patch('/agents/:id', audit('agent:updated', 'user'), editAgent);

// @route   PATCH /api/admin/agents/:id/deactivate
// @desc    Deactivate agent account
router.patch('/agents/:id/deactivate', audit('agent:deactivated', 'user'), deactivateAgent);

// @route   PATCH /api/admin/agents/:id/reactivate
// @desc    Reactivate agent account
router.patch('/agents/:id/reactivate', reactivateAgent);

// @route   POST /api/admin/agents/:id/resend-passkey
// @desc    Generate and resend new passkey to agent email
router.post('/agents/:id/resend-passkey', audit('agent:passkey_resent', 'user'), resendPasskey);

module.exports = router;