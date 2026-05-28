const {
  findPrincipalDMChannel,
  createPrincipalDMChannel,
  createGroupChannel,
  getPrincipalChannels,
  getChannelMessages,
  sendPrincipalMessage,
  deleteMessage,
  isPrincipalChannelMember,
  addChannelMember,
} = require('../models/messageModel');
const {
  sendNotificationToUser,
  emitTicketEvent,
  getIO,
} = require('../services/socketService');
const {
  findStudentByDbId,
  findTeacherByDbId,
  areStudentsInSameGroup,
} = require('../models/schoolModel');
const { findUserById } = require('../models/userModel');
const pool = require('../config/db');
const { saveRawAudioUpload } = require('../utils/audioUpload');

// ─── Helpers ──────────────────────────────────────────────────────
const STAFF_ROLES = ['agent', 'admin'];

const resolvePrincipalForMessaging = async (reqUser) => {
  if (!reqUser) return null;

  if (STAFF_ROLES.includes(reqUser.role)) {
    return {
      principalType: 'staff',
      principalRole: reqUser.role,
      principalId: reqUser.id,
      displayName: reqUser.full_name,
      raw: reqUser,
    };
  }

  if (reqUser.role === 'student') {
    const student = await findStudentByDbId(reqUser.id);
    if (!student) return null;

    return {
      principalType: 'student',
      principalRole: 'student',
      principalId: student.id,
      displayName: student.full_name,
      raw: student,
    };
  }

  if (reqUser.role === 'teacher') {
    const teacher = await findTeacherByDbId(reqUser.id);
    if (!teacher) return null;

    return {
      principalType: 'teacher',
      principalRole: 'teacher',
      principalId: teacher.id,
      displayName: teacher.full_name,
      raw: teacher,
    };
  }

  return null;
};

const resolveTargetForMessaging = async (targetType, targetId) => {
  if (targetType === 'student') {
    const student = await findStudentByDbId(targetId);
    if (!student) return null;

    return {
      targetType: 'student',
      targetRole: 'student',
      targetId: student.id,
      displayName: student.full_name,
      raw: student,
    };
  }

  if (targetType === 'teacher') {
    const teacher = await findTeacherByDbId(targetId);
    if (!teacher) return null;

    return {
      targetType: 'teacher',
      targetRole: 'teacher',
      targetId: teacher.id,
      displayName: teacher.full_name,
      raw: teacher,
    };
  }

  if (targetType === 'staff') {
    const staff = await findUserById(targetId);
    if (!staff) return null;

    return {
      targetType: 'staff',
      targetRole: staff.role,
      targetId: staff.id,
      displayName: staff.full_name,
      raw: staff,
    };
  }

  return null;
};

const buildChannelParticipantSet = async (channelId) => {
  const result = await pool.query(
    `SELECT member_type, member_id
     FROM channel_members
     WHERE channel_id = $1`,
    [channelId]
  );
  return new Set(result.rows.map((r) => `${r.member_type}:${Number(r.member_id)}`));
};

const assertStudentChannelAccess = async (reqUser, channelId) => {
  const principal = await resolvePrincipalForMessaging(reqUser);
  if (!principal || principal.principalType !== 'student') {
    return { ok: false, reason: 'Student not found' };
  }

  const memberIds = await buildChannelParticipantSet(channelId);

  if (!memberIds.has(`student:${Number(principal.principalId)}`)) {
    return { ok: false, reason: 'Access denied' };
  }

  // Student private channels must only contain students
  for (const memberKey of memberIds) {
    const [memberType] = memberKey.split(':');
    if (memberType !== 'student') {
      return { ok: false, reason: 'Access denied' };
    }
  }

  return { ok: true, principal };
};

// ─── Get All Channels for Current User ───────────────────────────
const getChannels = async (req, res) => {
  try {
    const principal = await resolvePrincipalForMessaging(req.user);

    if (!principal) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const channels = await getPrincipalChannels({
      type: principal.principalType,
      id: principal.principalId,
    });
    res.status(200).json({ channels });
  } catch (error) {
    console.error('Get channels error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Start or Get DM Channel ─────────────────────────────────────
const startDM = async (req, res) => {
  try {
    const { target_id, target_type } = req.body;

    if (!target_id || !target_type) {
      return res.status(400).json({
        message: 'target_id and target_type are required',
      });
    }

    const normalizedTargetType = String(target_type).toLowerCase();

    if (!['student', 'teacher', 'staff'].includes(normalizedTargetType)) {
      return res.status(400).json({
        message: 'target_type must be one of: student, teacher, staff',
      });
    }

    const targetId = parseInt(target_id, 10);
    if (!Number.isInteger(targetId)) {
      return res.status(400).json({ message: 'Invalid target_id' });
    }

    const principal = await resolvePrincipalForMessaging(req.user);
    if (!principal) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const target = await resolveTargetForMessaging(normalizedTargetType, targetId);
    if (!target) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    if (
      principal.principalType === target.targetType &&
      principal.principalId === target.targetId
    ) {
      return res.status(400).json({ message: 'You cannot DM yourself' });
    }

    // ── Student DM rules ─────────────────────────────────────────
    if (principal.principalType === 'student') {
      if (target.targetType !== 'student') {
        return res.status(403).json({
          message: 'Students can only privately message fellow group members',
        });
      }

      const sameGroup = await areStudentsInSameGroup(
        principal.principalId,
        target.targetId
      );

      if (!sameGroup) {
        return res.status(403).json({
          message: 'Students can only privately message fellow group members',
        });
      }

      let channel = await findPrincipalDMChannel(
        { type: 'student', id: principal.principalId },
        { type: 'student', id: target.targetId }
      );
      if (!channel) {
        channel = await createPrincipalDMChannel(
          { type: 'student', id: principal.principalId },
          { type: 'student', id: target.targetId }
        );
      }

      return res.status(200).json({ channel });
    }

    // ── Teacher DM rules ─────────────────────────────────────────
    if (principal.principalType === 'teacher') {
      if (target.targetType === 'student') {
        return res.status(403).json({
          message: 'Teachers cannot privately message students outside group chat',
        });
      }

      let channel = await findPrincipalDMChannel(
        { type: 'teacher', id: principal.principalId },
        { type: target.targetType, id: target.targetId }
      );
      if (!channel) {
        channel = await createPrincipalDMChannel(
          { type: 'teacher', id: principal.principalId },
          { type: target.targetType, id: target.targetId }
        );
      }

      return res.status(200).json({ channel });
    }

    // ── Staff DM rules ───────────────────────────────────────────
    let channel = await findPrincipalDMChannel(
      { type: 'staff', id: principal.principalId },
      { type: target.targetType, id: target.targetId }
    );
    if (!channel) {
      channel = await createPrincipalDMChannel(
        { type: 'staff', id: principal.principalId },
        { type: target.targetType, id: target.targetId }
      );
    }

    res.status(200).json({ channel });
  } catch (error) {
    console.error('Start DM error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Create Group Channel ─────────────────────────────────────────
const createGroup = async (req, res) => {
  try {
    const { name, member_ids } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    if (!member_ids || member_ids.length === 0) {
      return res.status(400).json({ message: 'At least one member is required' });
    }

    const channel = await createGroupChannel(name, req.user.id, member_ids);

    res.status(201).json({ message: 'Group channel created', channel });
  } catch (error) {
    console.error('Create group error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Channel Messages ─────────────────────────────────────────
const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    const principal = await resolvePrincipalForMessaging(req.user);
    if (!principal) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const isMember = await isPrincipalChannelMember(id, {
      type: principal.principalType,
      id: principal.principalId,
    });
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await getChannelMessages(id, limit, offset);
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Send Message ─────────────────────────────────────────────────
const sendMsg = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ message: 'Message body is required' });
    }

    const principal = await resolvePrincipalForMessaging(req.user);
    if (!principal) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const isMember = await isPrincipalChannelMember(id, {
      type: principal.principalType,
      id: principal.principalId,
    });
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messageRow = await sendPrincipalMessage(
      id,
      { type: principal.principalType, id: principal.principalId },
      body
    );

    await pool.query(
      `UPDATE tickets
       SET updated_at = NOW()
       WHERE support_channel_id = $1
         AND status IN ('open', 'pending')`,
      [id]
    );

    const message = {
      ...messageRow,
      sender_name: principal.displayName,
      sender_role: principal.principalRole,
    };

    emitTicketEvent('message:new', {
      channel_id: id,
      message
    });

    // Real-time fan-out to every channel member EXCEPT the sender. This is
    // what powers the unread badge + notification in the recipient's chat
    // list, so when an agent replies, the teacher/student sees the support
    // DM bumped to the top with a blue badge — and vice versa. Previously
    // only agents got a DB notification row (and only staff at that), so
    // teachers/students were never told their support thread had a reply.
    const allMembers = await pool.query(
      `SELECT member_type, member_id, user_id FROM channel_members
       WHERE channel_id = $1
         AND NOT (member_type = $2 AND member_id = $3)`,
      [id, principal.principalType, principal.principalId]
    );

    const io = getIO();
    const socketPayload = {
      channel_id: Number(id),
      message,
      sender_name: principal.displayName,
      sender_role: principal.principalRole,
      body,
      created_at: message.created_at || new Date().toISOString(),
    };
    for (const member of allMembers.rows) {
      // Pick the correct id namespace per role:
      //   staff   → channel_members.user_id (= users.id)
      //   teacher → channel_members.member_id (= teachers.id)
      //   student → channel_members.member_id (= students.id)
      const targetId = member.member_type === 'staff'
        ? member.user_id
        : member.member_id;
      if (!targetId) continue;
      if (io) io.to(`user_${targetId}`).emit('channel:message', socketPayload);

      await sendNotificationToUser({
        userId: targetId,
        userRole: member.member_type === 'staff' ? null : member.member_type,
        type: 'message:new',
        title: `New message from ${principal.displayName}`,
        body,
        reference_id: parseInt(id, 10),
        reference_type: 'channel',
      });
    }

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('Send message error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendAudioMsg = async (req, res) => {
  try {
    const { id } = req.params;

    const principal = await resolvePrincipalForMessaging(req.user);
    if (!principal) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const isMember = await isPrincipalChannelMember(id, {
      type: principal.principalType,
      id: principal.principalId,
    });
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const upload = await saveRawAudioUpload(req, `channel-${id}`);

    const messageRow = await sendPrincipalMessage(
      id,
      { type: principal.principalType, id: principal.principalId },
      '[Voice message]',
      {
        message_type: 'audio',
        media_url: upload.mediaUrl,
        audio_duration: upload.audioDuration,
      }
    );

    await pool.query(
      `UPDATE tickets
       SET updated_at = NOW()
       WHERE support_channel_id = $1
         AND status IN ('open', 'pending')`,
      [id]
    );

    const message = {
      ...messageRow,
      sender_name: principal.displayName,
      sender_role: principal.principalRole,
      is_audio: true,
      media_url: upload.mediaUrl,
      audio_duration: upload.audioDuration,
    };

    emitTicketEvent('message:new', {
      channel_id: id,
      message,
    });

    // Same socket fan-out as text messages so audio replies also bump the
    // recipient's chat list unread badge in real time. See the long comment
    // on the text-message path above.
    const allMembers = await pool.query(
      `SELECT member_type, member_id, user_id FROM channel_members
       WHERE channel_id = $1
         AND NOT (member_type = $2 AND member_id = $3)`,
      [id, principal.principalType, principal.principalId]
    );
    const io = getIO();
    const socketPayload = {
      channel_id: Number(id),
      message,
      sender_name: principal.displayName,
      sender_role: principal.principalRole,
      body: '[Voice message]',
      message_type: 'audio',
      media_url: upload.mediaUrl,
      audio_duration: upload.audioDuration,
      created_at: message.created_at || new Date().toISOString(),
    };
    for (const member of allMembers.rows) {
      const targetId = member.member_type === 'staff' ? member.user_id : member.member_id;
      if (!targetId) continue;
      if (io) io.to(`user_${targetId}`).emit('channel:message', socketPayload);
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send audio message error:', error.message);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
};

// ─── Delete Message (Admin only) ──────────────────────────────────
const removeMessage = async (req, res) => {
  try {
    await deleteMessage(req.params.messageId);
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Add Member to Group ──────────────────────────────────────────
const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const principal = await resolvePrincipalForMessaging(req.user);
    if (!principal || principal.principalType !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const isMember = await isPrincipalChannelMember(id, {
      type: 'staff',
      id: principal.principalId,
    });
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await addChannelMember(id, user_id);
    res.status(200).json({ message: 'Member added to channel' });
  } catch (error) {
    console.error('Add member error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChannels,
  startDM,
  createGroup,
  getMessages,
  sendMsg,
  sendAudioMsg,
  removeMessage,
  addMember,
};
