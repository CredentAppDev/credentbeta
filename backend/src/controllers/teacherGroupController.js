const pool = require('../config/db');
const {
  getGroupMembers,
  getGroupRosterMembers,
  getGroupMessages,
  addGroupMessage,
} = require('../models/schoolModel');
const { saveRawAudioUpload } = require('../utils/audioUpload');
const { saveRawMediaUpload } = require('../utils/mediaUpload');
const { sendDataPush } = require('../services/pushSender');
const { notifyGroupOfMessage } = require('../services/groupPushNotifier');

const MAX_FEEDBACK_LEN = 1000;

const ensureTeacher = (req, res) => {
  if (!req.user || req.user.role !== 'teacher') {
    res.status(403).json({ message: 'Teacher access only' });
    return false;
  }
  return true;
};

const getTeacherGroups = async (teacherId) => {
  // Show every group the teacher has been assigned to via teacher_group_access.
  // The previous `is_confirmed = true` filter hid groups the agent hadn't
  // confirmed yet, so a freshly-assigned teacher saw an empty chat list even
  // though groups existed. Unconfirmed groups are still differentiated by
  // their `is_confirmed` flag on each row.
  const result = await pool.query(
    `SELECT sg.*, s.name AS school_name,
            (SELECT MAX(created_at) FROM group_messages WHERE group_id = sg.id) AS last_message_at
     FROM student_groups sg
     JOIN schools s ON s.id = sg.school_id
     JOIN teacher_group_access tga ON tga.group_id = sg.id
     WHERE tga.teacher_id = $1
       AND tga.is_active = true
     ORDER BY sg.is_confirmed DESC,
              COALESCE(
                (SELECT MAX(created_at) FROM group_messages WHERE group_id = sg.id),
                sg.created_at
              ) DESC`,
    [teacherId]
  );
  return result.rows;
};

const assertTeacherAllowed = async (teacherId, groupId) => {
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

const getMyGroups = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const groups = await getTeacherGroups(req.user.id);
    const enriched = [];

    for (const group of groups) {
      const members = await getGroupMembers(group.id);
      enriched.push({
        ...group,
        members_count: members.length,
      });
    }

    res.status(200).json({ groups: enriched });
  } catch (error) {
    console.error('Teacher get groups error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeacherGroupMessages = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const allowed = await assertTeacherAllowed(req.user.id, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await getGroupMessages(groupId, { role: 'teacher', id: req.user.id });
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Teacher get group messages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const postTeacherGroupMessage = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    const { body, message_type } = req.body;

    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    if (!body || !String(body).trim()) {
      return res.status(400).json({ message: 'Message body is required' });
    }

    const allowed = await assertTeacherAllowed(req.user.id, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = await addGroupMessage(
      {
        group_id: groupId,
        sender_type: 'teacher',
        sender_id: req.user.id,
        body: String(body).trim(),
        message_type: message_type || 'text',
      },
      { role: 'teacher', id: req.user.id }
    );
    notifyGroupOfMessage({
      groupId, senderType: 'teacher', senderId: req.user.id,
      body: String(body).trim(), messageType: message_type || 'text',
      message,
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('Teacher post group message error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const postTeacherGroupAudioMessage = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const allowed = await assertTeacherAllowed(req.user.id, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const upload = await saveRawAudioUpload(req, `teacher-group-${groupId}`);

    const message = await addGroupMessage(
      {
        group_id: groupId,
        sender_type: 'teacher',
        sender_id: req.user.id,
        body: '[Voice message]',
        message_type: 'audio',
        media_url: upload.mediaUrl,
        audio_duration: upload.audioDuration,
      },
      { role: 'teacher', id: req.user.id }
    );
    notifyGroupOfMessage({
      groupId, senderType: 'teacher', senderId: req.user.id,
      body: '[Voice message]', messageType: 'audio',
      message,
    });

    res.status(201).json({ message, data: message });
  } catch (error) {
    console.error('Teacher post group audio error:', error.message);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
};

const postTeacherGroupMediaMessage = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;
    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) return res.status(400).json({ message: 'Invalid groupId' });
    const allowed = await assertTeacherAllowed(req.user.id, groupId);
    if (!allowed) return res.status(403).json({ message: 'Access denied' });
    const upload = await saveRawMediaUpload(req, `teacher-group-${groupId}`);
    const body = upload.messageType === 'image' ? '[Image]' : upload.messageType === 'video' ? '[Video]' : '[File]';
    const message = await addGroupMessage(
      { group_id: groupId, sender_type: 'teacher', sender_id: req.user.id, body, message_type: upload.messageType, media_url: upload.mediaUrl },
      { role: 'teacher', id: req.user.id }
    );
    notifyGroupOfMessage({
      groupId, senderType: 'teacher', senderId: req.user.id,
      body, messageType: upload.messageType,
      message,
    });
    res.status(201).json({ message, data: message });
  } catch (error) {
    console.error('Teacher post group media error:', error.message);
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Server error' });
  }
};

const getTeacherGroupMembersHandler = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const allowed = await assertTeacherAllowed(req.user.id, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const members = await getGroupRosterMembers(groupId);
    res.status(200).json({ members });
  } catch (error) {
    console.error('Teacher get group members error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const RUBRIC_DIMENSIONS = ['creativity', 'execution', 'teamwork', 'presentation'];

// Pull the rubric dimensions out of the body in either of two shapes:
//   1. flat:   { creativity: 80, execution: 75, ... }
//   2. nested: { dimensions: { creativity: 80, ... } }
// Each returned value is an integer 0–100 or null. Throws { msg } on bad input.
const parseDimensions = (body) => {
  const source = body && typeof body.dimensions === 'object' && body.dimensions
    ? body.dimensions
    : body || {};
  const out = {};
  for (const key of RUBRIC_DIMENSIONS) {
    if (source[key] === undefined || source[key] === null || source[key] === '') {
      out[key] = null;
      continue;
    }
    const n = Number(source[key]);
    if (!Number.isInteger(n) || n < 0 || n > 100) {
      const e = new Error(`${key} must be an integer between 0 and 100`);
      e.status = 400;
      throw e;
    }
    out[key] = n;
  }
  return out;
};

const submitTeacherGroupRating = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    const projectName = String(req.body.project_name || '').trim();
    // Optional. Empty string normalizes to NULL so a missing field doesn't
    // clobber existing feedback on update.
    const rawFeedback = typeof req.body.feedback === 'string' ? req.body.feedback.trim() : '';
    const feedback = rawFeedback ? rawFeedback.slice(0, MAX_FEEDBACK_LEN) : null;

    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }
    if (!projectName) {
      return res.status(400).json({ message: 'project_name is required' });
    }

    let dims;
    try { dims = parseDimensions(req.body); }
    catch (e) { return res.status(e.status || 400).json({ message: e.message }); }

    const dimsProvided = RUBRIC_DIMENSIONS.filter((k) => dims[k] !== null);

    // If the caller sent dimensions but no overall score, derive overall as
    // the rounded mean of the dimensions they DID provide. Keeps single-slider
    // clients working unchanged, while rubric-mode clients can omit `score`.
    let score = Number(req.body.score);
    if ((!Number.isInteger(score) || score < 0 || score > 100) && dimsProvided.length > 0) {
      const mean = dimsProvided.reduce((acc, k) => acc + dims[k], 0) / dimsProvided.length;
      score = Math.round(mean);
    }
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      return res.status(400).json({ message: 'score must be between 0 and 100' });
    }

    const allowed = await assertTeacherAllowed(req.user.id, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(
      `INSERT INTO group_ratings
         (group_id, teacher_id, project_name, score, feedback,
          creativity, execution, teamwork, presentation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (group_id, teacher_id, project_name)
       DO UPDATE SET score        = EXCLUDED.score,
                     feedback     = EXCLUDED.feedback,
                     creativity   = EXCLUDED.creativity,
                     execution    = EXCLUDED.execution,
                     teamwork     = EXCLUDED.teamwork,
                     presentation = EXCLUDED.presentation,
                     updated_at   = NOW(),
                     submitted_at = NOW()
       RETURNING *`,
      [groupId, req.user.id, projectName, score, feedback,
       dims.creativity, dims.execution, dims.teamwork, dims.presentation]
    );

    const rating = result.rows[0];

    // Fire push to every student in this group. Fan-out is fire-and-forget so
    // a misbehaving push doesn't slow down the teacher's save.
    notifyGroupOfRating({
      groupId,
      teacherId: req.user.id,
      rating,
    }).catch((e) => console.warn('[group-rating] push fan-out failed:', e.message));

    res.status(201).json({ message: 'Group rating saved', rating });
  } catch (error) {
    console.error('Submit group rating error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Look up the teacher's name + the group's student members, then push each
// student a `rating_received` notification. Best-effort: errors are logged but
// never propagated to the user-facing response.
const notifyGroupOfRating = async ({ groupId, teacherId, rating }) => {
  const [teacherRow, groupRow, memberRows] = await Promise.all([
    pool.query(`SELECT full_name FROM teachers WHERE id = $1`, [teacherId]),
    pool.query(`SELECT name FROM student_groups WHERE id = $1`, [groupId]),
    pool.query(`SELECT student_id FROM group_members WHERE group_id = $1`, [groupId]),
  ]);
  const teacherName = teacherRow.rows[0]?.full_name || 'Your teacher';
  const groupName   = groupRow.rows[0]?.name || 'Your group';
  const students    = memberRows.rows.map((r) => r.student_id).filter(Boolean);
  if (!students.length) return;

  // Feedback truncated to fit comfortably in a notification body.
  const snippet = rating.feedback
    ? rating.feedback.length > 140 ? `${rating.feedback.slice(0, 137)}…` : rating.feedback
    : null;
  const body = snippet
    ? `${teacherName} rated ${rating.project_name}: ${rating.score}/100 — "${snippet}"`
    : `${teacherName} rated ${rating.project_name}: ${rating.score}/100`;

  const payload = {
    title: `${groupName} was rated`,
    body,
    rating_id: rating.id,
    group_id: groupId,
    group_name: groupName,
    project_name: rating.project_name,
    score: rating.score,
    teacher_name: teacherName,
    feedback: rating.feedback || '',
  };

  await Promise.all(students.map((studentId) =>
    sendDataPush({
      user_id: studentId,
      user_role: 'student',
      type: 'rating_received',
      payload,
    }).catch((e) => console.warn(`[group-rating] push to student=${studentId} failed:`, e.message))
  ));
};

const getTeacherGroupRatings = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const result = await pool.query(
      `SELECT gr.*,
              sg.name AS group_name
       FROM group_ratings gr
       JOIN student_groups sg ON sg.id = gr.group_id
       WHERE gr.teacher_id = $1
       ORDER BY gr.submitted_at DESC`,
      [req.user.id]
    );

    res.status(200).json({ ratings: result.rows });
  } catch (error) {
    console.error('Get teacher group ratings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTeacherGroupRating = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) return;

    const ratingId = parseInt(req.params.ratingId, 10);
    if (!Number.isInteger(ratingId)) {
      return res.status(400).json({ message: 'Invalid ratingId' });
    }

    // Only the teacher who submitted the rating may delete it.
    const result = await pool.query(
      `DELETE FROM group_ratings
        WHERE id = $1 AND teacher_id = $2
        RETURNING id`,
      [ratingId, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ message: 'Rating deleted', id: result.rows[0].id });
  } catch (error) {
    console.error('Delete group rating error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMyGroups,
  getTeacherGroupMessages,
  postTeacherGroupMessage,
  postTeacherGroupAudioMessage,
  postTeacherGroupMediaMessage,
  getTeacherGroupMembersHandler,
  submitTeacherGroupRating,
  getTeacherGroupRatings,
  deleteTeacherGroupRating,
};
