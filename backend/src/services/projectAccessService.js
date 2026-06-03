const pool = require('../config/db');

const STAFF_ROLES = ['admin', 'agent'];

const canAccessProject = async (user, project) => {
  if (!user || !project) return false;
  if (STAFF_ROLES.includes(user.role)) return true;

  if (user.role === 'student') {
    return projectMatchesClass(project, {
      grade: user.grade,
      class_name: user.class_name,
    });
  }

  // Teachers can access ALL projects — no group assignment required. Adding a
  // teacher is enough; groups are no longer part of project access.
  if (user.role === 'teacher') {
    return true;
  }

  return false;
};

const filterProjectsForUser = async (user, projects) => {
  if (!user) return [];
  if (STAFF_ROLES.includes(user.role)) return projects;

  if (user.role === 'student') {
    return projects.filter((project) =>
      projectMatchesClass(project, {
        grade: user.grade,
        class_name: user.class_name,
      })
    );
  }

  // Teachers see ALL projects — no group assignment required.
  if (user.role === 'teacher') {
    return projects;
  }

  return [];
};

const projectMatchesClass = (project, scope) => {
  if (!project.class_name || !scope.class_name) {
    return false;
  }

  const classMatches = normalize(project.class_name) === normalize(scope.class_name);
  const gradeMatches = !project.grade
    || !scope.grade
    || normalize(project.grade) === normalize(scope.grade);

  return classMatches && gradeMatches;
};

const teacherHasProjectClass = async (teacherId, project) => {
  if (!project.grade || !project.class_name) return false;

  const result = await pool.query(
    `SELECT 1
     FROM teacher_group_access tga
     JOIN student_groups sg ON sg.id = tga.group_id
     WHERE tga.teacher_id = $1
       AND tga.is_active = true
       AND (
         sg.grade IS NULL
         OR LOWER(sg.grade) = LOWER($2)
       )
       AND LOWER(sg.class_name) = LOWER($3)
     LIMIT 1`,
    [teacherId, project.grade, project.class_name]
  );
  return !!result.rows[0];
};

const getTeacherClassScopes = async (teacherId) => {
  const result = await pool.query(
    `SELECT DISTINCT sg.grade, sg.class_name
     FROM teacher_group_access tga
     JOIN student_groups sg ON sg.id = tga.group_id
     WHERE tga.teacher_id = $1
       AND tga.is_active = true
       AND sg.grade IS NOT NULL
       AND sg.class_name IS NOT NULL`,
    [teacherId]
  );
  return result.rows;
};

const normalize = (value) => String(value || '').trim().toLowerCase();

module.exports = {
  canAccessProject,
  filterProjectsForUser,
  projectMatchesClass,
};
