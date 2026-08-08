/**
 * Canonicalise every existing class_name in students and student_groups.
 *
 * Class names were free text with no normalisation, so one class ended up
 * stored several ways — production had a group classed "JHS3" whose members
 * were classed "JHS 3". Because the agent's class picker is built from
 * `SELECT DISTINCT class_name FROM students`, each variant appeared as its own
 * class and groups got split across them. It also hid a student's own group
 * from them on the leaderboard.
 *
 * Writes are now normalised at the source (src/utils/classNames.js, applied in
 * schoolModel + agentRoutes). This script fixes the rows already in the table.
 *
 * Usage:
 *   node scripts/normalizeClassNames.js            # dry run — shows the plan
 *   node scripts/normalizeClassNames.js --apply    # perform the update
 *
 * Production:
 *   DATABASE_URL='postgres://...' NODE_ENV=production \
 *     node scripts/normalizeClassNames.js --apply
 */

const pool = require('../src/config/db');
const { canonicalClassName, classKey } = require('../src/utils/classNames');

const apply = process.argv.includes('--apply');

const report = async (table) => {
  const rows = (await pool.query(
    `SELECT school_id, class_name, COUNT(*)::int AS n
       FROM ${table}
      WHERE class_name IS NOT NULL AND class_name <> ''
      GROUP BY school_id, class_name
      ORDER BY school_id, class_name`)).rows;

  // school -> classKey -> [{ class_name, n }]
  const buckets = new Map();
  for (const r of rows) {
    const key = `${r.school_id}::${classKey(r.class_name)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(r);
  }

  const changes = [];
  const merges = [];
  for (const [key, variants] of buckets) {
    const canonical = canonicalClassName(variants[0].class_name);
    if (variants.length > 1) {
      merges.push({ key, canonical, variants });
    }
    for (const v of variants) {
      if (v.class_name !== canonical) {
        changes.push({ school_id: v.school_id, from: v.class_name, to: canonical, n: v.n });
      }
    }
  }
  return { table, rows, changes, merges };
};

(async () => {
  try {
    console.log(apply ? 'APPLYING class-name normalisation\n' : 'DRY RUN — no changes written\n');

    let totalChanges = 0;
    for (const table of ['students', 'student_groups']) {
      const { rows, changes, merges } = await report(table);
      console.log(`${table}: ${rows.length} distinct (school, class_name) pairs`);

      if (merges.length) {
        console.log('  variants of the SAME class that will merge:');
        for (const m of merges) {
          const list = m.variants.map(v => `"${v.class_name}" (${v.n})`).join('  +  ');
          console.log(`    school ${m.variants[0].school_id}: ${list}   ->   "${m.canonical}"`);
        }
      }

      if (changes.length) {
        console.log('  rows to rewrite:');
        for (const c of changes) {
          console.log(`    school ${c.school_id}: "${c.from}" -> "${c.to}"  (${c.n} row${c.n === 1 ? '' : 's'})`);
        }
      } else {
        console.log('  nothing to change.');
      }

      if (apply) {
        for (const c of changes) {
          const res = await pool.query(
            `UPDATE ${table} SET class_name = $1
              WHERE school_id = $2 AND class_name = $3`,
            [c.to, c.school_id, c.from]);
          console.log(`    updated ${res.rowCount} row(s) in ${table}: "${c.from}" -> "${c.to}"`);
        }
      }
      totalChanges += changes.length;
      console.log('');
    }

    if (!apply) {
      console.log(totalChanges
        ? `Re-run with --apply to perform ${totalChanges} rewrite(s).`
        : 'Everything is already canonical.');
    } else {
      // Show the resulting class list per school — this is what the agent's
      // class picker will now offer.
      const after = (await pool.query(
        `SELECT school_id, class_name, COUNT(*)::int AS students
           FROM students
          WHERE class_name IS NOT NULL AND class_name <> ''
          GROUP BY school_id, class_name
          ORDER BY school_id, class_name`)).rows;
      console.log('Class picker will now show:');
      after.forEach(r => console.log(`  school ${r.school_id}: "${r.class_name}" (${r.students} students)`));
    }
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
