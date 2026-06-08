const pool = require('../config/db');
const crypto = require('crypto');

// ── ID Generators ─────────────────────────────────────────────────
const generateSchoolId = () =>
  'SCH' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

const generateStudentId = () =>
  'STU' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

const generateTeacherId = () =>
  'TCH' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

const normalizeTeacherId = (value) =>
  String(value || '').trim().replace(/\s+/g, '').toUpperCase();

// ── Table Creation ────────────────────────────────────────────────
const createSchoolTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schools (
      id SERIAL PRIMARY KEY,
      school_id VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      address TEXT,
      contact_email VARCHAR(255),
      contact_phone VARCHAR(50),
      registered_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      assigned_agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Schools table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      student_id VARCHAR(20) UNIQUE NOT NULL,
      school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone_number VARCHAR(50),
      grade VARCHAR(50),
      class_name VARCHAR(100),
      semester VARCHAR(50),
      profile_picture_url TEXT,
      passkey VARCHAR(20),
      passkey_expires_at TIMESTAMP,
      passkey_used BOOLEAN DEFAULT false,
      device_token TEXT,
      device_token_expires_at TIMESTAMP,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Students table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      teacher_id VARCHAR(20) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number VARCHAR(50),
      account_number VARCHAR(100),
      certificate VARCHAR(255),
      profile_picture_url TEXT,
      passkey VARCHAR(20),
      passkey_expires_at TIMESTAMP,
      passkey_used BOOLEAN DEFAULT false,
      device_token TEXT,
      device_token_expires_at TIMESTAMP,
      last_active_at TIMESTAMP,
      is_available BOOLEAN DEFAULT true,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Teachers table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_groups (
      id SERIAL PRIMARY KEY,
      school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      grade VARCHAR(50),
      class_name VARCHAR(100),
      semester VARCHAR(50),
      group_number INTEGER,
      description TEXT,
      is_confirmed BOOLEAN DEFAULT false,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      profile_picture_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // Backfill for DBs created before profile_picture_url / updated_at were
  // added — CREATE TABLE IF NOT EXISTS won't add them retroactively, but
  // groupPhotoController.uploadGroupProfilePicture and listGroupPhotoEditors
  // both read/write these columns. Without this migration the photo endpoints
  // 500 with `column "profile_picture_url" does not exist`.
  await pool.query(`
    ALTER TABLE student_groups
      ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
  `);
  console.log('✅ Student groups table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_members (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      joined_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(group_id, student_id)
    )
  `);
  console.log('✅ Group members table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_group_access (
      id SERIAL PRIMARY KEY,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      assigned_at TIMESTAMP DEFAULT NOW(),
      is_active BOOLEAN DEFAULT true,
      UNIQUE(teacher_id, group_id)
    )
  `);
  console.log('✅ Teacher group access table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_school_assignments (
      id SERIAL PRIMARY KEY,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
      school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
      assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(teacher_id, school_id)
    )
  `);
  console.log('✅ Teacher school assignments table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_availability (
      id SERIAL PRIMARY KEY,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE UNIQUE,
      is_available BOOLEAN DEFAULT true,
      max_concurrent_cases INTEGER DEFAULT 3,
      current_cases INTEGER DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Teacher availability table ready');

  await pool.query(`
    INSERT INTO teacher_availability (teacher_id)
    SELECT id
    FROM teachers
    WHERE is_active = true
    ON CONFLICT (teacher_id) DO NOTHING
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS school_agent_assignments (
      id SERIAL PRIMARY KEY,
      school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
      agent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(school_id, agent_id)
    )
  `);
  console.log('✅ School agent assignments table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_help_requests (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      requested_by_student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      ticket_id INTEGER REFERENCES tickets(id) ON DELETE SET NULL,
      assigned_agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      assigned_teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('open', 'assigned', 'active', 'resolved', 'closed')),
      priority VARCHAR(20) DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      resolved_at TIMESTAMP
    )
  `);
  console.log('✅ Group help requests table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_messages (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      help_request_id INTEGER REFERENCES group_help_requests(id) ON DELETE SET NULL,
      sender_type VARCHAR(20) NOT NULL
        CHECK (sender_type IN ('student', 'teacher', 'agent', 'system', 'ai')),
      sender_id INTEGER,
      body TEXT NOT NULL,
      message_type VARCHAR(20) DEFAULT 'text'
        CHECK (message_type IN ('text', 'audio', 'image', 'file', 'system', 'ai_answer')),
      media_url TEXT,
      audio_duration INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Group messages table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_ratings (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
      project_name VARCHAR(255) NOT NULL,
      score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
      feedback TEXT,
      creativity   INTEGER CHECK (creativity   >= 0 AND creativity   <= 100),
      execution    INTEGER CHECK (execution    >= 0 AND execution    <= 100),
      teamwork     INTEGER CHECK (teamwork     >= 0 AND teamwork     <= 100),
      presentation INTEGER CHECK (presentation >= 0 AND presentation <= 100),
      submitted_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(group_id, teacher_id, project_name)
    )
  `);
  // Backfill columns on databases created before they existed. The dimension
  // columns are nullable so historical single-score rows stay valid.
  await pool.query(`ALTER TABLE group_ratings ADD COLUMN IF NOT EXISTS feedback     TEXT`);
  await pool.query(`ALTER TABLE group_ratings ADD COLUMN IF NOT EXISTS creativity   INTEGER`);
  await pool.query(`ALTER TABLE group_ratings ADD COLUMN IF NOT EXISTS execution    INTEGER`);
  await pool.query(`ALTER TABLE group_ratings ADD COLUMN IF NOT EXISTS teamwork     INTEGER`);
  await pool.query(`ALTER TABLE group_ratings ADD COLUMN IF NOT EXISTS presentation INTEGER`);
  console.log('✅ Group ratings table ready');

  // Per-group photo edit grants. Default = nobody but the agent can change a
  // group's profile picture; the agent delegates by inserting rows here.
  // (group_id, user_role, user_id) is the natural unique key — user_id alone
  // is not unique because students/teachers/agents have separate id spaces.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_photo_editors (
      id SERIAL PRIMARY KEY,
      group_id INTEGER NOT NULL REFERENCES student_groups(id) ON DELETE CASCADE,
      user_role VARCHAR(10) NOT NULL CHECK (user_role IN ('student','teacher','agent')),
      user_id INTEGER NOT NULL,
      granted_by_agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(group_id, user_role, user_id)
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_group_photo_editors_group ON group_photo_editors(group_id)`);
  console.log('✅ Group photo editors table ready');

  await pool.query(`
    ALTER TABLE group_messages
      DROP CONSTRAINT IF EXISTS group_messages_sender_type_check
  `);

  await pool.query(`
    ALTER TABLE group_messages
      ADD CONSTRAINT group_messages_sender_type_check
      CHECK (sender_type IN ('student', 'teacher', 'agent', 'system', 'ai'))
  `);

  await pool.query(`
    ALTER TABLE group_messages
      DROP CONSTRAINT IF EXISTS group_messages_message_type_check
  `);

  await pool.query(`
    ALTER TABLE group_messages
      ADD CONSTRAINT group_messages_message_type_check
      CHECK (message_type IN ('text', 'audio', 'image', 'file', 'system', 'ai_answer'))
  `);

  await pool.query(`
    ALTER TABLE group_messages
      ADD COLUMN IF NOT EXISTS media_url TEXT,
      ADD COLUMN IF NOT EXISTS audio_duration INTEGER,
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP
  `);

  await pool.query(`
    UPDATE group_messages
    SET message_type = 'audio'
    WHERE body = '[Voice message]'
      AND COALESCE(message_type, 'text') = 'text'
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_group_sessions (
      id SERIAL PRIMARY KEY,
      help_request_id INTEGER REFERENCES group_help_requests(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
      assigned_by_agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      joined_at TIMESTAMP,
      left_at TIMESTAMP,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Teacher group sessions table ready');

  await pool.query(`
    ALTER TABLE students
      ADD COLUMN IF NOT EXISTS class_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS semester VARCHAR(50),
      ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50)
  `);

  // "About Me" profile fields the student fills in themselves. All nullable
  // so existing rows stay valid; the agent reads them back on tap-through.
  await pool.query(`
    ALTER TABLE students
      ADD COLUMN IF NOT EXISTS date_of_birth DATE,
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS guardian_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS guardian_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS hobbies TEXT
  `);

  await pool.query(`
    ALTER TABLE teachers
      ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS account_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS certificate VARCHAR(255)
  `);

  // "About Me" profile fields the teacher fills in themselves.
  await pool.query(`
    ALTER TABLE teachers
      ADD COLUMN IF NOT EXISTS date_of_birth DATE,
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS qualification VARCHAR(255),
      ADD COLUMN IF NOT EXISTS subjects TEXT,
      ADD COLUMN IF NOT EXISTS years_of_experience INTEGER
  `);

  await pool.query(`
    ALTER TABLE teacher_school_assignments
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()
  `);

  await pool.query(`
    ALTER TABLE student_groups
      ADD COLUMN IF NOT EXISTS class_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS semester VARCHAR(50),
      ADD COLUMN IF NOT EXISTS group_number INTEGER,
      ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT false
  `);
};

// ── School Functions ──────────────────────────────────────────────
const createSchool = async (data) => {
  const school_id = generateSchoolId();
  const result = await pool.query(
    `INSERT INTO schools (school_id, name, address, contact_email, contact_phone, registered_by, assigned_agent_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      school_id,
      data.name,
      data.address,
      data.contact_email,
      data.contact_phone,
      data.registered_by,
      data.assigned_agent_id || null,
    ]
  );
  return result.rows[0];
};

const getAllSchools = async () => {
  const result = await pool.query(`
    SELECT s.*, u.full_name as agent_name
    FROM schools s
    LEFT JOIN users u ON s.assigned_agent_id = u.id
    WHERE s.is_active = true
    ORDER BY s.created_at DESC
  `);
  return result.rows;
};

const getSchoolById = async (id) => {
  const result = await pool.query('SELECT * FROM schools WHERE id = $1', [id]);
  return result.rows[0];
};

const getSchoolBySchoolId = async (school_id) => {
  const result = await pool.query(
    'SELECT * FROM schools WHERE school_id = $1 AND is_active = true',
    [school_id]
  );
  return result.rows[0];
};

const updateSchoolAgent = async (schoolId, agentId) => {
  const result = await pool.query(
    `UPDATE schools
     SET assigned_agent_id = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [agentId, schoolId]
  );
  return result.rows[0];
};

const assignAgentsToSchool = async (schoolId, agentIds = [], assignedBy) => {
  if (!Array.isArray(agentIds) || agentIds.length === 0) {
    return [];
  }

  const inserted = [];

  for (const agentId of agentIds) {
    const result = await pool.query(
      `INSERT INTO school_agent_assignments (school_id, agent_id, assigned_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (school_id, agent_id) DO NOTHING
       RETURNING *`,
      [schoolId, agentId, assignedBy]
    );

    if (result.rows[0]) inserted.push(result.rows[0]);
  }

  return inserted;
};

const getSchoolAgents = async (schoolId) => {
  const result = await pool.query(
    `SELECT saa.*, u.full_name, u.email, u.role
     FROM school_agent_assignments saa
     JOIN users u ON saa.agent_id = u.id
     WHERE saa.school_id = $1
     ORDER BY u.full_name`,
    [schoolId]
  );
  return result.rows;
};

const isAgentAssignedToSchool = async (schoolId, agentId) => {
  const result = await pool.query(
    `SELECT 1
     FROM school_agent_assignments
     WHERE school_id = $1 AND agent_id = $2`,
    [schoolId, agentId]
  );
  return !!result.rows[0];
};

// ── Student Functions ─────────────────────────────────────────────
const createStudent = async (data) => {
  const student_id = generateStudentId();
  const result = await pool.query(
    `INSERT INTO students (student_id, school_id, full_name, email, grade, class_name, semester)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      student_id,
      data.school_id,
      data.full_name,
      data.email,
      data.grade || null,
      data.class_name || null,
      data.semester || null,
    ]
  );
  return result.rows[0];
};

const saveStudentPasskey = async (studentId, passkey) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await pool.query(
    `UPDATE students
     SET passkey = $1,
         passkey_expires_at = $2,
         passkey_used = false,
         updated_at = NOW()
     WHERE id = $3`,
    [passkey, expiresAt, studentId]
  );
};

const findStudentByPasskey = async (passkey) => {
  const result = await pool.query(
    `SELECT s.*, sc.school_id as school_code, sc.name as school_name
     FROM students s
     JOIN schools sc ON s.school_id = sc.id
     WHERE s.passkey = $1
       AND s.is_active = true`,
    [passkey]
  );
  return result.rows[0];
};

const findStudentByIds = async (school_code, student_id) => {
  const result = await pool.query(
    `SELECT s.*, sc.school_id as school_code, sc.name as school_name
     FROM students s
     JOIN schools sc ON s.school_id = sc.id
     WHERE sc.school_id = $1
       AND s.student_id = $2
       AND s.is_active = true`,
    [school_code, student_id]
  );
  return result.rows[0];
};

const findStudentByDbId = async (id) => {
  const result = await pool.query(
    `SELECT s.*, sc.school_id as school_code, sc.name as school_name
     FROM students s
     JOIN schools sc ON s.school_id = sc.id
     WHERE s.id = $1
       AND s.is_active = true`,
    [id]
  );
  return result.rows[0];
};

const getStudentMe = async (studentDbId) => {
  const result = await pool.query(
    `SELECT s.*, sc.school_id as school_code, sc.name as school_name
     FROM students s
     JOIN schools sc ON s.school_id = sc.id
     WHERE s.id = $1
       AND s.is_active = true`,
    [studentDbId]
  );
  return result.rows[0];
};

const updateStudentProfilePicture = async (studentDbId, profilePictureUrl) => {
  const result = await pool.query(
    `UPDATE students
     SET profile_picture_url = $1,
         updated_at = NOW()
     WHERE id = $2
       AND is_active = true
     RETURNING *`,
    [profilePictureUrl, studentDbId]
  );
  return result.rows[0];
};

const updateStudentProfile = async (studentDbId, data) => {
  const result = await pool.query(
    `UPDATE students
     SET full_name = $1,
         phone_number = $2,
         student_id = $3,
         class_name = $4,
         grade = $5,
         date_of_birth = $6,
         gender = $7,
         address = $8,
         bio = $9,
         guardian_name = $10,
         guardian_phone = $11,
         hobbies = $12,
         updated_at = NOW()
     WHERE id = $13
       AND is_active = true
     RETURNING *`,
    [
      data.full_name,
      data.phone_number || null,
      data.student_id,
      data.class_name || null,
      data.grade || null,
      data.date_of_birth || null,
      data.gender || null,
      data.address || null,
      data.bio || null,
      data.guardian_name || null,
      data.guardian_phone || null,
      data.hobbies || null,
      studentDbId,
    ]
  );
  return result.rows[0];
};

const saveStudentDeviceToken = async (studentId, deviceToken) => {
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  await pool.query(
    `UPDATE students
     SET device_token = $1,
         device_token_expires_at = $2,
         updated_at = NOW()
     WHERE id = $3`,
    [deviceToken, expiresAt, studentId]
  );
};

const findStudentByDeviceToken = async (deviceToken) => {
  const result = await pool.query(
    `SELECT s.*, sc.school_id as school_code, sc.name as school_name
     FROM students s
     JOIN schools sc ON s.school_id = sc.id
     WHERE s.device_token = $1
       AND s.device_token_expires_at > NOW()
       AND s.is_active = true`,
    [deviceToken]
  );
  return result.rows[0];
};

const getStudentsBySchool = async (schoolId) => {
  const result = await pool.query(
    `SELECT id, student_id, full_name, email, grade, class_name, semester, profile_picture_url, is_active, created_at
     FROM students
     WHERE school_id = $1
     ORDER BY full_name`,
    [schoolId]
  );
  return result.rows;
};

const getStudentsBySchoolAndClass = async (schoolId, className, semester = null) => {
  const values = [schoolId, className];
  let query = `
    SELECT id, student_id, full_name, email, grade, class_name, semester, profile_picture_url
    FROM students
    WHERE school_id = $1
      AND class_name = $2
      AND is_active = true
  `;

  if (semester) {
    values.push(semester);
    query += ` AND semester = $3`;
  }

  query += ` ORDER BY full_name`;

  const result = await pool.query(query, values);
  return result.rows;
};

// ── Teacher Functions — company level, no school ──────────────────
const createTeacher = async (data) => {
  const teacher_id = generateTeacherId();
  const result = await pool.query(
    `INSERT INTO teachers (teacher_id, full_name, email)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [teacher_id, data.full_name, data.email]
  );

  await pool.query(
    `INSERT INTO teacher_availability (teacher_id)
     VALUES ($1)
     ON CONFLICT (teacher_id) DO NOTHING`,
    [result.rows[0].id]
  );

  return result.rows[0];
};

const saveTeacherPasskey = async (teacherId, passkey) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await pool.query(
    `UPDATE teachers
     SET passkey = $1,
         passkey_expires_at = $2,
         passkey_used = false,
         updated_at = NOW()
     WHERE id = $3`,
    [passkey, expiresAt, teacherId]
  );
};

const findTeacherByPasskey = async (passkey) => {
  const result = await pool.query(
    `SELECT *
     FROM teachers
     WHERE passkey = $1
       AND is_active = true`,
    [passkey]
  );
  return result.rows[0];
};

const findTeacherByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM teachers WHERE email = $1 AND is_active = true',
    [email]
  );
  return result.rows[0];
};

const findTeacherByTeacherId = async (teacher_id) => {
  const result = await pool.query(
    'SELECT * FROM teachers WHERE teacher_id = $1 AND is_active = true',
    [teacher_id]
  );
  return result.rows[0];
};

const findTeacherByDbId = async (id) => {
  const result = await pool.query(
    `SELECT *
     FROM teachers
     WHERE id = $1
       AND is_active = true`,
    [id]
  );
  return result.rows[0];
};

const getTeacherMe = async (teacherDbId) => {
  const result = await pool.query(
    `SELECT *
     FROM teachers
     WHERE id = $1
       AND is_active = true`,
    [teacherDbId]
  );
  return result.rows[0];
};

const updateTeacherProfilePicture = async (teacherDbId, profilePictureUrl) => {
  const result = await pool.query(
    `UPDATE teachers
     SET profile_picture_url = $1,
         updated_at = NOW()
     WHERE id = $2
       AND is_active = true
     RETURNING *`,
    [profilePictureUrl, teacherDbId]
  );
  return result.rows[0];
};

const updateTeacherProfile = async (teacherDbId, data) => {
  const teacherId = normalizeTeacherId(data.teacher_id);
  const yearsExperience = Number.isFinite(Number(data.years_of_experience)) && String(data.years_of_experience).trim() !== ''
    ? Math.max(0, Math.trunc(Number(data.years_of_experience)))
    : null;
  const result = await pool.query(
    `UPDATE teachers
     SET full_name = $1,
         phone_number = $2,
         teacher_id = $3,
         account_number = $4,
         certificate = $5,
         date_of_birth = $6,
         gender = $7,
         address = $8,
         bio = $9,
         qualification = $10,
         subjects = $11,
         years_of_experience = $12,
         updated_at = NOW()
     WHERE id = $13
       AND is_active = true
     RETURNING *`,
    [
      data.full_name,
      data.phone_number || null,
      teacherId,
      data.account_number || null,
      data.certificate || null,
      data.date_of_birth || null,
      data.gender || null,
      data.address || null,
      data.bio || null,
      data.qualification || null,
      data.subjects || null,
      yearsExperience,
      teacherDbId,
    ]
  );
  return result.rows[0];
};

const saveTeacherDeviceToken = async (teacherId, deviceToken) => {
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  await pool.query(
    `UPDATE teachers
     SET device_token = $1,
         device_token_expires_at = $2,
         last_active_at = NOW(),
         updated_at = NOW()
     WHERE id = $3`,
    [deviceToken, expiresAt, teacherId]
  );
};

const findTeacherByDeviceToken = async (deviceToken) => {
  const result = await pool.query(
    `SELECT *
     FROM teachers
     WHERE device_token = $1
       AND device_token_expires_at > NOW()
       AND is_active = true`,
    [deviceToken]
  );
  return result.rows[0];
};

const updateTeacherLastActive = async (teacherId) => {
  await pool.query(
    'UPDATE teachers SET last_active_at = NOW(), updated_at = NOW() WHERE id = $1',
    [teacherId]
  );
};

const getAllTeachers = async () => {
  const result = await pool.query(
    `SELECT id, teacher_id, full_name, email, phone_number, profile_picture_url, is_available, is_active, created_at
     FROM teachers
     ORDER BY full_name`
  );
  return result.rows;
};

const getAvailableTeachers = async () => {
  const result = await pool.query(
    `SELECT t.id, t.teacher_id, t.full_name, t.email, t.profile_picture_url,
            COALESCE(ta.current_cases, 0) as current_cases,
            COALESCE(ta.max_concurrent_cases, 3) as max_concurrent_cases
     FROM teachers t
     LEFT JOIN teacher_availability ta ON t.id = ta.teacher_id
     WHERE t.is_active = true
       AND t.is_available = true
       AND COALESCE(ta.current_cases, 0) < COALESCE(ta.max_concurrent_cases, 3)`
  );
  return result.rows;
};

// ── Student Group Functions ───────────────────────────────────────
const createStudentGroup = async (data) => {
  const result = await pool.query(
    `INSERT INTO student_groups
     (school_id, name, grade, class_name, semester, group_number, description, is_confirmed, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.school_id,
      data.name,
      data.grade || null,
      data.class_name || null,
      data.semester || null,
      data.group_number || null,
      data.description || null,
      data.is_confirmed || false,
      data.created_by || null,
    ]
  );
  return result.rows[0];
};

const addStudentToGroup = async (groupId, studentId) => {
  const result = await pool.query(
    `INSERT INTO group_members (group_id, student_id)
     VALUES ($1, $2)
     ON CONFLICT (group_id, student_id) DO NOTHING
     RETURNING *`,
    [groupId, studentId]
  );
  return result.rows[0];
};

const getGroupsBySchoolAndClass = async (schoolId, className, semester = null) => {
  const values = [schoolId, className];
  let query = `
    SELECT *
    FROM student_groups
    WHERE school_id = $1
      AND class_name = $2
  `;

  if (semester) {
    values.push(semester);
    query += ` AND semester = $3`;
  }

  query += ` ORDER BY group_number ASC, created_at ASC`;

  const result = await pool.query(query, values);
  return result.rows;
};

const getGroupMembers = async (groupId, includeUnconfirmed = false) => {
  const result = await pool.query(
    `SELECT gm.*, s.id, s.student_id, s.full_name, s.email, s.grade, s.class_name, s.semester, s.profile_picture_url
     FROM group_members gm
     JOIN students s ON gm.student_id = s.id
     JOIN student_groups sg ON sg.id = gm.group_id
     WHERE gm.group_id = $1
       AND s.school_id = sg.school_id
       AND ($2::boolean = true OR sg.is_confirmed = true)
       AND (
         sg.grade IS NULL
         OR s.grade IS NULL
         OR LOWER(s.grade) = LOWER(sg.grade)
       )
       AND (
         sg.class_name IS NULL
         OR s.class_name IS NULL
         OR LOWER(s.class_name) = LOWER(sg.class_name)
       )
       AND (
         (sg.semester IS NULL AND s.semester IS NULL)
         OR (sg.semester IS NOT NULL AND s.semester IS NOT NULL AND LOWER(s.semester) = LOWER(sg.semester))
       )
     ORDER BY s.full_name`,
    [groupId, includeUnconfirmed]
  );
  return result.rows;
};

const getGroupRosterMembers = async (groupId) => {
  const result = await pool.query(
    `SELECT
       s.id,
       s.id AS source_id,
       s.student_id,
       s.full_name,
       s.email,
       s.grade,
       s.class_name,
       s.semester,
       s.profile_picture_url,
       gm.joined_at,
       'student' AS role,
       'student' AS member_type
     FROM group_members gm
     JOIN students s ON gm.student_id = s.id
     WHERE gm.group_id = $1
       AND s.is_active = true

     UNION ALL

     SELECT
       -t.id AS id,
       t.id AS source_id,
       t.teacher_id AS student_id,
       t.full_name,
       t.email,
       NULL AS grade,
       NULL AS class_name,
       NULL AS semester,
       t.profile_picture_url,
       tga.assigned_at AS joined_at,
       'teacher' AS role,
       'teacher' AS member_type
     FROM teacher_group_access tga
     JOIN teachers t ON t.id = tga.teacher_id
     WHERE tga.group_id = $1
       AND tga.is_active = true
       AND t.is_active = true

     ORDER BY role DESC, full_name ASC`,
    [groupId]
  );
  return result.rows;
};

const getStudentGroups = async (studentId) => {
  // Membership is the source of truth: if an agent explicitly added the
  // student to this group via group_members, they see it. Previously this
  // also enforced grade/class/semester to match between student and group on
  // every read — that silently hid groups when the agent UI stored grade
  // inconsistently (e.g. student.grade='4' vs group.grade='Class 4'). Class
  // alignment belongs at add-time, not on every list call.
  // Also returns last_message_at (MAX created_at of group_messages) so the
  // chat list can render the WhatsApp-style time stamp per row on first load.
  const result = await pool.query(
    `SELECT sg.*,
            (SELECT MAX(created_at) FROM group_messages WHERE group_id = sg.id) AS last_message_at
     FROM group_members gm
     JOIN student_groups sg ON gm.group_id = sg.id
     JOIN students s ON s.id = gm.student_id
     WHERE gm.student_id = $1
       AND s.school_id = sg.school_id
       AND sg.is_confirmed = true
     ORDER BY COALESCE(
       (SELECT MAX(created_at) FROM group_messages WHERE group_id = sg.id),
       sg.created_at
     ) DESC`,
    [studentId]
  );
  return result.rows;
};

const getSharedGroupsForStudents = async (studentIdA, studentIdB) => {
  const result = await pool.query(
    `SELECT sg.*
     FROM group_members gm1
     JOIN group_members gm2 ON gm1.group_id = gm2.group_id
     JOIN student_groups sg ON gm1.group_id = sg.id
     JOIN students sa ON sa.id = gm1.student_id
     JOIN students sb ON sb.id = gm2.student_id
     WHERE gm1.student_id = $1
       AND gm2.student_id = $2
       AND sa.school_id = sg.school_id
       AND sb.school_id = sg.school_id
       AND sg.grade IS NOT NULL
       AND sa.grade IS NOT NULL
       AND sb.grade IS NOT NULL
       AND LOWER(sa.grade) = LOWER(sg.grade)
       AND LOWER(sb.grade) = LOWER(sg.grade)
       AND sg.class_name IS NOT NULL
       AND sa.class_name IS NOT NULL
       AND sb.class_name IS NOT NULL
       AND LOWER(sa.class_name) = LOWER(sg.class_name)
       AND LOWER(sb.class_name) = LOWER(sg.class_name)
       AND (
         (sg.semester IS NULL AND sa.semester IS NULL AND sb.semester IS NULL)
         OR (
           sg.semester IS NOT NULL
           AND sa.semester IS NOT NULL
           AND sb.semester IS NOT NULL
           AND LOWER(sa.semester) = LOWER(sg.semester)
           AND LOWER(sb.semester) = LOWER(sg.semester)
         )
       )
     ORDER BY sg.created_at DESC`,
    [studentIdA, studentIdB]
  );
  return result.rows;
};

const areStudentsInSameGroup = async (studentIdA, studentIdB) => {
  const result = await pool.query(
    `SELECT 1
     FROM group_members gm1
     JOIN group_members gm2 ON gm1.group_id = gm2.group_id
     JOIN student_groups sg ON sg.id = gm1.group_id
     JOIN students sa ON sa.id = gm1.student_id
     JOIN students sb ON sb.id = gm2.student_id
     WHERE gm1.student_id = $1
       AND gm2.student_id = $2
       AND sa.school_id = sg.school_id
       AND sb.school_id = sg.school_id
       AND sg.grade IS NOT NULL
       AND sa.grade IS NOT NULL
       AND sb.grade IS NOT NULL
       AND LOWER(sa.grade) = LOWER(sg.grade)
       AND LOWER(sb.grade) = LOWER(sg.grade)
       AND sg.class_name IS NOT NULL
       AND sa.class_name IS NOT NULL
       AND sb.class_name IS NOT NULL
       AND LOWER(sa.class_name) = LOWER(sg.class_name)
       AND LOWER(sb.class_name) = LOWER(sg.class_name)
       AND (
         (sg.semester IS NULL AND sa.semester IS NULL AND sb.semester IS NULL)
         OR (
           sg.semester IS NOT NULL
           AND sa.semester IS NOT NULL
           AND sb.semester IS NOT NULL
           AND LOWER(sa.semester) = LOWER(sg.semester)
           AND LOWER(sb.semester) = LOWER(sg.semester)
         )
       )
     LIMIT 1`,
    [studentIdA, studentIdB]
  );
  return !!result.rows[0];
};

const autoCreateGroupsForClass = async ({
  school_id,
  class_name,
  semester,
  created_by,
}) => {
  const school = await getSchoolBySchoolId(school_id);
  if (!school) {
    throw new Error('School not found');
  }

  const students = await getStudentsBySchoolAndClass(school.id, class_name, semester);
  if (students.length === 0) {
    throw new Error('No students found for this class');
  }

  await pool.query(
    `DELETE FROM student_groups
     WHERE school_id = $1
       AND class_name = $2
       AND COALESCE(semester, '') = COALESCE($3, '')
       AND is_confirmed = false`,
    [school.id, class_name, semester || null]
  );

  const groups = [];
  let groupNumber = 1;

  for (let i = 0; i < students.length; i += 3) {
    const chunk = students.slice(i, i + 3);

    const group = await createStudentGroup({
      school_id: school.id,
      name: `${class_name} Group ${groupNumber}`,
      grade: chunk[0]?.grade || null,
      class_name,
      semester: semester || null,
      group_number: groupNumber,
      description: `Auto-generated group for ${class_name}${semester ? ` - ${semester}` : ''}`,
      is_confirmed: false,
      created_by,
    });

    for (const student of chunk) {
      await addStudentToGroup(group.id, student.id);
    }

    const members = await getGroupMembers(group.id, true);
    groups.push({ ...group, members });
    groupNumber++;
  }

  return groups;
};

const confirmGroupsForClass = async ({
  school_id,
  class_name,
  semester,
  confirmed_by,
}) => {
  const school = await getSchoolBySchoolId(school_id);
  if (!school) {
    throw new Error('School not found');
  }

  const result = await pool.query(
    `UPDATE student_groups
     SET is_confirmed = true
     WHERE school_id = $1
       AND class_name = $2
       AND COALESCE(semester, '') = COALESCE($3, '')
     RETURNING *`,
    [school.id, class_name, semester || null]
  );

  if (result.rows.length > 0) {
    await pool.query(
      `INSERT INTO teacher_group_access (teacher_id, group_id, assigned_by, is_active)
       SELECT DISTINCT tsa.teacher_id, sg.id, $4, true
       FROM teacher_school_assignments tsa
       JOIN student_groups sg ON sg.school_id = tsa.school_id
       WHERE tsa.school_id = $1
         AND sg.class_name = $2
         AND COALESCE(sg.semester, '') = COALESCE($3, '')
         AND sg.is_confirmed = true
       ON CONFLICT (teacher_id, group_id)
       DO UPDATE SET assigned_by = EXCLUDED.assigned_by, assigned_at = NOW(), is_active = true`,
      [school.id, class_name, semester || null, confirmed_by || null]
    );
  }

  const groups = [];
  for (const group of result.rows) {
    const members = await getGroupMembers(group.id, true);
    groups.push({ ...group, members });
  }

  return { school, groups };
};

// ── Group Help Request Functions ──────────────────────────────────
const createGroupHelpRequest = async (data) => {
  const result = await pool.query(
    `INSERT INTO group_help_requests
     (group_id, requested_by_student_id, ticket_id, assigned_agent_id, title, description, priority)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.group_id,
      data.requested_by_student_id,
      data.ticket_id || null,
      data.assigned_agent_id || null,
      data.title,
      data.description || null,
      data.priority || 'normal',
    ]
  );
  return result.rows[0];
};

const getGroupHelpRequestById = async (id) => {
  const result = await pool.query(
    `SELECT ghr.*,
            sg.name as group_name,
            sg.school_id,
            sg.class_name,
            sg.semester,
            s.full_name as requested_by_student_name,
            t.full_name as teacher_name,
            u.full_name as agent_name
     FROM group_help_requests ghr
     LEFT JOIN student_groups sg ON ghr.group_id = sg.id
     LEFT JOIN students s ON ghr.requested_by_student_id = s.id
     LEFT JOIN teachers t ON ghr.assigned_teacher_id = t.id
     LEFT JOIN users u ON ghr.assigned_agent_id = u.id
     WHERE ghr.id = $1`,
    [id]
  );
  return result.rows[0];
};

const getGroupHelpRequests = async () => {
  const result = await pool.query(
    `SELECT ghr.*,
            sg.name as group_name,
            s.full_name as requested_by_student_name,
            t.full_name as teacher_name,
            u.full_name as agent_name
     FROM group_help_requests ghr
     LEFT JOIN student_groups sg ON ghr.group_id = sg.id
     LEFT JOIN students s ON ghr.requested_by_student_id = s.id
     LEFT JOIN teachers t ON ghr.assigned_teacher_id = t.id
     LEFT JOIN users u ON ghr.assigned_agent_id = u.id
     ORDER BY ghr.created_at DESC`
  );
  return result.rows;
};

const getGroupHelpRequestsByGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT ghr.*,
            t.full_name as teacher_name,
            u.full_name as agent_name
     FROM group_help_requests ghr
     LEFT JOIN teachers t ON ghr.assigned_teacher_id = t.id
     LEFT JOIN users u ON ghr.assigned_agent_id = u.id
     WHERE ghr.group_id = $1
     ORDER BY ghr.created_at DESC`,
    [groupId]
  );
  return result.rows;
};

const assignTeacherToHelpRequest = async (helpRequestId, teacherId, agentId) => {
  const result = await pool.query(
    `UPDATE group_help_requests
     SET assigned_teacher_id = $1,
         assigned_agent_id = COALESCE(assigned_agent_id, $2),
         status = 'assigned',
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [teacherId, agentId, helpRequestId]
  );

  if (!result.rows[0]) return null;

  await pool.query(
    `INSERT INTO teacher_group_access (teacher_id, group_id, assigned_by, is_active)
     SELECT $1, group_id, $2, true
     FROM group_help_requests
     WHERE id = $3
     ON CONFLICT (teacher_id, group_id)
     DO UPDATE SET assigned_by = EXCLUDED.assigned_by, assigned_at = NOW(), is_active = true`,
    [teacherId, agentId, helpRequestId]
  );

  await pool.query(
    `INSERT INTO teacher_group_sessions
     (help_request_id, group_id, teacher_id, assigned_by_agent_id)
     SELECT id, group_id, $1, $2
     FROM group_help_requests
     WHERE id = $3`,
    [teacherId, agentId, helpRequestId]
  );

  await pool.query(
    `INSERT INTO teacher_availability (teacher_id, current_cases, updated_at)
     VALUES ($1, 1, NOW())
     ON CONFLICT (teacher_id)
     DO UPDATE SET current_cases = teacher_availability.current_cases + 1, updated_at = NOW()`,
    [teacherId]
  );

  return result.rows[0];
};

const updateGroupHelpRequestStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE group_help_requests
     SET status = $1::VARCHAR(20),
         updated_at = NOW(),
         resolved_at = CASE
           WHEN $1::VARCHAR(20) IN ('resolved', 'closed') THEN NOW()
           ELSE resolved_at
         END
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const closeTeacherGroupSession = async (helpRequestId, teacherId) => {
  const result = await pool.query(
    `UPDATE teacher_group_sessions
     SET left_at = NOW(),
         is_active = false
     WHERE help_request_id = $1
       AND teacher_id = $2
       AND is_active = true
     RETURNING *`,
    [helpRequestId, teacherId]
  );

  if (result.rows.length > 0) {
    await pool.query(
      `UPDATE teacher_availability
       SET current_cases = GREATEST(current_cases - 1, 0), updated_at = NOW()
       WHERE teacher_id = $1`,
      [teacherId]
    );
  }

  return result.rows[0];
};

// ── Group Message Functions ───────────────────────────────────────
// Emrys is a 1:1 surface — its answers belong in the AI conversation history,
// not in a normal group thread. The previous behavior posted `sender_type='ai'`
// rows when callers set share_to_group=true; that path has been removed in
// aiController.js. The `<> 'ai'` filter below hides any HISTORICAL ai rows
// that landed in the table before the fix, so reopening an old group chat
// doesn't show ghost Emrys bubbles.
const GROUP_MESSAGE_SELECT = `
  SELECT gm.*,
         (COALESCE(gm.message_type, 'text') = 'audio' OR gm.body = '[Voice message]') AS is_audio,
         CASE
           WHEN gm.sender_type = 'student' THEN students.full_name
           WHEN gm.sender_type = 'teacher' THEN teachers.full_name
           WHEN gm.sender_type = 'agent' THEN users.full_name
           WHEN gm.sender_type = 'system' THEN 'System'
           ELSE 'Unknown'
         END AS sender_name
  FROM group_messages gm
  LEFT JOIN students ON gm.sender_type = 'student' AND students.id = gm.sender_id
  LEFT JOIN teachers ON gm.sender_type = 'teacher' AND teachers.id = gm.sender_id
  LEFT JOIN users ON gm.sender_type = 'agent' AND users.id = gm.sender_id
  WHERE gm.deleted_at IS NULL
    AND gm.sender_type <> 'ai'
`;

const enrichGroupMessages = (rows, viewer = null) => rows.map((row) => ({
  ...row,
  sender_name: row.sender_name || 'Unknown',
  is_own: Boolean(
    viewer
      && row.sender_type === viewer.role
      && row.sender_id !== null
      && Number(row.sender_id) === Number(viewer.id)
  ),
}));

const getGroupMessageById = async (messageId, viewer = null) => {
  const result = await pool.query(
    `${GROUP_MESSAGE_SELECT}
     AND gm.id = $1`,
    [messageId]
  );
  return enrichGroupMessages(result.rows, viewer)[0];
};

const addGroupMessage = async (data, viewer = null) => {
  // Defensive guard: Emrys never posts into a group thread. The schema CHECK
  // still allows 'ai' so historical rows stay valid, but new writes are
  // refused here so a future regression can't reintroduce the bug.
  if (data.sender_type === 'ai') {
    throw new Error("Refusing to write sender_type='ai' to group_messages — " +
                    "Emrys answers belong in the 1:1 AI history, not group chats.");
  }
  const result = await pool.query(
    `INSERT INTO group_messages
     (group_id, help_request_id, sender_type, sender_id, body, message_type, media_url, audio_duration)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.group_id,
      data.help_request_id || null,
      data.sender_type,
      data.sender_id || null,
      data.body,
      data.message_type || 'text',
      data.media_url || null,
      Number.isInteger(data.audio_duration) ? data.audio_duration : null,
    ]
  );
  return getGroupMessageById(result.rows[0].id, viewer);
};

const getGroupMessages = async (groupId, viewer = null, limit = 100) => {
  const result = await pool.query(
    `SELECT * FROM (
       ${GROUP_MESSAGE_SELECT}
       AND gm.group_id = $1
       ORDER BY gm.created_at DESC
       LIMIT $2
     ) sub
     ORDER BY created_at ASC`,
    [groupId, limit]
  );
  return enrichGroupMessages(result.rows, viewer);
};

const getGroupMessagesByHelpRequest = async (helpRequestId, viewer = null, limit = 100) => {
  const result = await pool.query(
    `SELECT * FROM (
       ${GROUP_MESSAGE_SELECT}
       AND gm.help_request_id = $1
       ORDER BY gm.created_at DESC
       LIMIT $2
     ) sub
     ORDER BY created_at ASC`,
    [helpRequestId, limit]
  );
  return enrichGroupMessages(result.rows, viewer);
};

module.exports = {
  createSchoolTables,
  generateSchoolId,
  generateStudentId,
  generateTeacherId,
  createSchool,
  getAllSchools,
  getSchoolById,
  getSchoolBySchoolId,
  updateSchoolAgent,
  assignAgentsToSchool,
  getSchoolAgents,
  isAgentAssignedToSchool,
  createStudent,
  saveStudentPasskey,
  findStudentByPasskey,
  findStudentByIds,
  findStudentByDbId,
  getStudentMe,
  updateStudentProfilePicture,
  updateStudentProfile,
  saveStudentDeviceToken,
  findStudentByDeviceToken,
  getStudentsBySchool,
  getStudentsBySchoolAndClass,
  createTeacher,
  saveTeacherPasskey,
  findTeacherByPasskey,
  findTeacherByEmail,
  findTeacherByTeacherId,
  findTeacherByDbId,
  getTeacherMe,
  updateTeacherProfilePicture,
  updateTeacherProfile,
  saveTeacherDeviceToken,
  findTeacherByDeviceToken,
  updateTeacherLastActive,
  getAllTeachers,
  getAvailableTeachers,
  createStudentGroup,
  addStudentToGroup,
  getGroupsBySchoolAndClass,
  getGroupMembers,
  getGroupRosterMembers,
  getStudentGroups,
  getSharedGroupsForStudents,
  areStudentsInSameGroup,
  autoCreateGroupsForClass,
  confirmGroupsForClass,
  createGroupHelpRequest,
  getGroupHelpRequestById,
  getGroupHelpRequests,
  getGroupHelpRequestsByGroup,
  assignTeacherToHelpRequest,
  updateGroupHelpRequestStatus,
  closeTeacherGroupSession,
  addGroupMessage,
  getGroupMessages,
  getGroupMessagesByHelpRequest,
};
