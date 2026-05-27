const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require('../models/notificationModel');

// ─── Get All Notifications ───────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user.id);
    const unreadCount = await getUnreadCount(req.user.id);

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Mark Single Notification as Read ───────────────────────────
const readNotification = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Read notification error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Mark All Notifications as Read ─────────────────────────────
const readAllNotifications = async (req, res) => {
  try {
    await markAllAsRead(req.user.id);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Read all notifications error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Unread Count ────────────────────────────────────────────
const getUnread = async (req, res) => {
  try {
    const count = await getUnreadCount(req.user.id);
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNotifications,
  readNotification,
  readAllNotifications,
  getUnread,
};