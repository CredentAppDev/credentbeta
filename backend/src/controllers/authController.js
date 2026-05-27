const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const {
  findUserByEmail,
  findUserById,
  updateRefreshToken,
  findUserByRefreshToken,
  savePasskey,
  markPasskeyUsed,
  saveDeviceToken,
  findUserByDeviceToken,
  clearDeviceToken,
  findUserByPasskeyOnly,
} = require('../models/userModel');
const {
  findTeacherByPasskey,
  findStudentByPasskey,
} = require('../models/schoolModel');
const sgMail = require('@sendgrid/mail');
const agentPasskeyTemplate = require('../templates/agentPasskey');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ─── Generate 10-Digit Numeric Passkey ──────────────────────────
const generatePasskey = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const generateUniquePasskey = async () => {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const passkey = generatePasskey();
    const collision = await pool.query(
      `SELECT 1 FROM users WHERE passkey = $1
       UNION
       SELECT 1 FROM teachers WHERE passkey = $1
       UNION
       SELECT 1 FROM students WHERE passkey = $1
       LIMIT 1`,
      [passkey]
    );

    if (collision.rowCount === 0) {
      return passkey;
    }
  }

  throw new Error('Could not generate a unique passkey');
};

const sendAgentPasskeyEmail = async ({ user, passkey }) => {
  const template = agentPasskeyTemplate({
    agentName: user.full_name,
    passkey,
    expiryHours: 24,
  });

  await sgMail.send({
    to: user.email,
    from: {
      email: process.env.EMAIL_FROM,
      name: process.env.EMAIL_FROM_NAME,
    },
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

// ─── Generate Tokens ─────────────────────────────────────────────
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

// ─── Generate Device Token ───────────────────────────────────────
const generateDeviceToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// ─── Unified First Passkey Detection ─────────────────────────────
const passkeyStart = async (req, res) => {
  try {
    const { passkey } = req.body;

    if (!passkey) {
      return res.status(400).json({ message: 'Passkey is required' });
    }

    const [agent, teacher, student] = await Promise.all([
      findUserByPasskeyOnly(passkey),
      findTeacherByPasskey(passkey),
      findStudentByPasskey(passkey),
    ]);

    const matches = [
      agent ? 'agent' : null,
      teacher ? 'teacher' : null,
      student ? 'student' : null,
    ].filter(Boolean);

    if (matches.length === 0) {
      return res.status(401).json({
        message: 'Invalid or expired passkey',
      });
    }

    if (matches.length > 1) {
      return res.status(409).json({
        message: 'Passkey matches multiple user types. Regenerate the passkey.',
        matches,
      });
    }

    if (agent) {
      return res.status(200).json({
        message: 'Passkey verified',
        userType: 'agent',
        nextStep: 'complete_agent_login',
        route: '/api/auth/passkey',
        user: {
          id: agent.id,
          full_name: agent.full_name,
          email: agent.email,
          role: agent.role,
        },
      });
    }

    if (teacher) {
      return res.status(200).json({
        message: 'Passkey verified',
        userType: 'teacher',
        nextStep: 'teacher_id',
        route: '/api/auth/teacher/passkey',
        teacher: {
          id: teacher.id,
          full_name: teacher.full_name,
          teacher_id: teacher.teacher_id,
          email: teacher.email,
        },
      });
    }

    if (student) {
      return res.status(200).json({
        message: 'Passkey verified',
        userType: 'student',
        nextStep: 'school_id_and_student_id',
        route: '/api/auth/student/passkey',
        student: {
          id: student.id,
          full_name: student.full_name,
          student_id: student.student_id,
          school_id: student.school_code,
          school_name: student.school_name,
        },
      });
    }

    return res.status(500).json({ message: 'Unexpected auth state' });
  } catch (error) {
    console.error('Passkey start error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Admin Login (password based — admin only) ───────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Agents must login using their passkey'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await updateRefreshToken(user.id, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Agent Passkey Login — passkey only, no email needed ─────────
const passkeyLogin = async (req, res) => {
  try {
    const { passkey } = req.body;

    if (!passkey) {
      return res.status(400).json({
        message: 'Passkey is required'
      });
    }

    // Find user by passkey alone — no email needed
    const result = await pool.query(
      `SELECT * FROM users
       WHERE passkey = $1
       AND is_active = true`,
      [passkey]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: 'Invalid passkey.'
      });
    }

    // Generate permanent device token
    const deviceToken = generateDeviceToken();

    // Save device token — permanent session
    await saveDeviceToken(user.id, deviceToken);

    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await updateRefreshToken(user.id, refreshToken);

    console.log(`✅ Passkey login successful for ${user.email}`);

    res.status(200).json({
      message: 'Login successful',
      deviceToken,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Passkey login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Device Token Login (auto login on app reopen) ───────────────
const deviceLogin = async (req, res) => {
  try {
    const { deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({ message: 'Device token required' });
    }

    const user = await findUserByDeviceToken(deviceToken);
    if (!user) {
      return res.status(401).json({
        message: 'Session expired. Please request a new passkey.',
        requiresPasskey: true,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await updateRefreshToken(user.id, refreshToken);

    res.status(200).json({
      message: 'Auto login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Device login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Request New Passkey ─────────────────────────────────────────
const requestNewPasskey = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(200).json({
        message: 'If this email is registered, a new passkey has been sent.'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        message: 'Admin accounts use password login.'
      });
    }

    const passkey = await generateUniquePasskey();
    await savePasskey(user.id, passkey);
    await clearDeviceToken(user.id);

    await sendAgentPasskeyEmail({ user, passkey });

    console.log(`✅ New passkey sent to ${user.email}`);

    res.status(200).json({
      message: 'If this email is registered, a new passkey has been sent.'
    });
  } catch (error) {
    console.error('Request passkey error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Agent Self-Service Passkey Reset ────────────────────────────
const resetCurrentAgentPasskey = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Only agents can reset their passkey from settings' });
    }

    const user = await findUserById(req.user.id);
    if (!user || user.role !== 'agent' || !user.is_active) {
      return res.status(404).json({ message: 'Agent account not found' });
    }

    const passkey = await generateUniquePasskey();
    const updated = await savePasskey(user.id, passkey);

    await clearDeviceToken(user.id);
    await updateRefreshToken(user.id, null);

    let emailSent = false;
    try {
      await sendAgentPasskeyEmail({ user, passkey });
      emailSent = true;
    } catch (emailError) {
      console.error('Agent self passkey reset email error:', emailError.message);
    }

    res.status(200).json({
      message: emailSent
        ? 'Agent passkey reset successfully and sent to email'
        : 'Agent passkey reset successfully, but email delivery failed',
      passkey,
      passkey_expires_at: updated?.passkey_expires_at || null,
      passkey_used: false,
      email_sent: emailSent,
      agent: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Agent self passkey reset error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Logout ──────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    const { refreshToken, deviceToken } = req.body;

    if (refreshToken) {
      const user = await findUserByRefreshToken(refreshToken);
      if (user) {
        await updateRefreshToken(user.id, null);
      }
    }

    if (deviceToken) {
      const user = await findUserByDeviceToken(deviceToken);
      if (user) {
        await clearDeviceToken(user.id);
      }
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Refresh Token ────────────────────────────────────────────────
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await findUserByRefreshToken(refreshToken);
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Refresh error:', error.message);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// ─── Get Current User ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  passkeyStart,
  passkeyLogin,
  deviceLogin,
  requestNewPasskey,
  resetCurrentAgentPasskey,
  refresh,
  logout,
  getMe,
};
