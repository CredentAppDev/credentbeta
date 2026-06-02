/**
 * delete-incomplete-projects.js — one-off cleanup.
 *
 * KEEPS only the projects whose title matches the KEEP list (Voice Assistant,
 * Jarvis). PERMANENTLY DELETES every other learning_project, which cascades to
 * its content chunks, assets, roadmap days, and tutoring sessions (ON DELETE
 * CASCADE) — THIS CANNOT BE UNDONE.
 *
 * SAFETY: runs as a DRY RUN by default — it prints exactly what WOULD be kept
 * and deleted, and stops. It only deletes when you pass --confirm.
 *
 *   Dry run (safe, shows the plan):
 *     DATABASE_URL=... node scripts/delete-incomplete-projects.js
 *   Actually delete:
 *     DATABASE_URL=... node scripts/delete-incomplete-projects.js --confirm
 *
 * Must run with DATABASE_URL pointing at the SAME database as the server
 * (Render → backend service → Shell, or locally with the prod URL).
 */
const pool = require('../src/config/db');

// Titles to KEEP (case-insensitive substring match). Everything else is removed.
const KEEP_PATTERNS = ['voice assistant', 'jarvis'];

const confirm = process.argv.includes('--confirm');

function isKept(title) {
  const t = String(title || '').toLowerCase();
  return KEEP_PATTERNS.some(p => t.includes(p));
}

(async () => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, project_type, is_active FROM learning_projects ORDER BY id'
    );
    if (!rows.length) { console.log('No projects found. Nothing to do.'); return; }

    const keep = rows.filter(r => isKept(r.title));
    const remove = rows.filter(r => !isKept(r.title));

    console.log('\n=== KEEP (' + keep.length + ') ===');
    keep.forEach(r => console.log(`  [KEEP]   #${r.id}  ${r.title}  [${r.project_type}]`));
    console.log('\n=== DELETE (' + remove.length + ') ===');
    remove.forEach(r => console.log(`  [DELETE] #${r.id}  ${r.title}  [${r.project_type}]`));

    if (!remove.length) { console.log('\nNothing to delete.'); return; }

    if (!confirm) {
      console.log('\nDRY RUN — nothing deleted. Re-run with --confirm to permanently delete the above.');
      console.log('(This will also cascade-delete their content chunks, assets, roadmaps, and sessions.)');
      return;
    }

    // Safety: never delete EVERYTHING (means the keep-match failed → titles differ).
    if (!keep.length) {
      console.log('\nABORT: keep-list matched 0 projects — refusing to delete all of them.');
      console.log('Check the titles above and adjust KEEP_PATTERNS, then re-run.');
      return;
    }

    const ids = remove.map(r => r.id);
    const res = await pool.query(
      'DELETE FROM learning_projects WHERE id = ANY($1::int[]) RETURNING id, title',
      [ids]
    );
    console.log(`\n✅ Deleted ${res.rowCount} project(s):`);
    res.rows.forEach(r => console.log(`   #${r.id}  ${r.title}`));
    console.log('Done.');
  } catch (e) {
    console.error('Error:', e.message);
    process.exitCode = 1;
  } finally {
    try { await pool.end(); } catch {}
  }
})();
