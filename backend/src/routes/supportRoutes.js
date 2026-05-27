const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const {
  createWebsiteSupportTicket,
  startSupportChatForRequester,
} = require('../services/supportTicketService');

const isCustomer = allowRoles('student', 'teacher');

/**
 * POST /api/support/website-ticket
 * Public endpoint used by the Credent Robotics website.
 */
router.post('/website-ticket', async (req, res) => {
  try {
    const result = await createWebsiteSupportTicket(req.body || {});
    return res.status(201).json({
      message: 'Ticket created',
      ...result,
    });
  } catch (error) {
    console.error('website-ticket error:', error.message);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
});

router.use(protect);

/**
 * GET /api/support/available-agent
 * Returns the next available support agent for a student or teacher to contact.
 *
 * Strategy: pick the active agent with the fewest currently-open channels.
 * Fallback: any active agent.
 */
router.get('/available-agent', isCustomer, async (req, res) => {
  try {
    // Try to find the active agent with the least direct-message channels
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.role,
              COALESCE(cm.dm_count, 0) AS dm_count
       FROM users u
       LEFT JOIN (
         SELECT cm.user_id, COUNT(*) AS dm_count
         FROM channel_members cm
         JOIN channels c ON c.id = cm.channel_id
         WHERE c.type = 'dm'
         GROUP BY cm.user_id
       ) cm ON cm.user_id = u.id
       WHERE u.is_active = true
         AND u.role = 'agent'
       ORDER BY dm_count ASC, u.id ASC
       LIMIT 1`
    );

    const agent = result.rows[0];
    if (!agent) {
      return res.status(404).json({ message: 'No agents available right now' });
    }

    return res.status(200).json({
      agent: {
        id: agent.id,
        full_name: agent.full_name,
        email: agent.email,
        role: agent.role,
      },
    });
  } catch (error) {
    console.error('available-agent error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/support/my-channels
 * Returns every DM channel the caller is a member of, decorated with the
 * OTHER side's name + role + avatar + latest message preview, so the
 * desktop chat list can render them as real chat rows.
 *
 * Works for all four roles — the caller's row maps to a channel-members
 * `member_type`:
 *   agent / admin → 'staff'
 *   teacher       → 'teacher'
 *   student       → 'student'
 *
 * The "other side" is whoever is in the channel that isn't the caller. For
 * a teacher's support chat that's the staff agent; for an agent it's the
 * teacher/student customer.
 */
router.get('/my-channels', allowRoles('agent', 'admin', 'teacher', 'student'), async (req, res) => {
  try {
    const meType = (req.user.role === 'agent' || req.user.role === 'admin') ? 'staff' : req.user.role;
    const result = await pool.query(
      `SELECT
         c.id                                                  AS channel_id,
         c.created_at                                          AS channel_created_at,
         other.member_type                                     AS other_role,
         other.member_id                                       AS other_id,
         COALESCE(
           CASE other.member_type
             WHEN 'teacher' THEN (SELECT full_name FROM teachers WHERE id = other.member_id)
             WHEN 'student' THEN (SELECT full_name FROM students WHERE id = other.member_id)
             WHEN 'staff'   THEN (SELECT full_name FROM users    WHERE id = other.member_id)
           END,
           'Unknown'
         )                                                     AS other_name,
         COALESCE(
           CASE other.member_type
             WHEN 'teacher' THEN (SELECT profile_picture_url FROM teachers WHERE id = other.member_id)
             WHEN 'student' THEN (SELECT profile_picture_url FROM students WHERE id = other.member_id)
             WHEN 'staff'   THEN (SELECT profile_picture_url FROM users    WHERE id = other.member_id)
           END,
           NULL
         )                                                     AS other_avatar_url,
         (SELECT body FROM messages WHERE channel_id = c.id ORDER BY id DESC LIMIT 1)
                                                              AS last_message_body,
         (SELECT created_at FROM messages WHERE channel_id = c.id ORDER BY id DESC LIMIT 1)
                                                              AS last_message_at
       FROM channels c
       JOIN channel_members me ON me.channel_id = c.id
        AND me.member_type = $2
        AND me.member_id = $1
       LEFT JOIN channel_members other ON other.channel_id = c.id
        AND NOT (other.member_type = $2 AND other.member_id = $1)
       WHERE c.type = 'dm'
       ORDER BY COALESCE(
         (SELECT MAX(created_at) FROM messages WHERE channel_id = c.id),
         c.created_at
       ) DESC`,
      [req.user.id, meType]
    );
    // Keep the old field names (`customer_name`, `customer_avatar_url`,
    // `customer_role`, `customer_id`) populated for the agent-side renderer
    // which already consumes them — just alias them from the generic
    // `other_*` columns.
    const channels = result.rows.map((r) => ({
      ...r,
      customer_role: r.other_role,
      customer_id: r.other_id,
      customer_name: r.other_name,
      customer_avatar_url: r.other_avatar_url,
    }));
    return res.status(200).json({ channels });
  } catch (error) {
    console.error('my-channels error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/support/start-chat
 * Creates or resumes a support conversation and links it to an open ticket.
 */
router.post('/start-chat', isCustomer, async (req, res) => {
  try {
    const result = await startSupportChatForRequester({
      requester: req.user,
      requesterType: req.user.role,
    });

    return res.status(result.created ? 201 : 200).json({
      message: result.created
        ? 'Support chat and ticket created'
        : 'Support chat resumed',
      agent: result.agent,
      channel: result.channel,
      channel_id: result.channel.id,
      ticket: result.ticket,
      ticket_id: result.ticket.id,
      created: result.created,
    });
  } catch (error) {
    console.error('start support chat error:', error.message);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
});

module.exports = router;
