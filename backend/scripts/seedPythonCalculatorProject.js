/**
 * Seeds the "Python Calculator" learning project for Class 4.
 *
 * Source of truth: python_calculator/Calculator_Project_Lessons.md (in the
 * credent 2 repo root). This script PARSES that markdown at seed time so the
 * real lesson content goes into the database — no hand-copied duplication.
 *
 * Each "## Lesson N: Title" becomes:
 *   - one learning_content_chunk (Big Idea + Kid Meaning + Calculator Connection)
 *   - one learning_project_roadmap_day
 *
 * Usage (production):
 *   DATABASE_URL='postgres://...' NODE_ENV=production \
 *     node scripts/seedPythonCalculatorProject.js
 */

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');
const { createSchoolTables } = require('../src/models/schoolModel');
const {
  createLearningTables,
  createLearningProject,
  replaceLearningContentChunks,
  replaceLearningRoadmapDays,
} = require('../src/models/learningModel');

// The lessons doc lives in the repo root: <repo>/python_calculator/...
const LESSONS_PATH =
  process.env.CALCULATOR_LESSONS_PATH
  || path.resolve(__dirname, '../../python_calculator/Calculator_Project_Lessons.md');

// Pull the body text under a "### Heading" within a lesson block (stops at the
// next ### or ##). Strips code fences down to a short inline note so chunks stay
// readable as teaching text rather than raw code dumps.
const sectionText = (block, heading) => {
  const re = new RegExp(`### ${heading}\\s*\\n([\\s\\S]*?)(?=\\n### |\\n## |$)`, 'i');
  const m = block.match(re);
  if (!m) return '';
  return m[1]
    .replace(/```[a-z]*\n([\s\S]*?)```/gi, (full, code) => {
      const oneLine = code.trim().split('\n').join(' ');
      return ` (code: ${oneLine}) `;
    })
    .replace(/\s+/g, ' ')
    .trim();
};

const parseLessons = (md) => {
  // Split on lesson headers, keeping the header line with its block.
  const parts = md.split(/\n(?=## Lesson )/g).filter((p) => /^## Lesson /.test(p));
  return parts.map((block) => {
    const titleMatch = block.match(/^## (Lesson [^\n]+)/);
    const fullTitle = titleMatch ? titleMatch[1].trim() : 'Lesson';
    const numMatch = fullTitle.match(/Lesson\s+(\d+)/i);
    const lessonNum = numMatch ? parseInt(numMatch[1], 10) : 0;

    const bigIdea = sectionText(block, 'Big Idea');
    const kidMeaning = sectionText(block, 'Kid Meaning');
    const calcConnection = sectionText(block, 'Calculator Connection');

    const content = [
      bigIdea && `Big idea: ${bigIdea}`,
      kidMeaning && `In kid words: ${kidMeaning}`,
      calcConnection && `How it connects to the calculator: ${calcConnection}`,
    ].filter(Boolean).join(' ');

    return {
      lessonNum,
      title: fullTitle,
      content: content || `${fullTitle}: see the Calculator project lesson notes.`,
    };
  });
};

const buildChunks = (lessons) =>
  lessons.map((lesson, i) => ({
    step_number: i + 1,
    title: lesson.title,
    source_type: 'lesson',
    audience: 'both',
    tags: ['python', 'calculator', 'coding', 'class4', `lesson-${lesson.lessonNum}`],
    content: lesson.content,
  }));

const buildRoadmapDays = (lessons) =>
  lessons.map((lesson, i) => {
    const dayNumber = i + 1;
    return {
      day_number: dayNumber,
      title: lesson.title,
      teacher_goal: `Teach "${lesson.title}" at beginner-child level: explain the idea in plain words, show the smallest example, then connect it to the Python calculator the class is building.`,
      student_goal: `Students understand "${lesson.title}" and can do one tiny practice step on their own.`,
      activities: [
        'Review the previous lesson in one sentence.',
        `Explain "${lesson.title}" with a simple, familiar example before any code.`,
        'Type one tiny example together and run it.',
        'Connect the step to the calculator project.',
        'Ask each learner to try a one-line practice before moving on.',
      ],
      materials: ['Class 4 calculator lesson notes', 'Computer with Python + Thonny installed', 'calculator.py project file'],
      code_explanation_focus: 'Explain each line like the class is seeing code for the first time: what it does, why it matters, what to notice.',
      end_of_day_checklist: [
        'Students can explain the idea in their own words',
        'Students completed the tiny practice step',
        'The step was connected back to the calculator',
        'Anything unfinished was noted for next lesson',
      ],
      teacher_report_prompts: [
        'What did students complete today?',
        'What did students understand well?',
        'Where did students need support?',
        'What is the first unfinished step for next lesson?',
      ],
      next_day_prep: `Prepare the next calculator step after "${lesson.title}"; do not assume earlier code exists unless today's report confirms it.`,
    };
  });

const seed = async () => {
  if (!fs.existsSync(LESSONS_PATH)) {
    throw new Error(`Lessons file not found at ${LESSONS_PATH}. Set CALCULATOR_LESSONS_PATH.`);
  }
  const md = fs.readFileSync(LESSONS_PATH, 'utf-8');
  const lessons = parseLessons(md);
  if (lessons.length === 0) throw new Error('No "## Lesson" sections found in the lessons file.');

  const chunks = buildChunks(lessons);
  const roadmapDays = buildRoadmapDays(lessons);
  roadmapDays.forEach((day) => {
    day.section_number = day.day_number;
    day.week_number = day.day_number;
    day.month_number = Math.ceil(day.day_number / 4);
    day.section_label = `Month ${day.month_number}, Week ${day.week_number}, Section ${day.section_number}`;
  });

  await createSchoolTables();
  await createLearningTables();

  const project = await createLearningProject({
    title: 'Python Calculator',
    subject: 'Coding, Python',
    grade: 'Class 4',
    class_name: 'Class 4',
    description: 'A Class 4 beginner project that builds a working Python calculator step by step — from first print() to a styled tkinter GUI app — teaching core programming ideas through one real project.',
    learning_goals: 'Understand variables, input, numbers, operations, loops, if-statements, functions, lists, error handling, f-strings, and a tkinter GUI by building a calculator the class can run themselves.',
    difficulty_level: 'beginner',
    duration_months: 4,
    expected_section_count: roadmapDays.length,
    audience_scope: 'student_teacher',
    teacher_readiness_required: true,
    code_explanation_required: true,
    source_doc_name: 'Calculator_Project_Lessons.md',
    created_by_role: 'system',
  });

  const createdChunks = await replaceLearningContentChunks(project.id, chunks);
  const createdRoadmapDays = await replaceLearningRoadmapDays(project.id, roadmapDays);

  return {
    project: { id: project.id, title: project.title, grade: project.grade, class_name: project.class_name },
    lessons_parsed: lessons.length,
    chunk_count: createdChunks.length,
    roadmap_day_count: createdRoadmapDays.length,
  };
};

seed()
  .then((result) => {
    console.log('✅ Python Calculator project seeded for Class 4');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('❌ Failed to seed Python Calculator project:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
