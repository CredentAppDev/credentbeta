const pool = require('../src/config/db');
(async () => {
  const r = await pool.query(
    `UPDATE learning_projects
       SET teacher_readiness_required = false
     WHERE id IN (4,5,6,7)
     RETURNING id, title, teacher_readiness_required`
  );
  console.log('Updated:');
  r.rows.forEach(p => console.log(' ', p.id, '|', p.title, '| readiness_required:', p.teacher_readiness_required));
  await pool.end();
})();
