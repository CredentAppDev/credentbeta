const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const pool = require('../config/db');
const {
  createAssignment,
  getAssignmentById,
  getGroupAssignments,
  getStudentAssignments,
  getSubmissionsForAssignment,
  getGroupStudentIds,
  upsertSubmission,
  gradeSubmission,
  closeAssignment,
} = require('../models/assignmentModel');
const { createNotification } = require('../models/notificationModel');

const MAX_TITLE_LEN = 255;
const MAX_TEXT_LEN = 5000;
const MAX_FEEDBACK_LEN = 2000;
const MAX_POINTS = 1000;
const MAX_ATTACH_BYTES = 8 * 1024 * 1024;      // 8MB — a photo of a build, not a video

// Same uploads folder and relative-URL convention as groupPhotoController, so
// attachments are served by the existing /uploads static route.
const uploadsRoot = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');

// A link field that accepts any 5000-character string is not a link field.
// Only http(s) is allowed — javascript: and data: URLs must never make it into
// something a teacher will click.
const cleanUrl = (raw) => {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  let u;
  try { u = new URL(s); } catch (_) { return undefined; }   // undefined = invalid
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return undefined;
  return u.toString().slice(0, MAX_TEXT_LEN);
};

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
      if (!Number.isInteger(p) || p < 1 || p > MAX_POINTS) {
        return res.status(400).json({ message: `Points must be between 1 and ${MAX_POINTS}` });
      }
      pts = p;
    }

    const linkUrl = cleanUrl(link_url);
    if (linkUrl === undefined) {
      return res.status(400).json({ message: 'Reference link must be a valid http(s) URL' });
    }

    const assignment = await createAssignment({
      group_id: groupId,
      teacher_id: req.user.id,
      title: String(title).trim().slice(0, MAX_TITLE_LEN),
      instructions: instructions ? String(instructions).slice(0, MAX_TEXT_LEN) : null,
      link_url: linkUrl,
      due_at: dueAt,
      points: pts,
    });

    // Tell the students. The form promises "students will see it the moment you
    // create it", but nothing was ever sent — they only found out by opening the
    // Assignments tab and looking. A failure here must not fail the assignment
    // itself, so it is logged and swallowed.
    try {
      const studentIds = await getGroupStudentIds(groupId);
      const due = dueAt ? ` Due ${new Date(dueAt).toLocaleDateString()}.` : '';
      await Promise.all(studentIds.map((sid) => createNotification({
        user_id: sid,
        user_role: 'student',
        type: 'assignment',
        title: `New assignment: ${assignment.title}`,
        body: `${assignment.group_name || 'Your class'} · ${pts} points.${due}`,
        reference_id: assignment.id,
        reference_type: 'assignment',
      })));
    } catch (notifyError) {
      console.error('Assignment notify error:', notifyError.message);
    }

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

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const allowed = await teacherOwnsGroup(req.user.id, assignment.group_id);
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Grade against THIS assignment's points, not a fixed 100. The old ceiling
    // meant an assignment set at 500 points could never be marked above 100 —
    // the field was shown to the teacher but did nothing.
    const max = Number.isInteger(assignment.points) ? assignment.points : 100;
    const g = parseInt(grade, 10);
    if (!Number.isInteger(g) || g < 0 || g > max) {
      return res.status(400).json({ message: `Grade must be a number between 0 and ${max}` });
    }

    const fb = feedback ? String(feedback).slice(0, MAX_FEEDBACK_LEN) : null;
    const submission = await gradeSubmission(assignmentId, studentId, g, fb);
    if (!submission) {
      return res.status(404).json({ message: 'This student has not submitted yet' });
    }

    // Being graded is the thing a student is actually waiting for, so it is
    // worth a notification even more than the assignment itself.
    try {
      await createNotification({
        user_id: studentId,
        user_role: 'student',
        type: 'assignment',
        title: `Graded: ${assignment.title}`,
        body: `${g} / ${max}${fb ? ` — ${fb.slice(0, 140)}` : ''}`,
        reference_id: assignmentId,
        reference_type: 'assignment',
      });
    } catch (notifyError) {
      console.error('Grade notify error:', notifyError.message);
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
    const { body, link_url, attachment_url, attachment_name } = req.body;

    if (!Number.isInteger(assignmentId)) {
      return res.status(400).json({ message: 'Invalid assignment id' });
    }

    const hasBody = body && String(body).trim();
    const linkUrl = cleanUrl(link_url);
    if (linkUrl === undefined) {
      return res.status(400).json({ message: 'Your link must be a valid http(s) URL' });
    }
    const attach = attachment_url ? String(attachment_url).trim() : null;
    // An attachment URL is only ever one we issued from /uploads.
    if (attach && !attach.startsWith('/uploads/')) {
      return res.status(400).json({ message: 'Invalid attachment' });
    }
    if (!hasBody && !linkUrl && !attach) {
      return res.status(400).json({ message: 'Add your answer, a link or a file before submitting' });
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

    // The due date used to be decorative — stored, sorted by, displayed, and
    // never checked. Late work is still ACCEPTED (a teacher wants to see it),
    // but it is now recorded as late instead of passing as on time.
    const isLate = !!(assignment.due_at && Date.now() > new Date(assignment.due_at).getTime());

    const submission = await upsertSubmission({
      assignment_id: assignmentId,
      student_id: req.user.id,
      body: hasBody ? String(body).slice(0, MAX_TEXT_LEN) : null,
      link_url: linkUrl,
      attachment_url: attach,
      attachment_name: attachment_name ? String(attachment_name).slice(0, 255) : null,
      is_late: isLate,
    });

    res.status(201).json({ submission });
  } catch (error) {
    console.error('Submit assignment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/assignments/:id/attachment  (raw body, Content-Type = the file's)
//
// Same shape as uploadGroupProfilePicture: the bytes arrive as the request body
// and come back as a relative /uploads/ URL, which the student then sends with
// their submission. Storing the relative path (not an absolute one) is
// deliberate — an absolute URL bakes in whatever host the uploader happened to
// reach the server on, which broke images for everyone else.
const uploadSubmissionAttachment = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    if (!Number.isInteger(assignmentId)) {
      return res.status(400).json({ message: 'Invalid assignment id' });
    }
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'File body is required' });
    }
    if (req.body.length > MAX_ATTACH_BYTES) {
      return res.status(413).json({
        message: `File is too large (max ${MAX_ATTACH_BYTES / 1024 / 1024}MB)`,
      });
    }

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.status === 'closed') {
      return res.status(403).json({ message: 'This assignment is closed' });
    }
    const allowed = await studentInGroup(req.user.id, assignment.group_id);
    if (!allowed) {
      return res.status(403).json({ message: 'This assignment is not for your group' });
    }

    // Extension comes from the declared type, never from a client-supplied
    // filename — a name is attacker-controlled and must not decide what lands
    // on disk.
    const ct = String(req.get('content-type') || '').toLowerCase();
    const ext = ct.includes('png') ? 'png'
      : ct.includes('webp') ? 'webp'
        : ct.includes('gif') ? 'gif'
          : ct.includes('pdf') ? 'pdf'
            : ct.includes('zip') ? 'zip'
              : ct.includes('text/plain') ? 'txt'
                : ct.includes('jpeg') || ct.includes('jpg') ? 'jpg'
                  : null;
    if (!ext) {
      return res.status(415).json({ message: 'Only images, PDF, ZIP or text files are accepted' });
    }

    fs.mkdirSync(uploadsRoot, { recursive: true });
    const filename = `asn-${assignmentId}-${req.user.id}-${Date.now()}-`
      + `${crypto.randomBytes(4).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(uploadsRoot, filename), req.body);

    res.status(201).json({ url: `/uploads/${filename}`, name: filename });
  } catch (error) {
    console.error('Upload attachment error:', error.message);
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
  uploadSubmissionAttachment,
};
