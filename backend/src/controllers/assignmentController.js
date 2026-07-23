const pool = require('../config/db');
const {
  createAssignment,
  getAssignmentById,
  getGroupAssignments,
  getStudentAssignments,
  getSubmissionsForAssignment,
  upsertSubmission,
  gradeSubmission,
  closeAssignment,
} = require('../models/assignmentModel');

const MAX_TITLE_LEN = 255;
const MAX_TEXT_LEN = 5000;
const MAX_FEEDBACK_LEN = 2000;

// ── Access helpers ────────────────────────────────────────────────
// Mirrors assertTeacherAllowed in teacherGroupController.js — a teacher may
// only touch a group they have an active teacher_group_access row for.
const teacherOwnsGroup = async (teacherId, groupId) => {
  const result = await pool.query(
    `SELECT 1 FROM teacher_group_access
     WHERE teacher_id = $1 AND group_id = $2 AND is_active = true
     LIMIT 1`,
    [teacherId, groupId]
  );
  return !!result.rows[0];
};

// A student may only submit to / see assignments for a group they are an
// active member of (same school as the group — mirrors getStudentGroups).
const studentInGroup = async (studentId, groupId) => {
  const result = await pool.query(
    `SELECT 1
     FROM group_members gm
     JOIN student_groups sg ON sg.id = gm.group_id
     JOIN students s ON s.id = gm.student_id
     WHERE gm.group_id = $1
       AND gm.student_id = $2
       AND s.school_id = sg.school_id
       AND s.is_active = true
     LIMIT 1`,
    [groupId, studentId]
  );
  return !!result.rows[0];
};

// ── Teacher handlers ──────────────────────────────────────────────
const createAssignmentHandler = async (req, res) => {
  try {
    const { group_id, title, instructions, link_url, due_at, points } = req.body;
    const groupId = parseInt(group_id, 10);

    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Valid group_id is required' });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const allowed = await teacherOwnsGroup(req.user.id, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'You are not assigned to this group' });
    }

    let dueAt = null;
    if (due_at) {
      const d = new Date(due_at);
      if (!Number.isNaN(d.getTime())) dueAt = d.toISOString();
    }

    let pts = 100;
    if (points !== undefined && points !== null && points !== '') {
      const p = parseInt(points, 10);
      if (Number.isInteger(p) && p >= 0 && p <= 1000) pts = p;
    }

    const assignment = await createAssignment({
      group_id: groupId,
      teacher_id: req.user.id,
      title: String(title).trim().slice(0, MAX_TITLE_LEN),
      instructions: instructions ? String(instructions).slice(0, MAX_TEXT_LEN) : null,
      link_url: link_url ? String(link_url).trim().slice(0, MAX_TEXT_LEN) : null,
      due_at: dueAt,
      points: pts,
    });

    res.status(201).json({ assignment });
  } catch (error) {
    console.error('Create assignment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const listGroupAssignments = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const allowed = await teacherOwnsGroup(req.user.id, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignments = await getGroupAssignments(groupId);
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('List group assignments error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    if (!Number.isInteger(assignmentId)) {
      return res.status(400).json({ message: 'Invalid assignment id' });
    }

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const allowed = await teacherOwnsGroup(req.user.id, assignment.group_id);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submissions = await getSubmissionsForAssignment(assignmentId);
    res.status(200).json({ assignment, submissions });
  } catch (error) {
    console.error('Get submissions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const gradeSubmissionHandler = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const studentId = parseInt(req.params.studentId, 10);
    const { grade, feedback } = req.body;

    if (!Number.isInteger(assignmentId) || !Number.isInteger(studentId)) {
      return res.status(400).json({ message: 'Invalid assignment or student id' });
    }

    const g = parseInt(grade, 10);
    if (!Number.isInteger(g) || g < 0 || g > 100) {
      return res.status(400).json({ message: 'Grade must be a number between 0 and 100' });
    }

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const allowed = await teacherOwnsGroup(req.user.id, assignment.group_id);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const fb = feedback ? String(feedback).slice(0, MAX_FEEDBACK_LEN) : null;
    const submission = await gradeSubmission(assignmentId, studentId, g, fb);
    if (!submission) {
      return res.status(404).json({ message: 'This student has not submitted yet' });
    }

    res.status(200).json({ submission });
  } catch (error) {
    console.error('Grade submission error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const closeAssignmentHandler = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    if (!Number.isInteger(assignmentId)) {
      return res.status(400).json({ message: 'Invalid assignment id' });
    }

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const allowed = await teacherOwnsGroup(req.user.id, assignment.group_id);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await closeAssignment(assignmentId);
    res.status(200).json({ assignment: updated });
  } catch (error) {
    console.error('Close assignment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Student handlers ──────────────────────────────────────────────
const listMyAssignments = async (req, res) => {
  try {
    const assignments = await getStudentAssignments(req.user.id);
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('List my assignments error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitAssignmentHandler = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const { body, link_url } = req.body;

    if (!Number.isInteger(assignmentId)) {
      return res.status(400).json({ message: 'Invalid assignment id' });
    }

    const hasBody = body && String(body).trim();
    const hasLink = link_url && String(link_url).trim();
    if (!hasBody && !hasLink) {
      return res.status(400).json({ message: 'Add your answer or a link before submitting' });
    }

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    if (assignment.status === 'closed') {
      return res.status(403).json({ message: 'This assignment is closed' });
    }

    const allowed = await studentInGroup(req.user.id, assignment.group_id);
    if (!allowed) {
      return res.status(403).json({ message: 'This assignment is not for your group' });
    }

    const submission = await upsertSubmission({
      assignment_id: assignmentId,
      student_id: req.user.id,
      body: hasBody ? String(body).slice(0, MAX_TEXT_LEN) : null,
      link_url: hasLink ? String(link_url).trim().slice(0, MAX_TEXT_LEN) : null,
    });

    res.status(201).json({ submission });
  } catch (error) {
    console.error('Submit assignment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAssignmentHandler,
  listGroupAssignments,
  getSubmissions,
  gradeSubmissionHandler,
  closeAssignmentHandler,
  listMyAssignments,
  submitAssignmentHandler,
};
