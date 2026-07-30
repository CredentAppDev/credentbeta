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
  getSubmissionFor,
  getGroupStudentIds,
  upsertSubmission,
  gradeSubmission,
  closeAssignment,
  saveAiMark,
  getAiMarkedForTeacher,
  markTeacherReviewed,
} = require('../models/assignmentModel');
const { createNotification } = require('../models/notificationModel');
const { markSubmission, formatFeedback } = require('../services/emrysMarkingService');
const {
  getLearningProjectById,
  getLearningRoadmapDay,
  getLearningRoadmapDays,
  getLearningContentChunks,
} = require('../models/learningModel');
const {
  findRelevantChunks,
  buildControlledAnswer,
} = require('../services/controlledAiTutorService');

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

// Extension from the DECLARED content type, never from a client-supplied
// filename — a name is attacker-controlled and must not decide what lands on
// disk. Shared by the student-submission and teacher-assignment uploads so the
// two can never drift into accepting different things.
const extFromContentType = (raw) => {
  const ct = String(raw || '').toLowerCase();
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('gif')) return 'gif';
  if (ct.includes('pdf')) return 'pdf';
  if (ct.includes('zip')) return 'zip';
  if (ct.includes('text/plain')) return 'txt';
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  return null;
};
const ACCEPTED_TYPES_MESSAGE = 'Only images (PNG, JPEG, WebP, GIF), PDF, ZIP or text files are accepted';

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
    const { group_id, title, instructions, link_url, due_at, points,
      project_id, roadmap_day, kind, starter_code, rubric, auto_mark } = req.body;
    const groupId = parseInt(group_id, 10);

    // An exercise is an assignment with a different kind — same submissions,
    // same grading, same course link. Only the authoring and the marking differ.
    const itemKind = kind === 'exercise' ? 'exercise' : 'assignment';

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

    // Optional course link. Validated rather than trusted: a project_id that
    // does not exist, or a day that is not in that project's roadmap, would
    // give Emrys confidently wrong context — worse than no context at all.
    let projectId = null;
    let roadmapDay = null;
    if (project_id !== undefined && project_id !== null && project_id !== '') {
      const pid = parseInt(project_id, 10);
      if (!Number.isInteger(pid)) {
        return res.status(400).json({ message: 'project_id must be a number' });
      }
      const project = await getLearningProjectById(pid);
      if (!project) {
        return res.status(400).json({ message: 'That project does not exist' });
      }
      projectId = pid;

      if (roadmap_day !== undefined && roadmap_day !== null && roadmap_day !== '') {
        const d = parseInt(roadmap_day, 10);
        if (!Number.isInteger(d) || d < 1) {
          return res.status(400).json({ message: 'roadmap_day must be a positive number' });
        }
        const day = await getLearningRoadmapDay(pid, d);
        if (!day) {
          return res.status(400).json({ message: `Day ${d} is not in that project's roadmap` });
        }
        roadmapDay = d;
      }
    } else if (roadmap_day !== undefined && roadmap_day !== null && roadmap_day !== '') {
      // A day without a project points at nothing.
      return res.status(400).json({ message: 'Pick a project before choosing a roadmap day' });
    }

    const assignment = await createAssignment({
      group_id: groupId,
      teacher_id: req.user.id,
      title: String(title).trim().slice(0, MAX_TITLE_LEN),
      instructions: instructions ? String(instructions).slice(0, MAX_TEXT_LEN) : null,
      link_url: linkUrl,
      due_at: dueAt,
      points: pts,
      project_id: projectId,
      roadmap_day: roadmapDay,
      kind: itemKind,
      starter_code: starter_code ? String(starter_code).slice(0, MAX_TEXT_LEN) : null,
      rubric: rubric ? String(rubric).slice(0, MAX_TEXT_LEN) : null,
      // Exercises are marked by Emrys unless the teacher turns it off; plain
      // assignments only when the teacher asks for it.
      auto_mark: auto_mark === undefined ? (itemKind === 'exercise') : Boolean(auto_mark),
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

    // Answer the student immediately. Marking is a model call with real
    // thinking behind it and can take many seconds — holding the response for
    // it would make submitting feel broken, and a failure to mark would then
    // read as a failure to submit. The work is already safely stored.
    res.status(201).json({ submission });

    if (assignment.auto_mark) {
      // Detached on purpose: nothing after this point may affect the response.
      // If it throws, or the process restarts mid-mark, the submission simply
      // stays unmarked and waits for the teacher — which is the safe outcome.
      markSubmissionInBackground({ assignment, submission, studentId: req.user.id })
        .catch((e) => console.error('[emrysMarking] background mark failed:', e.message));
    }
  } catch (error) {
    console.error('Submit assignment error:', error.message);
    // The response may already have been sent before marking was scheduled.
    if (!res.headersSent) res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Mark a submission after the fact and store the result.
 *
 * Writes to ai_score / ai_feedback only. The teacher's `grade` is never
 * touched, so the record always distinguishes what Emrys proposed from what a
 * teacher decided.
 */
const markSubmissionInBackground = async ({ assignment, submission, studentId }) => {
  let student = null;
  try {
    const r = await pool.query('SELECT name FROM students WHERE id = $1', [studentId]);
    student = r.rows[0] || null;
  } catch (_) { /* the name is a nicety; mark without it */ }

  const mark = await markSubmission({ assignment, submission, student });
  if (!mark) return;   // unavailable or unparseable — leave it for the teacher

  await saveAiMark(submission.id, {
    score: mark.score,
    feedback: formatFeedback(mark),
  });
  console.log(
    `[emrysMarking] ${assignment.kind || 'assignment'} ${assignment.id} / submission ${submission.id}` +
    ` → ${mark.score}/${assignment.points || 100} (confidence ${mark.confidence})`
  );
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
    const ext = extFromContentType(req.get('content-type'));
    if (!ext) {
      return res.status(415).json({ message: ACCEPTED_TYPES_MESSAGE });
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

// ── Teacher attaches a brief / worksheet / photo to the assignment ──────────
//
// The mirror of uploadSubmissionAttachment: same size cap, same type allowlist,
// same "extension from declared type" rule — but gated on teacherOwnsGroup and
// written onto the assignment rather than a submission, so every student in the
// class sees it alongside the instructions.
const uploadAssignmentAttachment = async (req, res) => {
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

    const allowed = await teacherOwnsGroup(req.user.id, assignment.group_id);
    if (!allowed) return res.status(403).json({ message: 'Access denied' });

    const ext = extFromContentType(req.get('content-type'));
    if (!ext) return res.status(415).json({ message: ACCEPTED_TYPES_MESSAGE });

    fs.mkdirSync(uploadsRoot, { recursive: true });
    const filename = `asnbrief-${assignmentId}-${Date.now()}-`
      + `${crypto.randomBytes(4).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(uploadsRoot, filename), req.body);

    const url = `/uploads/${filename}`;
    const label = String(req.get('x-file-name') || `attachment.${ext}`).slice(0, 200);
    const updated = await setAssignmentAttachment(assignmentId, url, label);

    res.status(201).json({ assignment: updated, attachment_url: url, attachment_name: label });
  } catch (error) {
    console.error('Assignment attachment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Ask Emrys for help with an assignment ───────────────────────────────────
//
// This is the whole point of linking an assignment to a project and a day.
// Emrys receives the assignment itself, the lesson material it was set on, the
// course roadmap with that day marked, and the student's own draft — so it can
// coach against the right material instead of guessing from the title.
//
// It cannot do the homework: HOMEWORK_COACHING_POLICY is in the student system
// prompt, and the framing below tells it plainly that this is an assignment.
const helpWithAssignmentHandler = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const question = String(req.body.question || '').trim();
    if (!Number.isInteger(assignmentId)) {
      return res.status(400).json({ message: 'Invalid assignment id' });
    }
    if (!question) {
      return res.status(400).json({ message: 'Ask Emrys something about the assignment' });
    }

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    const allowed = await studentInGroup(req.user.id, assignment.group_id);
    if (!allowed) {
      return res.status(403).json({ message: 'This assignment is not for your group' });
    }

    // The course context, when the teacher linked one.
    let project = null;
    let allChunks = [];
    let days = [];
    let day = null;
    if (assignment.project_id) {
      project = await getLearningProjectById(assignment.project_id);
      if (project) {
        allChunks = await getLearningContentChunks(project.id, 'student');
        days = await getLearningRoadmapDays(project.id);
        if (assignment.roadmap_day) {
          day = await getLearningRoadmapDay(project.id, assignment.roadmap_day);
        }
      }
    }

    // Retrieve against the assignment AND the question together — the title
    // and instructions say what the work is about, which is often more
    // informative than a short question like "I'm stuck".
    const retrievalQuery = [
      assignment.title,
      assignment.instructions,
      assignment.rubric,
      day ? day.title : '',
      question,
    ].filter(Boolean).join(' ');
    const chunks = findRelevantChunks(allChunks, retrievalQuery, 8);

    const submission = await getSubmissionFor(assignmentId, req.user.id);

    const briefing = [
      assignment.kind === 'exercise'
        ? 'THE STUDENT IS ASKING FOR HELP WITH A SET EXERCISE. Coach, do not complete it.'
        : 'THE STUDENT IS ASKING FOR HELP WITH A SET ASSIGNMENT. Coach, do not complete it.',
      `${assignment.kind === 'exercise' ? 'Exercise' : 'Assignment'}: "${assignment.title}"`,
      assignment.instructions ? `What the teacher asked for: ${assignment.instructions}` : '',
      assignment.due_at ? `Due: ${new Date(assignment.due_at).toDateString()}` : '',
      // The starter code is the shape of the task. Without it Emrys guesses at
      // what the student is even looking at.
      assignment.starter_code
        ? `The student started from this code — help them build ON it, do not replace it:
---
${String(assignment.starter_code).slice(0, 2000)}
---`
        : '',
      // The rubric steers the coaching, but reciting it would hand over a
      // checklist that IS the answer for a small exercise.
      assignment.rubric
        ? `The teacher will mark this against: ${assignment.rubric}
Use that to decide what to steer them towards. Do NOT read the rubric out to them or turn it into a to-do list.`
        : '',
      day ? `This assignment belongs to Day ${day.day_number}${day.title ? ` — ${day.title}` : ''} of the course.` : '',
      submission && (submission.body || submission.link_url)
        ? `The student's own work so far (respond to THIS — say what is right, name the one thing to fix first, and do not rewrite it):\n---\n${String(submission.body || submission.link_url).slice(0, 4000)}\n---`
        : 'The student has not submitted anything yet, so there is no draft to react to. Help them find the first step themselves.',
      `Their question: ${question}`,
    ].filter(Boolean).join('\n');

    const answer = await buildControlledAnswer({
      project,
      question: briefing,
      chunks,
      allChunks,
      audience: 'student',
      readiness: null,
      conversationHistory: [],
      progressEvidence: { dailyReports: [], groupUpdates: [] },
      days,
    });

    res.status(200).json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        project_id: assignment.project_id,
        roadmap_day: assignment.roadmap_day,
        linked: Boolean(project),
      },
      answer,
    });
  } catch (error) {
    console.error('Assignment help error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// ── Emrys marking review (teacher) ────────────────────────────────
// Everything Emrys has marked that the teacher has not yet looked at. This is
// the queue the "Marked by Emrys" tab reads: the mark is a proposal, and it
// stays invisible to the student until the teacher has been through it.
const listAiMarkedHandler = async (req, res) => {
  try {
    const includeReviewed = String(req.query.include_reviewed || '') === 'true';
    const rows = await getAiMarkedForTeacher(req.user.id, { includeReviewed });
    res.status(200).json({
      submissions: rows,
      pending: rows.filter((r) => !r.teacher_reviewed).length,
    });
  } catch (error) {
    console.error('List AI-marked submissions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * The teacher signs off on a mark.
 *
 * Two ways through:
 *   accept          — take Emrys's score and feedback as the real grade
 *   override        — the teacher supplies their own grade/feedback
 *
 * Either way the submission is flagged reviewed, which is also what releases
 * Emrys's feedback to the student. Nothing reaches a student on the model's
 * say-so alone.
 */
const reviewAiMarkHandler = async (req, res) => {
  try {
    const submissionId = parseInt(req.params.submissionId, 10);
    if (!Number.isInteger(submissionId)) {
      return res.status(400).json({ message: 'Invalid submission id' });
    }

    // Ownership: the submission must belong to an assignment this teacher set.
    const owned = await pool.query(
      `SELECT s.id, s.ai_score, s.ai_feedback, a.points, a.teacher_id
         FROM assignment_submissions s
         JOIN assignments a ON a.id = s.assignment_id
        WHERE s.id = $1`,
      [submissionId]
    );
    const row = owned.rows[0];
    if (!row) return res.status(404).json({ message: 'Submission not found' });
    if (row.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'That submission is not yours to review' });
    }

    const { accept, grade, feedback } = req.body || {};
    let finalGrade = null;
    let finalFeedback = null;

    if (accept) {
      finalGrade = row.ai_score;
      finalFeedback = row.ai_feedback;
    } else if (grade !== undefined && grade !== null && grade !== '') {
      const g = parseInt(grade, 10);
      const max = Number.isFinite(Number(row.points)) ? Number(row.points) : 100;
      if (!Number.isInteger(g) || g < 0 || g > max) {
        return res.status(400).json({ message: `Grade must be between 0 and ${max}` });
      }
      finalGrade = g;
      finalFeedback = feedback ? String(feedback).slice(0, MAX_FEEDBACK_LEN) : null;
    }

    // A grade is only written when the teacher actually gave one. Marking a
    // submission "reviewed" with no grade is legitimate — it means the teacher
    // has seen Emrys's mark and wants to grade it properly later.
    if (finalGrade !== null) {
      await gradeSubmission(submissionId, { grade: finalGrade, feedback: finalFeedback });
    }
    const updated = await markTeacherReviewed(submissionId);

    res.status(200).json({ submission: updated, graded: finalGrade !== null });
  } catch (error) {
    console.error('Review AI mark error:', error.message);
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
  uploadAssignmentAttachment,
  helpWithAssignmentHandler,
  listAiMarkedHandler,
  reviewAiMarkHandler,
};
