const express = require('express');
const router = express.Router();
const {
  getOverviewStats,
  getTicketVolume,
  getAgentPerformance,
  getTicketsByCategory,
  getTicketsByPriority,
  getResponseTimes,
  getFullReport,
  getLearningLeaderboard,
  getProjectAnalytics,
  getAnalyticsSummary,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { isAdmin, allowRoles } = require('../middleware/roles');

// Analytics routes require login. Leaderboard is visible to learning users;
// operational ticket analytics remain admin-only below.
router.use(protect);

router.get(
  '/leaderboard',
  allowRoles('student', 'teacher', 'agent', 'admin'),
  getLearningLeaderboard
);

router.get(
  '/project-analytics',
  allowRoles('student', 'teacher', 'agent', 'admin'),
  getProjectAnalytics
);

// Summary shape consumed by iOS ProjectAnalyticsView + desktop engine.getAnalytics.
router.get(
  '/summary',
  allowRoles('student', 'teacher', 'agent', 'admin'),
  getAnalyticsSummary
);

router.use(isAdmin);

// @route   GET /api/analytics/overview
// @desc    Get overview stats
router.get('/overview', getOverviewStats);

// @route   GET /api/analytics/volume
// @desc    Get ticket volume over time
router.get('/volume', getTicketVolume);

// @route   GET /api/analytics/agents
// @desc    Get agent performance report
router.get('/agents', getAgentPerformance);

// @route   GET /api/analytics/categories
// @desc    Get tickets by category
router.get('/categories', getTicketsByCategory);

// @route   GET /api/analytics/priorities
// @desc    Get tickets by priority
router.get('/priorities', getTicketsByPriority);

// @route   GET /api/analytics/response-times
// @desc    Get response time report
router.get('/response-times', getResponseTimes);

// @route   GET /api/analytics/report
// @desc    Get full analytics report
router.get('/report', getFullReport);

module.exports = router;
