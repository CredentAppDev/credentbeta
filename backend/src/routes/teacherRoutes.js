const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAgent } = require('../middleware/roles');
const {
  registerTeacher,
  getTeachers,
  getAvailable,
} = require('../controllers/schoolController');

// ── Teacher routes — company level, no school ─────────────────────
router.post('/',         protect, isAgent, registerTeacher);
router.get('/',          protect, isAgent, getTeachers);
router.get('/available', protect, isAgent, getAvailable);

module.exports = router;
