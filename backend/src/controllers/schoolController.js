const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const {
  createSchool,
  getAllSchools,
  getSchoolById,
  getSchoolBySchoolId,
  updateSchoolAgent,
  assignAgentsToSchool,
  getSchoolAgents,
  createStudent,
  saveStudentPasskey,
  findStudentByPasskey,
  findStudentByIds,
  saveStudentDeviceToken,
  findStudentByDeviceToken,
  getStudentsBySchool,
  createTeacher,
  saveTeacherPasskey,
  findTeacherByPasskey,
  findTeacherByTeacherId,
  saveTeacherDeviceToken,
  findTeacherByDeviceToken,
  updateTeacherLastActive,
  getAllTeachers,
  getAvailableTeachers,
  autoCreateGroupsForClass,
  confirmGroupsForClass,
  getGroupsBySchoolAndClass,
  getGroupMembers,
} = require('../models/schoolModel');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const generatePasskey = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();

const generateDeviceToken = () =>
  crypto.randomBytes(64).toString('hex');

const normalizeTeacherId = (value) =>
  String(value || '').trim().replace(/\s+/g, '').toUpperCase();

const generateEducationAccessToken = (user, role) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email || null,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EDUCATION_JWT_EXPIRES_IN || '365d' }
  );
};

const ONE_HOUR = 60 * 60 * 1000;

const teacherIsIdle = (lastActiveAt) => {
  if (!lastActiveAt) return true;
  return Date.now() - new Date(lastActiveAt).getTime() > ONE_HOUR;
};

const serializeTeacherAuth = (teacher) => ({
  id: teacher.id,
  teacher_id: teacher.teacher_id,
  full_name: teacher.full_name,
  email: teacher.email,
  phone_number: teacher.phone_number || null,
  account_number: teacher.account_number || null,
  certificate: teacher.certificate || null,
  profile_picture_url: teacher.profile_picture_url || null,
});

// ── School Registration ───────────────────────────────────────────
const registerSchool = async (req, res) => {
  try {
    const {
      name,
      address,
      contact_email,
      contact_phone,
      assigned_agent_id,
      assigned_agent_ids,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'School name is required' });
    }

    const school = await createSchool({
      name,
      address,
      contact_email,
      contact_phone,
      registered_by: req.user.id,
      assigned_agent_id: assigned_agent_id || null,
    });

    if (Array.isArray(assigned_agent_ids) && assigned_agent_ids.length > 0) {
      await assignAgentsToSchool(school.id, assigned_agent_ids, req.user.id);
    }

    console.log(`✅ School registered: ${school.school_id} — ${school.name}`);

    res.status(201).json({
      message: 'School registered successfully',
      school: {
        id: school.id,
        school_id: school.school_id,
        name: school.name,
        assigned_agent_id: school.assigned_agent_id,
      },
    });
  } catch (error) {
    console.error('Register school error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSchools = async (req, res) => {
  try {
    const schools = await getAllSchools();
    res.status(200).json({ schools });
  } catch (error) {
    console.error('Get schools error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSchool = async (req, res) => {
  try {
    const school = await getSchoolById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const agents = await getSchoolAgents(school.id);
    res.status(200).json({ school, agents });
  } catch (error) {
    console.error('Get school error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignAgent = async (req, res) => {
  try {
    const { agent_id } = req.body;
    if (!agent_id) {
      return res.status(400).json({ message: 'agent_id is required' });
    }

    const school = await updateSchoolAgent(req.params.id, agent_id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    await assignAgentsToSchool(school.id, [agent_id], req.user.id);

    res.status(200).json({ message: 'Agent assigned to school', school });
  } catch (error) {
    console.error('Assign agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignMultipleAgents = async (req, res) => {
  try {
    const { agent_ids } = req.body;

    if (!Array.isArray(agent_ids) || agent_ids.length === 0) {
      return res.status(400).json({ message: 'agent_ids array is required' });
    }

    const school = await getSchoolById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const assignments = await assignAgentsToSchool(school.id, agent_ids, req.user.id);
    const agents = await getSchoolAgents(school.id);

    res.status(200).json({
      message: 'Agents assigned successfully',
      assignments,
      agents,
    });
  } catch (error) {
    console.error('Assign multiple agents error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAssignedAgents = async (req, res) => {
  try {
    const school = await getSchoolById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const agents = await getSchoolAgents(school.id);
    res.status(200).json({ agents });
  } catch (error) {
    console.error('Get assigned agents error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Teacher Registration — company level, no school ───────────────
const registerTeacher = async (req, res) => {
  try {
    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ message: 'full_name and email are required' });
    }

    const teacher = await createTeacher({ full_name, email });
    const passkey = generatePasskey();
    await saveTeacherPasskey(teacher.id, passkey);

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({
        to: email,
        from: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME },
        subject: 'Your Credent Teacher Access',
        html: `
          <div style="font-family:'Times New Roman',serif;max-width:600px;margin:0 auto;padding:40px;">
            <h2>Welcome to Credent, ${full_name}</h2>
            <p>You have been registered as a teacher on the Credent platform.</p>
            <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0;">
              <p><strong>Teacher ID:</strong> ${teacher.teacher_id}</p>
              <p><strong>One-time Passkey:</strong>
                <span style="font-size:24px;letter-spacing:4px;font-weight:bold;">${passkey}</span>
              </p>
            </div>
            <p><strong>First login:</strong> Enter your passkey, then your Teacher ID.</p>
            <p><strong>After that:</strong> If the app is idle for over 1 hour, enter your Teacher ID to resume.</p>
            <p style="color:#888;font-size:12px;">Passkey expires in 24 hours. Do not share it.</p>
          </div>
        `,
        text: `Welcome ${full_name}. Teacher ID: ${teacher.teacher_id}. Passkey: ${passkey}. Expires in 24 hours.`,
      });
    }

    console.log(`✅ Teacher registered: ${teacher.teacher_id} — ${full_name}`);

    res.status(201).json({
      message: 'Teacher registered. Credentials sent to email.',
      passkey,
      teacher: {
        id: teacher.id,
        teacher_id: teacher.teacher_id,
        full_name: teacher.full_name,
        email: teacher.email,
        profile_picture_url: teacher.profile_picture_url || null,
      },
    });
  } catch (error) {
    console.error('Register teacher error:', error.message);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'A teacher with this email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await getAllTeachers();
    res.status(200).json({ teachers });
  } catch (error) {
    console.error('Get teachers error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAvailable = async (req, res) => {
  try {
    const teachers = await getAvailableTeachers();
    res.status(200).json({ teachers });
  } catch (error) {
    console.error('Get available teachers error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Student Registration ──────────────────────────────────────────
const registerStudent = async (req, res) => {
  try {
    const { full_name, email, grade, class_name, semester } = req.body;
    const { school_id } = req.params;

    if (!full_name) {
      return res.status(400).json({ message: 'full_name is required' });
    }

    const school = await getSchoolBySchoolId(school_id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const student = await createStudent({
      school_id: school.id,
      full_name,
      email,
      grade,
      class_name,
      semester,
    });

    const passkey = generatePasskey();
    await saveStudentPasskey(student.id, passkey);

    const emailTarget = email || school.contact_email;
    if (emailTarget && process.env.SENDGRID_API_KEY) {
      await sgMail.send({
        to: emailTarget,
        from: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME },
        subject: `Student Access Credentials — ${school.name}`,
        html: `
          <div style="font-family:'Times New Roman',serif;max-width:600px;margin:0 auto;padding:40px;">
            <h2>Credent Student Access — ${full_name}</h2>
            <p>Student registered at <strong>${school.name}</strong>.</p>
            <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0;">
              <p><strong>School ID:</strong> ${school.school_id}</p>
              <p><strong>Student ID:</strong> ${student.student_id}</p>
              <p><strong>One-time Passkey:</strong>
                <span style="font-size:24px;letter-spacing:4px;font-weight:bold;">${passkey}</span>
              </p>
            </div>
            <p><strong>First login:</strong> Enter passkey, then School ID + Student ID.</p>
            <p><strong>After that:</strong> Use School ID + Student ID to open the app.</p>
            <p style="color:#888;font-size:12px;">Passkey expires in 24 hours.</p>
          </div>
        `,
        text: `Student: ${full_name}. School: ${school.name}. School ID: ${school.school_id}. Student ID: ${student.student_id}. Passkey: ${passkey}.`,
      });
    }

    console.log(`✅ Student registered: ${student.student_id} — ${full_name}`);

    res.status(201).json({
      message: 'Student registered. Credentials sent.',
      student: {
        id: student.id,
        student_id: student.student_id,
        full_name: student.full_name,
        school_id: school.school_id,
        grade: student.grade,
        class_name: student.class_name,
        semester: student.semester,
        profile_picture_url: student.profile_picture_url || null,
      },
    });
  } catch (error) {
    console.error('Register student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudents = async (req, res) => {
  try {
    const school = await getSchoolBySchoolId(req.params.school_id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const students = await getStudentsBySchool(school.id);
    res.status(200).json({ students });
  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Auto Grouping ─────────────────────────────────────────────────
const autoGroupStudents = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { class_name, semester } = req.body;

    if (!class_name) {
      return res.status(400).json({ message: 'class_name is required' });
    }

    const groups = await autoCreateGroupsForClass({
      school_id,
      class_name,
      semester: semester || null,
      created_by: req.user.id,
    });

    res.status(201).json({
      message: 'Groups generated successfully',
      groups,
    });
  } catch (error) {
    console.error('Auto group students error:', error.message);
    if (
      error.message === 'School not found' ||
      error.message === 'No students found for this class'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getClassGroups = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { class_name, semester } = req.query;

    if (!class_name) {
      return res.status(400).json({ message: 'class_name query is required' });
    }

    const school = await getSchoolBySchoolId(school_id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const groups = await getGroupsBySchoolAndClass(school.id, class_name, semester || null);
    const enriched = [];

    for (const group of groups) {
      const members = await getGroupMembers(group.id, true);
      enriched.push({ ...group, members });
    }

    res.status(200).json({ groups: enriched });
  } catch (error) {
    console.error('Get class groups error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const confirmClassGroups = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { class_name, semester } = req.body;

    if (!class_name) {
      return res.status(400).json({ message: 'class_name is required' });
    }

    const { school, groups } = await confirmGroupsForClass({
      school_id,
      class_name,
      semester: semester || null,
      confirmed_by: req.user.id,
    });

    if (process.env.SENDGRID_API_KEY) {
      for (const group of groups) {
        const memberNames = group.members.map((m) => m.full_name).join(', ');

        for (const member of group.members) {
          if (!member.email) continue;

          await sgMail.send({
            to: member.email,
            from: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME },
            subject: `${school.name} — ${group.name} confirmed`,
            html: `
              <div style="font-family:'Times New Roman',serif;max-width:600px;margin:0 auto;padding:40px;">
                <h2>Your Semester Group Has Been Confirmed</h2>
                <p><strong>School:</strong> ${school.name}</p>
                <p><strong>Class:</strong> ${group.class_name || 'N/A'}</p>
                <p><strong>Semester:</strong> ${group.semester || 'N/A'}</p>
                <p><strong>Group:</strong> ${group.name}</p>
                <p><strong>Your classmates:</strong> ${memberNames}</p>
              </div>
            `,
            text: `School: ${school.name}. Class: ${group.class_name || 'N/A'}. Semester: ${group.semester || 'N/A'}. Group: ${group.name}. Classmates: ${memberNames}`,
          });
        }
      }
    }

    res.status(200).json({
      message: 'Groups confirmed successfully',
      groups,
    });
  } catch (error) {
    console.error('Confirm class groups error:', error.message);
    if (error.message === 'School not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Teacher Auth ──────────────────────────────────────────────────
const teacherPasskeyLogin = async (req, res) => {
  try {
    const { passkey, teacher_id } = req.body;
    if (!passkey || !teacher_id) {
      return res.status(400).json({ message: 'Passkey and Teacher ID are required' });
    }

    const teacher = await findTeacherByPasskey(passkey);
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid or expired passkey. Contact your administrator.' });
    }

    if (normalizeTeacherId(teacher.teacher_id) !== normalizeTeacherId(teacher_id)) {
      return res.status(401).json({ message: 'Teacher ID does not match. Check your credentials.' });
    }

    const deviceToken = generateDeviceToken();
    await saveTeacherDeviceToken(teacher.id, deviceToken);
    const accessToken = generateEducationAccessToken(teacher, 'teacher');

    console.log(`✅ Teacher passkey login: ${teacher.teacher_id}`);

    res.status(200).json({
      message: 'Login successful',
      deviceToken,
      accessToken,
      requiresIdOnResume: true,
      teacher: serializeTeacherAuth(teacher),
    });
  } catch (error) {
    console.error('Teacher passkey login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const teacherResumeLogin = async (req, res) => {
  try {
    const { deviceToken, teacher_id } = req.body;
    if (!deviceToken || !teacher_id) {
      return res.status(400).json({ message: 'Device token and Teacher ID are required' });
    }

    const teacher = await findTeacherByDeviceToken(deviceToken);
    if (!teacher) {
      return res.status(401).json({
        message: 'Session expired. Please use your passkey to login again.',
        requiresPasskey: true,
      });
    }

    if (normalizeTeacherId(teacher.teacher_id) !== normalizeTeacherId(teacher_id)) {
      return res.status(401).json({ message: 'Teacher ID does not match.' });
    }

    await updateTeacherLastActive(teacher.id);
    const accessToken = generateEducationAccessToken(teacher, 'teacher');

    console.log(`✅ Teacher resume login: ${teacher.teacher_id}`);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      teacher: serializeTeacherAuth(teacher),
    });
  } catch (error) {
    console.error('Teacher resume login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const teacherDeviceLogin = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    if (!deviceToken) {
      return res.status(400).json({ message: 'Device token required' });
    }

    const teacher = await findTeacherByDeviceToken(deviceToken);
    if (!teacher) {
      return res.status(401).json({
        message: 'Session expired. Please login again.',
        requiresPasskey: true,
      });
    }

    const isIdle = teacherIsIdle(teacher.last_active_at);

    if (isIdle) {
      return res.status(200).json({
        message: 'Session requires verification',
        requiresTeacherId: true,
        deviceToken,
        teacher: serializeTeacherAuth(teacher),
      });
    }

    await updateTeacherLastActive(teacher.id);
    const accessToken = generateEducationAccessToken(teacher, 'teacher');

    console.log(`✅ Teacher auto login: ${teacher.teacher_id}`);

    res.status(200).json({
      message: 'Auto login successful',
      accessToken,
      requiresTeacherId: false,
      teacher: serializeTeacherAuth(teacher),
    });
  } catch (error) {
    console.error('Teacher device login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Student Auth ──────────────────────────────────────────────────
const studentPasskeyLogin = async (req, res) => {
  try {
    const { passkey, school_id, student_id } = req.body;
    if (!passkey || !school_id || !student_id) {
      return res.status(400).json({ message: 'Passkey, School ID and Student ID are required' });
    }

    const student = await findStudentByPasskey(passkey);
    if (!student) {
      return res.status(401).json({ message: 'Invalid or expired passkey.' });
    }

    if (student.school_code !== school_id || student.student_id !== student_id) {
      return res.status(401).json({ message: 'School ID or Student ID does not match.' });
    }

    const deviceToken = generateDeviceToken();
    await saveStudentDeviceToken(student.id, deviceToken);
    const accessToken = generateEducationAccessToken(student, 'student');

    console.log(`✅ Student passkey login: ${student.student_id}`);

    res.status(200).json({
      message: 'Login successful',
      deviceToken,
      accessToken,
      student: {
        id: student.id,
        student_id: student.student_id,
        full_name: student.full_name,
        school_id: student.school_code,
        school_name: student.school_name,
        grade: student.grade,
        class_name: student.class_name,
        semester: student.semester,
        profile_picture_url: student.profile_picture_url || null,
      },
    });
  } catch (error) {
    console.error('Student passkey login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const studentDeviceLogin = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    if (!deviceToken) {
      return res.status(400).json({ message: 'Device token required' });
    }

    const student = await findStudentByDeviceToken(deviceToken);
    if (!student) {
      return res.status(401).json({
        message: 'Session expired. Please login again.',
        requiresPasskey: true,
      });
    }

    const accessToken = generateEducationAccessToken(student, 'student');

    console.log(`✅ Student auto login: ${student.student_id}`);

    res.status(200).json({
      message: 'Auto login successful',
      accessToken,
      student: {
        id: student.id,
        student_id: student.student_id,
        full_name: student.full_name,
        school_id: student.school_code,
        school_name: student.school_name,
        grade: student.grade,
        class_name: student.class_name,
        semester: student.semester,
        profile_picture_url: student.profile_picture_url || null,
      },
    });
  } catch (error) {
    console.error('Student device login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const studentResumeLogin = async (req, res) => {
  try {
    const { deviceToken, school_id, student_id } = req.body;
    if (!deviceToken || !school_id || !student_id) {
      return res.status(400).json({ message: 'Device token, School ID and Student ID are required' });
    }

    const student = await findStudentByDeviceToken(deviceToken);
    if (!student) {
      return res.status(401).json({
        message: 'Session expired. Please use your passkey to login again.',
        requiresPasskey: true,
      });
    }

    if (student.school_code !== school_id || student.student_id !== student_id) {
      return res.status(401).json({ message: 'School ID or Student ID does not match.' });
    }

    const accessToken = generateEducationAccessToken(student, 'student');

    console.log(`✅ Student resume login: ${student.student_id}`);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      student: {
        id: student.id,
        student_id: student.student_id,
        full_name: student.full_name,
        school_id: student.school_code,
        school_name: student.school_name,
        grade: student.grade,
        class_name: student.class_name,
        semester: student.semester,
        profile_picture_url: student.profile_picture_url || null,
      },
    });
  } catch (error) {
    console.error('Student resume login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerSchool,
  getSchools,
  getSchool,
  assignAgent,
  assignMultipleAgents,
  getAssignedAgents,
  registerTeacher,
  getTeachers,
  getAvailable,
  registerStudent,
  getStudents,
  autoGroupStudents,
  getClassGroups,
  confirmClassGroups,
  teacherPasskeyLogin,
  teacherResumeLogin,
  teacherDeviceLogin,
  studentPasskeyLogin,
  studentDeviceLogin,
  studentResumeLogin,
};
