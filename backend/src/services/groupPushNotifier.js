/**
 * Group message → push fan-out.
 *
 * Called by the controllers that create rows via `addGroupMessage` (teacher,
 * student). Looks up every member of the group except the sender, then sends
 * each a `group_message` data push so their mobile chat list can bump its
 * unread badge.
 *
 * Fire-and-forget by convention — never throw to the caller, just log. A bad
 * push must not roll back a successful message write.
 */

const pool = require('../config/db');
const { sendDataPush } = require('./pushSender');
const { getIO } = require('./socketService');

const MAX_BODY_PREVIEW = 140;

const truncate = (s, n) => {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
};

/**
 * @param {object} args
 * @param {number} args.groupId
 * @param {string} args.senderType   'teacher' | 'student' | 'agent'
 * @param {number} args.senderId     Suppresses the push to the sender themselves.
 * @param {string} args.body         Message body (will be truncated for the push payload).
 * @param {string} [args.messageType] e.g. 'text', 'audio', 'image' — affects the body shown.
 */
async function notifyGroupOfMessage({ groupId, senderType, senderId, body, messageType = 'text', message = null }) {
  try {
    const gid = Number(groupId);
    if (!Number.isInteger(gid) || gid <= 0) return;

    const [groupRow, students, teachers, senderRow] = await Promise.all([
      pool.query(`SELECT name FROM student_groups WHERE id = $1`, [gid]),
      pool.query(`SELECT student_id FROM group_members WHERE group_id = $1`, [gid]),
      pool.query(
        `SELECT teacher_id FROM teacher_group_access
          WHERE group_id = $1 AND is_active = true`,
        [gid]
      ),
      resolveSenderName(senderType, senderId),
    ]);

    const groupName = groupRow.rows[0]?.name || 'Your group';
    const senderName = senderRow || (senderType === 'teacher' ? 'Your teacher' : 'A teammate');

    // Title/body shown if the device shows the push as a banner. Mobile
    // clients ALSO read `group_id` from the data payload to bump the badge —
    // see Android CredentFcmService.handleGenericNotification + iOS
    // PushManager userNotificationCenter(willPresent:).
    const preview = messageType === 'audio'
        ? '🎤 Voice message'
      : messageType === 'image'
        ? '📷 Photo'
      : truncate(body || '', MAX_BODY_PREVIEW);

    const payload = {
      title: groupName,
      body: `${senderName}: ${preview}`,
      group_id: gid,
      group_name: groupName,
      sender_name: senderName,
      sender_role: senderType,
    };

    // Socket fan-out for the desktop renderer (Electron). Mobile apps get
    // FCM pushes below; desktop relies on the live socket.io 'message:new'
    // event to either append the bubble (if the chat is open) or bump the
    // chat-list unread badge (if not). Previously this function only sent
    // FCM, so the desktop never got real-time notifications.
    const io = getIO();
    const socketPayload = {
      ...(message || {}),
      id: message?.id,
      group_id: gid,
      group_name: groupName,
      sender_type: senderType,
      sender_id: senderId,
      sender_name: senderName,
      body: message?.body ?? body ?? preview,
      message_type: message?.message_type || messageType,
      media_url: message?.media_url || null,
      audio_duration: message?.audio_duration || null,
      created_at: message?.created_at || new Date().toISOString(),
    };

    // Don't push to the sender themselves.
    const tasks = [];
    for (const row of students.rows) {
      const sid = Number(row.student_id);
      if (senderType === 'student' && sid === Number(senderId)) continue;
      if (io) io.to(`user_${sid}`).emit('message:new', { ...socketPayload, is_own: false });
      tasks.push(sendDataPush({
        user_id: sid, user_role: 'student', type: 'group_message', payload,
      }).catch((e) => console.warn(`[group-push] student=${sid} failed:`, e.message)));
    }
    for (const row of teachers.rows) {
      const tid = Number(row.teacher_id);
      if (senderType === 'teacher' && tid === Number(senderId)) continue;
      if (io) io.to(`user_${tid}`).emit('message:new', { ...socketPayload, is_own: false });
      tasks.push(sendDataPush({
        user_id: tid, user_role: 'teacher', type: 'group_message', payload,
      }).catch((e) => console.warn(`[group-push] teacher=${tid} failed:`, e.message)));
    }

    await Promise.all(tasks);
  } catch (e) {
    // Never throw — a push failure must not roll back the message write.
    console.warn('[group-push] fan-out failed:', e.message);
  }
}

async function resolveSenderName(senderType, senderId) {
  if (!senderType || !Number.isInteger(Number(senderId))) return null;
  const id = Number(senderId);
  try {
    if (senderType === 'student') {
      const r = await pool.query(`SELECT full_name FROM students WHERE id = $1`, [id]);
      return r.rows[0]?.full_name || null;
    }
    if (senderType === 'teacher') {
      const r = await pool.query(`SELECT full_name FROM teachers WHERE id = $1`, [id]);
      return r.rows[0]?.full_name || null;
    }
    if (senderType === 'agent') {
      const r = await pool.query(`SELECT full_name FROM users WHERE id = $1`, [id]);
      return r.rows[0]?.full_name || null;
    }
  } catch (_) { /* swallow */ }
  return null;
}

module.exports = { notifyGroupOfMessage };
