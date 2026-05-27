const pool = require('../config/db');
const crypto = require('crypto');

const SCREEN_SESSION_SIGNAL_TYPES = [
  'offer',
  'answer',
  'ice',
  'ice_controller',
  'ice_host',
  'pointer',
  'frame',
  'joined',
  'host_sharing',
  'student_sharing',
  'declined',          // host cancelled the screen-share consent modal
  'end',
];

const createScreenSessionTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS screen_sessions (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      host_role VARCHAR(20) NOT NULL CHECK (host_role IN ('teacher', 'agent', 'admin', 'student')),
      host_id INTEGER NOT NULL,
      school_id INTEGER,
      target_user_id INTEGER,
      target_user_role VARCHAR(20),
      status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
      max_participants INTEGER DEFAULT 5,
      created_at TIMESTAMP DEFAULT NOW(),
      ended_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS screen_session_participants (
      id SERIAL PRIMARY KEY,
      session_id INTEGER REFERENCES screen_sessions(id) ON DELETE CASCADE,
      participant_role VARCHAR(20) NOT NULL,
      participant_id INTEGER NOT NULL,
      joined_at TIMESTAMP DEFAULT NOW(),
      left_at TIMESTAMP,
      is_active BOOLEAN DEFAULT true,
      UNIQUE (session_id, participant_id, participant_role)
    );

    CREATE TABLE IF NOT EXISTS screen_session_signals (
      id SERIAL PRIMARY KEY,
      session_id INTEGER REFERENCES screen_sessions(id) ON DELETE CASCADE,
      from_id INTEGER NOT NULL,
      from_role VARCHAR(20) NOT NULL,
      to_id INTEGER,
      signal_type VARCHAR(20) NOT NULL CHECK (signal_type IN ('offer', 'answer', 'ice', 'ice_controller', 'ice_host', 'pointer', 'frame', 'joined', 'host_sharing', 'student_sharing', 'declined', 'end')),
      payload TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    ALTER TABLE screen_sessions
    ADD COLUMN IF NOT EXISTS target_user_id INTEGER;

    ALTER TABLE screen_sessions
    ADD COLUMN IF NOT EXISTS target_user_role VARCHAR(20);

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'screen_session_signals_signal_type_check'
      ) THEN
        ALTER TABLE screen_session_signals
        DROP CONSTRAINT screen_session_signals_signal_type_check;
      END IF;

      ALTER TABLE screen_session_signals
      ADD CONSTRAINT screen_session_signals_signal_type_check
      CHECK (signal_type IN ('offer', 'answer', 'ice', 'ice_controller', 'ice_host', 'pointer', 'frame', 'joined', 'host_sharing', 'student_sharing', 'declined', 'end'));
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);
  console.log('✅ Screen session tables ready');
};

const generateCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

const createScreenSession = async ({
  hostRole,
  hostId,
  schoolId,
  maxParticipants = 5,
  targetUserId = null,
  targetUserRole = null,
}) => {
  let code;
  let attempts = 0;
  while (attempts < 10) {
    code = generateCode();
    const exists = await pool.query('SELECT id FROM screen_sessions WHERE code = $1 AND status != $2', [code, 'ended']);
    if (!exists.rows[0]) break;
    attempts++;
  }
  const result = await pool.query(
    `INSERT INTO screen_sessions (
       code,
       host_role,
       host_id,
       school_id,
       max_participants,
       status,
       target_user_id,
       target_user_role
     )
     VALUES ($1, $2, $3, $4, $5, 'waiting', $6, $7)
     RETURNING *`,
    [code, hostRole, hostId, schoolId || null, maxParticipants, targetUserId || null, targetUserRole || null]
  );
  return result.rows[0];
};

const getSessionByCode = async (code) => {
  // age_seconds + is_expired are computed entirely in PostgreSQL using NOW()
  // and the row's own created_at. Both sides of the comparison are in PG's
  // session timezone, so it's immune to the timezone mismatch that breaks
  // JavaScript Date.parse() on TIMESTAMP-without-time-zone values returned
  // by pg-node (which interprets them in Node's LOCAL timezone — often
  // hours off from PG's, especially on Windows). The renderer's symptom was
  // brand-new sessions immediately returning 410 "Session code has expired".
  const result = await pool.query(
    `SELECT ss.*,
            (SELECT COUNT(*) FROM screen_session_participants ssp
             WHERE ssp.session_id = ss.id AND ssp.is_active = true) AS participant_count,
            EXTRACT(EPOCH FROM (NOW() - ss.created_at))::int AS age_seconds,
            (NOW() - ss.created_at) > INTERVAL '5 minutes' AS is_waiting_expired
     FROM screen_sessions ss WHERE ss.code = $1`,
    [code.toUpperCase()]
  );
  return result.rows[0];
};

const getSessionById = async (sessionId) => {
  const result = await pool.query(
    `SELECT ss.*,
            (SELECT COUNT(*) FROM screen_session_participants ssp
             WHERE ssp.session_id = ss.id AND ssp.is_active = true) AS participant_count
     FROM screen_sessions ss WHERE ss.id = $1`,
    [sessionId]
  );
  return result.rows[0];
};

const getSessionParticipants = async (sessionId) => {
  const result = await pool.query(
    `SELECT * FROM screen_session_participants
     WHERE session_id = $1 AND is_active = true
     ORDER BY joined_at ASC`,
    [sessionId]
  );
  return result.rows;
};

const getActiveParticipant = async (sessionId, participantId, participantRole) => {
  const result = await pool.query(
    `SELECT *
     FROM screen_session_participants
     WHERE session_id = $1
       AND participant_id = $2
       AND participant_role = $3
       AND is_active = true
     LIMIT 1`,
    [sessionId, participantId, participantRole]
  );
  return result.rows[0] || null;
};

const joinSession = async (sessionId, participantRole, participantId) => {
  const result = await pool.query(
    `INSERT INTO screen_session_participants (session_id, participant_role, participant_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (session_id, participant_id, participant_role)
     DO UPDATE SET is_active = true, joined_at = NOW(), left_at = NULL
     RETURNING *`,
    [sessionId, participantRole, participantId]
  );
  await pool.query(
    `UPDATE screen_sessions SET status = 'active' WHERE id = $1 AND status = 'waiting'`,
    [sessionId]
  );
  return result.rows[0];
};

const leaveSession = async (sessionId, participantId, participantRole) => {
  await pool.query(
    `UPDATE screen_session_participants
     SET is_active = false, left_at = NOW()
     WHERE session_id = $1 AND participant_id = $2 AND participant_role = $3`,
    [sessionId, participantId, participantRole]
  );
};

const endSession = async (sessionId) => {
  await pool.query(
    `UPDATE screen_sessions SET status = 'ended', ended_at = NOW() WHERE id = $1`,
    [sessionId]
  );
  await pool.query(
    `UPDATE screen_session_participants SET is_active = false, left_at = NOW()
     WHERE session_id = $1 AND is_active = true`,
    [sessionId]
  );
};

const saveSignal = async ({ sessionId, fromId, fromRole, toId, signalType, payload }) => {
  const storedPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const result = await pool.query(
    `INSERT INTO screen_session_signals (session_id, from_id, from_role, to_id, signal_type, payload)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [sessionId, fromId, fromRole, toId || null, signalType, storedPayload]
  );
  return result.rows[0];
};

const getSignals = async (sessionId, afterId = 0) => {
  const result = await pool.query(
    `SELECT * FROM screen_session_signals
     WHERE session_id = $1 AND id > $2
     ORDER BY id ASC LIMIT 100`,
    [sessionId, afterId]
  );
  return result.rows;
};

/**
 * Delete signal rows that are no longer useful. Without this, every offer /
 * answer / ICE candidate persists forever and the table grows unbounded —
 * the renderer only polls signals from new sessions, but old rows still
 * cost storage + slow down inserts on the indexed columns.
 *
 * Policy:
 *   - Drop ALL signals belonging to ended sessions older than 5 minutes
 *     (their session is closed; signals serve no purpose).
 *   - Drop signals older than 1 hour regardless (covers stuck/abandoned
 *     sessions that never reached an explicit end).
 *
 * Returns the number of deleted rows.
 */
const purgeStaleSignals = async () => {
  const result = await pool.query(
    `DELETE FROM screen_session_signals
       WHERE id IN (
         SELECT s.id
           FROM screen_session_signals s
           JOIN screen_sessions ss ON ss.id = s.session_id
          WHERE (ss.status = 'ended' AND ss.ended_at < NOW() - INTERVAL '5 minutes')
             OR s.created_at < NOW() - INTERVAL '1 hour'
       )`
  );
  return result.rowCount || 0;
};

module.exports = {
  SCREEN_SESSION_SIGNAL_TYPES,
  createScreenSessionTables,
  createScreenSession,
  getSessionByCode,
  getSessionById,
  getSessionParticipants,
  getActiveParticipant,
  joinSession,
  leaveSession,
  endSession,
  saveSignal,
  getSignals,
  purgeStaleSignals,
};
