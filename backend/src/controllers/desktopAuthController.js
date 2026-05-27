const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendDataPush } = require('../services/pushSender');
const { findTeacherByPasskey, findStudentByPasskey } = require('../models/schoolModel');
const { findUserByPasskeyOnly } = require('../models/userModel');

const generateCode = () => String(Math.floor(10000 + Math.random() * 90000));

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email || '', role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const generateDeviceToken = () => crypto.randomBytes(32).toString('hex');

const createDesktopAuthTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS desktop_auth_codes (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      user_role VARCHAR(20) NOT NULL,
      code VARCHAR(5) NOT NULL,
      used BOOLEAN DEFAULT false,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

/**
 * Look the passkey up in all three user tables (users / teachers / students)
 * plus the legacy ID columns (teacher_id, student_id) and email. Returns
 * { userId, displayName, role } or null.
 *
 * Why three tables: teachers and students keep their own `passkey` column on
 * their respective rows, while agents/admins live in `users`. The desktop
 * login screen accepts a single field, so we have to try them all.
 */
const lookupByDesktopCredential = async (raw) => {
  const candidate = (raw || '').trim();
  if (!candidate) return null;

  // 1. Numeric / opaque passkey across all three tables.
  const teacher = await findTeacherByPasskey(candidate);
  if (teacher) return { userId: teacher.id, displayName: teacher.full_name, role: 'teacher', email: teacher.email || '' };

  const student = await findStudentByPasskey(candidate);
  if (student) return { userId: student.id, displayName: student.full_name, role: 'student', email: student.email || '' };

  const agent = await findUserByPasskeyOnly(candidate);
  if (agent) return { userId: agent.id, displayName: agent.full_name, role: agent.role || 'agent', email: agent.email || '' };

  // 2. Legacy ID columns — teacher_id like "TCH96751076", student_id like "STU300002942".
  const upper = candidate.toUpperCase();
  if (upper.startsWith('TCH')) {
    const r = await pool.query(
      `SELECT id, full_name, email FROM teachers WHERE teacher_id = $1 AND is_active = true`,
      [candidate]
    );
    if (r.rows.length) return { userId: r.rows[0].id, displayName: r.rows[0].full_name, role: 'teacher', email: r.rows[0].email || '' };
  }
  if (upper.startsWith('STU')) {
    const r = await pool.query(
      `SELECT id, full_name, email FROM students WHERE student_id = $1 AND is_active = true`,
      [candidate]
    );
    if (r.rows.length) return { userId: r.rows[0].id, displayName: r.rows[0].full_name, role: 'student', email: r.rows[0].email || '' };
  }

  // 3. Email fallback (mostly for agents / admins).
  const byEmail = await pool.query(
    `SELECT id, full_name, role, email FROM users WHERE email = $1 AND is_active = true`,
    [candidate]
  );
  if (byEmail.rows.length) {
    return { userId: byEmail.rows[0].id, displayName: byEmail.rows[0].full_name, role: byEmail.rows[0].role || 'agent', email: byEmail.rows[0].email || '' };
  }

  return null;
};

// POST /api/auth/desktop/initiate
// body: { passkey: string } - universal passkey for any user type
// NOTE: 2FA second factor (push-delivered code) has been disabled — the
// passkey alone now logs the user in and returns auth tokens directly.
const initiate = async (req, res) => {
  try {
    const { passkey } = req.body;

    if (!passkey) {
      return res.status(400).json({ message: 'passkey required' });
    }

    const found = await lookupByDesktopCredential(passkey);
    if (!found) {
      return res.status(404).json({ message: 'Invalid passkey. User not found.' });
    }
    const { userId, displayName, role, email } = found;

    const user = { id: userId, email: email || '', role };
    const accessToken = generateAccessToken(user);
    const deviceToken = generateDeviceToken();

    res.json({
      success: true,
      displayName,
      accessToken,
      deviceToken,
      user: {
        id: userId,
        displayName,
        role,
      },
    });
  } catch (err) {
    console.error('Desktop initiate error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resolve a desktop login identifier (passkey, teacher_id, student_id, or
// email) to a concrete user row + role. Mirrors the routing in initiate()
// so verify() and initiate() can never disagree on who the user is.
const resolveDesktopUser = async ({ passkey, teacher_id, student_id, email }) => {
  const candidate = (passkey || teacher_id || student_id || email || '').trim();
  if (!candidate) return null;
  const found = await lookupByDesktopCredential(candidate);
  if (!found) return null;
  return {
    row: { id: found.userId, full_name: found.displayName, email: found.email || '' },
    role: found.role,
  };
};

// POST /api/auth/desktop/verify
const verify = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || code.length !== 5) return res.status(400).json({ message: 'Invalid code' });

    const resolved = await resolveDesktopUser(req.body);
    if (!resolved) return res.status(404).json({ message: 'User not found' });
    const { row: userRow, role: userRole } = resolved;
    const userId = userRow.id;

    const codeRow = await pool.query(
      `SELECT id FROM desktop_auth_codes
       WHERE user_id = $1 AND user_role = $2 AND code = $3 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, userRole, code]
    );

    if (!codeRow.rows.length) {
      return res.status(401).json({ message: 'Invalid or expired code' });
    }

    await pool.query(`UPDATE desktop_auth_codes SET used = true WHERE id = $1`, [codeRow.rows[0].id]);

    const user = { id: userId, email: userRow.email || '', role: userRole };
    const accessToken = generateAccessToken(user);
    const deviceToken = generateDeviceToken();

    res.json({
      success: true,
      accessToken,
      deviceToken,
      user: {
        id: userId,
        displayName: userRow.full_name,
        role: userRole,
      },
    });
  } catch (err) {
    console.error('Desktop verify error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/desktop/pending-code — called by mobile app to show code to user
const pendingCode = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const r = await pool.query(
      `SELECT code, expires_at FROM desktop_auth_codes
       WHERE user_id = $1 AND user_role = $2 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, role]
    );
    if (!r.rows.length) return res.json({ code: null });
    const row = r.rows[0];
    const secondsLeft = Math.floor((new Date(row.expires_at) - Date.now()) / 1000);
    res.json({ code: row.code, expiresIn: secondsLeft });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { initiate, verify, pendingCode, createDesktopAuthTable };
