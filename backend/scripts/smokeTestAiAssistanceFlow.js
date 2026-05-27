const jwt = require('jsonwebtoken');
const app = require('../src/app');
const pool = require('../src/config/db');

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

const request = async (baseUrl, path, { method = 'GET', token, body } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { raw: text };
  }

  return { status: response.status, data };
};

const assert = (condition, message, details = {}) => {
  if (!condition) {
    const error = new Error(message);
    error.details = details;
    throw error;
  }
};

const firstRow = async (query, values = []) => {
  const result = await pool.query(query, values);
  return result.rows[0];
};

const ensureClass6TestAssignment = async (teacherId) => {
  const school = await firstRow(
    `INSERT INTO schools (school_id, name, address, contact_email, contact_phone, is_active)
     VALUES ('SCHCLASS6AI', 'AI Smoke Class 6 School', 'Smoke test address', 'class6-smoke@credent.test', '0000000000', true)
     ON CONFLICT (school_id) DO UPDATE SET
       name = EXCLUDED.name,
       is_active = true,
       updated_at = NOW()
     RETURNING *`
  );

  const student = await firstRow(
    `INSERT INTO students (student_id, school_id, full_name, email, grade, class_name, semester, is_active)
     VALUES ('STUCLASS6AI', $1, 'AI Smoke Class 6 Student', 'class6-student@credent.test', 'Class 6', 'Class 6', 'Project Term', true)
     ON CONFLICT (student_id) DO UPDATE SET
       school_id = EXCLUDED.school_id,
       full_name = EXCLUDED.full_name,
       grade = EXCLUDED.grade,
       class_name = EXCLUDED.class_name,
       semester = EXCLUDED.semester,
       is_active = true,
       updated_at = NOW()
     RETURNING *`,
    [school.id]
  );

  let group = await firstRow(
    `SELECT *
     FROM student_groups
     WHERE school_id = $1
       AND grade = 'Class 6'
       AND class_name = 'Class 6'
       AND semester = 'Project Term'
     ORDER BY id
     LIMIT 1`,
    [school.id]
  );

  if (!group) {
    group = await firstRow(
      `INSERT INTO student_groups
       (school_id, name, grade, class_name, semester, group_number, description, is_confirmed)
       VALUES ($1, 'AI Smoke Class 6 Group', 'Class 6', 'Class 6', 'Project Term', 1, 'Smoke test Class 6 group', true)
       RETURNING *`,
      [school.id]
    );
  }

  await pool.query(
    `INSERT INTO group_members (group_id, student_id)
     VALUES ($1, $2)
     ON CONFLICT (group_id, student_id) DO NOTHING`,
    [group.id, student.id]
  );

  await pool.query(
    `INSERT INTO teacher_group_access (teacher_id, group_id, assigned_by, is_active)
     VALUES ($1, $2, NULL, true)
     ON CONFLICT (teacher_id, group_id) DO UPDATE SET
       is_active = true,
       assigned_at = NOW()`,
    [teacherId, group.id]
  );

  return { school, student, group };
};

const run = async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const project = await firstRow(
      "SELECT id, title FROM learning_projects WHERE title = 'Voice-Controlled AI Assistant' AND is_active = true"
    );
    assert(project, 'Seeded voice-assistant learning project was not found');

    const forbiddenClassProject = await firstRow(
      `INSERT INTO learning_projects
       (title, subject, grade, class_name, description, duration_months, expected_section_count, source_doc_name, created_by_role)
       VALUES ($1, 'Smoke Test', 'Class 4', 'Class 4', 'Class access smoke test project', 4, 16, 'smoke-test', 'system')
       ON CONFLICT (title) DO UPDATE SET
         grade = EXCLUDED.grade,
         class_name = EXCLUDED.class_name,
         duration_months = EXCLUDED.duration_months,
         expected_section_count = EXCLUDED.expected_section_count,
         is_active = true,
         updated_at = NOW()
       RETURNING id, title`,
      ['Smoke Class 4 Access Test Project']
    );

    const teacher = await firstRow(
      'SELECT id, teacher_id, full_name FROM teachers WHERE is_active = true ORDER BY id LIMIT 1'
    );
    assert(teacher, 'No active teacher found for AI smoke test');

    const class6TestData = await ensureClass6TestAssignment(teacher.id);
    const student = await firstRow(
      `SELECT s.id, s.student_id, s.full_name, sc.school_id
       FROM students s
       JOIN schools sc ON sc.id = s.school_id
       WHERE s.id = $1`,
      [class6TestData.student.id]
    );
    assert(student, 'No active student found for AI smoke test');

    const looseGroup = await firstRow(
      `INSERT INTO student_groups
       (school_id, name, grade, class_name, semester, group_number, description, is_confirmed)
       VALUES ($1, 'Loose Class Data Smoke Group', NULL, NULL, NULL, 99, 'Should fail closed for student access', true)
       RETURNING *`,
      [class6TestData.school.id]
    );
    await pool.query(
      `INSERT INTO group_members (group_id, student_id)
       VALUES ($1, $2)
       ON CONFLICT (group_id, student_id) DO NOTHING`,
      [looseGroup.id, student.id]
    );

    await pool.query(
      'DELETE FROM teacher_ai_readiness WHERE teacher_id = $1 AND project_id = $2',
      [teacher.id, project.id]
    );

    const teacherToken = signToken(teacher.id, 'teacher');
    const studentToken = signToken(student.id, 'student');

    const projectList = await request(baseUrl, '/api/learning/projects', { token: teacherToken });
    assert(projectList.status === 200, 'Teacher could not list learning projects', projectList);
    assert(
      projectList.data.projects.some((item) => item.id === project.id),
      'Voice-assistant project was not returned in project list',
      projectList.data
    );
    assert(
      !projectList.data.projects.some((item) => item.id === forbiddenClassProject.id),
      'Teacher could see a project outside their assigned project class',
      projectList.data
    );

    const studentProjectList = await request(baseUrl, '/api/learning/projects', { token: studentToken });
    assert(studentProjectList.status === 200, 'Student could not list learning projects', studentProjectList);
    assert(
      studentProjectList.data.projects.some((item) => item.id === project.id)
        && !studentProjectList.data.projects.some((item) => item.id === forbiddenClassProject.id),
      'Student project list was not scoped to their class project',
      studentProjectList.data
    );

    const studentAssets = await request(baseUrl, `/api/learning/projects/${project.id}/assets`, {
      token: studentToken,
    });
    assert(studentAssets.status === 200, 'Student could not list class project assets', studentAssets);
    assert(
      studentAssets.data.assets.every((asset) => asset.file_path === undefined),
      'Student assets leaked server-local file paths',
      studentAssets.data
    );

    const studentGroups = await request(baseUrl, '/api/student/groups', { token: studentToken });
    assert(studentGroups.status === 200, 'Student could not list groups', studentGroups);
    assert(
      !studentGroups.data.groups.some((group) => group.id === looseGroup.id),
      'Student could see a group with missing class data',
      studentGroups.data
    );

    const looseGroupAi = await request(baseUrl, '/api/ai/ask', {
      method: 'POST',
      token: studentToken,
      body: {
        project_id: project.id,
        group_id: looseGroup.id,
        question: 'Can this loose group access the project?',
      },
    });
    assert(
      looseGroupAi.status === 403,
      'Student could use AI inside a group with missing class data',
      looseGroupAi
    );

    const forbiddenStudentAi = await request(baseUrl, '/api/ai/ask', {
      method: 'POST',
      token: studentToken,
      body: {
        project_id: forbiddenClassProject.id,
        question: 'Can I work on this Class 4 project?',
      },
    });
    assert(
      forbiddenStudentAi.status === 404,
      'Student was allowed to access a project from another class',
      forbiddenStudentAi
    );

    const teacherPrompt = await request(baseUrl, '/api/ai/ask', {
      method: 'POST',
      token: teacherToken,
      body: {
        project_id: project.id,
        question: 'How do I start teaching the voice assistant project?',
      },
    });
    assert(teacherPrompt.status === 200, 'Teacher readiness prompt request failed', teacherPrompt);
    assert(
      teacherPrompt.data.requires_teacher_readiness === true,
      'Teacher was not asked the typing and keyboard readiness question first',
      teacherPrompt.data
    );

    const teacherAnswer = await request(baseUrl, '/api/ai/ask', {
      method: 'POST',
      token: teacherToken,
      body: {
        project_id: project.id,
        question: 'Explain MCP before we write any code',
        teacher_readiness: {
          is_good_typer: false,
          knows_keyboard_letters: false,
          note: 'Smoke test readiness confirmation for guided support mode',
        },
      },
    });
    assert(teacherAnswer.status === 200, 'Teacher AI answer request failed', teacherAnswer);
    assert(
      teacherAnswer.data.policy.syllabus_bound === true
        && teacherAnswer.data.policy.uses_teacher_intelligence === true
        && teacherAnswer.data.policy.uses_model_knowledge_within_syllabus === true
        && teacherAnswer.data.policy.project_is_textbook_reference === true
        && teacherAnswer.data.answer.includes('Typing readiness noted'),
      'Teacher AI answer did not follow the teacher/textbook policy',
      teacherAnswer.data
    );
    assert(
      teacherAnswer.data.answer.includes('guided teacher support mode'),
      'Teacher no-readiness answer did not switch into guided support mode',
      teacherAnswer.data
    );

    const roadmapAnswer = await request(baseUrl, `/api/ai/roadmap?project_id=${project.id}`, {
      token: teacherToken,
    });
    assert(roadmapAnswer.status === 200, 'Teacher roadmap request failed', roadmapAnswer);
    assert(
      Array.isArray(roadmapAnswer.data.roadmap)
        && roadmapAnswer.data.roadmap.length === 16
        && roadmapAnswer.data.project.duration_months === 4
        && roadmapAnswer.data.message.includes('guided teacher support mode'),
      'Teacher roadmap did not include the full support-aware teaching plan',
      roadmapAnswer.data
    );

    const dayReport = await request(baseUrl, '/api/ai/teacher/day-report', {
      method: 'POST',
      token: teacherToken,
      body: {
        project_id: project.id,
        day_number: 1,
        completed_items: [
          'Teacher readiness answer saved',
          'Students can describe MCP as a safe bridge',
        ],
        student_understanding: 'Most students understood MCP, but some still confused the BMS with the ESP32.',
        challenges: 'Some learners need the parts names repeated before wiring.',
        support_needed: 'Start Day 2 with a short parts review.',
        teacher_notes: 'Use slower typing instructions.',
      },
    });
    assert(dayReport.status === 201, 'Teacher daily report request failed', dayReport);
    assert(
      dayReport.data.ai_next_steps.includes('Recommended next steps')
        && dayReport.data.next_roadmap_day
        && dayReport.data.next_roadmap_day.day_number === 2,
      'Teacher daily report did not return next-step guidance',
      dayReport.data
    );

    const studentAnswer = await request(baseUrl, '/api/ai/ask', {
      method: 'POST',
      token: studentToken,
      body: {
        project_id: project.id,
        question: 'Help me understand the speaker wiring code step',
      },
    });
    assert(studentAnswer.status === 200, 'Student AI answer request failed', studentAnswer);
    assert(
      !studentAnswer.data.requires_teacher_readiness
        && studentAnswer.data.answer.includes('Code explanation rule'),
      'Student AI answer did not allow direct help with code explanation',
      studentAnswer.data
    );

    const unsupportedAnswer = await request(baseUrl, '/api/ai/ask', {
      method: 'POST',
      token: studentToken,
      body: {
        project_id: project.id,
        question: 'Who is the president of Ghana?',
      },
    });
    assert(unsupportedAnswer.status === 200, 'Unsupported-question request failed', unsupportedAnswer);
    assert(
      unsupportedAnswer.data.answer.includes("I can't connect that question to this class project yet"),
      'AI did not refuse an out-of-project question',
      unsupportedAnswer.data
    );

    const membership = await firstRow(
      `SELECT gm.group_id
       FROM group_members gm
       JOIN student_groups sg ON sg.id = gm.group_id
       JOIN students s ON s.id = gm.student_id
       WHERE gm.student_id = $1
         AND s.school_id = sg.school_id
         AND sg.grade IS NOT NULL
         AND s.grade IS NOT NULL
         AND LOWER(s.grade) = LOWER(sg.grade)
         AND sg.class_name IS NOT NULL
         AND s.class_name IS NOT NULL
         AND LOWER(s.class_name) = LOWER(sg.class_name)
         AND (
           (sg.semester IS NULL AND s.semester IS NULL)
           OR (sg.semester IS NOT NULL AND s.semester IS NOT NULL AND LOWER(s.semester) = LOWER(sg.semester))
         )
       ORDER BY gm.group_id
       LIMIT 1`,
      [student.id]
    );

    let groupMessageTest = { skipped: true, reason: 'Student is not assigned to a group yet' };
    const teacherGroupMember = await firstRow(
      `SELECT gm.group_id, s.id AS student_id
       FROM teacher_group_access tga
       JOIN group_members gm ON gm.group_id = tga.group_id
       JOIN student_groups sg ON sg.id = gm.group_id
       JOIN students s ON s.id = gm.student_id
       WHERE tga.teacher_id = $1
         AND tga.is_active = true
         AND s.school_id = sg.school_id
         AND sg.grade IS NOT NULL
         AND s.grade IS NOT NULL
         AND LOWER(s.grade) = LOWER(sg.grade)
         AND sg.class_name IS NOT NULL
         AND s.class_name IS NOT NULL
         AND LOWER(s.class_name) = LOWER(sg.class_name)
         AND (
           (sg.semester IS NULL AND s.semester IS NULL)
           OR (sg.semester IS NOT NULL AND s.semester IS NOT NULL AND LOWER(s.semester) = LOWER(sg.semester))
         )
       ORDER BY gm.group_id, s.id
       LIMIT 1`,
      [teacher.id]
    );

    let groupProjectUpdateTest = { skipped: true, reason: 'Teacher is not assigned to a group with students yet' };
    if (membership) {
      const groupAnswer = await request(baseUrl, '/api/ai/ask', {
        method: 'POST',
        token: studentToken,
        body: {
          project_id: project.id,
          group_id: membership.group_id,
          question: 'Help my group check the battery and BMS wiring',
        },
      });
      assert(groupAnswer.status === 200, 'Group AI answer request failed', groupAnswer);
      assert(
        groupAnswer.data.group_message && groupAnswer.data.group_message.sender_type === 'ai',
        'AI answer was not saved into the group chat as an AI message',
        groupAnswer.data
      );
      groupMessageTest = { skipped: false, group_id: membership.group_id };
    }

    if (teacherGroupMember) {
      const groupProjectUpdate = await request(baseUrl, '/api/ai/teacher/group-project-update', {
        method: 'POST',
        token: teacherToken,
        body: {
          project_id: project.id,
          group_id: teacherGroupMember.group_id,
          day_number: 1,
          section_number: 1,
          impact_student_id: teacherGroupMember.student_id,
          lead_student_id: teacherGroupMember.student_id,
          completed_items: [
            'Teacher readiness answer saved',
            'Students can describe MCP as a safe bridge',
          ],
          impact_summary: 'Kofi helped the group explain MCP clearly.',
          group_progress: 'The group completed the launch discussion and parts identification.',
          next_actions: 'Let Kofi lead the power path recap next section.',
          teacher_notes: 'Leadership is based on explanation and teamwork.',
        },
      });
      assert(groupProjectUpdate.status === 201, 'Teacher group project update failed', groupProjectUpdate);
      assert(
        groupProjectUpdate.data.update.lead_student_id === teacherGroupMember.student_id
          && groupProjectUpdate.data.update.impact_student_id === teacherGroupMember.student_id,
        'Teacher group project update did not save impact and lead students',
        groupProjectUpdate.data
      );
      groupProjectUpdateTest = {
        skipped: false,
        group_id: teacherGroupMember.group_id,
        lead_student_id: teacherGroupMember.student_id,
      };
    }

    return {
      project,
      teacher: {
        id: teacher.id,
        teacher_id: teacher.teacher_id,
        full_name: teacher.full_name,
      },
      student: {
        id: student.id,
        student_id: student.student_id,
        school_id: student.school_id,
        full_name: student.full_name,
      },
      checks: {
        project_list: 'passed',
        teacher_readiness_prompt: 'passed',
        teacher_controlled_answer: 'passed',
        class_scoped_project_access: 'passed',
        fail_closed_group_access: 'passed',
        asset_path_redaction: 'passed',
        teacher_roadmap: 'passed',
        teacher_daily_report: 'passed',
        teacher_group_project_update: groupProjectUpdateTest,
        student_direct_help: 'passed',
        out_of_project_refusal: 'passed',
        group_message: groupMessageTest,
      },
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

run()
  .then((result) => {
    console.log('✅ AI assistance smoke test passed');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('❌ AI assistance smoke test failed:', error.message);
    if (error.details) {
      console.error(JSON.stringify(error.details, null, 2));
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
