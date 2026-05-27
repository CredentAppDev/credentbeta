require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5000';
const ADMIN_PASSWORD = 'Admin123!';
const PASSKEYS = {
  agent: '1111111111',
  teacher: '2222222222',
  student: '3333333333',
};

const results = [];

const record = (name, ok, details) => {
  results.push({ name, ok, details });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${details ? ` :: ${details}` : ''}`);
};

const request = async (name, method, path, { token, body, expectedStatus } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  const ok = expectedStatus ? res.status === expectedStatus : res.ok;
  record(name, ok, `status=${res.status}`);

  if (!ok) {
    throw new Error(`${name} failed with status ${res.status}: ${text}`);
  }

  return { status: res.status, data };
};

const getRequiredRow = async (query, params, label) => {
  const result = await pool.query(query, params);
  if (!result.rows[0]) {
    throw new Error(`Missing required fixture: ${label}`);
  }
  return result.rows[0];
};

const setupFixtures = async () => {
  const admin = await getRequiredRow(
    `SELECT id, full_name, email, role
     FROM users
     WHERE role = 'admin' AND is_active = true
     ORDER BY id ASC
     LIMIT 1`,
    [],
    'active admin user'
  );

  const agent = await getRequiredRow(
    `SELECT id, full_name, email, role
     FROM users
     WHERE role = 'agent' AND is_active = true
     ORDER BY id ASC
     LIMIT 1`,
    [],
    'active agent user'
  );

  const teacher = await getRequiredRow(
    `SELECT id, teacher_id, full_name, email
     FROM teachers
     WHERE is_active = true
     ORDER BY id ASC
     LIMIT 1`,
    [],
    'active teacher'
  );

  const student = await getRequiredRow(
    `SELECT s.id, s.student_id, s.full_name, s.email, sc.school_id AS school_code
     FROM students s
     JOIN schools sc ON sc.id = s.school_id
     WHERE s.is_active = true
     ORDER BY s.id ASC
     LIMIT 1`,
    [],
    'active student'
  );

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await pool.query(
    `UPDATE users
     SET password_hash = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [passwordHash, admin.id]
  );

  await pool.query(
    `UPDATE users
     SET passkey = $1,
         passkey_expires_at = NOW() + INTERVAL '24 hours',
         passkey_used = false,
         device_token = NULL,
         refresh_token = NULL,
         updated_at = NOW()
     WHERE id = $2`,
    [PASSKEYS.agent, agent.id]
  );

  await pool.query(
    `UPDATE teachers
     SET passkey = $1,
         passkey_expires_at = NOW() + INTERVAL '24 hours',
         passkey_used = false,
         device_token = NULL,
         device_token_expires_at = NULL,
         updated_at = NOW()
     WHERE id = $2`,
    [PASSKEYS.teacher, teacher.id]
  );

  await pool.query(
    `UPDATE students
     SET passkey = $1,
         passkey_expires_at = NOW() + INTERVAL '24 hours',
         passkey_used = false,
         device_token = NULL,
         device_token_expires_at = NULL,
         updated_at = NOW()
     WHERE id = $2`,
    [PASSKEYS.student, student.id]
  );

  return { admin, agent, teacher, student };
};

const main = async () => {
  const startedAt = Date.now();
  const suffix = `${Date.now()}`;

  try {
    const fixtures = await setupFixtures();

    await request('health', 'GET', '/api/health', { expectedStatus: 200 });

    const adminLogin = await request('admin login', 'POST', '/api/auth/login', {
      body: { email: fixtures.admin.email, password: ADMIN_PASSWORD },
      expectedStatus: 200,
    });
    const adminToken = adminLogin.data.accessToken;
    const adminRefresh = adminLogin.data.refreshToken;

    await request('admin me', 'GET', '/api/auth/me', {
      token: adminToken,
      expectedStatus: 200,
    });
    await request('admin refresh', 'POST', '/api/auth/refresh', {
      body: { refreshToken: adminRefresh },
      expectedStatus: 200,
    });

    await request('agent passkey start', 'POST', '/api/auth/passkey/start', {
      body: { passkey: PASSKEYS.agent },
      expectedStatus: 200,
    });
    const agentLogin = await request('agent passkey login', 'POST', '/api/auth/passkey', {
      body: { passkey: PASSKEYS.agent },
      expectedStatus: 200,
    });
    const agentToken = agentLogin.data.accessToken;
    const agentDeviceToken = agentLogin.data.deviceToken;
    await request('agent device login', 'POST', '/api/auth/device', {
      body: { deviceToken: agentDeviceToken },
      expectedStatus: 200,
    });
    await request('agent me', 'GET', '/api/auth/me', {
      token: agentToken,
      expectedStatus: 200,
    });

    await request('teacher passkey start', 'POST', '/api/auth/passkey/start', {
      body: { passkey: PASSKEYS.teacher },
      expectedStatus: 200,
    });
    const teacherLogin = await request('teacher passkey login', 'POST', '/api/auth/teacher/passkey', {
      body: { passkey: PASSKEYS.teacher, teacher_id: fixtures.teacher.teacher_id },
      expectedStatus: 200,
    });
    const teacherToken = teacherLogin.data.accessToken;
    const teacherDeviceToken = teacherLogin.data.deviceToken;
    await request('teacher device login', 'POST', '/api/auth/teacher/device', {
      body: { deviceToken: teacherDeviceToken },
      expectedStatus: 200,
    });
    await request('teacher resume login', 'POST', '/api/auth/teacher/resume', {
      body: { deviceToken: teacherDeviceToken, teacher_id: fixtures.teacher.teacher_id },
      expectedStatus: 200,
    });
    await request('teacher me', 'GET', '/api/teacher/me', {
      token: teacherToken,
      expectedStatus: 200,
    });

    await request('student passkey start', 'POST', '/api/auth/passkey/start', {
      body: { passkey: PASSKEYS.student },
      expectedStatus: 200,
    });
    const studentLogin = await request('student passkey login', 'POST', '/api/auth/student/passkey', {
      body: {
        passkey: PASSKEYS.student,
        school_id: fixtures.student.school_code,
        student_id: fixtures.student.student_id,
      },
      expectedStatus: 200,
    });
    const studentToken = studentLogin.data.accessToken;
    const studentDeviceToken = studentLogin.data.deviceToken;
    await request('student device login', 'POST', '/api/auth/student/device', {
      body: { deviceToken: studentDeviceToken },
      expectedStatus: 200,
    });
    await request('student resume login', 'POST', '/api/auth/student/resume', {
      body: {
        deviceToken: studentDeviceToken,
        school_id: fixtures.student.school_code,
        student_id: fixtures.student.student_id,
      },
      expectedStatus: 200,
    });
    await request('student me', 'GET', '/api/student/me', {
      token: studentToken,
      expectedStatus: 200,
    });

    await request('support agent for teacher', 'GET', '/api/support/available-agent', {
      token: teacherToken,
      expectedStatus: 200,
    });
    await request('support agent for student', 'GET', '/api/support/available-agent', {
      token: studentToken,
      expectedStatus: 200,
    });

    await request('admin stats', 'GET', '/api/admin/stats', {
      token: adminToken,
      expectedStatus: 200,
    });
    const agentsList = await request('admin agents list', 'GET', '/api/admin/agents', {
      token: adminToken,
      expectedStatus: 200,
    });
    const listedAgent = agentsList.data.agents[0];
    await request('admin single agent', 'GET', `/api/admin/agents/${listedAgent.id}`, {
      token: adminToken,
      expectedStatus: 200,
    });

    const tempAgent = await request('admin create agent', 'POST', '/api/admin/agents', {
      token: adminToken,
      body: {
        full_name: `Role Sweep Agent ${suffix}`,
        email: `role-sweep-agent-${suffix}@credent.test`,
      },
      expectedStatus: 201,
    });
    const tempAgentId = tempAgent.data.agent.id;
    await request('admin edit agent', 'PATCH', `/api/admin/agents/${tempAgentId}`, {
      token: adminToken,
      body: { full_name: `Role Sweep Agent Updated ${suffix}` },
      expectedStatus: 200,
    });
    await request('admin resend agent passkey', 'POST', `/api/admin/agents/${tempAgentId}/resend-passkey`, {
      token: adminToken,
      expectedStatus: 200,
    });
    await request('admin deactivate agent', 'PATCH', `/api/admin/agents/${tempAgentId}/deactivate`, {
      token: adminToken,
      expectedStatus: 200,
    });
    await request('admin reactivate agent', 'PATCH', `/api/admin/agents/${tempAgentId}/reactivate`, {
      token: adminToken,
      expectedStatus: 200,
    });

    await request('analytics overview admin', 'GET', '/api/analytics/overview', {
      token: adminToken,
      expectedStatus: 200,
    });
    await request('analytics blocked for agent', 'GET', '/api/analytics/overview', {
      token: agentToken,
      expectedStatus: 403,
    });

    const category = await request('admin create category', 'POST', '/api/categories', {
      token: adminToken,
      body: { name: `Role Sweep Category ${suffix}`, description: 'Regression category' },
      expectedStatus: 201,
    });
    const categoryId = category.data.category.id;
    await request('agent list categories', 'GET', '/api/categories', {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('admin update category', 'PATCH', `/api/categories/${categoryId}`, {
      token: adminToken,
      body: { description: 'Regression category updated' },
      expectedStatus: 200,
    });

    const customer = await request('agent create customer', 'POST', '/api/customers', {
      token: agentToken,
      body: {
        full_name: `Role Sweep Customer ${suffix}`,
        email: `role-sweep-customer-${suffix}@credent.test`,
        phone: '555-0101',
        company: 'Credent QA',
      },
      expectedStatus: 201,
    });
    const customerId = customer.data.customer.id;
    await request('agent list customers', 'GET', '/api/customers', {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent get customer', 'GET', `/api/customers/${customerId}`, {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent update customer', 'PATCH', `/api/customers/${customerId}`, {
      token: agentToken,
      body: { company: 'Credent QA Updated' },
      expectedStatus: 200,
    });

    const ticket = await request('agent create ticket', 'POST', '/api/tickets', {
      token: agentToken,
      body: {
        title: `Role Sweep Ticket ${suffix}`,
        description: 'Regression ticket body',
        priority: 'normal',
        customer_id: customerId,
        category_id: categoryId,
        assigned_to: fixtures.agent.id,
      },
      expectedStatus: 201,
    });
    const ticketId = ticket.data.ticket.id;
    await request('agent list tickets', 'GET', '/api/tickets', {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent get ticket', 'GET', `/api/tickets/${ticketId}`, {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent add internal note', 'POST', `/api/tickets/${ticketId}/replies`, {
      token: agentToken,
      body: { body: 'Internal regression note', is_internal_note: true },
      expectedStatus: 201,
    });
    await request('agent update ticket with elevated fields', 'PATCH', `/api/tickets/${ticketId}`, {
      token: agentToken,
      body: {
        status: 'closed',
        priority: 'high',
        category_id: categoryId,
        assigned_to: fixtures.agent.id,
      },
      expectedStatus: 200,
    });

    const school = await request('agent create school', 'POST', '/api/schools', {
      token: agentToken,
      body: {
        name: `Role Sweep School ${suffix}`,
        address: 'QA Address',
        contact_email: `school-${suffix}@credent.test`,
        assigned_agent_id: fixtures.agent.id,
      },
      expectedStatus: 201,
    });
    const schoolId = school.data.school.id;
    const schoolCode = school.data.school.school_id;
    await request('agent list schools', 'GET', '/api/schools', {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent get school', 'GET', `/api/schools/${schoolId}`, {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent assign school agent', 'PATCH', `/api/schools/${schoolId}/assign-agent`, {
      token: agentToken,
      body: { agent_id: fixtures.agent.id },
      expectedStatus: 200,
    });
    await request('agent assign multiple school agents', 'PATCH', `/api/schools/${schoolId}/assign-agents`, {
      token: agentToken,
      body: { agent_ids: [fixtures.agent.id, tempAgentId] },
      expectedStatus: 200,
    });
    await request('agent get assigned school agents', 'GET', `/api/schools/${schoolId}/agents`, {
      token: agentToken,
      expectedStatus: 200,
    });

    const schoolTeacher = await request('agent register teacher', 'POST', '/api/teachers', {
      token: agentToken,
      body: {
        full_name: `Role Sweep Teacher ${suffix}`,
        email: `role-sweep-teacher-${suffix}@credent.test`,
      },
      expectedStatus: 201,
    });
    const schoolTeacherId = schoolTeacher.data.teacher.id;
    await request('agent list teachers', 'GET', '/api/teachers', {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent list available teachers', 'GET', '/api/teachers/available', {
      token: agentToken,
      expectedStatus: 200,
    });

    const schoolStudent = await request('agent register student', 'POST', `/api/schools/${schoolCode}/students`, {
      token: agentToken,
      body: {
        full_name: `Role Sweep Student ${suffix}`,
        email: `role-sweep-student-${suffix}@credent.test`,
        grade: '8',
        class_name: 'RoleRefactorClass',
        semester: 'First',
      },
      expectedStatus: 201,
    });
    const schoolStudentId = schoolStudent.data.student.id;
    await request('agent get school students', 'GET', `/api/schools/${schoolCode}/students`, {
      token: agentToken,
      expectedStatus: 200,
    });
    const groupsResponse = await request('agent auto group students', 'POST', `/api/schools/${schoolCode}/groups/auto`, {
      token: agentToken,
      body: { class_name: 'RoleRefactorClass', semester: 'First' },
      expectedStatus: 201,
    });
    const groupId = groupsResponse.data.groups[0].id;
    await request('agent get class groups', 'GET', `/api/schools/${schoolCode}/groups?class_name=RoleRefactorClass&semester=First`, {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent confirm class groups', 'POST', `/api/schools/${schoolCode}/groups/confirm`, {
      token: agentToken,
      body: { class_name: 'RoleRefactorClass', semester: 'First' },
      expectedStatus: 200,
    });

    const helpRequest = await request('agent create group help request', 'POST', '/api/group-help', {
      token: agentToken,
      body: {
        group_id: groupId,
        requested_by_student_id: schoolStudentId,
        assigned_agent_id: fixtures.agent.id,
        title: `Role Sweep Help ${suffix}`,
        description: 'Need support',
        priority: 'normal',
      },
      expectedStatus: 201,
    });
    const helpRequestId = helpRequest.data.helpRequest.id;
    await request('agent list group help', 'GET', '/api/group-help', {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent get single group help', 'GET', `/api/group-help/${helpRequestId}`, {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent assign teacher to group help', 'PATCH', `/api/group-help/${helpRequestId}/assign-teacher`, {
      token: agentToken,
      body: { teacher_id: schoolTeacherId },
      expectedStatus: 200,
    });
    await request('agent update group help status', 'PATCH', `/api/group-help/${helpRequestId}/status`, {
      token: agentToken,
      body: { status: 'active' },
      expectedStatus: 200,
    });
    await request('agent get group help requests by group', 'GET', `/api/group-help/group/${groupId}`, {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent add group help message', 'POST', '/api/group-help/group/messages', {
      token: agentToken,
      body: {
        group_id: groupId,
        help_request_id: helpRequestId,
        sender_type: 'agent',
        sender_id: fixtures.agent.id,
        body: 'Role refactor regression message',
      },
      expectedStatus: 201,
    });
    await request('agent get group messages', 'GET', `/api/group-help/group/${groupId}/messages`, {
      token: agentToken,
      expectedStatus: 200,
    });
    await request('agent close teacher session', 'PATCH', `/api/group-help/${helpRequestId}/close-session`, {
      token: agentToken,
      body: { teacher_id: schoolTeacherId },
      expectedStatus: 200,
    });

    const groupChannel = await request('agent create group channel', 'POST', '/api/messages/group', {
      token: agentToken,
      body: { name: `Role Sweep Channel ${suffix}`, member_ids: [fixtures.admin.id] },
      expectedStatus: 201,
    });
    const channelId = groupChannel.data.channel.id;
    await request('agent add member to group channel', 'POST', `/api/messages/channels/${channelId}/members`, {
      token: agentToken,
      body: { user_id: tempAgentId },
      expectedStatus: 200,
    });
    const dmChannel = await request('agent start DM with admin', 'POST', '/api/messages/dm', {
      token: agentToken,
      body: { target_id: fixtures.admin.id, target_type: 'staff' },
      expectedStatus: 200,
    });
    await request('agent send DM message', 'POST', `/api/messages/channels/${dmChannel.data.channel.id}`, {
      token: agentToken,
      body: { body: 'Role refactor DM check' },
      expectedStatus: 201,
    });
    await request('agent get DM messages', 'GET', `/api/messages/channels/${dmChannel.data.channel.id}`, {
      token: agentToken,
      expectedStatus: 200,
    });

    await request('admin broadcast history', 'GET', '/api/broadcast', {
      token: adminToken,
      expectedStatus: 200,
    });
    await request('admin send broadcast', 'POST', '/api/broadcast', {
      token: adminToken,
      body: {
        title: `Role Sweep Broadcast ${suffix}`,
        body: 'Regression broadcast body',
        target_role: 'agent',
      },
      expectedStatus: 201,
    });
    await request('agent blocked from broadcast send', 'POST', '/api/broadcast', {
      token: agentToken,
      body: { title: 'Nope', body: 'Should fail' },
      expectedStatus: 403,
    });

    await request('webhook inbound email', 'POST', '/api/webhook/inbound-email', {
      body: {
        from: `Role Sweep Sender <role-sweep-webhook-${suffix}@test.com>`,
        subject: `Role Sweep Webhook ${suffix}`,
        text: 'Webhook regression payload',
      },
      expectedStatus: 200,
    });

    await request('admin delete ticket', 'DELETE', `/api/tickets/${ticketId}`, {
      token: adminToken,
      expectedStatus: 200,
    });
    await request('admin delete category', 'DELETE', `/api/categories/${categoryId}`, {
      token: adminToken,
      expectedStatus: 200,
    });
    await request('admin logout', 'POST', '/api/auth/logout', {
      body: { refreshToken: adminRefresh },
      expectedStatus: 200,
    });

    const failures = results.filter((result) => !result.ok);
    console.log(JSON.stringify({
      failures,
      passed: results.length - failures.length,
      total: results.length,
      duration_ms: Date.now() - startedAt,
    }, null, 2));
  } catch (error) {
    console.error('REGRESSION_FAILURE');
    console.error(error.stack || error.message);
    console.log(JSON.stringify({
      failures: results.filter((result) => !result.ok),
      passed: results.filter((result) => result.ok).length,
      total: results.length,
      duration_ms: Date.now() - startedAt,
    }, null, 2));
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main();
