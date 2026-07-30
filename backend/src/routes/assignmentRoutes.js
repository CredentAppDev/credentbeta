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
  helpWithAssignmentHandler,
  uploadSubmissionAttachment,
  uploadAssignmentAttachment,
  listAiMarkedHandler,
  reviewAiMarkHandler,
} = require('../controllers/assignmentController');

const isTeacher = allowRoles('teacher');
const isStudent = allowRoles('student');

router.use(protect);

// ── Student routes ────────────────────────────────────────────────
router.get('/mine', isStudent, listMyAssignments);
router.post('/:id/submit', isStudent, submitAssignmentHandler);
// Emrys coaches on the assignment, using the project + roadmap day it is
// linked to. It will not produce the deliverable — see HOMEWORK_COACHING_POLICY.
router.post('/:id/help', isStudent, helpWithAssignmentHandler);
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
// Emrys's marking queue. Declared BEFORE any '/:id' route — Express matches in
// order, and '/review' would otherwise be swallowed as an assignment id.
router.get('/review', isTeacher, listAiMarkedHandler);
router.post('/review/:submissionId', isTeacher, reviewAiMarkHandler);
router.get('/groups/:groupId', isTeacher, listGroupAssignments);
router.get('/:id/submissions', isTeacher, getSubmissions);
router.post('/:id/submissions/:studentId/grade', isTeacher, gradeSubmissionHandler);
router.patch('/:id/close', isTeacher, closeAssignmentHandler);
// The teacher's own attachment — a brief, worksheet, or reference photo every
// student in the class sees. Same raw-body shape and 8MB cap as the student's.
router.post(
  '/:id/brief',
  isTeacher,
  express.raw({
    type: ['image/*', 'application/pdf', 'application/zip', 'text/plain', 'application/octet-stream'],
    limit: '8mb',
  }),
  uploadAssignmentAttachment
);

module.exports = router;
