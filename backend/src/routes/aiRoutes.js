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
router.post('/ask-with-attachment', protect, aiDailyCap, upload.single('file'), askWithAttachment);
router.post('/transcribe', protect, upload.single('file'), transcribeAudio);
router.get('/history', protect, validateAiHistoryRequest, getAiHistory);
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

module.exports = router;
