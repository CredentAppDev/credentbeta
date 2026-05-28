const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotificationForUser,
} = require('../models/notificationModel');
const { getFeedbackById } = require('../models/feedbackModel');

const getNotifications = async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user.id, req.user.role);
    const unreadCount = await getUnreadCount(req.user.id, req.user.role);

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const readNotification = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id, req.user.id, req.user.role);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Read notification error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const readAllNotifications = async (req, res) => {
  try {
    await markAllAsRead(req.user.id, req.user.role);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Read all notifications error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUnread = async (req, res) => {
  try {
    const count = await getUnreadCount(req.user.id, req.user.role);
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotificationDetail = async (req, res) => {
  try {
    const notification = await getNotificationForUser(req.params.id, req.user.id, req.user.role);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    let detail = null;
    if (notification.reference_type === 'beta_feedback' && notification.reference_id) {
      detail = await getFeedbackById(notification.reference_id);
    }

    res.status(200).json({ notification, detail });
  } catch (error) {
    console.error('Get notification detail error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNotifications,
  readNotification,
  readAllNotifications,
  getUnread,
  getNotificationDetail,
};
