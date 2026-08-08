const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { aiDailyCap } = require('../middleware/aiDailyCap');
const {
  validateAskAi,
  validateRoadmapRequest,
  validateTeacherDailyReport,
  validateTeacherGroupProjectUpdate,
  validateAgentAskAi,
  validateAiHistoryRequest,
  askAi,
  agentAskAi,
  getAiHistory,
  getTeachingRoadmap,
  getTeachingDayLesson,
  getTeacherReports,
  submitTeacherDailyReport,
  submitTeacherGroupProjectUpdate,
  askWithAttachment,
  transcribeAudio,
  tutorAsk,
  tutorEnd,
  generateBuildPlan,
  generate3DPart,
  get3DPartStatus,
  getStudentAiHistory,
} = require('../controllers/aiController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const router = express.Router();

// Routes that invoke Claude / paid LLM calls are wrapped in aiDailyCap so
// each tester is limited to AI_DAILY_CAP (default 30) calls per UTC day.
// Agents/admins are uncapped (see middleware). Routes below that DON'T call
// Claude (history, roadmap index, reports) skip the cap so testers can still
// navigate even after they hit it.
router.post('/ask', protect, aiDailyCap, validateAskAi, askAi);
router.post('/agent/ask', protect, validateAgentAskAi, agentAskAi);
// Students may send a picture of their work. For a robotics class a photo of
// the wiring or the screen IS the work, and Emrys judging it from a filename
// was guessing. The coaching rules still apply — see the briefing built below.
router.post('/ask-with-attachment', protect, aiDailyCap, upload.single('file'), askWithAttachment);
router.post('/transcribe', protect, upload.single('file'), transcribeAudio);
router.get('/history', protect, validateAiHistoryRequest, getAiHistory);
// What Emrys said to one of the teacher's OWN students. Role and class
// membership are both checked in the handler — a child's conversation is not
// readable by any teacher who happens to know a student id.
router.get('/student-history', protect, getStudentAiHistory);
router.get('/roadmap', protect, validateRoadmapRequest, getTeachingRoadmap);
router.get('/teaching-lesson', protect, aiDailyCap, getTeachingDayLesson);
router.get('/teacher/reports', protect, getTeacherReports);
router.post('/teacher/day-report', protect, validateTeacherDailyReport, submitTeacherDailyReport);
router.post('/teacher/group-project-update', protect, validateTeacherGroupProjectUpdate, submitTeacherGroupProjectUpdate);

// Tutor mode (conversational, multi-turn, 10-rule patient teacher)
router.post('/tutor', protect, aiDailyCap, tutorAsk);
router.post('/tutor/:id/end', protect, tutorEnd);

// Build Studio: dedicated 3D build-plan generator (calls Claude → capped).
router.post('/build-plan', protect, aiDailyCap, generateBuildPlan);

// Build Studio: organic 3D part generation (Meshy). POST kicks off a job (costs
// credits → capped); GET polls status (cheap → uncapped so prefetch polling
// doesn't drain the daily cap).
router.post('/generate-3d', protect, aiDailyCap, generate3DPart);
router.get('/generate-3d/:id', protect, get3DPartStatus);

module.exports = router;
