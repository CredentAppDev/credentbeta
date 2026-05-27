const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const agentPasskeyTemplate = require('../templates/agentPasskey');
const { savePasskey } = require('../models/userModel');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ─── Generate 10-Digit Numeric Passkey ──────────────────────────
const generatePasskey = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// ─── Get All Agents ──────────────────────────────────────────────
const getAgents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users
       WHERE role = 'agent'
       ORDER BY created_at DESC`
    );
    res.status(200).json({ agents: result.rows });
  } catch (error) {
    console.error('Get agents error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Single Agent ────────────────────────────────────────────
const getAgent = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users WHERE id = $1 AND role = 'agent'`,
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json({ agent: result.rows[0] });
  } catch (error) {
    console.error('Get agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Create New Agent ────────────────────────────────────────────
const createAgent = async (req, res) => {
  try {
    const { full_name, email, role } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({
        message: 'Full name and email are required'
      });
    }

    if (role && role !== 'agent') {
      return res.status(400).json({
        message: 'Only the agent role can be created here'
      });
    }

    // Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows[0]) {
      return res.status(409).json({
        message: 'An agent with this email already exists'
      });
    }

    // Generate 10-digit passkey
    const passkey = generatePasskey();
    const passkeyExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create agent without password
    const result = await pool.query(
      `INSERT INTO users
        (full_name, email, role, passkey, passkey_expires_at, passkey_used)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING id, full_name, email, role, is_active, created_at`,
      [full_name, email, 'agent', passkey, passkeyExpiresAt]
    );

    const agent = result.rows[0];

    // Send passkey email to agent
    const template = agentPasskeyTemplate({
      agentName: full_name,
      passkey,
      expiryHours: 24,
    });

    await sgMail.send({
      to: email,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`✅ Passkey sent to ${email}`);

    res.status(201).json({
      message: 'Agent created successfully. Passkey sent to their email.',
      agent,
    });
  } catch (error) {
    console.error('Create agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Edit Agent ──────────────────────────────────────────────────
const editAgent = async (req, res) => {
  try {
    const { full_name, email, role } = req.body;

    const existing = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [req.params.id, 'agent']
    );
    if (!existing.rows[0]) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    if (role && role !== 'agent') {
      return res.status(400).json({ message: 'Agents must keep the agent role' });
    }

    const result = await pool.query(
      `UPDATE users SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        role = COALESCE($3, role),
        updated_at = NOW()
       WHERE id = $4
       RETURNING id, full_name, email, role, is_active, created_at`,
      [full_name, email, 'agent', req.params.id]
    );

    res.status(200).json({
      message: 'Agent updated successfully',
      agent: result.rows[0]
    });
  } catch (error) {
    console.error('Edit agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Deactivate Agent ────────────────────────────────────────────
const deactivateAgent = async (req, res) => {
  try {
    if (req.params.id == req.user.id) {
      return res.status(400).json({
        message: 'You cannot deactivate your own account'
      });
    }

    const result = await pool.query(
      `UPDATE users SET
        is_active = false,
        device_token = NULL,
        updated_at = NOW()
       WHERE id = $1 AND role = 'agent'
       RETURNING id, full_name, email, role, is_active`,
      [req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({
      message: 'Agent deactivated successfully',
      agent: result.rows[0]
    });
  } catch (error) {
    console.error('Deactivate agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Reactivate Agent ────────────────────────────────────────────
const reactivateAgent = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users SET
        is_active = true,
        updated_at = NOW()
       WHERE id = $1 AND role = 'agent'
       RETURNING id, full_name, email, role, is_active`,
      [req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({
      message: 'Agent reactivated successfully',
      agent: result.rows[0]
    });
  } catch (error) {
    console.error('Reactivate agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Resend Passkey ───────────────────────────────────────────────
const resendPasskey = async (req, res) => {
  try {
    const agentResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [req.params.id, 'agent']
    );

    if (!agentResult.rows[0]) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const agent = agentResult.rows[0];

    // Generate new passkey
    const passkey = generatePasskey();
    await savePasskey(agent.id, passkey);

    // Clear device token so agent must re-login
    await pool.query(
      'UPDATE users SET device_token = NULL WHERE id = $1',
      [agent.id]
    );

    // Send new passkey email
    const template = agentPasskeyTemplate({
      agentName: agent.full_name,
      passkey,
      expiryHours: 24,
    });

    await sgMail.send({
      to: agent.email,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`✅ New passkey resent to ${agent.email}`);

    res.status(200).json({
      message: 'New passkey sent to agent email successfully'
    });
  } catch (error) {
    console.error('Resend passkey error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Dashboard Stats ─────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const [tickets, agents, customers] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_tickets,
          COUNT(*) FILTER (WHERE status = 'closed') as closed_tickets,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as new_today
        FROM tickets
      `),
      pool.query(`
        SELECT
          COUNT(*) as total_agents,
          COUNT(*) FILTER (WHERE is_active = true) as active_agents
        FROM users
        WHERE role != 'admin'
      `),
      pool.query(`
        SELECT COUNT(*) as total_customers FROM customers
      `)
    ]);

    res.status(200).json({
      tickets: tickets.rows[0],
      agents: agents.rows[0],
      customers: customers.rows[0]
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAgents,
  getAgent,
  createAgent,
  editAgent,
  deactivateAgent,
  reactivateAgent,
  resendPasskey,
  getDashboardStats,
};
