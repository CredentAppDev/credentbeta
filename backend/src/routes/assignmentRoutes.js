const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const {
  createAssignmentHandler,
  listGroupAssignments,
  getSubmissions,
  gradeSubmissionHandler,
  closeAssignmentHandler,
  listMyAssignments,
  submitAssignmentHandler,
  uploadSubmissionAttachment,
} = require('../controllers/assignmentController');

const isTeacher = allowRoles('teacher');
const isStudent = allowRoles('student');

router.use(protect);

// ── Student routes ────────────────────────────────────────────────
router.get('/mine', isStudent, listMyAssignments);
router.post('/:id/submit', isStudent, submitAssignmentHandler);
// Raw file bytes, same shape as the group-photo upload. Declared BEFORE the
// JSON body parser would see it, and limited here as well as in the controller.
router.post(
  '/:id/attachment',
  isStudent,
  express.raw({
    type: ['image/*', 'application/pdf', 'application/zip', 'text/plain', 'application/octet-stream'],
    limit: '8mb',
  }),
  uploadSubmissionAttachment
);

// ── Teacher routes ────────────────────────────────────────────────
router.post('/', isTeacher, createAssignmentHandler);
router.get('/groups/:groupId', isTeacher, listGroupAssignments);
router.get('/:id/submissions', isTeacher, getSubmissions);
router.post('/:id/submissions/:studentId/grade', isTeacher, gradeSubmissionHandler);
router.patch('/:id/close', isTeacher, closeAssignmentHandler);

module.exports = router;
