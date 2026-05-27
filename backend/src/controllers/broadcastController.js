const pool = require('../config/db');
const {
  sendNotificationToRole,
  sendNotificationToMany,
  emitTicketEvent,
} = require('../services/socketService');

// ─── Send Broadcast Message ──────────────────────────────────────
const sendBroadcast = async (req, res) => {
  try {
    const { title, body, target_role } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        message: 'Title and body are required'
      });
    }

    const validRoles = ['all', 'agent', 'admin'];
    if (target_role && !validRoles.includes(target_role)) {
      return res.status(400).json({ message: 'Invalid target role' });
    }

    let userIds = [];

    if (!target_role || target_role === 'all') {
      // Send to all active staff
      const result = await pool.query(
        'SELECT id FROM users WHERE is_active = true'
      );
      userIds = result.rows.map(u => u.id);
    } else {
      // Send to specific role
      const result = await pool.query(
        'SELECT id FROM users WHERE role = $1 AND is_active = true',
        [target_role]
      );
      userIds = result.rows.map(u => u.id);
    }

    // Save broadcast to database
    const broadcast = await pool.query(
      `INSERT INTO broadcasts (sent_by, title, body, target_role, recipient_count)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, title, body, target_role || 'all', userIds.length]
    );

    // Send notifications to all recipients
    await sendNotificationToMany({
      userIds,
      type: 'broadcast',
      title,
      body,
      reference_id: broadcast.rows[0].id,
      reference_type: 'broadcast',
    });

    // Emit real-time event
    emitTicketEvent('broadcast:new', {
      title,
      body,
      sent_by: req.user.full_name,
    });

    res.status(201).json({
      message: 'Broadcast sent successfully',
      broadcast: broadcast.rows[0],
    });
  } catch (error) {
    console.error('Broadcast error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Broadcast History ───────────────────────────────────────
const getBroadcasts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.full_name as sent_by_name
       FROM broadcasts b
       LEFT JOIN users u ON b.sent_by = u.id
       ORDER BY b.created_at DESC
       LIMIT 50`
    );
    res.status(200).json({ broadcasts: result.rows });
  } catch (error) {
    console.error('Get broadcasts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendBroadcast, getBroadcasts };
