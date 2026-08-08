/**
 * Disambiguate groups that share a name within the same school + class.
 *
 * Nothing used to stop two groups being created with the same name, so a school
 * ended up with two groups both called "Credent Group" in Class 6 — impossible
 * to tell apart in any list, and two separate rows on the leaderboard. New
 * duplicates are now rejected at POST /schools/:schoolId/groups/manual; this
 * script cleans up the rows already in the table.
 *
 * It does NOT merge groups — duplicates usually have different members, and
 * merging would silently lose one. It renames instead, which is reversible:
 * the OLDEST group keeps the original name, later ones get a numeric suffix.
 *
 *   "Credent Group" (#4, 1 member)  -> unchanged
 *   "Credent Group" (#5, 3 members) -> "Credent Group 2"
 *
 * Usage:
 *   node scripts/dedupeGroupNames.js            # dry run
 *   node scripts/dedupeGroupNames.js --apply    # perform the renames
 */

const pool = require('../src/config/db');

const apply = process.argv.includes('--apply');
const nameKey = (s) => String(s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

(async () => {
  try {
    console.log(apply ? 'APPLYING group-name disambiguation\n' : 'DRY RUN — no changes written\n');

    const rows = (await pool.query(
      `SELECT id, name, school_id, COALESCE(class_name,'') AS class_name,
              (SELECT COUNT(*)::int FROM group_members gm WHERE gm.group_id = sg.id) AS members
         FROM student_groups sg
        ORDER BY school_id, class_name, id`)).rows;

    // school + class + normalised name -> [groups], oldest first
    const buckets = new Map();
    for (const r of rows) {
      const key = `${r.school_id}::${r.class_name}::${nameKey(r.name)}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(r);
    }

    const dupes = [...buckets.values()].filter((g) => g.length > 1);
    if (!dupes.length) {
      console.log('No duplicate group names found.');
      return;
    }

    const existingKeys = new Set(rows.map(
      (r) => `${r.school_id}::${r.class_name}::${nameKey(r.name)}`));
    const plan = [];

    for (const group of dupes) {
      const [keep, ...rest] = group;   // oldest id keeps the name
      console.log(`school ${keep.school_id} · ${keep.class_name || '(no class)'} · "${keep.name}" — ${group.length} groups:`);
      console.log(`  #${keep.id} (${keep.members} members)  KEEPS the name`);
      let n = 1;
      for (const g of rest) {
        // Find a free suffix so we never create a fresh collision.
        let candidate;
        do {
          n += 1;
          candidate = `${String(keep.name).trim()} ${n}`;
        } while (existingKeys.has(`${g.school_id}::${g.class_name}::${nameKey(candidate)}`));
        existingKeys.add(`${g.school_id}::${g.class_name}::${nameKey(candidate)}`);
        console.log(`  #${g.id} (${g.members} members)  ->  "${candidate}"`);
        plan.push({ id: g.id, from: g.name, to: candidate });
      }
      console.log('');
    }

    if (!apply) {
      console.log(`Re-run with --apply to rename ${plan.length} group(s).`);
      return;
    }

    for (const p of plan) {
      const res = await pool.query(
        `UPDATE student_groups SET name = $1, updated_at = NOW() WHERE id = $2`,
        [p.to, p.id]);
      console.log(`  renamed #${p.id}: "${p.from}" -> "${p.to}" (${res.rowCount} row)`);
    }

    const after = (await pool.query(
      `SELECT id, name, school_id, COALESCE(class_name,'') AS class_name
         FROM student_groups ORDER BY id`)).rows;
    console.log('\nGroups now:');
    after.forEach((r) => console.log(
      `  #${r.id} "${r.name}"  school=${r.school_id} class="${r.class_name}"`));
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
