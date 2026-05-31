/**
 * DANGER: Hard-deletes ALL learning projects from the connected database.
 *
 * Deleting a learning_projects row cascades (per schema) to:
 *   - learning_content_chunks            (ON DELETE CASCADE)
 *   - learning_project_assets            (ON DELETE CASCADE)
 *   - learning_project_roadmap_days      (ON DELETE CASCADE)
 *   - learning_group_project_updates     (ON DELETE CASCADE)
 *   - teacher_ai_readiness               (ON DELETE CASCADE)
 *   - teacher_ai_daily_reports           (ON DELETE CASCADE)
 * and SET NULL on:
 *   - ai_interactions.project_id
 *   - ai_tutoring_sessions.project_id
 *
 * Safety:
 *   - Requires DATABASE_URL in the environment (never hardcoded here).
 *   - Requires the flag --yes-delete-everything to actually delete.
 *     Without it, the script only PRINTS what would be removed (dry run).
 *   - Runs the delete inside a transaction and prints before/after counts.
 *
 * Usage:
 *   node scripts/clearAllLearningProjects.js                    # dry run
 *   node scripts/clearAllLearningProjects.js --yes-delete-everything
 */

const pool = require('../src/config/db');

const CONFIRM = process.argv.includes('--yes-delete-everything');

const countRows = async (client, table) => {
  try {
    const r = await client.query(`SELECT COUNT(*)::int AS n FROM ${table}`);
    return r.rows[0].n;
  } catch (e) {
    return `(n/a: ${e.message})`;
  }
};

const TABLES = [
  'learning_projects',
  'learning_content_chunks',
  'learning_project_assets',
  'learning_project_roadmap_days',
  'learning_group_project_updates',
  'teacher_ai_readiness',
  'teacher_ai_daily_reports',
];

const main = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('ABORT: DATABASE_URL is not set in the environment.');
    process.exitCode = 1;
    return;
  }

  const client = await pool.connect();
  try {
    console.log('\n=== BEFORE ===');
    for (const t of TABLES) console.log(`  ${t}: ${await countRows(client, t)}`);

    // Show the actual projects so we have a record of what is being removed.
    const projects = await client.query(
      'SELECT id, title, grade, class_name, is_active FROM learning_projects ORDER BY id'
    );
    console.log(`\nProjects present (${projects.rows.length}):`);
    for (const p of projects.rows) {
      console.log(`  - ${p.id}: ${p.title} | grade=${p.grade || ''} | class=${p.class_name || ''} | active=${p.is_active}`);
    }

    if (!CONFIRM) {
      console.log('\nDRY RUN — nothing deleted.');
      console.log('Re-run with  --yes-delete-everything  to actually delete all projects.\n');
      return;
    }

    console.log('\n=== DELETING (transaction) ===');
    await client.query('BEGIN');
    // Deleting the parent cascades to the children defined ON DELETE CASCADE.
    const del = await client.query('DELETE FROM learning_projects');
    await client.query('COMMIT');
    console.log(`  Deleted ${del.rowCount} learning_projects rows (cascade handled children).`);

    console.log('\n=== AFTER ===');
    for (const t of TABLES) console.log(`  ${t}: ${await countRows(client, t)}`);
    console.log('\nDone.\n');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('\nFAILED (rolled back):', e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

main();
