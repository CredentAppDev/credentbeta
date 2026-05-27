const pool = require('../config/db');
const {
  getStudentGroups,
  getGroupMembers,
  getGroupRosterMembers,
  getGroupMessages,
  addGroupMessage,
} = require('../models/schoolModel');
const { saveRawAudioUpload } = require('../utils/audioUpload');
const { saveRawMediaUpload } = require('../utils/mediaUpload');
const { notifyGroupOfMessage } = require('../services/groupPushNotifier');

const ensureStudent = (req, res) => {
  if (!req.user || req.user.role !== 'student') {
    res.status(403).json({ message: 'Student access only' });
    return false;
  }
  return true;
};

const getMyGroups = async (req, res) => {
  try {
    if (!ensureStudent(req, res)) return;

    const groups = await getStudentGroups(req.user.id);

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
    console.error('Get my groups error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const assertStudentOwnsGroup = async (studentId, groupId) => {
  // Mirrors getStudentGroups: explicit group_members membership + same-school
  // is the source of truth. Grade/class/semester are no longer enforced here
  // because the agent UI stores them inconsistently across student vs group
  // (e.g. '4' vs 'Class 4'), which would deny legitimate members access to
  // their own group's messages.
  const result = await pool.query(
    `SELECT 1
     FROM group_members gm
     JOIN student_groups sg ON sg.id = gm.group_id
     JOIN students s ON s.id = gm.student_id
     WHERE gm.group_id = $1
       AND gm.student_id = $2
       AND s.school_id = sg.school_id
     LIMIT 1`,
    [groupId, studentId]
  );
  return !!result.rows[0];
};

const getStudentGroupMessages = async (req, res) => {
  try {
    if (!ensureStudent(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const isMember = await assertStudentOwnsGroup(req.user.id, groupId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await getGroupMessages(groupId, { role: 'student', id: req.user.id });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get student group messages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const postStudentGroupMessage = async (req, res) => {
  try {
    if (!ensureStudent(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    const { body, message_type } = req.body;

    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    if (!body || !String(body).trim()) {
      return res.status(400).json({ message: 'Message body is required' });
    }

    const isMember = await assertStudentOwnsGroup(req.user.id, groupId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = await addGroupMessage(
      {
        group_id: groupId,
        sender_type: 'student',
        sender_id: req.user.id,
        body: String(body).trim(),
        message_type: message_type || 'text',
      },
      { role: 'student', id: req.user.id }
    );
    notifyGroupOfMessage({
      groupId, senderType: 'student', senderId: req.user.id,
      body: String(body).trim(), messageType: message_type || 'text',
      message,
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('Post student group message error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const postStudentGroupAudioMessage = async (req, res) => {
  try {
    if (!ensureStudent(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const isMember = await assertStudentOwnsGroup(req.user.id, groupId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const upload = await saveRawAudioUpload(req, `student-group-${groupId}`);

    const message = await addGroupMessage(
      {
        group_id: groupId,
        sender_type: 'student',
        sender_id: req.user.id,
        body: '[Voice message]',
        message_type: 'audio',
        media_url: upload.mediaUrl,
        audio_duration: upload.audioDuration,
      },
      { role: 'student', id: req.user.id }
    );
    notifyGroupOfMessage({
      groupId, senderType: 'student', senderId: req.user.id,
      body: '[Voice message]', messageType: 'audio',
      message,
    });

    res.status(201).json({ message, data: message });
  } catch (error) {
    console.error('Post student group audio error:', error.message);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
};

const postStudentGroupMediaMessage = async (req, res) => {
  try {
    if (!ensureStudent(req, res)) return;
    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) return res.status(400).json({ message: 'Invalid groupId' });
    const isMember = await assertStudentOwnsGroup(req.user.id, groupId);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });
    const upload = await saveRawMediaUpload(req, `student-group-${groupId}`);
    const body = upload.messageType === 'image' ? '[Image]' : upload.messageType === 'video' ? '[Video]' : '[File]';
    const message = await addGroupMessage(
      { group_id: groupId, sender_type: 'student', sender_id: req.user.id, body, message_type: upload.messageType, media_url: upload.mediaUrl },
      { role: 'student', id: req.user.id }
    );
    notifyGroupOfMessage({
      groupId, senderType: 'student', senderId: req.user.id,
      body, messageType: upload.messageType,
      message,
    });
    res.status(201).json({ message: 'Media sent', data: message });
  } catch (error) {
    console.error('Post student group media error:', error.message);
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Server error' });
  }
};

const getStudentGroupMembers = async (req, res) => {
  try {
    if (!ensureStudent(req, res)) return;

    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const isMember = await assertStudentOwnsGroup(req.user.id, groupId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const members = await getGroupRosterMembers(groupId);

    res.status(200).json({ members });
  } catch (error) {
    console.error('Get student group members error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMyGroups,
  getStudentGroupMessages,
  postStudentGroupMessage,
  postStudentGroupAudioMessage,
  postStudentGroupMediaMessage,
  getStudentGroupMembers,
};
