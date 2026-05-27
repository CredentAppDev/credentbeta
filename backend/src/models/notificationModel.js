const pool = require('../config/db');

const createNotificationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
  console.log('✅ Notifications table ready');
};

const createNotification = async ({
  user_id, type, title, body,
  reference_id, reference_type
}) => {
  const result = await pool.query(
    `INSERT INTO notifications
      (user_id, type, title, body, reference_id, reference_type)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, type, title, body || null,
     reference_id || null, reference_type || null]
  );
  return result.rows[0];
};

const getUserNotifications = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );
  return result.rows;
};

const markAsRead = async (notificationId, userId) => {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );
  return result.rows[0];
};

const markAllAsRead = async (userId) => {
  await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE user_id = $1`,
    [userId]
  );
};

const getUnreadCount = async (userId) => {
  const result = await pool.query(
    `SELECT COUNT(*) as count
     FROM notifications
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return parseInt(result.rows[0].count);
};

module.exports = {
  createNotificationsTable,
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};