const pool = require('../config/db');

const createNotificationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      user_role VARCHAR(32),
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT,
      is_read BOOLEAN DEFAULT false,
      reference_id INTEGER,
      reference_type VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  await pool.query(`
    ALTER TABLE notifications
      DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
    ALTER TABLE notifications
      ADD COLUMN IF NOT EXISTS user_role VARCHAR(32);
    CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created
      ON notifications (user_id, user_role, created_at DESC);
  `);
  console.log('Notifications table ready');
};

const recipientWhere = (userRole, userIdParam = '$1', roleParam = '$2') => {
  if (['agent', 'admin'].includes(userRole)) {
    return `user_id = ${userIdParam} AND (user_role = ${roleParam} OR user_role IS NULL)`;
  }
  return `user_id = ${userIdParam} AND user_role = ${roleParam}`;
};

const createNotification = async ({
  user_id, user_role, type, title, body,
  reference_id, reference_type
}) => {
  const result = await pool.query(
    `INSERT INTO notifications
      (user_id, user_role, type, title, body, reference_id, reference_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id, user_role || null, type, title, body || null,
     reference_id || null, reference_type || null]
  );
  return result.rows[0];
};

const getUserNotifications = async (userId, userRole) => {
  const result = await pool.query(
    `SELECT * FROM notifications
     WHERE ${recipientWhere(userRole)}
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId, userRole]
  );
  return result.rows;
};

const markAsRead = async (notificationId, userId, userRole) => {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND ${recipientWhere(userRole, '$2', '$3')}
     RETURNING *`,
    [notificationId, userId, userRole]
  );
  return result.rows[0];
};

const markAllAsRead = async (userId, userRole) => {
  await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE ${recipientWhere(userRole)}`,
    [userId, userRole]
  );
};

const getUnreadCount = async (userId, userRole) => {
  const result = await pool.query(
    `SELECT COUNT(*) as count
     FROM notifications
     WHERE ${recipientWhere(userRole)} AND is_read = false`,
    [userId, userRole]
  );
  return parseInt(result.rows[0].count);
};

const getNotificationForUser = async (notificationId, userId, userRole) => {
  const result = await pool.query(
    `SELECT * FROM notifications
     WHERE id = $1 AND ${recipientWhere(userRole, '$2', '$3')}
     LIMIT 1`,
    [notificationId, userId, userRole]
  );
  return result.rows[0];
};

module.exports = {
  createNotificationsTable,
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotificationForUser,
};
