const pool = require('../config/db');

// ── Table Creation ────────────────────────────────────────────────
// Idempotent, mirrors createSchoolTables() in schoolModel.js. Called once
// on boot from server.js. Assignments belong to a student_group and are
// authored by a teacher; each student in the group can hand in ONE
// submission per assignment (UNIQUE(assignment_id, student_id)), which the
// teacher then grades.
const createAssignmentTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      group_id INTEGER NOT NULL REFERENCES student_groups(id) ON DELETE CASCADE,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      instructions TEXT,
      link_url TEXT,
      due_at TIMESTAMP,
      points INTEGER DEFAULT 100,
      status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('open', 'closed')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_assignments_group ON assignments(group_id)`);
  console.log('✅ Assignments table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      body TEXT,
      link_url TEXT,
      status VARCHAR(20) DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'graded')),
      grade INTEGER CHECK (grade >= 0 AND grade <= 100),
      feedback TEXT,
      submitted_at TIMESTAMP DEFAULT NOW(),
      graded_at TIMESTAMP,
      UNIQUE(assignment_id, student_id)
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions(assignment_id)`);

  // ── Migrations for databases created before these columns existed ────────
  // CREATE TABLE IF NOT EXISTS does nothing to a table that already exists, so
  // every column added after the first deploy needs its own ADD COLUMN.
  await pool.query(`
    ALTER TABLE assignment_submissions
      ADD COLUMN IF NOT EXISTS is_late         BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS attachment_url  TEXT,
      ADD COLUMN IF NOT EXISTS attachment_name TEXT,
      ADD COLUMN IF NOT EXISTS prev_grade      INTEGER,
      ADD COLUMN IF NOT EXISTS prev_feedback   TEXT,
      ADD COLUMN IF NOT EXISTS resubmit_count  INTEGER DEFAULT 0
  `);

  // The grade ceiling was hard-wired to 100 while an assignment could be worth
  // up to 1000 points — so a teacher could set "500 points" and then be unable
  // to award more than 100. The column now allows the full points range and the
  // controller checks each grade against ITS OWN assignment's points.
  await pool.query(`
    ALTER TABLE assignment_submissions
      DROP CONSTRAINT IF EXISTS assignment_submissions_grade_check
  `);
  await pool.query(`
    ALTER TABLE assignment_submissions
      ADD CONSTRAINT assignment_submissions_grade_check
      CHECK (grade IS NULL OR (grade >= 0 AND grade <= 1000))
  `);
  console.log('✅ Assignment submissions table ready');
};

// ── Assignment Functions ──────────────────────────────────────────
const createAssignment = async (data) => {
  const result = await pool.query(
    `INSERT INTO assignments
       (group_id, teacher_id, title, instructions, link_url, due_at, points)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.group_id,
      data.teacher_id || null,
      data.title,
      data.instructions || null,
      data.link_url || null,
      data.due_at || null,
      Number.isInteger(data.points) ? data.points : 100,
    ]
  );
  return result.rows[0];
};

const getAssignmentById = async (id) => {
  const result = await pool.query(
    `SELECT a.*, sg.name AS group_name, sg.school_id
     FROM assignments a
     JOIN student_groups sg ON sg.id = a.group_id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

// All assignments for one group, newest first, with submission progress
// counts so the teacher list can show "3/5 submitted · 2 graded".
const getGroupAssignments = async (groupId) => {
  const result = await pool.query(
    `SELECT a.*,
            t.full_name AS teacher_name,
            (SELECT COUNT(*) FROM group_members gm
               JOIN students s ON s.id = gm.student_id AND s.is_active = true
              WHERE gm.group_id = a.group_id) AS member_count,
            (SELECT COUNT(*) FROM assignment_submissions sub
              WHERE sub.assignment_id = a.id) AS submitted_count,
            (SELECT COUNT(*) FROM assignment_submissions sub
              WHERE sub.assignment_id = a.id AND sub.status = 'graded') AS graded_count
     FROM assignments a
     LEFT JOIN teachers t ON t.id = a.teacher_id
     WHERE a.group_id = $1
     ORDER BY a.created_at DESC`,
    [groupId]
  );
  return result.rows;
};

// Every assignment across the groups this student belongs to (confirmed
// groups only, matching getStudentGroups visibility), with THIS student's
// submission joined in so the UI can show To-do / Submitted / Graded.
const getStudentAssignments = async (studentId) => {
  const result = await pool.query(
    `SELECT a.*,
            sg.name AS group_name,
            sub.id        AS submission_id,
            sub.body      AS submission_body,
            sub.link_url  AS submission_link_url,
            sub.status    AS submission_status,
            sub.grade     AS submission_grade,
            sub.feedback  AS submission_feedback,
            sub.submitted_at AS submission_submitted_at,
            sub.graded_at    AS submission_graded_at,
            sub.is_late         AS submission_is_late,
            sub.attachment_url  AS submission_attachment_url,
            sub.attachment_name AS submission_attachment_name,
            sub.prev_grade      AS submission_prev_grade,
            sub.resubmit_count  AS submission_resubmit_count
     FROM assignments a
     JOIN student_groups sg ON sg.id = a.group_id AND sg.is_confirmed = true
     JOIN group_members gm ON gm.group_id = a.group_id AND gm.student_id = $1
     JOIN students s ON s.id = gm.student_id AND s.school_id = sg.school_id
     LEFT JOIN assignment_submissions sub
            ON sub.assignment_id = a.id AND sub.student_id = $1
     WHERE s.id = $1
     ORDER BY
       CASE WHEN a.due_at IS NULL THEN 1 ELSE 0 END,
       a.due_at ASC,
       a.created_at DESC`,
    [studentId]
  );
  return result.rows;
};

// Full group roster LEFT JOINed to submissions, so students who have not yet
// handed in still appear (submission_id NULL). Powers the teacher grading view.
const getSubmissionsForAssignment = async (assignmentId) => {
  const result = await pool.query(
    `SELECT s.id            AS student_id,
            s.student_id    AS student_code,
            s.full_name,
            s.profile_picture_url,
            sub.id          AS submission_id,
            sub.body,
            sub.link_url,
            sub.status,
            sub.grade,
            sub.feedback,
            sub.submitted_at,
            sub.graded_at,
            sub.is_late,
            sub.attachment_url,
            sub.attachment_name,
            sub.prev_grade,
            sub.prev_feedback,
            sub.resubmit_count
     FROM assignments a
     JOIN group_members gm ON gm.group_id = a.group_id
     JOIN students s ON s.id = gm.student_id AND s.is_active = true
     LEFT JOIN assignment_submissions sub
            ON sub.assignment_id = a.id AND sub.student_id = s.id
     WHERE a.id = $1
     ORDER BY s.full_name ASC`,
    [assignmentId]
  );
  return result.rows;
};

// Student hands in (or re-hands-in) their work.
//
// A resubmission still needs re-grading, so the live grade is cleared — but the
// teacher's marks are now PRESERVED in prev_grade/prev_feedback instead of being
// deleted. Previously a student could resubmit after grading and silently
// destroy written feedback with no history and no warning to the teacher.
//
// `is_late` is stamped here rather than inferred later, because it is a fact
// about the moment of handing in: recomputing it afterwards against a due date
// the teacher may since have changed would give a different answer.
const upsertSubmission = async (data) => {
  const result = await pool.query(
    `INSERT INTO assignment_submissions
       (assignment_id, student_id, body, link_url, attachment_url, attachment_name,
        status, submitted_at, is_late, resubmit_count)
     VALUES ($1, $2, $3, $4, $5, $6, 'submitted', NOW(), $7, 0)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET body = EXCLUDED.body,
                   link_url = EXCLUDED.link_url,
                   -- a resubmission with no new file keeps the old one
                   attachment_url  = COALESCE(EXCLUDED.attachment_url, assignment_submissions.attachment_url),
                   attachment_name = COALESCE(EXCLUDED.attachment_name, assignment_submissions.attachment_name),
                   status = 'submitted',
                   prev_grade = CASE WHEN assignment_submissions.status = 'graded'
                                     THEN assignment_submissions.grade
                                     ELSE assignment_submissions.prev_grade END,
                   prev_feedback = CASE WHEN assignment_submissions.status = 'graded'
                                        THEN assignment_submissions.feedback
                                        ELSE assignment_submissions.prev_feedback END,
                   resubmit_count = assignment_submissions.resubmit_count + 1,
                   grade = NULL,
                   feedback = NULL,
                   graded_at = NULL,
                   submitted_at = NOW(),
                   is_late = EXCLUDED.is_late
     RETURNING *`,
    [
      data.assignment_id, data.student_id,
      data.body || null, data.link_url || null,
      data.attachment_url || null, data.attachment_name || null,
      !!data.is_late,
    ]
  );
  return result.rows[0];
};

const gradeSubmission = async (assignmentId, studentId, grade, feedback) => {
  const result = await pool.query(
    `UPDATE assignment_submissions
     SET grade = $1,
         feedback = $2,
         status = 'graded',
         graded_at = NOW()
     WHERE assignment_id = $3
       AND student_id = $4
     RETURNING *`,
    [grade, feedback || null, assignmentId, studentId]
  );
  return result.rows[0];
};

const closeAssignment = async (id) => {
  const result = await pool.query(
    `UPDATE assignments
     SET status = 'closed', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// Active students in a group — who to tell when an assignment is set.
const getGroupStudentIds = async (groupId) => {
  const result = await pool.query(
    `SELECT gm.student_id
     FROM group_members gm
     JOIN students s ON s.id = gm.student_id AND s.is_active = true
     JOIN student_groups sg ON sg.id = gm.group_id AND s.school_id = sg.school_id
     WHERE gm.group_id = $1`,
    [groupId]
  );
  return result.rows.map((r) => r.student_id);
};

module.exports = {
  createAssignmentTables,
  createAssignment,
  getAssignmentById,
  getGroupAssignments,
  getStudentAssignments,
  getSubmissionsForAssignment,
  getGroupStudentIds,
  upsertSubmission,
  gradeSubmission,
  closeAssignment,
};
