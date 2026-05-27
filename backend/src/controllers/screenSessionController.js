const pool = require('../config/db');
const {
  SCREEN_SESSION_SIGNAL_TYPES,
  createScreenSession,
  getSessionByCode,
  getActiveParticipant,
  getSessionParticipants,
  joinSession,
  leaveSession,
  endSession,
  saveSignal,
  getSignals,
} = require('../models/screenSessionModel');
const { getIO } = require('../services/socketService');
const { recordAuditEvent } = require('../models/remoteControlAuditModel');
const { sendDataPush } = require('../services/pushSender');

const SESSION_CODE_TTL_MS = 5 * 60 * 1000;

// ── Access helpers ────────────────────────────────────────────────

const getTeacherSchoolIds = async (teacherId) => {
  const r = await pool.query(
    `SELECT DISTINCT school_id FROM teacher_group_access tga
     JOIN student_groups sg ON sg.id = tga.group_id
     WHERE tga.teacher_id = $1 AND tga.is_active = true`,
    [teacherId]
  );
  return r.rows.map((row) => row.school_id);
};

const getStudentSchoolId = async (studentId) => {
  const r = await pool.query('SELECT school_id FROM students WHERE id = $1', [studentId]);
  return r.rows[0]?.school_id || null;
};

const isSessionHost = (user, session) =>
  Number(session.host_id) === Number(user.id) && session.host_role === user.role;

const isInvitedTarget = (user, session) =>
  session.target_user_id != null &&
  session.target_user_role &&
  Number(session.target_user_id) === Number(user.id) &&
  session.target_user_role === user.role;

const isWaitingSessionExpired = (session) => {
  if (!session || session.status !== 'waiting') return false;
  // Trust the SQL-computed `is_waiting_expired` column from getSessionByCode.
  // Falling back to a JS Date.parse comparison here previously caused
  // brand-new sessions to be flagged expired immediately when PG and Node
  // disagreed on timezone — common on Windows where PG defaults to UTC
  // while pg-node interprets TIMESTAMP (no TZ) as local time, producing a
  // Date whose epoch can be hours off the actual creation time.
  return session.is_waiting_expired === true;
};

const getActiveSessionByCode = async (code) => {
  const session = await getSessionByCode(code);
  if (!session) return { session: null, expired: false };
  if (session.status === 'ended') return { session, expired: false };
  if (!isWaitingSessionExpired(session)) return { session, expired: false };

  await endSession(session.id);
  return {
    session: {
      ...session,
      status: 'ended',
      ended_at: new Date().toISOString(),
    },
    expired: true,
  };
};

const canParticipantJoin = async (user, session) => {
  if (isSessionHost(user, session)) return true;
  if (session.target_user_id != null || session.target_user_role) {
    return isInvitedTarget(user, session);
  }

  const hostRole = session.host_role;

  // Agent hosts → teachers can join
  if (['agent', 'admin'].includes(hostRole)) {
    if (user.role === 'teacher') return true;
    if (['agent', 'admin'].includes(user.role)) return true;
  }

  // Teacher hosts → students from same school can join; agents can observe
  if (hostRole === 'teacher') {
    if (['agent', 'admin'].includes(user.role)) return true;
    if (user.role === 'student') {
      const studentSchoolId = await getStudentSchoolId(user.id);
      const teacherSchools = await getTeacherSchoolIds(session.host_id);
      return teacherSchools.includes(studentSchoolId);
    }
    // Teacher-to-teacher: same schools
    if (user.role === 'teacher') {
      const joinerSchools = await getTeacherSchoolIds(user.id);
      const hostSchools = await getTeacherSchoolIds(session.host_id);
      return joinerSchools.some((s) => hostSchools.includes(s));
    }
  }

  // Student hosts → others in same group can join
  if (hostRole === 'student') {
    if (['agent', 'admin', 'teacher'].includes(user.role)) return true;
    if (user.role === 'student') {
      const studentSchoolId = await getStudentSchoolId(user.id);
      const hostSchoolId = await getStudentSchoolId(session.host_id);
      return studentSchoolId === hostSchoolId;
    }
  }

  return false;
};

const canAccessSessionOverview = async (user, session) => {
  if (isSessionHost(user, session)) return true;
  if (await getActiveParticipant(session.id, user.id, user.role)) return true;
  return canParticipantJoin(user, session);
};

const canExchangeSignals = async (user, session) => {
  if (isSessionHost(user, session)) return true;
  return Boolean(await getActiveParticipant(session.id, user.id, user.role));
};

const canRecordAudit = async (user, session) => {
  if (isSessionHost(user, session) || isInvitedTarget(user, session)) return true;
  return Boolean(await getActiveParticipant(session.id, user.id, user.role));
};

// ── Route handlers ────────────────────────────────────────────────

const createSession = async (req, res) => {
  try {
    const allowedRoles = ['teacher', 'agent', 'admin', 'student'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not allowed to create screen sessions' });
    }
    if ((req.body.target_user_id && !req.body.target_user_role) || (!req.body.target_user_id && req.body.target_user_role)) {
      return res.status(400).json({ message: 'target_user_id and target_user_role must be provided together' });
    }
    if (req.body.target_user_role && !allowedRoles.includes(req.body.target_user_role)) {
      return res.status(400).json({ message: 'Invalid target_user_role' });
    }

    let schoolId = req.body.school_id || null;
    if (!schoolId && req.user.role === 'teacher') {
      const schools = await getTeacherSchoolIds(req.user.id);
      schoolId = schools[0] || null;
    }

    const session = await createScreenSession({
      hostRole: req.user.role,
      hostId: req.user.id,
      schoolId,
      maxParticipants: req.body.max_participants || 5,
      targetUserId: req.body.target_user_id || null,
      targetUserRole: req.body.target_user_role || null,
    });

    // Audit: who created which session.
    recordAuditEvent({
      session_id: session.id,
      session_code: session.code,
      session_type: req.body.session_type || null,
      controller_id: req.user.id,
      controller_role: req.user.role,
      controller_name: req.user.full_name || null,
      host_id: req.body.target_user_id || 0,
      host_role: req.body.target_user_role || 'unknown',
      armed: false,
      event: 'session_created',
      ip: req.ip,
    }).catch(() => {});

    // If the controller named a target, push them an invite so they don't
    // have to manually type the code. The receiver listens on
    // `screen-session:incoming-invite` (renderer wires this up).
    if (req.body.target_user_id && req.body.target_user_role) {
      const io = getIO();
      const payload = {
        session_id: session.id,
        session_code: session.code,
        session_type: req.body.session_type || null,
        controller_id: req.user.id,
        controller_role: req.user.role,
        controller_name: req.user.full_name || 'Someone',
        invited_at: new Date().toISOString(),
      };
      if (io) io.to(`user_${req.body.target_user_id}`).emit('screen-session:incoming-invite', payload);

      // Also send a push so closed apps still get the prompt.
      sendDataPush({
        user_id: req.body.target_user_id,
        user_role: req.body.target_user_role,
        type: 'screen_session_invite',
        payload: {
          title: `${payload.controller_name} wants to view your screen`,
          body: `Tap to accept · code ${session.code}`,
          session_code: session.code,
        },
        highPriority: true,
      }).catch(() => {});
    }

    res.status(201).json({ message: 'Screen session created', session });
  } catch (error) {
    console.error('createSession error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSession = async (req, res) => {
  try {
    const { session, expired } = await getActiveSessionByCode(req.params.code);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status === 'ended') {
      return res.status(410).json({ message: expired ? 'Session code has expired' : 'Session has ended' });
    }
    if (!(await canAccessSessionOverview(req.user, session))) {
      return res.status(403).json({ message: 'You are not allowed to access this session' });
    }

    const participants = await getSessionParticipants(session.id);
    res.status(200).json({ session, participants });
  } catch (error) {
    console.error('getSession error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const joinSessionHandler = async (req, res) => {
  try {
    const code = (req.body.code || '').toUpperCase();
    if (!code) return res.status(400).json({ message: 'code is required' });

    const { session, expired } = await getActiveSessionByCode(code);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status === 'ended') {
      return res.status(410).json({ message: expired ? 'Session code has expired' : 'Session has ended' });
    }

    const allowed = await canParticipantJoin(req.user, session);
    if (!allowed) return res.status(403).json({ message: 'You are not allowed to join this session' });

    const participants = await getSessionParticipants(session.id);
    const alreadyIn = participants.find(
      (p) => p.participant_id === req.user.id && p.participant_role === req.user.role
    );
    if (!alreadyIn) {
      if (participants.length >= session.max_participants) {
        return res.status(409).json({ message: 'Session is full' });
      }
    }

    const participant = await joinSession(session.id, req.user.role, req.user.id);
    const updatedParticipants = await getSessionParticipants(session.id);

    const io = getIO();
    if (io) {
      io.to(`screen_session_${session.id}`).emit('screen-session:participant-joined', {
        sessionId: session.id,
        participant,
        participants: updatedParticipants,
      });
    }

    res.status(200).json({ message: 'Joined session', session, participant, participants: updatedParticipants });
  } catch (error) {
    console.error('joinSession error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const leaveSessionHandler = async (req, res) => {
  try {
    const session = await getSessionByCode(req.params.code);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Require the caller to actually be a participant (or the host) of this
    // session — without this check any authed user who knows the 6-char code
    // could hit /leave for a session they were never in. The model's UPDATE
    // is no-op in that case but the 200 response leaks code-validity info.
    const allowed = await canExchangeSignals(req.user, session);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // A participant can only mark THEIR OWN row inactive — the model WHERE
    // clause is keyed on (session_id, participant_id, participant_role).
    await leaveSession(session.id, req.user.id, req.user.role);

    const io = getIO();
    if (io) {
      io.to(`screen_session_${session.id}`).emit('screen-session:participant-left', {
        sessionId: session.id,
        participantId: req.user.id,
        participantRole: req.user.role,
      });
    }

    res.status(200).json({ message: 'Left session' });
  } catch (error) {
    console.error('leaveSession error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const endSessionHandler = async (req, res) => {
  try {
    const session = await getSessionByCode(req.params.code);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Either side of the session must be able to terminate it. Previously
    // only the host (the user who created the session — typically the
    // teacher / controller) and agents/admins could end it, so the student
    // whose screen was being shared had no way to revoke the share if they
    // wanted out — clicking "End" returned 403 silently. Now any active
    // participant of the session can end it.
    const isHost = session.host_id === req.user.id;
    const isPrivileged = ['agent', 'admin'].includes(req.user.role);
    const isParticipant = Boolean(await getActiveParticipant(session.id, req.user.id, req.user.role));
    if (!isHost && !isPrivileged && !isParticipant) {
      return res.status(403).json({ message: 'You must be in this session to end it' });
    }

    await endSession(session.id);

    const io = getIO();
    if (io) {
      io.to(`screen_session_${session.id}`).emit('screen-session:ended', { sessionId: session.id });
    }

    res.status(200).json({ message: 'Session ended' });
  } catch (error) {
    console.error('endSession error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendSignalHandler = async (req, res) => {
  try {
    const { session, expired } = await getActiveSessionByCode(req.params.code);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status === 'ended') {
      return res.status(410).json({ message: expired ? 'Session code has expired' : 'Session has ended' });
    }
    if (!(await canExchangeSignals(req.user, session))) {
      return res.status(403).json({ message: 'You are not allowed to signal this session' });
    }

    const { signal_type, payload, to_id } = req.body;
    if (!signal_type || !payload) {
      return res.status(400).json({ message: 'signal_type and payload are required' });
    }
    if (!SCREEN_SESSION_SIGNAL_TYPES.includes(signal_type)) {
      return res.status(400).json({ message: 'Invalid signal_type' });
    }

    const signal = await saveSignal({
      sessionId: session.id,
      fromId: req.user.id,
      fromRole: req.user.role,
      toId: to_id || null,
      signalType: signal_type,
      payload,
    });

    const io = getIO();
    if (io) {
      const targetRoom = to_id ? `user_${to_id}` : `screen_session_${session.id}`;
      io.to(targetRoom).emit('screen-session:signal', {
        sessionId: session.id,
        signal,
        fromId: req.user.id,
        fromRole: req.user.role,
      });
    }

    res.status(201).json({ message: 'Signal sent', signal });
  } catch (error) {
    console.error('sendSignal error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSignalsHandler = async (req, res) => {
  try {
    const { session, expired } = await getActiveSessionByCode(req.params.code);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status === 'ended') {
      return res.status(410).json({ message: expired ? 'Session code has expired' : 'Session has ended' });
    }
    if (!(await canExchangeSignals(req.user, session))) {
      return res.status(403).json({ message: 'You are not allowed to access session signals' });
    }

    const afterId = parseInt(req.query.after_id || '0', 10);
    const signals = await getSignals(session.id, afterId);
    res.status(200).json({ signals });
  } catch (error) {
    console.error('getSignals error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/screen-session/:code/audit
 * Body: { event: 'control_armed' | 'control_disarmed' | 'session_ended', controller_user_id?, controller_role? }
 *
 * Records meaningful events the host's renderer reports — most importantly
 * the moment the host flipped "Allow remote control" on or off, so an admin
 * can later answer "who was driving this machine at 14:03?"
 */
const recordAuditFromClient = async (req, res) => {
  try {
    const { session, expired } = await getActiveSessionByCode(req.params.code);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status === 'ended') {
      return res.status(410).json({ message: expired ? 'Session code has expired' : 'Session has ended' });
    }
    if (!(await canRecordAudit(req.user, session))) {
      return res.status(403).json({ message: 'You are not allowed to audit this session' });
    }

    const allowed = ['control_armed', 'control_disarmed', 'session_ended', 'invite_declined', 'invite_accepted'];
    const ev = String(req.body.event || '');
    if (!allowed.includes(ev)) return res.status(400).json({ message: 'Invalid event' });

    await recordAuditEvent({
      session_id: session.id,
      session_code: session.code,
      session_type: req.body.session_type || null,
      controller_id: req.body.controller_user_id || 0,
      controller_role: req.body.controller_role || 'unknown',
      controller_name: req.body.controller_name || null,
      host_id: req.user.id,
      host_role: req.user.role,
      host_name: req.user.full_name || null,
      armed: ev === 'control_armed',
      event: ev,
      ip: req.ip,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('recordAuditFromClient error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  recordAuditFromClient,
  createSession,
  getSession,
  joinSessionHandler,
  leaveSessionHandler,
  endSessionHandler,
  sendSignalHandler,
  getSignalsHandler,
};
