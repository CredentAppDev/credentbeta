const pool = require('../src/config/db');
(async () => {
  const t = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='teachers'`);
  console.log('teachers columns:', t.rows.map(r => r.column_name).join(', '));

  const ta = await pool.query('SELECT * FROM teachers LIMIT 5');
  console.log('Teachers rows:');
  ta.rows.forEach(r => console.log(' ', JSON.stringify(r)));

  const tga = await pool.query('SELECT * FROM teacher_group_access');
  console.log('Teacher group access:');
  tga.rows.forEach(r => console.log(' ', JSON.stringify(r)));

  const sg = await pool.query(`SELECT id, class_name, grade FROM student_groups`);
  console.log('Student groups:');
  sg.rows.forEach(r => console.log(' ', JSON.stringify(r)));

  await pool.end();
})();
