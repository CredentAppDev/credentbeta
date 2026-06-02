#!/usr/bin/env node
/**
 * Seed ONE test group rating (with skill dimensions) so the new analytics
 * features have data to display — student "My Progress", teacher Analytics skill
 * bars + risk flags, and the Emrys insight.
 *
 * Safe: it only INSERTS a single group_ratings row (idempotent via ON CONFLICT),
 * after finding a real group + a member student + a teacher so all foreign keys
 * are valid. It does NOT modify or delete anything else.
 *
 * Run from the backend dir with DATABASE_URL set (same env as the server):
 *     node scripts/seed-test-rating.js
 * Optional: pass a group id to target a specific group:
 *     node scripts/seed-test-rating.js 12
 */
const pool = require('../src/config/db');

const PROJECT = 'Voice Assistant (Test)';
const SCORE = { score: 84, creativity: 90, execution: 78, teamwork: 92, presentation: 76 };

(async () => {
  try {
    const argGroup = process.argv[2] ? Number(process.argv[2]) : null;

    // 1. Find a group that has at least one student member (so My Progress has a
    //    student to attribute the score to). Prefer the requested group if given.
    const groupRow = (await pool.query(
      `SELECT sg.id, sg.name
         FROM student_groups sg
         JOIN group_members gm ON gm.group_id = sg.id
        ${argGroup ? 'WHERE sg.id = $1' : ''}
        GROUP BY sg.id, sg.name
        ORDER BY COUNT(gm.student_id) DESC
        LIMIT 1`,
      argGroup ? [argGroup] : []
    )).rows[0];

    if (!groupRow) {
      console.error('❌ No group with student members found. Create a group + add a student first, then re-run.');
      process.exit(1);
    }

    // 2. A teacher for the rating (any active teacher; nullable FK so optional).
    const teacher = (await pool.query(
      `SELECT id, full_name FROM teachers WHERE is_active = true ORDER BY id LIMIT 1`
    )).rows[0] || null;

    // 3. A member student of that group — to tell you whose My Progress to check.
    const student = (await pool.query(
      `SELECT s.id, s.full_name
         FROM group_members gm JOIN students s ON s.id = gm.student_id
        WHERE gm.group_id = $1 ORDER BY s.id LIMIT 1`,
      [groupRow.id]
    )).rows[0] || null;

    // 4. Insert the rating (idempotent on the natural key).
    const res = await pool.query(
      `INSERT INTO group_ratings
         (group_id, teacher_id, project_name, score, feedback, creativity, execution, teamwork, presentation, submitted_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
       ON CONFLICT (group_id, teacher_id, project_name)
       DO UPDATE SET score=EXCLUDED.score, creativity=EXCLUDED.creativity, execution=EXCLUDED.execution,
                     teamwork=EXCLUDED.teamwork, presentation=EXCLUDED.presentation, updated_at=NOW()
       RETURNING id`,
      [groupRow.id, teacher ? teacher.id : null, PROJECT, SCORE.score, 'Seeded test rating for analytics verification.',
       SCORE.creativity, SCORE.execution, SCORE.teamwork, SCORE.presentation]
    );

    console.log('✅ Seeded test rating (id ' + res.rows[0].id + ')');
    console.log('   Group   :', groupRow.name, '(id ' + groupRow.id + ')');
    console.log('   Teacher :', teacher ? teacher.full_name + ' (id ' + teacher.id + ')' : '(none — null)');
    console.log('   Project :', PROJECT, '| score', SCORE.score, '| skills', JSON.stringify({ c: SCORE.creativity, e: SCORE.execution, t: SCORE.teamwork, p: SCORE.presentation }));
    if (student) console.log('   ➜ Log in as student "' + student.full_name + '" (id ' + student.id + ') → Stats → My Progress to see it.');
    console.log('   ➜ Or a teacher with access to this group → Stats → Analytics for skill bars + risk flag.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  }
})();
