const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const {
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
} = require('../controllers/educationProfileController');

// Student
router.get('/student/me', protect, studentMe);
router.patch(
  '/student/profile',
  protect,
  validateStudentProfile,
  audit('update_profile', 'student'),
  patchStudentProfile
);
router.patch(
  '/student/profile-picture',
  protect,
  validateProfilePicture,
  audit('update_profile_picture', 'student'),
  patchStudentProfilePicture
);
router.post(
  '/student/profile-picture/upload',
  protect,
  express.raw({ type: ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'], limit: '6mb' }),
  uploadStudentProfilePicture
);

// Teacher
router.get('/teacher/me', protect, teacherMe);
router.patch(
  '/teacher/profile',
  protect,
  validateTeacherProfile,
  audit('update_profile', 'teacher'),
  patchTeacherProfile
);
router.patch(
  '/teacher/profile-picture',
  protect,
  validateProfilePicture,
  audit('update_profile_picture', 'teacher'),
  patchTeacherProfilePicture
);
router.post(
  '/teacher/profile-picture/upload',
  protect,
  express.raw({ type: ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'], limit: '6mb' }),
  uploadTeacherProfilePicture
);

module.exports = router;
