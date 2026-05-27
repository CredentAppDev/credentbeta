const express = require('express');
const router = express.Router();

const pool = require('../config/db');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const {
  getMyGroups,
  getStudentGroupMessages,
  postStudentGroupMessage,
  postStudentGroupAudioMessage,
  postStudentGroupMediaMessage,
  getStudentGroupMembers,
} = require('../controllers/studentController');

const isStudent = allowRoles('student');

router.use(protect);
router.use(isStudent);

router.get('/groups', getMyGroups);

/**
 * GET /api/student/peers
 * Returns every other student who shares at least one group with the
 * caller. Used by the desktop chat list to surface peer DMs alongside
 * group rows — without this, students could only chat as a group and
 * couldn't see classmates as individual conversations.
 */
router.get('/peers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT
              peer.id,
              peer.student_id,
              peer.full_name,
              peer.grade,
              peer.class_name,
              peer.profile_picture_url,
              (
                SELECT sg2.name FROM student_groups sg2
                  JOIN group_members gmA2 ON gmA2.group_id = sg2.id AND gmA2.student_id = $1
                  JOIN group_members gmB2 ON gmB2.group_id = sg2.id AND gmB2.student_id = peer.id
                LIMIT 1
              ) AS shared_group_name,
              (
                SELECT sg2.id FROM student_groups sg2
                  JOIN group_members gmA2 ON gmA2.group_id = sg2.id AND gmA2.student_id = $1
                  JOIN group_members gmB2 ON gmB2.group_id = sg2.id AND gmB2.student_id = peer.id
                LIMIT 1
              ) AS shared_group_id
         FROM group_members me
         JOIN group_members them ON them.group_id = me.group_id AND them.student_id != me.student_id
         JOIN students peer ON peer.id = them.student_id AND peer.is_active = true
         WHERE me.student_id = $1
         ORDER BY peer.full_name ASC`,
      [req.user.id]
    );
    res.status(200).json({ peers: result.rows });
  } catch (error) {
    console.error('list student peers error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/groups/:groupId/messages', getStudentGroupMessages);
router.post('/groups/:groupId/messages', postStudentGroupMessage);
router.post(
  '/groups/:groupId/audio',
  express.raw({ type: () => true, limit: '12mb' }),
  postStudentGroupAudioMessage
);
router.post(
  '/groups/:groupId/media',
  express.raw({ type: () => true, limit: '50mb' }),
  postStudentGroupMediaMessage
);
router.get('/groups/:groupId/members', getStudentGroupMembers);

// Returns the school this student is enrolled in
router.get('/school', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sc.id, sc.school_id AS school_code, sc.name, sc.address
       FROM students st
       JOIN schools sc ON sc.id = st.school_id
       WHERE st.id = $1 AND sc.is_active = true`,
      [req.user.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'School not found for this student' });
    }
    res.status(200).json({ school: result.rows[0] });
  } catch (error) {
    console.error('Get student school error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
