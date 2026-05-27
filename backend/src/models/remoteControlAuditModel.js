const pool = require('../config/db');

/**
 * Audit log for remote-control sessions. School-liability requirement —
 * we record who controlled whose machine, the type of session, when it
 * started, when it ended, and whether the controlled user explicitly
 * armed OS-level input dispatch (vs. view-only / laser-pointer mode).
 */
const createRemoteControlAuditTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS remote_control_audit (
      id              SERIAL PRIMARY KEY,
      session_id      INT,
      session_code    VARCHAR(12),
      session_type    VARCHAR(64),
      controller_id   INT  NOT NULL,
      controller_role VARCHAR(20) NOT NULL,
      controller_name TEXT,
      host_id         INT  NOT NULL,
      host_role       VARCHAR(20) NOT NULL,
      host_name       TEXT,
      armed           BOOLEAN DEFAULT false,
      event           VARCHAR(32) NOT NULL,
      ip              VARCHAR(64),
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_remote_control_audit_session
    ON remote_control_audit (session_code, created_at DESC);
  `);
};

const recordAuditEvent = async (row) => {
  await pool.query(
    `INSERT INTO remote_control_audit
       (session_id, session_code, session_type,
        controller_id, controller_role, controller_name,
        host_id, host_role, host_name,
        armed, event, ip)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      row.session_id || null,
      row.session_code || null,
      row.session_type || null,
      row.controller_id, row.controller_role, row.controller_name || null,
      row.host_id, row.host_role, row.host_name || null,
      !!row.armed,
      row.event,
      row.ip || null,
    ]
  );
};

module.exports = { createRemoteControlAuditTable, recordAuditEvent };
