const pool = require('../src/config/db');
const { canAccessProject, filterProjectsForUser } = require('../src/services/projectAccessService');
const { getLearningProjects, getLearningProjectById } = require('../src/models/learningModel');

(async () => {
  const teacher = { id: 1, role: 'teacher' };
  const project = await getLearningProjectById(7);
  console.log('Project 7:', { id: project.id, title: project.title, grade: project.grade, class_name: project.class_name });

  const access = await canAccessProject(teacher, project);
  console.log('canAccessProject ->', access);

  const all = await getLearningProjects();
  const visible = await filterProjectsForUser(teacher, all);
  console.log('Visible to teacher 1:');
  visible.forEach(p => console.log(' ', p.id, '|', p.title, '|', p.grade, '|', p.class_name));

  await pool.end();
})();
