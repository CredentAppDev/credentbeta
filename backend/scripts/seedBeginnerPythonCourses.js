/**
 * Seeds the five beginner Python class courses (Class 4 → JHS 2) from their
 * lesson markdown files into the learning database.
 *
 * Unlike the older calculator seeder, each lesson's FULL markdown body becomes
 * the content chunk — fenced ```python code blocks included. The desktop Teach
 * view renders chunks as markdown and automatically lifts fenced code into the
 * presentation code panel, so teachers get the complete lesson: Big Idea, Kid
 * Meaning, the code, Line by Line, Your Turn, More Examples, Common Mistakes,
 * Check Your Brain, and Level Up.
 *
 * Usage:
 *   node scripts/seedBeginnerPythonCourses.js            # seed all 5 courses
 *   node scripts/seedBeginnerPythonCourses.js class4     # seed one (key below)
 *
 * Production:
 *   DATABASE_URL='postgres://...neon...' NODE_ENV=production \
 *     node scripts/seedBeginnerPythonCourses.js
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

const REPO_ROOT = path.resolve(__dirname, '../..');

const COURSES = {
  class4: {
    file: path.join(REPO_ROOT, 'class4_number_game/Number_Game_Lessons.md'),
    title: 'Magic Number Game',
    subject: 'Coding, Python',
    grade: 'Class 4',
    class_name: 'Class 4',
    project_file: 'number_game.py',
    description:
      'A Class 4 beginner course that builds a complete Magic Number guessing game in Python — the computer picks a secret number and the player hunts it down with "too high / too low" clues. Starts from absolute zero: printing, variables, input, ifs, and loops, all taught through one fun game.',
    learning_goals:
      'Understand print, variables, numbers vs text, input(), int(), f-strings, if/elif/else, while loops, random numbers, and counting with variables — by building and improving a real guessing game.',
    tags: ['python', 'number-game', 'coding', 'class4'],
  },
  class5: {
    file: path.join(REPO_ROOT, 'class5_emoji_chatbot/Emoji_Chatbot_Lessons.md'),
    title: 'Emoji Chatbot',
    subject: 'Coding, Python',
    grade: 'Class 5',
    class_name: 'Class 5',
    project_file: 'chatbot.py',
    description:
      'A Class 5 beginner course that builds a friendly Emoji Chatbot in Python — a program that chats with you, remembers your name, answers questions, and replies with emojis. Teaches text handling, decisions, loops, lists, and functions through one lovable project.',
    learning_goals:
      'Understand strings and methods like .lower(), in-checks, if/elif chains, while loops, lists, random.choice, and simple functions — by building a chatbot the class can actually talk to.',
    tags: ['python', 'chatbot', 'coding', 'class5'],
  },
  class6: {
    file: path.join(REPO_ROOT, 'class6_quiz_game/Quiz_Game_Lessons.md'),
    title: 'Quiz Game Show',
    subject: 'Coding, Python',
    grade: 'Class 6',
    class_name: 'Class 6',
    project_file: 'quiz_game.py',
    description:
      'A Class 6 beginner course that builds a full Quiz Game Show in Python — questions, scoring, lives, a timer feel, and a winners board. Teaches lists, dictionaries, loops, functions, and files through one exciting game the whole class can play.',
    learning_goals:
      'Understand lists, dictionaries, for loops, functions with parameters and returns, score tracking, randomising questions, and saving high scores — by building a quiz show students run for each other.',
    tags: ['python', 'quiz-game', 'coding', 'class6'],
  },
  jhs1: {
    file: path.join(REPO_ROOT, 'jhs1_rock_paper_scissors/RPS_Lessons.md'),
    title: 'Rock Paper Scissors Arena',
    subject: 'Coding, Python',
    grade: 'JHS 1',
    class_name: 'JHS 1',
    project_file: 'rps_arena.py',
    description:
      'A JHS 1 beginner course that builds a Rock Paper Scissors Arena in Python — best-of rounds, score tracking, a computer opponent with personality, and win statistics. Teaches core programming with random choices, game logic, loops, and functions.',
    learning_goals:
      'Understand random.choice, comparing values, if/elif game rules, while game loops, functions, score dictionaries, and input validation — by building a polished arena game against the computer.',
    tags: ['python', 'rock-paper-scissors', 'coding', 'jhs1'],
  },
  jhs2: {
    file: path.join(REPO_ROOT, 'jhs2_budget_tracker/Budget_Tracker_Lessons.md'),
    title: 'My Money Budget Tracker',
    subject: 'Coding, Python',
    grade: 'JHS 2',
    class_name: 'JHS 2',
    project_file: 'budget_tracker.py',
    description:
      'A JHS 2 beginner course that builds a real Money Budget Tracker in Python — record pocket money and spending, see totals, get savings advice, and keep the data in a file so it survives restarts. Practical coding that teaches real-life money sense.',
    learning_goals:
      'Understand floats and money maths, lists of records, dictionaries, functions, file reading/writing, simple reports, and input validation — by building a budget tool students can genuinely use.',
    tags: ['python', 'budget-tracker', 'coding', 'jhs2'],
  },
};

/**
 * Split the markdown into lessons. Each "## Lesson N: Title" block becomes one
 * lesson; the chunk content is the FULL body (everything under the header up to
 * the next lesson), markdown and code fences intact.
 */
const parseLessons = (md) => {
  const parts = md.split(/\n(?=## Lesson )/g).filter((p) => /^## Lesson /.test(p));
  return parts.map((block) => {
    const titleMatch = block.match(/^## (Lesson [^\n]+)/);
    const fullTitle = titleMatch ? titleMatch[1].trim() : 'Lesson';
    const numMatch = fullTitle.match(/Lesson\s+(\d+)/i);
    const lessonNum = numMatch ? parseInt(numMatch[1], 10) : 0;

    // Body = everything after the header line; strip trailing part separators
    // ("---" + optional "# PART ..." heading bleeding into the block).
    let body = block.replace(/^## [^\n]+\n/, '');
    body = body.replace(/\n---\s*(\n# PART[\s\S]*)?$/i, '').trim();

    return { lessonNum, title: fullTitle, content: body };
  });
};

const buildChunks = (lessons, courseTags) =>
  lessons.map((lesson, i) => ({
    step_number: i + 1,
    title: lesson.title,
    source_type: 'lesson',
    audience: 'both',
    tags: [...courseTags, `lesson-${lesson.lessonNum}`],
    content: lesson.content,
  }));

const buildRoadmapDays = (course, lessons) =>
  lessons.map((lesson, i) => {
    const dayNumber = i + 1;
    const monthNumber = Math.max(1, Math.ceil(dayNumber / Math.ceil(lessons.length / 4)));
    return {
      day_number: dayNumber,
      section_number: dayNumber,
      week_number: dayNumber,
      month_number: monthNumber,
      section_label: `Month ${monthNumber}, Week ${dayNumber}, Section ${dayNumber}`,
      title: lesson.title,
      teacher_goal: `Teach "${lesson.title}" at beginner-child level: explain the idea with the lesson's everyday example first, walk the code line by line, then run it live so the class sees it work.`,
      student_goal: `Students understand "${lesson.title}", complete the Your Turn practice themselves, and can explain the idea back in their own words.`,
      activities: [
        'Review the previous lesson in one sentence (ask a student to say it).',
        `Explain "${lesson.title}" using the Kid Meaning before showing any code.`,
        'Type and run The Code together in VS Code; read the Line by Line out loud.',
        'Walk through the More Examples — run at least one live in VS Code.',
        'Every learner does the Your Turn practice on their own machine in VS Code.',
        'Each learner shows Emrys their result: paste the VS Code terminal output or send a screenshot for checking.',
        'Show one Common Mistake on purpose and let the class spot the fix.',
        'Fast finishers attempt the Level Up challenge (and show Emrys that too).',
      ],
      materials: [
        `${course.grade} lesson notes (this section)`,
        'Computer with Python + VS Code (with the Python extension) installed',
        `${course.project_file} project file`,
      ],
      code_explanation_focus:
        'Explain every line like the class is seeing code for the first time: what it does, why we need it, and what would break without it. Use the Common Mistakes to normalise errors as part of coding.',
      end_of_day_checklist: [
        'Students can say the Big Idea in their own words',
        'Every student ran code themselves today (not just watched)',
        'Your Turn was completed by all (or noted who needs follow-up)',
        'At least one Common Mistake was demonstrated and fixed live',
        'The step was connected back to the project we are building',
      ],
      teacher_report_prompts: [
        'What did students complete today?',
        'Which example or analogy landed best?',
        'Where did students need support, and which mistake came up most?',
        'Who finished the Level Up, and who needs revision next lesson?',
      ],
      next_day_prep: `Skim the next lesson after "${lesson.title}" and have its starter code ready; do not assume earlier code exists unless today's report confirms it.`,
    };
  });

const seedCourse = async (key) => {
  const course = COURSES[key];
  if (!fs.existsSync(course.file)) {
    throw new Error(`Lessons file not found: ${course.file}`);
  }
  const md = fs.readFileSync(course.file, 'utf-8');
  const lessons = parseLessons(md);
  if (lessons.length === 0) throw new Error(`No "## Lesson" sections in ${course.file}`);

  const project = await createLearningProject({
    title: course.title,
    subject: course.subject,
    grade: course.grade,
    class_name: course.class_name,
    description: course.description,
    learning_goals: course.learning_goals,
    difficulty_level: 'beginner',
    duration_months: 4,
    expected_section_count: lessons.length,
    audience_scope: 'student_teacher',
    teacher_readiness_required: true,
    code_explanation_required: true,
    source_doc_name: path.basename(course.file),
    created_by_role: 'system',
    project_type: 'software',
  });

  const chunks = await replaceLearningContentChunks(project.id, buildChunks(lessons, course.tags));
  const days = await replaceLearningRoadmapDays(project.id, buildRoadmapDays(course, lessons));

  return { key, id: project.id, title: project.title, grade: project.grade, lessons: lessons.length, chunks: chunks.length, days: days.length };
};

const main = async () => {
  const only = (process.argv[2] || '').toLowerCase();
  const keys = only ? [only] : Object.keys(COURSES);
  for (const key of keys) {
    if (!COURSES[key]) throw new Error(`Unknown course key "${key}". Valid: ${Object.keys(COURSES).join(', ')}`);
  }

  await createSchoolTables();
  await createLearningTables();

  const results = [];
  for (const key of keys) {
    results.push(await seedCourse(key));
  }
  return results;
};

main()
  .then((results) => {
    console.log('✅ Beginner Python courses seeded:');
    results.forEach((r) => console.log(`   ${r.grade}: "${r.title}" — ${r.lessons} lessons, ${r.chunks} chunks, ${r.days} roadmap sections (project ${r.id})`));
  })
  .catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
