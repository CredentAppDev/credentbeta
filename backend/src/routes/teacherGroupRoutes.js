const express = require('express');
const router = express.Router();

const pool = require('../config/db');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const {
  getMyGroups,
  getTeacherGroupMessages,
  postTeacherGroupMessage,
  postTeacherGroupAudioMessage,
  postTeacherGroupMediaMessage,
  getTeacherGroupMembersHandler,
  submitTeacherGroupRating,
  getTeacherGroupRatings,
  deleteTeacherGroupRating,
} = require('../controllers/teacherGroupController');

const isTeacher      = allowRoles('teacher');
const isTeacherOrAgent = allowRoles('teacher', 'agent');

router.use(protect);

// Teacher-only write/management routes
router.get('/groups',                  isTeacher,       getMyGroups);
router.get('/group-ratings',                isTeacher,  getTeacherGroupRatings);
router.post('/groups/:groupId/rating',      isTeacher,  submitTeacherGroupRating);
router.delete('/group-ratings/:ratingId',   isTeacher,  deleteTeacherGroupRating);

// Agents can also read messages and member lists (for oversight)
router.get('/groups/:groupId/messages',  isTeacherOrAgent, getTeacherGroupMessages);
router.post('/groups/:groupId/messages', isTeacherOrAgent, postTeacherGroupMessage);
router.post(
  '/groups/:groupId/audio',
  isTeacherOrAgent,
  express.raw({ type: () => true, limit: '12mb' }),
  postTeacherGroupAudioMessage
);
router.post(
  '/groups/:groupId/media',
  isTeacherOrAgent,
  express.raw({ type: () => true, limit: '50mb' }),
  postTeacherGroupMediaMessage
);
router.get('/groups/:groupId/members',   isTeacherOrAgent, getTeacherGroupMembersHandler);

// Returns all schools this teacher is assigned to
router.get('/assigned-schools', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.school_id AS school_code, s.name, s.address,
              tsa.created_at AS assigned_since
       FROM teacher_school_assignments tsa
       JOIN schools s ON s.id = tsa.school_id
       WHERE tsa.teacher_id = $1 AND s.is_active = true
       ORDER BY tsa.created_at DESC`,
      [req.user.id]
    );
    res.status(200).json({ schools: result.rows });
  } catch (error) {
    console.error('Get teacher assigned schools error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
