const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  teacherPasskeyLogin,
  teacherResumeLogin,
  teacherDeviceLogin,
  studentPasskeyLogin,
  studentDeviceLogin,
  studentResumeLogin,
} = require('../controllers/schoolController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// ── Teacher auth ──────────────────────────────────────────────────
// First time login
router.post('/teacher/passkey',
  body('passkey').notEmpty().isLength({ min: 10, max: 10 }),
  body('teacher_id').notEmpty(),
  validate,
  teacherPasskeyLogin
);

// After 1hr idle — enter teacher_id
router.post('/teacher/resume',
  body('deviceToken').notEmpty(),
  body('teacher_id').notEmpty(),
  validate,
  teacherResumeLogin
);

// Auto login on app open
router.post('/teacher/device',
  body('deviceToken').notEmpty(),
  validate,
  teacherDeviceLogin
);

// ── Student auth ──────────────────────────────────────────────────
// First time login
router.post('/student/passkey',
  body('passkey').notEmpty().isLength({ min: 10, max: 10 }),
  body('school_id').notEmpty(),
  body('student_id').notEmpty(),
  validate,
  studentPasskeyLogin
);

// Auto login — permanent device token
router.post('/student/device',
  body('deviceToken').notEmpty(),
  validate,
  studentDeviceLogin
);

// Resume — enter school_id + student_id
router.post('/student/resume',
  body('deviceToken').notEmpty(),
  body('school_id').notEmpty(),
  body('student_id').notEmpty(),
  validate,
  studentResumeLogin
);

module.exports = router;