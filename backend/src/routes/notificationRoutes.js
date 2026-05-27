const express = require('express');
const router = express.Router();
const {
  getNotifications,
  readNotification,
  readAllNotifications,
  getUnread,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/notifications
// @desc    Get all notifications for current user
router.get('/', getNotifications);

// @route   GET /api/notifications/unread
// @desc    Get unread count
router.get('/unread', getUnread);

// @route   PATCH /api/notifications/:id/read
// @desc    Mark single notification as read
router.patch('/:id/read', readNotification);

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
router.patch('/read-all', readAllNotifications);

module.exports = router;