const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  getStudentMe,
  updateStudentProfilePicture,
  updateStudentProfile,
  getTeacherMe,
  updateTeacherProfilePicture,
  updateTeacherProfile,
} = require('../models/schoolModel');

const uploadsRoot = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');

// Store a RELATIVE path (e.g. "/uploads/teacher-…jpg") rather than an
// absolute URL built from req.get('host'). The absolute form captured the
// uploader's LAN IP (e.g. 192.168.100.4:5000 when the Mac uploaded), which
// then failed to load for any viewer on a different machine because their
// renderer would dereference that exact URL literally. With a relative
// path, every viewer's renderer prefixes its own engine.baseUrl via
// resolvePhotoUrl(), so the same DB row works from any client. Same fix
// we already applied to group photos.
const publicUploadUrl = (_req, filename) => `/uploads/${filename}`;
const normalizeTeacherId = (value) =>
  String(value || '').trim().replace(/\s+/g, '').toUpperCase();

// Postgres returns DATE columns as a JS Date at local midnight. Serialize to a
// plain "YYYY-MM-DD" string so the renderer can drop it straight into a
// <input type="date"> without timezone drift.
const formatDateOnly = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return null;
  }
};

const saveRawProfileImage = (req, prefix) => {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    const error = new Error('Image body is required');
    error.statusCode = 400;
    throw error;
  }

  fs.mkdirSync(uploadsRoot, { recursive: true });
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

const serializeStudentProfile = (student) => ({
  id: student.id,
  student_id: student.student_id,
  full_name: student.full_name,
  email: student.email || null,
  phone_number: student.phone_number || null,
  school_id: student.school_code || student.school_id || null,
  school_name: student.school_name || null,
  grade: student.grade || null,
  class_name: student.class_name || null,
  semester: student.semester || null,
  date_of_birth: formatDateOnly(student.date_of_birth),
  gender: student.gender || null,
  address: student.address || null,
  bio: student.bio || null,
  guardian_name: student.guardian_name || null,
  guardian_phone: student.guardian_phone || null,
  hobbies: student.hobbies || null,
  profile_picture_url: student.profile_picture_url || null,
  is_active: student.is_active,
  created_at: student.created_at,
  updated_at: student.updated_at,
});

const serializeTeacherProfile = (teacher) => ({
  id: teacher.id,
  teacher_id: teacher.teacher_id,
  full_name: teacher.full_name,
  email: teacher.email || null,
  phone_number: teacher.phone_number || null,
  account_number: teacher.account_number || null,
  certificate: teacher.certificate || null,
  date_of_birth: formatDateOnly(teacher.date_of_birth),
  gender: teacher.gender || null,
  address: teacher.address || null,
  bio: teacher.bio || null,
  qualification: teacher.qualification || null,
  subjects: teacher.subjects || null,
  years_of_experience:
    teacher.years_of_experience === null || teacher.years_of_experience === undefined
      ? null
      : Number(teacher.years_of_experience),
  profile_picture_url: teacher.profile_picture_url || null,
  is_available: teacher.is_available,
  is_active: teacher.is_active,
  created_at: teacher.created_at,
  updated_at: teacher.updated_at,
});

const validateProfilePicture = [
  body('profile_picture_url')
    .trim()
    .notEmpty()
    .withMessage('profile_picture_url is required')
    .isURL()
    .withMessage('profile_picture_url must be a valid URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateStudentProfile = [
  body('full_name').trim().notEmpty().withMessage('full_name is required'),
  body('phone_number')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('phone_number must be 50 characters or fewer'),
  body('student_id').trim().notEmpty().withMessage('student_id is required'),
  body('class_name')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('class_name must be 100 characters or fewer'),
  body('grade')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('grade must be 50 characters or fewer'),
  body('date_of_birth')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('date_of_birth must be a valid date (YYYY-MM-DD)'),
  body('gender')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('gender must be 20 characters or fewer'),
  body('address')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('address must be 500 characters or fewer'),
  body('bio')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('bio must be 1000 characters or fewer'),
  body('guardian_name')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('guardian_name must be 255 characters or fewer'),
  body('guardian_phone')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('guardian_phone must be 50 characters or fewer'),
  body('hobbies')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('hobbies must be 500 characters or fewer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateTeacherProfile = [
  body('full_name').trim().notEmpty().withMessage('full_name is required'),
  body('phone_number')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('phone_number must be 50 characters or fewer'),
  body('teacher_id').trim().notEmpty().withMessage('teacher_id is required'),
  body('account_number')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('account_number must be 100 characters or fewer'),
  body('certificate')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('certificate must be 255 characters or fewer'),
  body('date_of_birth')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('date_of_birth must be a valid date (YYYY-MM-DD)'),
  body('gender')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('gender must be 20 characters or fewer'),
  body('address')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('address must be 500 characters or fewer'),
  body('bio')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('bio must be 1000 characters or fewer'),
  body('qualification')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('qualification must be 255 characters or fewer'),
  body('subjects')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('subjects must be 500 characters or fewer'),
  body('years_of_experience')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0, max: 80 })
    .withMessage('years_of_experience must be a whole number between 0 and 80'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const studentMe = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized as student' });
    }

    const student = await getStudentMe(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json({ student: serializeStudentProfile(student) });
  } catch (error) {
    console.error('studentMe error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const patchStudentProfilePicture = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized as student' });
    }

    const { profile_picture_url } = req.body;

    const student = await updateStudentProfilePicture(req.user.id, profile_picture_url);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json({
      message: 'Student profile picture updated',
      student: serializeStudentProfile(student),
    });
  } catch (error) {
    console.error('patchStudentProfilePicture error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const uploadStudentProfilePicture = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized as student' });
    }

    const profilePictureUrl = saveRawProfileImage(req, `student-${req.user.id}`);
    const student = await updateStudentProfilePicture(req.user.id, profilePictureUrl);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json({
      message: 'Student profile picture uploaded',
      profile_picture_url: profilePictureUrl,
      student: serializeStudentProfile(student),
    });
  } catch (error) {
    console.error('uploadStudentProfilePicture error:', error.message);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
};

const patchStudentProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized as student' });
    }

    const student = await updateStudentProfile(req.user.id, {
      full_name: req.body.full_name,
      phone_number: req.body.phone_number,
      student_id: req.body.student_id,
      class_name: req.body.class_name,
      grade: req.body.grade,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      address: req.body.address,
      bio: req.body.bio,
      guardian_name: req.body.guardian_name,
      guardian_phone: req.body.guardian_phone,
      hobbies: req.body.hobbies,
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json({
      message: 'Student profile updated',
      student: serializeStudentProfile(student),
    });
  } catch (error) {
    console.error('patchStudentProfile error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Student ID already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

const teacherMe = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized as teacher' });
    }

    const teacher = await getTeacherMe(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json({ teacher: serializeTeacherProfile(teacher) });
  } catch (error) {
    console.error('teacherMe error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const patchTeacherProfilePicture = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized as teacher' });
    }

    const { profile_picture_url } = req.body;

    const teacher = await updateTeacherProfilePicture(req.user.id, profile_picture_url);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json({
      message: 'Teacher profile picture updated',
      teacher: serializeTeacherProfile(teacher),
    });
  } catch (error) {
    console.error('patchTeacherProfilePicture error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const uploadTeacherProfilePicture = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized as teacher' });
    }

    const profilePictureUrl = saveRawProfileImage(req, `teacher-${req.user.id}`);
    const teacher = await updateTeacherProfilePicture(req.user.id, profilePictureUrl);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json({
      message: 'Teacher profile picture uploaded',
      profile_picture_url: profilePictureUrl,
      teacher: serializeTeacherProfile(teacher),
    });
  } catch (error) {
    console.error('uploadTeacherProfilePicture error:', error.message);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
};

const patchTeacherProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized as teacher' });
    }

    const teacher = await updateTeacherProfile(req.user.id, {
      full_name: req.body.full_name,
      phone_number: req.body.phone_number,
      teacher_id: normalizeTeacherId(req.body.teacher_id),
      account_number: req.body.account_number,
      certificate: req.body.certificate,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      address: req.body.address,
      bio: req.body.bio,
      qualification: req.body.qualification,
      subjects: req.body.subjects,
      years_of_experience: req.body.years_of_experience,
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json({
      message: 'Teacher profile updated',
      teacher: serializeTeacherProfile(teacher),
    });
  } catch (error) {
    console.error('patchTeacherProfile error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Teacher ID already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  validateProfilePicture,
  validateStudentProfile,
  validateTeacherProfile,
  studentMe,
  patchStudentProfilePicture,
  uploadStudentProfilePicture,
  patchStudentProfile,
  teacherMe,
  patchTeacherProfilePicture,
  uploadTeacherProfilePicture,
  patchTeacherProfile,
};
