const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const pool = require('../config/db');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { updateUserProfilePicture } = require('../models/userModel');
const {
  assignAgentsToSchool,
  autoCreateGroupsForClass,
  confirmGroupsForClass,
  getAvailableTeachers,
  getGroupsBySchoolAndClass,
  getGroupMembers,
  getGroupRosterMembers,
  getSchoolAgents,
  createStudentGroup,
  addStudentToGroup,
} = require('../models/schoolModel');

const router = express.Router();
const isAgent = allowRoles('agent', 'admin');

const makePasskey = () => crypto.randomInt(1000000000, 10000000000).toString();

const generateUniquePasskey = async () => {
  for (let i = 0; i < 25; i++) {
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
const clean = (value) => String(value || '').trim();
const normalizeTeacherId = (value) => clean(value).replace(/\s+/g, '').toUpperCase();
const emailConfigured = () => Boolean(process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM);
const isPlaceholderEmail = (email) => clean(email).toLowerCase().endsWith('@credent.local');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const escapeHtml = (value) => clean(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const sendCredentialEmail = async ({
  to,
  roleLabel,
  fullName,
  loginIdLabel,
  loginId,
  passkey,
  passkeyExpiresAt,
  schoolName,
  schoolCode,
}) => {
  const safeRole = escapeHtml(roleLabel);
  const safeName = escapeHtml(fullName);
  const safeLoginLabel = escapeHtml(loginIdLabel);
  const safeLoginId = escapeHtml(loginId);
  const safeSchoolName = escapeHtml(schoolName);
  const safeSchoolCode = escapeHtml(schoolCode);
  const safePasskey = escapeHtml(passkey);
  const expiresText = passkeyExpiresAt ? new Date(passkeyExpiresAt).toISOString() : '24 hours after creation';
  const schoolLine = schoolName
    ? `<p><strong>School:</strong> ${safeSchoolName}${schoolCode ? ` (${safeSchoolCode})` : ''}</p>`
    : '';
  const textSchoolLine = schoolName
    ? ` School: ${schoolName}${schoolCode ? ` (${schoolCode})` : ''}.`
    : '';

  await sgMail.send({
    to,
    from: {
      email: process.env.EMAIL_FROM,
      name: process.env.EMAIL_FROM_NAME || 'Credent',
    },
    subject: `Your Credent ${roleLabel} Access`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#111827;">
        <h2>Credent ${safeRole} Access</h2>
        <p>Hello ${safeName || safeRole},</p>
        <p>Your Credent access credentials are ready.</p>
        <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;">
          ${schoolLine}
          <p><strong>${safeLoginLabel}:</strong> ${safeLoginId}</p>
          <p><strong>One-time passkey:</strong> <span style="font-size:24px;letter-spacing:4px;font-weight:bold;">${safePasskey}</span></p>
          <p><strong>Expires:</strong> ${escapeHtml(expiresText)}</p>
        </div>
        <p>Use this passkey for first login. After the passkey is used, it cannot be used again.</p>
      </div>
    `,
    text: `Credent ${roleLabel} access for ${fullName}.${textSchoolLine} ${loginIdLabel}: ${loginId}. One-time passkey: ${passkey}. Expires: ${expiresText}.`,
  });
};

const uploadsRoot = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
// Store a relative path so every viewer's renderer can resolve it against
// its own engine.baseUrl. See educationProfileController for the same fix.
const publicUploadUrl = (_req, filename) => `/uploads/${filename}`;

const ensureUploadsDir = () => {
  fs.mkdirSync(uploadsRoot, { recursive: true });
};

const saveRawImage = (req, prefix) => {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    const error = new Error('Image body is required');
    error.statusCode = 400;
    throw error;
  }

  ensureUploadsDir();
  const contentType = String(req.get('content-type') || '').toLowerCase();
  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : 'jpg';
  const filename = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  fs.writeFileSync(path.join(uploadsRoot, filename), req.body);
  return publicUploadUrl(req, filename);
};

const findActiveSchool = async (schoolRef) => {
  const ref = clean(schoolRef);
  const numericId = Number(ref);
  const result = await pool.query(
    `SELECT id, school_id, name
     FROM schools
     WHERE is_active = true
       AND (id = $1 OR LOWER(school_id) = LOWER($2))
     LIMIT 1`,
    [Number.isInteger(numericId) && numericId > 0 ? numericId : null, ref]
  );
  return result.rows[0] || null;
};

const parseSemester = (value) => {
  const semester = clean(value);
  return semester || null;
};

router.use(protect);
router.use(isAgent);

router.get('/me', (req, res) => {
  res.status(200).json({
    agent: {
      id: req.user.id,
      full_name: req.user.full_name,
      email: req.user.email,
      role: req.user.role,
      profile_picture_url: req.user.profile_picture_url || null,
      created_at: req.user.created_at,
    },
  });
});

router.post(
  '/profile-picture/upload',
  express.raw({ type: ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'], limit: '6mb' }),
  async (req, res) => {
    try {
      const profilePictureUrl = saveRawImage(req, `agent-${req.user.id}`);
      const agent = await updateUserProfilePicture(req.user.id, profilePictureUrl);
      res.status(200).json({
        message: 'Agent profile picture uploaded',
        profile_picture_url: profilePictureUrl,
        agent,
      });
    } catch (error) {
      console.error('agent profile upload error:', error.message);
      res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Server error' });
    }
  }
);

router.get('/schools', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id,
              s.name,
              s.school_id AS school_code,
              s.address,
              COALESCE(s.contact_email, '') AS region,
              COUNT(DISTINCT st.id)::integer AS student_count,
              COUNT(DISTINCT tsa.teacher_id)::integer AS teacher_count
       FROM schools s
       LEFT JOIN students st ON st.school_id = s.id AND st.is_active = true
       LEFT JOIN teacher_school_assignments tsa ON tsa.school_id = s.id
       WHERE s.is_active = true
       GROUP BY s.id
       ORDER BY s.created_at DESC`
    );
    res.status(200).json({ schools: result.rows });
  } catch (error) {
    console.error('agent list schools error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/schools', async (req, res) => {
  try {
    const name = clean(req.body.name);
    const schoolCode = clean(req.body.school_code) || `SCH${Date.now().toString().slice(-8)}`;
    const address = clean(req.body.address);
    const region = clean(req.body.region);
    const contactEmail = clean(req.body.contact_email) || region;
    const contactPhone = clean(req.body.contact_phone);

    if (!name) {
      return res.status(400).json({ message: 'School name is required' });
    }

    const result = await pool.query(
      `INSERT INTO schools
       (school_id, name, address, contact_email, contact_phone, registered_by, assigned_agent_id)
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       RETURNING id, name, school_id AS school_code, address, COALESCE(contact_email, '') AS region,
                 0::integer AS student_count, 0::integer AS teacher_count`,
      [schoolCode, name, address || null, contactEmail || null, contactPhone || null, req.user.id]
    );

    await pool.query(
      `INSERT INTO school_agent_assignments (school_id, agent_id, assigned_by)
       VALUES ($1, $2, $2)
       ON CONFLICT (school_id, agent_id) DO NOTHING`,
      [result.rows[0].id, req.user.id]
    );

    res.status(201).json({ message: 'School created', school: result.rows[0] });
  } catch (error) {
    console.error('agent create school error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'School code already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/schools/:schoolId', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const result = await pool.query(
      `SELECT s.id,
              s.name,
              s.school_id AS school_code,
              s.address,
              COALESCE(s.contact_email, '') AS region,
              COUNT(DISTINCT st.id)::integer AS student_count,
              COUNT(DISTINCT tsa.teacher_id)::integer AS teacher_count
       FROM schools s
       LEFT JOIN students st ON st.school_id = s.id AND st.is_active = true
       LEFT JOIN teacher_school_assignments tsa ON tsa.school_id = s.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [school.id]
    );

    res.status(200).json({ school: result.rows[0] });
  } catch (error) {
    console.error('agent get school error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/schools/:schoolId/agents', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const agents = await getSchoolAgents(school.id);
    res.status(200).json({ agents });
  } catch (error) {
    console.error('agent list school agents error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/schools/:schoolId/assign-agent', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const agentId = Number(req.body.agent_id);

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (!Number.isInteger(agentId) || agentId <= 0) {
      return res.status(400).json({ message: 'agent_id is required' });
    }

    const updated = await pool.query(
      `UPDATE schools
       SET assigned_agent_id = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, school_id AS school_code, address, COALESCE(contact_email, '') AS region`,
      [agentId, school.id]
    );

    await assignAgentsToSchool(school.id, [agentId], req.user.id);

    res.status(200).json({ message: 'Agent assigned to school', school: updated.rows[0] });
  } catch (error) {
    console.error('agent assign school agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/schools/:schoolId/assign-agents', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const agentIds = Array.isArray(req.body.agent_ids)
      ? req.body.agent_ids.map(Number).filter((id) => Number.isInteger(id) && id > 0)
      : [];

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (agentIds.length === 0) {
      return res.status(400).json({ message: 'agent_ids array is required' });
    }

    const assignments = await assignAgentsToSchool(school.id, agentIds, req.user.id);
    const agents = await getSchoolAgents(school.id);

    res.status(200).json({ message: 'Agents assigned successfully', assignments, agents });
  } catch (error) {
    console.error('agent assign multiple school agents error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/students', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT st.id,
              st.full_name,
              st.student_id,
              COALESCE(st.email, '') AS email,
              st.school_id,
              sc.school_id AS school_code,
              sc.name AS school_name,
              COALESCE(st.grade, '') AS grade,
              COALESCE(st.class_name, '') AS class_name,
              st.passkey,
              st.is_active,
              st.created_at
       FROM students st
       LEFT JOIN schools sc ON sc.id = st.school_id
       WHERE st.is_active = true
       ORDER BY st.created_at DESC`
    );
    res.status(200).json({ students: result.rows });
  } catch (error) {
    console.error('agent list students error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/students', async (req, res) => {
  try {
    const fullName = clean(req.body.full_name);
    const studentId = clean(req.body.student_id) || `STU${Date.now().toString().slice(-8)}`;
    const passkey = clean(req.body.passkey) || makePasskey();
    const schoolId = Number(req.body.school_id || 0);

    if (!fullName) {
      return res.status(400).json({ message: 'Student name is required' });
    }
    if (!Number.isInteger(schoolId) || schoolId <= 0) {
      return res.status(400).json({ message: 'A valid school is required' });
    }

    const school = await findActiveSchool(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const result = await pool.query(
	      `INSERT INTO students
	       (student_id, school_id, full_name, email, grade, class_name, passkey, passkey_expires_at, passkey_used)
	       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
	       RETURNING id, full_name, student_id, email, school_id, grade, class_name, passkey_expires_at, created_at`,
      [
        studentId,
        school.id,
        fullName,
        clean(req.body.email) || null,
        clean(req.body.grade) || null,
        clean(req.body.class_name) || null,
        passkey,
        new Date(Date.now() + 24 * 60 * 60 * 1000),
      ]
    );

    const student = {
      ...result.rows[0],
      school_name: school.name,
      school_code: school.school_id,
      passkey,
    };
    res.status(201).json({ message: 'Student created', student });
  } catch (error) {
    console.error('agent create student error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Student ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/students/:studentId', async (req, res) => {
  try {
    const id = Number(req.params.studentId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Valid student id is required' });
    }
    const result = await pool.query(
      `SELECT st.id,
              st.full_name,
              st.student_id,
              COALESCE(st.email, '') AS email,
              COALESCE(st.phone_number, '') AS phone_number,
              COALESCE(st.grade, '') AS grade,
              COALESCE(st.class_name, '') AS class_name,
              COALESCE(st.semester, '') AS semester,
              to_char(st.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
              COALESCE(st.gender, '') AS gender,
              COALESCE(st.address, '') AS address,
              COALESCE(st.bio, '') AS bio,
              COALESCE(st.guardian_name, '') AS guardian_name,
              COALESCE(st.guardian_phone, '') AS guardian_phone,
              COALESCE(st.hobbies, '') AS hobbies,
              st.profile_picture_url,
              st.passkey,
              st.school_id,
              sc.name AS school_name,
              sc.school_id AS school_code,
              st.created_at
       FROM students st
       LEFT JOIN schools sc ON sc.id = st.school_id
       WHERE st.id = $1 AND st.is_active = true
       LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Student not found' });
    // Attach current groups
    const groupsResult = await pool.query(
      `SELECT sg.id, sg.name, sg.class_name, sg.is_confirmed
       FROM group_members gm
       JOIN student_groups sg ON sg.id = gm.group_id
       WHERE gm.student_id = $1`,
      [id]
    );
    res.status(200).json({ student: { ...result.rows[0], groups: groupsResult.rows } });
  } catch (error) {
    console.error('agent get student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/students/:studentId', async (req, res) => {
  try {
    const id = Number(req.params.studentId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Valid student id is required' });
    }
    const fullName = clean(req.body.full_name) || null;
    const email = clean(req.body.email) || null;
    const grade = clean(req.body.grade) || null;
    const className = clean(req.body.class_name) || null;
    const result = await pool.query(
      `UPDATE students SET
         full_name  = COALESCE($1, full_name),
         email      = COALESCE($2, email),
         grade      = COALESCE($3, grade),
         class_name = COALESCE($4, class_name),
         updated_at = NOW()
       WHERE id = $5 AND is_active = true
       RETURNING id, full_name, student_id, email, grade, class_name`,
      [fullName, email, grade, className, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ student: result.rows[0] });
  } catch (error) {
    console.error('agent update student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/students/:studentId/reset-passkey', async (req, res) => {
  try {
    const id = Number(req.params.studentId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Valid student id is required' });
    }
    const passkey = await generateUniquePasskey();
    const result = await pool.query(
      `UPDATE students SET
         passkey = $1,
         passkey_expires_at = NULL,
         passkey_used = false,
         updated_at = NOW()
       WHERE id = $2 AND is_active = true
       RETURNING id, full_name, student_id, passkey`,
      [passkey, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ student: result.rows[0], passkey });
  } catch (error) {
    console.error('agent reset student passkey error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/students/:studentId/credentials/email', async (req, res) => {
  try {
    const studentDbId = Number(req.params.studentId);
    if (!Number.isInteger(studentDbId) || studentDbId <= 0) {
      return res.status(400).json({ message: 'Valid student id is required' });
    }

    const result = await pool.query(
      `SELECT st.id,
              st.full_name,
              st.student_id,
              st.email,
              st.passkey,
              st.passkey_expires_at,
              st.passkey_used,
              sc.name AS school_name,
              sc.school_id AS school_code
       FROM students st
       LEFT JOIN schools sc ON sc.id = st.school_id
       WHERE st.id = $1
         AND st.is_active = true
       LIMIT 1`,
      [studentDbId]
    );
    const student = result.rows[0];
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const email = clean(student.email);
    if (!email) {
      return res.status(400).json({ message: 'Student does not have an email address' });
    }
    if (!student.passkey || student.passkey_used || !student.passkey_expires_at || new Date(student.passkey_expires_at) <= new Date()) {
      return res.status(400).json({ message: 'Student passkey is missing, used, or expired' });
    }
    if (!emailConfigured()) {
      return res.status(503).json({ message: 'Email sending is not configured' });
    }

    await sendCredentialEmail({
      to: email,
      roleLabel: 'Student',
      fullName: student.full_name,
      loginIdLabel: 'Student ID',
      loginId: student.student_id,
      passkey: student.passkey,
      passkeyExpiresAt: student.passkey_expires_at,
      schoolName: student.school_name,
      schoolCode: student.school_code,
    });

    res.status(200).json({ message: 'Student credentials sent to email', email_sent: true, email });
  } catch (error) {
    console.error('agent email student credentials error:', error.message);
    res.status(502).json({ message: 'Failed to send student credentials email' });
  }
});

router.post('/schools/:schoolId/students/register', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const fullName = clean(req.body.full_name);
    const studentId = clean(req.body.student_id) || `STU${Date.now().toString().slice(-8)}`;
    const passkey = clean(req.body.passkey) || makePasskey();

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (!fullName) {
      return res.status(400).json({ message: 'Student name is required' });
    }

    const result = await pool.query(
	      `INSERT INTO students
	       (student_id, school_id, full_name, email, grade, class_name, semester, passkey, passkey_expires_at, passkey_used)
	       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false)
	       RETURNING id, full_name, student_id, email, school_id, grade, class_name, semester, passkey_expires_at, created_at`,
      [
        studentId,
        school.id,
        fullName,
        clean(req.body.email) || null,
        clean(req.body.grade) || null,
        clean(req.body.class_name) || null,
        parseSemester(req.body.semester),
        passkey,
        new Date(Date.now() + 24 * 60 * 60 * 1000),
      ]
    );

    res.status(201).json({
      message: 'Student created',
      student: {
        ...result.rows[0],
        school_name: school.name,
        school_code: school.school_id,
        passkey,
      },
    });
  } catch (error) {
    console.error('agent register student error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Student ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/schools/:schoolId/classes', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    if (!school) return res.status(404).json({ message: 'School not found' });
    const result = await pool.query(
      `SELECT COALESCE(class_name, '') AS class_name, COUNT(*)::int AS student_count
       FROM students
       WHERE school_id = $1 AND is_active = true
       GROUP BY class_name
       ORDER BY class_name`,
      [school.id]
    );
    res.status(200).json({ classes: result.rows });
  } catch (error) {
    console.error('agent list school classes error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/schools/:schoolId/students', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    if (!school) return res.status(404).json({ message: 'School not found' });

    const className = req.query.class_name || null;
    const values = className ? [school.id, className] : [school.id];
    const classFilter = className ? 'AND st.class_name = $2' : '';

    const result = await pool.query(
      `SELECT st.id,
              st.full_name,
              st.student_id,
              COALESCE(st.email, '') AS email,
              st.school_id,
              sc.school_id AS school_code,
              sc.name AS school_name,
              COALESCE(st.grade, '') AS grade,
              COALESCE(st.class_name, '') AS class_name,
              COALESCE(st.semester, '') AS semester,
              st.passkey,
              st.is_active,
              st.created_at
       FROM students st
       JOIN schools sc ON sc.id = st.school_id
       WHERE st.school_id = $1 AND st.is_active = true ${classFilter}
       ORDER BY st.full_name ASC`,
      values
    );

    res.status(200).json({ students: result.rows });
  } catch (error) {
    console.error('agent list school students error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/schools/:schoolId/students', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const studentId = Number(req.body.student_id);
    if (!studentId) {
      return res.status(400).json({ message: 'schoolId and student_id are required' });
    }
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const result = await pool.query(
      `UPDATE students
	       SET school_id = $1,
	           updated_at = NOW()
	       WHERE id = $2
	         AND is_active = true
	       RETURNING id, full_name, student_id, COALESCE(email, '') AS email, school_id, grade, class_name, created_at`,
      [school.id, studentId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student assigned to school',
      student: {
        ...result.rows[0],
        school_name: school.name,
        school_code: school.school_id,
      },
    });
  } catch (error) {
    console.error('agent assign student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/teachers/available', async (req, res) => {
  try {
    const teachers = await getAvailableTeachers();
    res.status(200).json({ teachers });
  } catch (error) {
    console.error('agent available teachers error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id,
              t.full_name,
              t.teacher_id,
              t.email,
              COALESCE(t.phone_number, '') AS phone_number,
              t.passkey,
              t.is_active,
              t.created_at
       FROM teachers t
       WHERE t.is_active = true
       ORDER BY t.created_at DESC`
    );
    res.status(200).json({ teachers: result.rows });
  } catch (error) {
    console.error('agent list teachers error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/teachers', async (req, res) => {
  try {
    const fullName = clean(req.body.full_name);
    const teacherId = normalizeTeacherId(req.body.teacher_id) || `TCH${Date.now().toString().slice(-8)}`;
    const email = clean(req.body.email) || `${teacherId.toLowerCase()}@credent.local`;
    const passkeyInput = clean(req.body.passkey);
    const passkey = passkeyInput || makePasskey();

    if (!fullName) {
      return res.status(400).json({ message: 'Teacher name is required' });
    }
    if (passkeyInput && !/^\d{10}$/.test(passkeyInput)) {
      return res.status(400).json({ message: 'Teacher passkey must be 10 digits' });
    }

    const result = await pool.query(
      `INSERT INTO teachers
       (teacher_id, full_name, email, phone_number, passkey, passkey_expires_at, passkey_used)
       VALUES ($1, $2, $3, $4, $5, $6, false)
       RETURNING id, full_name, teacher_id, email, COALESCE(phone_number, '') AS phone_number,
                 passkey_expires_at, created_at`,
      [
        teacherId,
        fullName,
        email,
        clean(req.body.phone_number) || null,
        passkey,
        new Date(Date.now() + 24 * 60 * 60 * 1000),
      ]
    );

    await pool.query(
      `INSERT INTO teacher_availability (teacher_id)
       VALUES ($1)
       ON CONFLICT (teacher_id) DO NOTHING`,
      [result.rows[0].id]
    );

    res.status(201).json({ message: 'Teacher created', teacher: { ...result.rows[0], passkey } });
  } catch (error) {
    console.error('agent create teacher error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Teacher ID or email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/teachers/:teacherId', async (req, res) => {
  try {
    const id = Number(req.params.teacherId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Valid teacher id is required' });
    }
    const result = await pool.query(
      `SELECT t.id,
              t.full_name,
              t.teacher_id,
              COALESCE(t.email, '') AS email,
              COALESCE(t.phone_number, '') AS phone_number,
              COALESCE(t.account_number, '') AS account_number,
              COALESCE(t.certificate, '') AS certificate,
              to_char(t.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
              COALESCE(t.gender, '') AS gender,
              COALESCE(t.address, '') AS address,
              COALESCE(t.bio, '') AS bio,
              COALESCE(t.qualification, '') AS qualification,
              COALESCE(t.subjects, '') AS subjects,
              t.years_of_experience,
              t.profile_picture_url,
              t.passkey,
              t.created_at
       FROM teachers t
       WHERE t.id = $1 AND t.is_active = true
       LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Teacher not found' });
    // Attach schools and groups
    const schoolsResult = await pool.query(
      `SELECT sc.id, sc.name, sc.school_id AS school_code
       FROM teacher_school_assignments tsa
       JOIN schools sc ON sc.id = tsa.school_id
       WHERE tsa.teacher_id = $1`,
      [id]
    );
    const groupsResult = await pool.query(
      `SELECT sg.id, sg.name, sg.class_name, sg.is_confirmed
       FROM teacher_group_access tga
       JOIN student_groups sg ON sg.id = tga.group_id
       WHERE tga.teacher_id = $1 AND tga.is_active = true`,
      [id]
    );
    res.status(200).json({ teacher: { ...result.rows[0], schools: schoolsResult.rows, groups: groupsResult.rows } });
  } catch (error) {
    console.error('agent get teacher error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/teachers/:teacherId', async (req, res) => {
  try {
    const id = Number(req.params.teacherId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Valid teacher id is required' });
    }
    const fullName = clean(req.body.full_name) || null;
    const email = clean(req.body.email) || null;
    const phoneNumber = clean(req.body.phone_number) || null;
    const result = await pool.query(
      `UPDATE teachers SET
         full_name    = COALESCE($1, full_name),
         email        = COALESCE($2, email),
         phone_number = COALESCE($3, phone_number),
         updated_at   = NOW()
       WHERE id = $4 AND is_active = true
       RETURNING id, full_name, teacher_id, email, COALESCE(phone_number, '') AS phone_number`,
      [fullName, email, phoneNumber, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ teacher: result.rows[0] });
  } catch (error) {
    console.error('agent update teacher error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/teachers/:teacherId/reset-passkey', async (req, res) => {
  try {
    const id = Number(req.params.teacherId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Valid teacher id is required' });
    }
    const passkey = await generateUniquePasskey();
    const result = await pool.query(
      `UPDATE teachers SET
         passkey = $1,
         passkey_expires_at = NULL,
         passkey_used = false,
         updated_at = NOW()
       WHERE id = $2 AND is_active = true
       RETURNING id, full_name, teacher_id, passkey`,
      [passkey, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ teacher: result.rows[0], passkey });
  } catch (error) {
    console.error('agent reset teacher passkey error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/teachers/:teacherId/credentials/email', async (req, res) => {
  try {
    const teacherDbId = Number(req.params.teacherId);
    if (!Number.isInteger(teacherDbId) || teacherDbId <= 0) {
      return res.status(400).json({ message: 'Valid teacher id is required' });
    }

    const result = await pool.query(
      `SELECT id,
              full_name,
              teacher_id,
              email,
              passkey,
              passkey_expires_at,
              passkey_used
       FROM teachers
       WHERE id = $1
         AND is_active = true
       LIMIT 1`,
      [teacherDbId]
    );
    const teacher = result.rows[0];
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const email = clean(teacher.email);
    if (!email || isPlaceholderEmail(email)) {
      return res.status(400).json({ message: 'Teacher does not have a real email address' });
    }
    if (!teacher.passkey || teacher.passkey_used || !teacher.passkey_expires_at || new Date(teacher.passkey_expires_at) <= new Date()) {
      return res.status(400).json({ message: 'Teacher passkey is missing, used, or expired' });
    }
    if (!emailConfigured()) {
      return res.status(503).json({ message: 'Email sending is not configured' });
    }

    await sendCredentialEmail({
      to: email,
      roleLabel: 'Teacher',
      fullName: teacher.full_name,
      loginIdLabel: 'Teacher ID',
      loginId: teacher.teacher_id,
      passkey: teacher.passkey,
      passkeyExpiresAt: teacher.passkey_expires_at,
    });

    res.status(200).json({ message: 'Teacher credentials sent to email', email_sent: true, email });
  } catch (error) {
    console.error('agent email teacher credentials error:', error.message);
    res.status(502).json({ message: 'Failed to send teacher credentials email' });
  }
});

router.post('/schools/:schoolId/teachers', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const teacherId = Number(req.body.teacher_id);
    if (!teacherId) {
      return res.status(400).json({ message: 'schoolId and teacher_id are required' });
    }
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const teacherResult = await pool.query(
      `SELECT id
       FROM teachers
       WHERE id = $1
         AND is_active = true`,
      [teacherId]
    );
    if (!teacherResult.rows[0]) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const result = await pool.query(
      `INSERT INTO teacher_school_assignments (teacher_id, school_id, assigned_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (teacher_id, school_id) DO UPDATE SET assigned_by = EXCLUDED.assigned_by
       RETURNING *`,
      [teacherId, school.id, req.user.id]
    );

    const accessResult = await pool.query(
      `INSERT INTO teacher_group_access (teacher_id, group_id, assigned_by, is_active)
       SELECT $1, sg.id, $2, true
       FROM student_groups sg
       WHERE sg.school_id = $3
         AND sg.is_confirmed = true
       ON CONFLICT (teacher_id, group_id)
       DO UPDATE SET assigned_by = EXCLUDED.assigned_by, assigned_at = NOW(), is_active = true
       RETURNING group_id`,
      [teacherId, req.user.id, school.id]
    );

    res.status(200).json({
      message: 'Teacher assigned to school',
      assignment: result.rows[0],
      granted_group_count: accessResult.rowCount,
    });
  } catch (error) {
    console.error('agent assign teacher error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/schools/:schoolId/groups/auto', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const className = clean(req.body.class_name);
    const semester = parseSemester(req.body.semester);

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (!className) {
      return res.status(400).json({ message: 'class_name is required' });
    }

    const rawGroups = await autoCreateGroupsForClass({
      school_id: school.school_id,
      class_name: className,
      semester,
      created_by: req.user.id,
    });

    const groups = rawGroups.map(g => ({ ...g, member_count: (g.members || []).length }));
    res.status(201).json({ message: 'Groups generated successfully', groups });
  } catch (error) {
    console.error('agent auto group error:', error.message);
    if (error.message === 'No students found for this class') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/schools/:schoolId/groups', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const className = clean(req.query.class_name);
    const semester = parseSemester(req.query.semester);

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (!className) {
      return res.status(400).json({ message: 'class_name query is required' });
    }

    const groups = await getGroupsBySchoolAndClass(school.id, className, semester);
    const enriched = [];
    for (const group of groups) {
      const members = await getGroupMembers(group.id, true);
      enriched.push({ ...group, members, member_count: members.length });
    }

    res.status(200).json({ groups: enriched });
  } catch (error) {
    console.error('agent list groups error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/schools/:schoolId/groups/confirm', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    const className = clean(req.body.class_name);
    const semester = parseSemester(req.body.semester);

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (!className) {
      return res.status(400).json({ message: 'class_name is required' });
    }

    const { groups: rawGroups } = await confirmGroupsForClass({
      school_id: school.school_id,
      class_name: className,
      semester,
      confirmed_by: req.user.id,
    });

    const groups = rawGroups.map(g => ({ ...g, member_count: (g.members || []).length }));
    res.status(200).json({ message: 'Groups confirmed successfully', groups });
  } catch (error) {
    console.error('agent confirm groups error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── List all groups (optional school filter) ─────────────────────────────────
router.get('/groups', async (req, res) => {
  try {
    const schoolId = req.query.school_id ? Number(req.query.school_id) : null;
    const values = schoolId ? [schoolId] : [];
    const where = schoolId ? 'WHERE sg.school_id = $1' : '';
    const result = await pool.query(
      `SELECT sg.id, sg.name, sg.class_name, sg.grade, sg.is_confirmed,
              sc.name AS school_name, sc.id AS school_id,
              COUNT(gm.student_id)::int AS member_count
       FROM student_groups sg
       LEFT JOIN schools sc ON sc.id = sg.school_id
       LEFT JOIN group_members gm ON gm.group_id = sg.id
       ${where}
       GROUP BY sg.id, sc.name, sc.id
       ORDER BY sc.name, sg.name`,
      values
    );
    res.status(200).json({ groups: result.rows });
  } catch (error) {
    console.error('agent list groups error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Create group manually ─────────────────────────────────────────────────────
router.post('/schools/:schoolId/groups/manual', async (req, res) => {
  try {
    const school = await findActiveSchool(req.params.schoolId);
    if (!school) return res.status(404).json({ message: 'School not found' });
    const name = clean(req.body.name);
    const className = clean(req.body.class_name) || null;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const existing = await pool.query(
      className
        ? `SELECT COUNT(*) FROM student_groups WHERE school_id = $1 AND class_name = $2`
        : `SELECT COUNT(*) FROM student_groups WHERE school_id = $1`,
      className ? [school.id, className] : [school.id]
    );
    const groupNumber = Number(existing.rows[0].count) + 1;
    const profilePictureUrl = clean(req.body.profile_picture_url) || null;
    const group = await createStudentGroup({
      school_id: school.id,
      name,
      grade: clean(req.body.grade) || className || null,
      class_name: className || '',
      group_number: groupNumber,
      is_confirmed: true,
      created_by: req.user.id,
    });
    if (profilePictureUrl && group.id) {
      await pool.query(`UPDATE student_groups SET profile_picture_url = $1 WHERE id = $2`, [profilePictureUrl, group.id]);
    }
    res.status(201).json({ message: 'Group created', group: { ...group, profile_picture_url: profilePictureUrl, member_count: 0 } });
  } catch (error) {
    console.error('agent create group manual error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── List a group's full roster (students + teachers) ────────────────────────
// Used by the agent's "Manage group" panel in Stats → Groups so the agent
// can see exactly who's already in before they pick more to add.
router.get('/groups/:groupId/members', async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    if (!Number.isInteger(groupId) || groupId <= 0) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }
    const groupRow = await pool.query(`SELECT id FROM student_groups WHERE id = $1`, [groupId]);
    if (!groupRow.rows[0]) return res.status(404).json({ message: 'Group not found' });
    const members = await getGroupRosterMembers(groupId);
    res.status(200).json({ members });
  } catch (error) {
    console.error('agent list group members error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Remove a student from a group ────────────────────────────────────────────
router.delete('/groups/:groupId/students/:studentId', async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const studentId = Number(req.params.studentId);
    if (!Number.isInteger(groupId) || !Number.isInteger(studentId)) {
      return res.status(400).json({ message: 'Invalid groupId or studentId' });
    }
    const r = await pool.query(
      `DELETE FROM group_members WHERE group_id = $1 AND student_id = $2 RETURNING id`,
      [groupId, studentId]
    );
    if (!r.rows[0]) return res.status(404).json({ message: 'Student not in this group' });
    res.status(200).json({ message: 'Student removed from group' });
  } catch (error) {
    console.error('agent remove student from group error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Unassign a teacher from a group ──────────────────────────────────────────
router.delete('/groups/:groupId/teachers/:teacherId', async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const teacherId = Number(req.params.teacherId);
    if (!Number.isInteger(groupId) || !Number.isInteger(teacherId)) {
      return res.status(400).json({ message: 'Invalid groupId or teacherId' });
    }
    const r = await pool.query(
      `UPDATE teacher_group_access SET is_active = false WHERE group_id = $1 AND teacher_id = $2 RETURNING id`,
      [groupId, teacherId]
    );
    if (!r.rows[0]) return res.status(404).json({ message: 'Teacher not assigned to this group' });
    res.status(200).json({ message: 'Teacher unassigned from group' });
  } catch (error) {
    console.error('agent unassign teacher from group error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Add individual student to a group ────────────────────────────────────────
router.post('/groups/:groupId/students', async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const studentId = Number(req.body.student_id);
    if (!groupId || !studentId) return res.status(400).json({ message: 'groupId and student_id are required' });
    const groupRow = await pool.query(`SELECT id, school_id FROM student_groups WHERE id = $1`, [groupId]);
    if (!groupRow.rows[0]) return res.status(404).json({ message: 'Group not found' });
    await addStudentToGroup(groupId, studentId);
    res.status(200).json({ message: 'Student added to group' });
  } catch (error) {
    console.error('agent add student to group error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Assign teacher to a specific group ───────────────────────────────────────
router.post('/groups/:groupId/teachers', async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const teacherId = Number(req.body.teacher_id);
    if (!groupId || !teacherId) return res.status(400).json({ message: 'groupId and teacher_id are required' });
    await pool.query(
      `INSERT INTO teacher_group_access (teacher_id, group_id, assigned_by, is_active)
       VALUES ($1, $2, $3, true)
       ON CONFLICT (teacher_id, group_id) DO UPDATE SET is_active = true, assigned_by = $3`,
      [teacherId, groupId, req.user.id]
    );
    res.status(200).json({ message: 'Teacher assigned to group' });
  } catch (error) {
    console.error('agent assign teacher to group error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Disable / Delete students ─────────────────────────────────────────────────
router.patch('/students/:studentId/disable', async (req, res) => {
  try {
    const id = Number(req.params.studentId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid student id' });
    const result = await pool.query(
      `UPDATE students SET is_active = false, device_token = NULL, device_token_expires_at = NULL, updated_at = NOW()
       WHERE id = $1 RETURNING id, full_name, student_id`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student account disabled', student: result.rows[0] });
  } catch (error) {
    console.error('agent disable student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/students/:studentId/enable', async (req, res) => {
  try {
    const id = Number(req.params.studentId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid student id' });
    const result = await pool.query(
      `UPDATE students SET is_active = true, updated_at = NOW()
       WHERE id = $1 RETURNING id, full_name, student_id`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student account enabled', student: result.rows[0] });
  } catch (error) {
    console.error('agent enable student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/students/:studentId', async (req, res) => {
  try {
    const id = Number(req.params.studentId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid student id' });
    const result = await pool.query(
      `DELETE FROM students WHERE id = $1 RETURNING id, full_name, student_id`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student account deleted', student: result.rows[0] });
  } catch (error) {
    console.error('agent delete student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Disable / Delete teachers ─────────────────────────────────────────────────
router.patch('/teachers/:teacherId/disable', async (req, res) => {
  try {
    const id = Number(req.params.teacherId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid teacher id' });
    const result = await pool.query(
      `UPDATE teachers SET is_active = false, device_token = NULL, device_token_expires_at = NULL, updated_at = NOW()
       WHERE id = $1 RETURNING id, full_name, teacher_id`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ message: 'Teacher account disabled', teacher: result.rows[0] });
  } catch (error) {
    console.error('agent disable teacher error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/teachers/:teacherId/enable', async (req, res) => {
  try {
    const id = Number(req.params.teacherId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid teacher id' });
    const result = await pool.query(
      `UPDATE teachers SET is_active = true, updated_at = NOW()
       WHERE id = $1 RETURNING id, full_name, teacher_id`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ message: 'Teacher account enabled', teacher: result.rows[0] });
  } catch (error) {
    console.error('agent enable teacher error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/teachers/:teacherId', async (req, res) => {
  try {
    const id = Number(req.params.teacherId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid teacher id' });
    const result = await pool.query(
      `DELETE FROM teachers WHERE id = $1 RETURNING id, full_name, teacher_id`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ message: 'Teacher account deleted', teacher: result.rows[0] });
  } catch (error) {
    console.error('agent delete teacher error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Disable / Delete schools ──────────────────────────────────────────────────
router.patch('/schools/:schoolId/disable', async (req, res) => {
  try {
    const id = Number(req.params.schoolId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid school id' });
    const result = await pool.query(
      `UPDATE schools SET is_active = false, updated_at = NOW()
       WHERE id = $1 RETURNING id, name, school_id AS school_code`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ message: 'School disabled', school: result.rows[0] });
  } catch (error) {
    console.error('agent disable school error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/schools/:schoolId/enable', async (req, res) => {
  try {
    const id = Number(req.params.schoolId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid school id' });
    const result = await pool.query(
      `UPDATE schools SET is_active = true, updated_at = NOW()
       WHERE id = $1 RETURNING id, name, school_id AS school_code`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ message: 'School enabled', school: result.rows[0] });
  } catch (error) {
    console.error('agent enable school error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/schools/:schoolId', async (req, res) => {
  try {
    const id = Number(req.params.schoolId);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid school id' });
    const result = await pool.query(
      `DELETE FROM schools WHERE id = $1 RETURNING id, name`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ message: 'School deleted', school: result.rows[0] });
  } catch (error) {
    console.error('agent delete school error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
