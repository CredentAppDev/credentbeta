const pool = require('../src/config/db');
(async () => {
  const p = await pool.query("SELECT id, title, class_name, expected_section_count FROM learning_projects WHERE title = 'Python Calculator'");
  console.log('Project:', JSON.stringify(p.rows[0], null, 2));

  if (!p.rows[0]) { await pool.end(); return; }
  const id = p.rows[0].id;

  const r = await pool.query('SELECT COUNT(*) FROM learning_project_roadmap_days WHERE project_id = $1', [id]);
  console.log('Roadmap days:', r.rows[0].count);

  const c = await pool.query('SELECT step_number, title, source_type FROM learning_content_chunks WHERE project_id = $1 ORDER BY step_number', [id]);
  console.log('Content chunks (' + c.rowCount + '):');
  c.rows.forEach(row => console.log(' ', row.step_number, '|', row.source_type, '|', row.title));

  const rd = await pool.query('SELECT day_number, title FROM learning_project_roadmap_days WHERE project_id = $1 ORDER BY day_number LIMIT 5', [id]);
  console.log('First 5 roadmap days:');
  rd.rows.forEach(row => console.log(' ', row.day_number, '|', row.title));

  await pool.end();
})();
