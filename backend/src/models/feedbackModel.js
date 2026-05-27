const pool = require('../config/db');

const createFeedbackTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS beta_feedback (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      role VARCHAR(32),
      email VARCHAR(255),
      category VARCHAR(32) NOT NULL DEFAULT 'general'
        CHECK (category IN ('bug', 'idea', 'question', 'praise', 'general')),
      severity VARCHAR(16) DEFAULT 'normal'
        CHECK (severity IN ('low', 'normal', 'high', 'blocker')),
      message TEXT NOT NULL,
      page_context VARCHAR(255),
      app_version VARCHAR(32),
      platform VARCHAR(32),
      user_agent TEXT,
      status VARCHAR(32) DEFAULT 'new'
        CHECK (status IN ('new', 'acknowledged', 'in_progress', 'resolved', 'wontfix')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_beta_feedback_status_created
      ON beta_feedback (status, created_at DESC);
  `);
  console.log('✅ Beta feedback table ready');
};

const insertFeedback = async (data) => {
  const result = await pool.query(
    `INSERT INTO beta_feedback (
       user_id, role, email, category, severity, message,
       page_context, app_version, platform, user_agent
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, created_at`,
    [
      data.user_id || null,
      data.role || null,
      data.email || null,
      data.category || 'general',
      data.severity || 'normal',
      data.message,
      data.page_context || null,
      data.app_version || null,
      data.platform || null,
      data.user_agent || null,
    ]
  );
  return result.rows[0];
};

const listFeedback = async ({ status, limit = 100, offset = 0 } = {}) => {
  const where = status ? 'WHERE status = $1' : '';
  const params = status ? [status, limit, offset] : [limit, offset];
  const limitIdx = status ? '$2' : '$1';
  const offsetIdx = status ? '$3' : '$2';
  const result = await pool.query(
    `SELECT * FROM beta_feedback ${where}
     ORDER BY created_at DESC
     LIMIT ${limitIdx} OFFSET ${offsetIdx}`,
    params
  );
  return result.rows;
};

const updateFeedbackStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE beta_feedback
       SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status]
  );
  return result.rows[0];
};

module.exports = {
  createFeedbackTable,
  insertFeedback,
  listFeedback,
  updateFeedbackStatus,
};
