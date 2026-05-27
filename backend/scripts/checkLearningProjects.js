const pool = require('../src/config/db');
const { filterProjectsForUser } = require('../src/services/projectAccessService');
const { getLearningProjects } = require('../src/models/learningModel');
const { findStudentByDbId, findTeacherByDbId } = require('../src/models/schoolModel');
require('dotenv').config();

const args = process.argv.slice(2);

const getArgValue = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] || null;
};

const printProjects = (label, projects) => {
  console.log(`\n${label} (${projects.length})`);
  for (const project of projects) {
    console.log(`- ${project.id}: ${project.title} | grade=${project.grade || ''} | class=${project.class_name || ''} | active=${project.is_active}`);
  }
};

const getTeacherScopes = async (teacherId) => {
  const result = await pool.query(
    `SELECT DISTINCT sg.grade, sg.class_name
       FROM teacher_group_access tga
       JOIN student_groups sg ON sg.id = tga.group_id
      WHERE tga.teacher_id = $1
        AND tga.is_active = true
      ORDER BY sg.grade, sg.class_name`,
    [teacherId]
  );
  return result.rows;
};

const main = async () => {
  const allProjects = await getLearningProjects({ includeInactive: true });
  printProjects('All learning projects', allProjects);

  const teacherId = Number(getArgValue('--teacher-id'));
  if (teacherId) {
    const teacher = await findTeacherByDbId(teacherId);
    if (!teacher) {
      console.log(`\nTeacher ${teacherId} not found.`);
    } else {
      teacher.role = 'teacher';
      const scopes = await getTeacherScopes(teacherId);
      console.log(`\nTeacher ${teacherId} scopes:`);
      for (const scope of scopes) {
        console.log(`- grade=${scope.grade || ''} | class=${scope.class_name || ''}`);
      }
      printProjects(`Visible to teacher ${teacherId}`, await filterProjectsForUser(teacher, allProjects));
    }
  }

  const studentId = Number(getArgValue('--student-id'));
  if (studentId) {
    const student = await findStudentByDbId(studentId);
    if (!student) {
      console.log(`\nStudent ${studentId} not found.`);
    } else {
      student.role = 'student';
      console.log(`\nStudent ${studentId} scope: grade=${student.grade || ''} | class=${student.class_name || ''}`);
      printProjects(`Visible to student ${studentId}`, await filterProjectsForUser(student, allProjects));
    }
  }
};

main()
  .catch((error) => {
    console.error('Project check failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
