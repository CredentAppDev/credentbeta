/**
 * One-shot importer that registers three on-disk curriculum projects into the
 * Credent learning_projects DB, splits each lesson plan markdown into roadmap
 * days + content chunks, and attaches the corresponding .py source as both
 * an asset and a content chunk (so Emrys can quote real lines from it).
 *
 * Run once from the backend folder:
 *   node scripts/import-hand-gesture-projects.js
 *
 * Idempotent — re-running deletes existing rows for the same titles and
 * re-imports. Safe to run after lesson plans are edited on disk.
 *
 * Assignments per the user request:
 *   Snake (hand_gesture_snake)         → Class 6
 *   Name Writer (hand_gesture_name_writer) → Class 5
 *   Arcade (hand_gesture_arcade)       → JHS 1
 *   Calculator (python_calculator)     → Class 4
 *
 * Class-name strings here are stored verbatim into learning_projects.class_name
 * AND used by the teacher visibility filter, so they must match what's on the
 * student_groups.class_name rows in the future. We use the exact labels the
 * user dictated ("Class 6", "Class 5", "JHS 1", "Class 4"), normalized to title-case.
 */

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

const PROJECTS_ROOT = path.join(__dirname, '..', '..');

const PROJECTS = [
  {
    folder: 'hand_gesture_snake',
    title: 'Hand Gesture Snake',
    grade: 'Class 6',
    class_name: 'Class 6',
    source_doc_name: 'Snake_Project_Lessons.md',
    lessons_file: 'Snake_Project_Lessons.md',
    py_file: 'snake.py',
    materials: ['Laptop/PC with Python 3.11 installed', 'Project folder: hand_gesture_snake', 'Webcam'],
    description: 'Classic Snake game controlled by hand movement in front of the camera. Students learn Python basics, OpenCV drawing, MediaPipe hand tracking, and the main game loop pattern.',
  },
  {
    folder: 'hand_gesture_name_writer',
    title: 'Hand Gesture Name Writer',
    grade: 'Class 5',
    class_name: 'Class 5',
    source_doc_name: 'Name_Writer_Project_Lessons.md',
    lessons_file: 'Name_Writer_Project_Lessons.md',
    py_file: 'name_writer.py',
    materials: ['Laptop/PC with Python 3.11 installed', 'Project folder: hand_gesture_name_writer', 'Webcam'],
    description: 'Air-writing app — students draw their name with a fingertip in front of the camera. Covers MediaPipe landmarks, pen-down/pen-up detection, drawing onto a canvas, and basic UI.',
  },
  {
    folder: 'hand_gesture_arcade',
    title: 'Hand Gesture Arcade',
    grade: 'JHS 1',
    class_name: 'JHS 1',
    source_doc_name: 'Arcade_Project_Lessons.md',
    lessons_file: 'Arcade_Project_Lessons.md',
    py_file: 'gesture_arcade.py',
    materials: ['Laptop/PC with Python 3.11 installed', 'Project folder: hand_gesture_arcade', 'Webcam'],
    description: 'A small arcade game collection driven by hand gestures. Covers Python, OpenCV, MediaPipe, scene management, simple physics, scoring, and the game-loop pattern.',
  },
  {
    folder: 'python_calculator',
    title: 'Python Calculator',
    grade: 'Class 4',
    class_name: 'Class 4',
    source_doc_name: 'Calculator_Project_Lessons.md',
    lessons_file: 'Calculator_Project_Lessons.md',
    py_file: 'calculator.py',
    materials: ['Laptop/PC with Python 3.6+ installed', 'Project folder: python_calculator'],
    description: 'A terminal-based calculator built step by step. Students learn Python fundamentals — variables, input, float conversion, the four operations, if statements, functions, lists, f-strings, loops, break, and rounding — and finish with a working app that does maths and keeps a history of every calculation.',
  },
];

/**
 * Split lesson markdown into ordered sections.
 *
 * The MD files follow a consistent shape: a preamble (intro / "How to use" /
 * "Project picture"), then repeating `## Lesson N: Title` blocks until end.
 * We treat each `## Lesson N: ...` as one roadmap day. The preamble becomes
 * Day 0-style "intro" content chunk (NOT a roadmap day, since it isn't a
 * teaching session — it's reference framing).
 *
 * Returns: { preamble: string|null, lessons: Array<{number, title, body}> }
 */
function parseLessonMarkdown(text) {
  const lines = text.split(/\r?\n/);
  const lessons = [];
  let preambleLines = [];
  let current = null;

  // Match "## Lesson N: Title" (case-insensitive, allow extra spaces).
  const headingRe = /^##\s+Lesson\s+(\d+)\s*[:.\-]\s*(.+?)\s*$/i;

  for (const line of lines) {
    const m = line.match(headingRe);
    if (m) {
      // Push previous lesson, if any.
      if (current) lessons.push(current);
      current = {
        number: Number(m[1]),
        title: m[2].trim(),
        bodyLines: [],
      };
      continue;
    }
    if (current) {
      current.bodyLines.push(line);
    } else {
      preambleLines.push(line);
    }
  }
  if (current) lessons.push(current);

  return {
    preamble: preambleLines.join('\n').trim() || null,
    lessons: lessons.map((l) => ({
      number: l.number,
      title: l.title,
      body: l.bodyLines.join('\n').trim(),
    })),
  };
}

/** Short summary line used for roadmap day `teacher_goal` / `student_goal`. */
function firstNonEmptyParagraph(body) {
  const block = body.split(/\n\s*\n/).map((s) => s.trim()).find((s) => s && !s.startsWith('```'));
  if (!block) return null;
  return block.replace(/\s+/g, ' ').slice(0, 280);
}

async function importOne(project) {
  const projectDir = path.join(PROJECTS_ROOT, project.folder);
  const lessonsPath = path.join(projectDir, project.lessons_file);
  const pyPath = path.join(projectDir, project.py_file);

  if (!fs.existsSync(lessonsPath)) throw new Error(`Lessons file not found: ${lessonsPath}`);
  if (!fs.existsSync(pyPath))      throw new Error(`Python source not found: ${pyPath}`);

  const lessonText = fs.readFileSync(lessonsPath, 'utf8');
  const pyText = fs.readFileSync(pyPath, 'utf8');
  const { preamble, lessons } = parseLessonMarkdown(lessonText);

  if (!lessons.length) {
    throw new Error(`No "## Lesson N: ..." sections found in ${lessonsPath}`);
  }

  console.log(`\n── ${project.title} ──`);
  console.log(`  Folder:  ${project.folder}`);
  console.log(`  Class:   ${project.class_name} (${project.grade})`);
  console.log(`  Lessons: ${lessons.length}`);
  console.log(`  Source:  ${project.py_file} (${pyText.length} chars)`);

  // Wipe any previous version of this project to make the script idempotent.
  // The CASCADE on FKs handles content_chunks, roadmap_days, assets.
  await pool.query(`DELETE FROM learning_projects WHERE title = $1`, [project.title]);

  // Insert the project. Use the user's agent (id=1) as creator.
  const insertProject = await pool.query(
    `INSERT INTO learning_projects (
       title, subject, grade, class_name, description, learning_goals,
       difficulty_level, duration_months, expected_section_count,
       audience_scope, teacher_readiness_required, code_explanation_required,
       source_doc_name, is_active, created_by_role, created_by_id
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,true,$14,$15)
     RETURNING id`,
    [
      project.title,
      'Computer Science',
      project.grade,
      project.class_name,
      project.description,
      'Build the project end-to-end, understand each piece of code, and explain the game loop in their own words.',
      'beginner',
      Math.max(1, Math.ceil(lessons.length / 4)),  // 1 month per ~4 lessons
      lessons.length,
      'student_teacher',
      false,
      true,
      project.source_doc_name,
      'agent',
      1,
    ]
  );
  const projectId = insertProject.rows[0].id;
  console.log(`  → project id=${projectId}`);

  // Content chunk: preamble (overview / framing)
  if (preamble) {
    await pool.query(
      `INSERT INTO learning_content_chunks (project_id, title, content, step_number, source_type, audience, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [projectId, 'Overview', preamble, 0, 'lesson', 'both', ['overview', 'intro']]
    );
  }

  // Content chunk: full .py source — Emrys quotes real lines from this when
  // teaching. Tagged 'code' so retrieval can prefer it on code questions.
  await pool.query(
    `INSERT INTO learning_content_chunks (project_id, title, content, step_number, source_type, audience, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      projectId,
      `${project.py_file} (full source)`,
      '```python\n' + pyText + '\n```',
      9999, // sort to the end of the syllabus TOC
      'code',
      'both',
      ['code', 'source'],
    ]
  );

  // Content chunks + roadmap days: one per lesson
  for (const lesson of lessons) {
    const summary = firstNonEmptyParagraph(lesson.body) || lesson.title;

    await pool.query(
      `INSERT INTO learning_content_chunks (project_id, title, content, step_number, source_type, audience, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        projectId,
        `Lesson ${lesson.number}: ${lesson.title}`,
        lesson.body,
        lesson.number,
        'lesson',
        'both',
        ['lesson', 'day-' + lesson.number],
      ]
    );

    await pool.query(
      `INSERT INTO learning_project_roadmap_days (
         project_id, day_number, month_number, week_number, section_number,
         section_label, title, teacher_goal, student_goal,
         activities, materials, code_explanation_focus, end_of_day_checklist,
         teacher_report_prompts, next_day_prep, is_active
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true)`,
      [
        projectId,
        lesson.number,
        Math.ceil(lesson.number / 4),  // ~4 lessons per month
        ((lesson.number - 1) % 4) + 1,
        lesson.number,
        `Lesson ${lesson.number}`,
        lesson.title,
        summary,
        summary,
        JSON.stringify([]),
        JSON.stringify(project.materials),
        // code_explanation_focus: nudges Emrys to quote the actual source for this day's idea.
        `Connect today's idea to the lines in ${project.py_file} that implement it. Quote the real lines from the project's source code chunk.`,
        JSON.stringify(['Each student can explain the new idea in their own words', 'Each student ran the code at least once']),
        JSON.stringify(['What did the students struggle with?', 'Did anyone need extra time on setup?', 'What did they understand most clearly?']),
        lessons[lesson.number]
          ? `Tomorrow: ${lessons[lesson.number].title}`
          : 'Wrap-up and review.',
      ]
    );
  }

  // Asset record for the python file (relative path so any client can resolve).
  await pool.query(
    `INSERT INTO learning_project_assets (project_id, title, file_name, file_path, asset_type, mime_type, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,true)`,
    [
      projectId,
      `${project.title} — source code`,
      project.py_file,
      `/projects/${project.folder}/${project.py_file}`,
      'code',
      'text/x-python',
    ]
  );

  console.log(`  → ${lessons.length} content chunks + roadmap days inserted`);
  console.log(`  → asset registered: ${project.py_file}`);
}

(async () => {
  try {
    for (const p of PROJECTS) {
      await importOne(p);
    }
    console.log('\n✓ All four projects imported. Restart the backend so Emrys picks them up.');
  } catch (e) {
    console.error('\n✗ Import failed:', e.message || e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
