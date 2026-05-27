const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const {
  isAgent,
} = require('../middleware/roles');

const {
  registerSchool,
  getSchools,
  getSchool,
  assignAgent,
  assignMultipleAgents,
  getAssignedAgents,
  registerStudent,
  getStudents,
  autoGroupStudents,
  getClassGroups,
  confirmClassGroups,
} = require('../controllers/schoolController');

// ── School routes ─────────────────────────────────────────────────
// Staff can view schools for now
router.get('/', protect, isAgent, getSchools);
router.get('/:id', protect, isAgent, getSchool);

// Agents create schools and assign agents
router.post('/', protect, isAgent, registerSchool);
router.patch('/:id/assign-agent', protect, isAgent, assignAgent);
router.patch('/:id/assign-agents', protect, isAgent, assignMultipleAgents);
router.get('/:id/agents', protect, isAgent, getAssignedAgents);

// ── Student routes — under school ─────────────────────────────────
// Agents add students class by class
router.post('/:school_id/students', protect, isAgent, registerStudent);

// Staff can view students for now
router.get('/:school_id/students', protect, isAgent, getStudents);

// ── Auto grouping routes ──────────────────────────────────────────
// Agents generate groups of 3
router.post('/:school_id/groups/auto', protect, isAgent, autoGroupStudents);

// Staff can view generated groups
router.get('/:school_id/groups', protect, isAgent, getClassGroups);

// Agents confirm groups and trigger emails
router.post('/:school_id/groups/confirm', protect, isAgent, confirmClassGroups);

module.exports = router;
