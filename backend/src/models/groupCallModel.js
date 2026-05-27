const pool = require('../config/db');

const createGroupCallTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_call_sessions (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      help_request_id INTEGER REFERENCES group_help_requests(id) ON DELETE SET NULL,
      initiated_by_type VARCHAR(20) NOT NULL
        CHECK (initiated_by_type IN ('student', 'teacher')),
      initiated_by_id INTEGER NOT NULL,
      call_type VARCHAR(20) NOT NULL
        CHECK (call_type IN ('audio', 'video')),
      status VARCHAR(20) DEFAULT 'ringing'
        CHECK (status IN ('ringing', 'active', 'ended', 'missed', 'rejected', 'cancelled')),
      room_key VARCHAR(255) UNIQUE NOT NULL,
      started_at TIMESTAMP,
      ended_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Group call sessions table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_call_participants (
      id SERIAL PRIMARY KEY,
      call_session_id INTEGER REFERENCES group_call_sessions(id) ON DELETE CASCADE,
      participant_type VARCHAR(20) NOT NULL
        CHECK (participant_type IN ('student', 'teacher')),
      participant_id INTEGER NOT NULL,
      joined_at TIMESTAMP,
      left_at TIMESTAMP,
      declined_at TIMESTAMP,
      connection_state VARCHAR(20) DEFAULT 'invited'
        CHECK (connection_state IN ('invited', 'joined', 'left', 'declined', 'missed')),
      UNIQUE(call_session_id, participant_type, participant_id)
    )
  `);
  console.log('✅ Group call participants table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_call_signals (
      id SERIAL PRIMARY KEY,
      call_session_id INTEGER REFERENCES group_call_sessions(id) ON DELETE CASCADE,
      sender_type VARCHAR(20) NOT NULL
        CHECK (sender_type IN ('student', 'teacher')),
      sender_id INTEGER NOT NULL,
      signal_type VARCHAR(20) NOT NULL
        CHECK (signal_type IN ('offer', 'answer', 'ice_candidate')),
      payload JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Group call signals table ready');
};

const generateRoomKey = (groupId, initiatedByType, initiatedById) => {
  return `group-${groupId}-${initiatedByType}-${initiatedById}-${Date.now()}`;
};

const isStudentInGroup = async (studentId, groupId) => {
  const result = await pool.query(
    `SELECT 1
     FROM group_members
     WHERE group_id = $1 AND student_id = $2
     LIMIT 1`,
    [groupId, studentId]
  );
  return !!result.rows[0];
};

const isTeacherAllowedInGroup = async (teacherId, groupId) => {
  const result = await pool.query(
    `SELECT 1
     FROM teacher_group_access
     WHERE teacher_id = $1
       AND group_id = $2
       AND is_active = true
     LIMIT 1`,
    [teacherId, groupId]
  );
  return !!result.rows[0];
};

const getGroupStudentParticipants = async (groupId) => {
  const result = await pool.query(
    `SELECT s.id, s.student_id, s.full_name
     FROM group_members gm
     JOIN students s ON gm.student_id = s.id
     WHERE gm.group_id = $1
       AND s.is_active = true
     ORDER BY s.full_name`,
    [groupId]
  );
  return result.rows;
};

const getGroupTeacherParticipants = async (groupId) => {
  const result = await pool.query(
    `SELECT t.id, t.teacher_id, t.full_name
     FROM teacher_group_access tga
     JOIN teachers t ON tga.teacher_id = t.id
     WHERE tga.group_id = $1
       AND tga.is_active = true
       AND t.is_active = true
     ORDER BY t.full_name`,
    [groupId]
  );
  return result.rows;
};

const getActiveCallByGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT *
     FROM group_call_sessions
     WHERE group_id = $1
       AND status IN ('ringing', 'active')
     ORDER BY created_at DESC
     LIMIT 1`,
    [groupId]
  );
  return result.rows[0];
};

const createGroupCallSession = async (data) => {
  const roomKey = generateRoomKey(data.group_id, data.initiated_by_type, data.initiated_by_id);

  const result = await pool.query(
    `INSERT INTO group_call_sessions
     (group_id, help_request_id, initiated_by_type, initiated_by_id, call_type, status, room_key)
     VALUES ($1, $2, $3, $4, $5, 'ringing', $6)
     RETURNING *`,
    [
      data.group_id,
      data.help_request_id || null,
      data.initiated_by_type,
      data.initiated_by_id,
      data.call_type,
      roomKey,
    ]
  );

  return result.rows[0];
};

const getCallSessionById = async (callId) => {
  const result = await pool.query(
    `SELECT *
     FROM group_call_sessions
     WHERE id = $1`,
    [callId]
  );
  return result.rows[0];
};

const addCallParticipant = async (data) => {
  const result = await pool.query(
    `INSERT INTO group_call_participants
     (call_session_id, participant_type, participant_id, connection_state)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (call_session_id, participant_type, participant_id)
     DO UPDATE SET connection_state = EXCLUDED.connection_state
     RETURNING *`,
    [
      data.call_session_id,
      data.participant_type,
      data.participant_id,
      data.connection_state || 'invited',
    ]
  );
  return result.rows[0];
};

const getCallParticipants = async (callSessionId) => {
  const result = await pool.query(
    `SELECT *
     FROM group_call_participants
     WHERE call_session_id = $1
     ORDER BY id ASC`,
    [callSessionId]
  );
  return result.rows;
};

const seedCallParticipantsForGroup = async (callSession) => {
  const students = await getGroupStudentParticipants(callSession.group_id);
  const teachers = await getGroupTeacherParticipants(callSession.group_id);

  const inserted = [];

  for (const s of students) {
    inserted.push(await addCallParticipant({
      call_session_id: callSession.id,
      participant_type: 'student',
      participant_id: s.id,
      connection_state:
        s.id === callSession.initiated_by_id && callSession.initiated_by_type === 'student'
          ? 'joined'
          : 'invited',
    }));
  }

  for (const t of teachers) {
    inserted.push(await addCallParticipant({
      call_session_id: callSession.id,
      participant_type: 'teacher',
      participant_id: t.id,
      connection_state:
        t.id === callSession.initiated_by_id && callSession.initiated_by_type === 'teacher'
          ? 'joined'
          : 'invited',
    }));
  }

  if (callSession.initiated_by_type === 'student' || callSession.initiated_by_type === 'teacher') {
    await pool.query(
      `UPDATE group_call_sessions
       SET started_at = NOW(),
           status = 'active'
       WHERE id = $1`,
      [callSession.id]
    );
  }

  return inserted;
};

const joinCallParticipant = async (callSessionId, participantType, participantId) => {
  const result = await pool.query(
    `UPDATE group_call_participants
     SET joined_at = NOW(),
         connection_state = 'joined'
     WHERE call_session_id = $1
       AND participant_type = $2
       AND participant_id = $3
     RETURNING *`,
    [callSessionId, participantType, participantId]
  );

  await pool.query(
    `UPDATE group_call_sessions
     SET status = 'active',
         started_at = COALESCE(started_at, NOW())
     WHERE id = $1`,
    [callSessionId]
  );

  return result.rows[0];
};

const leaveCallParticipant = async (callSessionId, participantType, participantId) => {
  const result = await pool.query(
    `UPDATE group_call_participants
     SET left_at = NOW(),
         connection_state = 'left'
     WHERE call_session_id = $1
       AND participant_type = $2
       AND participant_id = $3
     RETURNING *`,
    [callSessionId, participantType, participantId]
  );

  return result.rows[0];
};

const declineCallParticipant = async (callSessionId, participantType, participantId) => {
  const result = await pool.query(
    `UPDATE group_call_participants
     SET declined_at = NOW(),
         connection_state = 'declined'
     WHERE call_session_id = $1
       AND participant_type = $2
       AND participant_id = $3
     RETURNING *`,
    [callSessionId, participantType, participantId]
  );

  return result.rows[0];
};

const countJoinedParticipants = async (callSessionId) => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM group_call_participants
     WHERE call_session_id = $1
       AND connection_state = 'joined'`,
    [callSessionId]
  );
  return result.rows[0]?.count || 0;
};

const endGroupCallSession = async (callSessionId, status = 'ended') => {
  const result = await pool.query(
    `UPDATE group_call_sessions
     SET status = $2,
         ended_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [callSessionId, status]
  );
  return result.rows[0];
};

const saveCallSignal = async (data) => {
  const result = await pool.query(
    `INSERT INTO group_call_signals
     (call_session_id, sender_type, sender_id, signal_type, payload)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.call_session_id,
      data.sender_type,
      data.sender_id,
      data.signal_type,
      data.payload,
    ]
  );
  return result.rows[0];
};

const getSignalsForCall = async (callSessionId) => {
  const result = await pool.query(
    `SELECT *
     FROM group_call_signals
     WHERE call_session_id = $1
     ORDER BY created_at ASC`,
    [callSessionId]
  );
  return result.rows;
};

const getCallHistoryForUser = async (userType, userId, limit = 50) => {
  let result;

  if (userType === 'student') {
    result = await pool.query(
      `SELECT gcs.*, sg.name AS group_name
       FROM group_call_sessions gcs
       JOIN student_groups sg ON sg.id = gcs.group_id
       JOIN group_members gm ON gm.group_id = gcs.group_id
       WHERE gm.student_id = $1
       ORDER BY gcs.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
  } else if (userType === 'teacher') {
    result = await pool.query(
      `SELECT gcs.*, sg.name AS group_name
       FROM group_call_sessions gcs
       JOIN student_groups sg ON sg.id = gcs.group_id
       JOIN teacher_group_access tga ON tga.group_id = gcs.group_id
       WHERE tga.teacher_id = $1
         AND tga.is_active = true
       ORDER BY gcs.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
  } else if (userType === 'agent') {
    result = await pool.query(
      `SELECT gcs.*, sg.name AS group_name
       FROM group_call_sessions gcs
       JOIN student_groups sg ON sg.id = gcs.group_id
       ORDER BY gcs.created_at DESC
       LIMIT $1`,
      [limit]
    );
  } else {
    return [];
  }

  return result.rows;
};

module.exports = {
  createGroupCallTables,
  isStudentInGroup,
  isTeacherAllowedInGroup,
  getGroupStudentParticipants,
  getGroupTeacherParticipants,
  getActiveCallByGroup,
  createGroupCallSession,
  getCallSessionById,
  addCallParticipant,
  getCallParticipants,
  seedCallParticipantsForGroup,
  joinCallParticipant,
  leaveCallParticipant,
  declineCallParticipant,
  countJoinedParticipants,
  endGroupCallSession,
  saveCallSignal,
  getSignalsForCall,
  getCallHistoryForUser,
};
