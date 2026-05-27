const pool = require('../config/db');

const createAuditLogsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      actor_name VARCHAR(100),
      actor_role VARCHAR(20),
      action VARCHAR(100) NOT NULL,
      target_type VARCHAR(50),
      target_id INTEGER,
      metadata JSONB,
      ip_address VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Audit logs table ready');
};

const createAuditLog = async ({
  actor_id, actor_name, actor_role,
  action, target_type, target_id,
  metadata, ip_address
}) => {
  const result = await pool.query(
    `INSERT INTO audit_logs
      (actor_id, actor_name, actor_role, action,
       target_type, target_id, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [actor_id, actor_name, actor_role, action,
     target_type || null, target_id || null,
     metadata ? JSON.stringify(metadata) : null,
     ip_address || null]
  );
  return result.rows[0];
};

const getAuditLogs = async ({ limit = 50, offset = 0, actor_id, action } = {}) => {
  let query = `
    SELECT a.*, u.email as actor_email
    FROM audit_logs a
    LEFT JOIN users u ON a.actor_id = u.id
    WHERE 1=1
  `;
  const values = [];
  let paramCount = 1;

  if (actor_id) {
    query += ` AND a.actor_id = $${paramCount}`;
    values.push(actor_id);
    paramCount++;
  }

  if (action) {
    query += ` AND a.action = $${paramCount}`;
    values.push(action);
    paramCount++;
  }

  query += ` ORDER BY a.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = { createAuditLogsTable, createAuditLog, getAuditLogs };