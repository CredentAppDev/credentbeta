/**
 * Seeds the "Jarvis Voice Assistant" learning project for JHS 3.
 *
 * Source of truth: jarvis_assistant/Jarvis_Project_Lessons.md (credent 2 root).
 * Parses that markdown at seed time so the real lesson content goes into the DB.
 *
 * Each "## Lesson N: Title" becomes one content chunk + one roadmap day.
 *
 * Usage (production):
 *   DATABASE_URL='postgres://...' NODE_ENV=production \
 *     node scripts/seedJarvisAssistantProject.js
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

const LESSONS_PATH =
  process.env.JARVIS_LESSONS_PATH
  || path.resolve(__dirname, '../../jarvis_assistant/Jarvis_Project_Lessons.md');

// Grab a section's prose, collapsing code fences to an inline "(code: ...)".
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

// Grab the raw code from a section, KEEPING the code lines (for "The Code").
const sectionCode = (block, heading) => {
  const re = new RegExp(`### ${heading}\\s*\\n([\\s\\S]*?)(?=\\n### |\\n## |$)`, 'i');
  const m = block.match(re);
  if (!m) return '';
  const codes = [];
  const fence = /```[a-z]*\n([\s\S]*?)```/gi;
  let cm;
  while ((cm = fence.exec(m[1])) !== null) codes.push(cm[1].trim());
  return codes.join('\n');
};

const parseLessons = (md) => {
  const parts = md.split(/\n(?=## Lesson )/g).filter((p) => /^## Lesson /.test(p));
  return parts.map((block) => {
    const titleMatch = block.match(/^## (Lesson [^\n]+)/);
    const fullTitle = titleMatch ? titleMatch[1].trim() : 'Lesson';
    const numMatch = fullTitle.match(/Lesson\s+(\d+)/i);
    const lessonNum = numMatch ? parseInt(numMatch[1], 10) : 0;

    const bigIdea = sectionText(block, 'Big Idea');
    const kidMeaning = sectionText(block, 'Kid Meaning');
    const connection = sectionText(block, 'Jarvis Connection')
      || sectionText(block, 'Calculator Connection');
    const code = sectionCode(block, 'The Code');
    const lineByLine = sectionText(block, 'Line by Line');

    const content = [
      bigIdea && `Big idea: ${bigIdea}`,
      kidMeaning && `In kid words: ${kidMeaning}`,
      connection && `How it connects to Jarvis: ${connection}`,
      code && `The actual code:\n${code}`,
      lineByLine && `Line-by-line explanation: ${lineByLine}`,
    ].filter(Boolean).join('\n\n');

    return {
      lessonNum,
      title: fullTitle,
      content: content || `${fullTitle}: see the Jarvis project lesson notes.`,
    };
  });
};

const buildChunks = (lessons) =>
  lessons.map((lesson, i) => ({
    step_number: i + 1,
    title: lesson.title,
    source_type: 'lesson',
    audience: 'both',
    tags: ['python', 'jarvis', 'voice-assistant', 'clap', 'gui', 'jhs3', `lesson-${lesson.lessonNum}`],
    content: lesson.content,
  }));

const buildRoadmapDays = (lessons) =>
  lessons.map((lesson, i) => {
    const dayNumber = i + 1;
    return {
      day_number: dayNumber,
      title: lesson.title,
      teacher_goal: `Teach "${lesson.title}" at beginner level: explain the idea in plain words, show the smallest example, then connect it to the Jarvis voice assistant the class is building.`,
      student_goal: `Students understand "${lesson.title}" and can do one tiny practice step on their own.`,
      activities: [
        'Review the previous lesson in one sentence.',
        `Explain "${lesson.title}" with a simple, familiar example before any code.`,
        'Type one tiny example together and run it.',
        'Connect the step to the Jarvis project (clap wake, listen, decide, speak).',
        'Ask each learner to try a one-line practice before moving on.',
      ],
      materials: ['JHS 3 Jarvis lesson notes', 'Computer with Python + a microphone and speakers', 'jarvis.py project file'],
      code_explanation_focus: 'Explain each line like the class is seeing code for the first time: what it does, why it matters, what to notice.',
      end_of_day_checklist: [
        'Students can explain the idea in their own words',
        'Students completed the tiny practice step',
        'The step was connected back to Jarvis',
        'Anything unfinished was noted for next lesson',
      ],
      teacher_report_prompts: [
        'What did students complete today?',
        'What did students understand well?',
        'Where did students need support?',
        'What is the first unfinished step for next lesson?',
      ],
      next_day_prep: `Prepare the next Jarvis step after "${lesson.title}"; do not assume earlier code exists unless today's report confirms it.`,
    };
  });

const seed = async () => {
  if (!fs.existsSync(LESSONS_PATH)) {
    throw new Error(`Lessons file not found at ${LESSONS_PATH}. Set JARVIS_LESSONS_PATH.`);
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

  // Re-seedable: if this project already exists, remove it first (cascade
  // clears its chunks + roadmap) so we can recreate it with the updated lessons.
  await pool.query("DELETE FROM learning_projects WHERE title = $1", ['Jarvis Voice Assistant']);

  const project = await createLearningProject({
    title: 'Jarvis Voice Assistant',
    subject: 'AI, Python, Coding',
    grade: 'JHS 3',
    class_name: 'JHS 3',
    description: 'A JHS 3 project that builds a friendly "Jarvis" desktop voice assistant in Python: it wakes up when you clap twice, shows a glowing Iron-Man arc-reactor screen, asks your name, holds a friendly conversation, answers questions (time, date, math), opens websites, switches between a male and female voice, and talks back. Every lesson matches the real jarvis.py code and explains it line by line.',
    learning_goals: 'Understand safe imports, variables, functions, the Conversation class with memory, regular expressions for pulling out the name, if/keyword decisions, text-to-speech with Windows SAPI and voice switching, microphone loudness and continuous clap detection, speech-to-text, dictionaries for websites, Canvas drawing and animation for the glowing reactor, and threads for doing two things at once — by building one real assistant and reading its actual code.',
    difficulty_level: 'beginner',
    duration_months: 4,
    expected_section_count: roadmapDays.length,
    audience_scope: 'student_teacher',
    teacher_readiness_required: true,
    code_explanation_required: true,
    source_doc_name: 'Jarvis_Project_Lessons.md',
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
    console.log('✅ Jarvis Voice Assistant project seeded for JHS 3');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('❌ Failed to seed Jarvis project:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
