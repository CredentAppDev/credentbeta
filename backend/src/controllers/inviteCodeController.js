const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const pool = require('../config/db');
const {
  createInviteCode,
  findInviteCode,
  incrementInviteUse,
  listInviteCodes,
  revokeInviteCode,
} = require('../models/inviteCodeModel');

const makePasskey = () => crypto.randomInt(1000000000, 10000000000).toString();

const generateUniquePasskey = async () => {
  for (let i = 0; i < 25; i += 1) {
    const passkey = makePasskey();
    const collision = await pool.query(
      `SELECT 1 FROM users WHERE passkey = $1
       UNION SELECT 1 FROM teachers WHERE passkey = $1
       UNION SELECT 1 FROM students WHERE passkey = $1
       LIMIT 1`,
      [passkey]
    );
    if (collision.rowCount === 0) return passkey;
  }
  throw new Error('Could not generate a unique passkey');
};

const validateCreateInvite = [
  body('role').isIn(['teacher', 'student']).withMessage('role must be teacher or student'),
  body('max_uses').optional().isInt({ min: 1, max: 200 }).withMessage('max_uses 1–200'),
  body('expires_at').optional().isISO8601().withMessage('expires_at must be ISO8601'),
];

const validateRedeem = [
  body('code').exists({ checkFalsy: true }).withMessage('code is required'),
  body('full_name')
    .exists({ checkFalsy: true })
    .withMessage('full_name is required')
    .isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().withMessage('email invalid'),
];

// POST /api/beta/invites — agent/admin creates an invite code.
const createInvite = async (req, res) => {
  if (!['agent', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const invite = await createInviteCode({
      role: req.body.role,
      grade: req.body.grade,
      class_name: req.body.class_name,
      school_code: req.body.school_code,
      max_uses: req.body.max_uses || 1,
      label: req.body.label,
      created_by: req.user.id,
      expires_at: req.body.expires_at || null,
    });
    res.status(201).json({ invite });
  } catch (error) {
    console.error('createInvite error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/beta/invites — agent/admin lists codes.
const listInvites = async (req, res) => {
  if (!['agent', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const invites = await listInviteCodes();
    res.status(200).json({ invites });
  } catch (error) {
    console.error('listInvites error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/beta/invites/:id — revoke (mark inactive).
const revokeInvite = async (req, res) => {
  if (!['agent', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const row = await revokeInviteCode(req.params.id);
    if (!row) return res.status(404).json({ message: 'Invite not found' });
    res.status(200).json({ invite: row });
  } catch (error) {
    console.error('revokeInvite error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/beta/redeem — PUBLIC. A tester redeems a code, we create their
// teacher/student row and hand back a passkey they can immediately use to log
// in via /api/auth/desktop/initiate. No password, no email verification.
const redeemInvite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const code = String(req.body.code || '').trim().toUpperCase();
  const fullName = String(req.body.full_name || '').trim();
  const email = String(req.body.email || '').trim() || null;

  try {
    const invite = await findInviteCode(code);
    if (!invite) {
      return res.status(404).json({ message: 'Invalid or expired invite code' });
    }

    const passkey = await generateUniquePasskey();

    if (invite.role === 'teacher') {
      // Generate a teacher_id matching the existing TCHxxxxxxxx pattern.
      const teacherId = 'TCH' + Date.now().toString().slice(-8);
      const result = await pool.query(
        `INSERT INTO teachers
           (teacher_id, full_name, email, passkey, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id, teacher_id, full_name, email`,
        [teacherId, fullName, email, passkey]
      );
      // Auto-assign to a school's groups if a school_code was attached to the
      // invite. Best-effort; if it fails the teacher still exists.
      if (invite.school_code) {
        await pool.query(
          `INSERT INTO teacher_group_access (teacher_id, group_id, assigned_by, is_active)
           SELECT $1, sg.id, $2, true FROM student_groups sg
           JOIN schools s ON s.id = sg.school_id
           WHERE s.school_id = $3 AND sg.is_confirmed = true
           ON CONFLICT (teacher_id, group_id) DO NOTHING`,
          [result.rows[0].id, invite.created_by, invite.school_code]
        ).catch(() => {});
      }
      await incrementInviteUse(invite.id);
      return res.status(201).json({
        message: 'Account created. Use the passkey to log in.',
        role: 'teacher',
        passkey,
        teacher: result.rows[0],
      });
    }

    // Student path
    let schoolId = null;
    if (invite.school_code) {
      const s = await pool.query(
        `SELECT id FROM schools WHERE school_id = $1 LIMIT 1`,
        [invite.school_code]
      );
      schoolId = s.rows[0]?.id || null;
    }
    const studentIdStr = 'STU' + Date.now().toString().slice(-8);
    const result = await pool.query(
      `INSERT INTO students
         (student_id, school_id, full_name, email, grade, class_name, passkey, passkey_used, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false, true)
       RETURNING id, student_id, full_name, email, grade, class_name`,
      [
        studentIdStr,
        schoolId,
        fullName,
        email,
        invite.grade,
        invite.class_name,
        passkey,
      ]
    );
    await incrementInviteUse(invite.id);
    return res.status(201).json({
      message: 'Account created. Use the passkey to log in.',
      role: 'student',
      passkey,
      student: result.rows[0],
    });
  } catch (error) {
    console.error('redeemInvite error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  validateCreateInvite,
  validateRedeem,
  createInvite,
  listInvites,
  revokeInvite,
  redeemInvite,
};
