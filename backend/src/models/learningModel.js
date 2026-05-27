const pool = require('../config/db');

const createLearningTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS learning_projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL,
      subject VARCHAR(100),
      grade VARCHAR(50),
      class_name VARCHAR(100),
      description TEXT,
      learning_goals TEXT,
      difficulty_level VARCHAR(50),
      duration_months INTEGER DEFAULT 4,
      expected_section_count INTEGER DEFAULT 16,
      audience_scope VARCHAR(50) DEFAULT 'student_teacher',
      teacher_readiness_required BOOLEAN DEFAULT true,
      code_explanation_required BOOLEAN DEFAULT true,
      source_doc_name VARCHAR(255),
      is_active BOOLEAN DEFAULT true,
      created_by_role VARCHAR(20),
      created_by_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS learning_content_chunks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      step_number INTEGER,
      source_type VARCHAR(50) DEFAULT 'lesson',
      audience VARCHAR(20) DEFAULT 'both'
        CHECK (audience IN ('student', 'teacher', 'both')),
      tags TEXT[] DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS learning_project_assets (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_path TEXT NOT NULL,
      asset_type VARCHAR(50) DEFAULT 'file',
      mime_type VARCHAR(100),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS learning_project_roadmap_days (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL,
      month_number INTEGER,
      week_number INTEGER,
      section_number INTEGER,
      section_label VARCHAR(100),
      title VARCHAR(255) NOT NULL,
      teacher_goal TEXT,
      student_goal TEXT,
      activities JSONB DEFAULT '[]'::jsonb,
      materials JSONB DEFAULT '[]'::jsonb,
      code_explanation_focus TEXT,
      end_of_day_checklist JSONB DEFAULT '[]'::jsonb,
      teacher_report_prompts JSONB DEFAULT '[]'::jsonb,
      next_day_prep TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (project_id, day_number)
    );

    CREATE TABLE IF NOT EXISTS learning_group_project_updates (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
      roadmap_day_id INTEGER REFERENCES learning_project_roadmap_days(id) ON DELETE SET NULL,
      day_number INTEGER NOT NULL,
      section_number INTEGER,
      impact_student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      lead_student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      impact_summary TEXT,
      group_progress TEXT,
      completed_items JSONB DEFAULT '[]'::jsonb,
      next_actions TEXT,
      teacher_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (project_id, group_id, day_number)
    );

    CREATE TABLE IF NOT EXISTS teacher_ai_readiness (
      id SERIAL PRIMARY KEY,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE CASCADE,
      is_good_typer BOOLEAN,
      knows_keyboard_letters BOOLEAN,
      note TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (teacher_id, project_id)
    );

    CREATE TABLE IF NOT EXISTS ai_interactions (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE SET NULL,
      group_id INTEGER REFERENCES student_groups(id) ON DELETE SET NULL,
      help_request_id INTEGER REFERENCES group_help_requests(id) ON DELETE SET NULL,
      requester_type VARCHAR(20) NOT NULL,
      requester_id INTEGER NOT NULL,
      audience VARCHAR(20) NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sources JSONB DEFAULT '[]'::jsonb,
      readiness_answer TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS teacher_ai_daily_reports (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE CASCADE,
      teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL,
      completed_items JSONB DEFAULT '[]'::jsonb,
      student_understanding TEXT,
      challenges TEXT,
      support_needed TEXT,
      teacher_notes TEXT,
      ai_next_steps TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (project_id, teacher_id, day_number)
    );

    -- One row per active tutoring conversation. Holds the rolling state
    -- (current topic, what's been covered, last attempt) so the prompt
    -- stays warm across turns and across days, AND a small turn log so the
    -- model can see what was just said without paying for a chat history
    -- table.
    CREATE TABLE IF NOT EXISTS ai_tutoring_sessions (
      id SERIAL PRIMARY KEY,
      user_type VARCHAR(20) NOT NULL,
      user_id INTEGER NOT NULL,
      project_id INTEGER REFERENCES learning_projects(id) ON DELETE SET NULL,
      mode VARCHAR(20) NOT NULL DEFAULT 'student',
      current_topic TEXT,
      completed_topics JSONB DEFAULT '[]'::jsonb,
      last_attempt TEXT,
      turns JSONB DEFAULT '[]'::jsonb,
      turn_count INTEGER DEFAULT 0,
      ended_at TIMESTAMP,
      started_at TIMESTAMP DEFAULT NOW(),
      last_active_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_tutoring_active
      ON ai_tutoring_sessions (user_type, user_id, project_id, ended_at);
  `);

  await pool.query(`
    ALTER TABLE learning_projects
      ADD COLUMN IF NOT EXISTS duration_months INTEGER DEFAULT 4,
      ADD COLUMN IF NOT EXISTS expected_section_count INTEGER DEFAULT 16
  `);

  await pool.query(`
    ALTER TABLE learning_project_roadmap_days
      ADD COLUMN IF NOT EXISTS month_number INTEGER,
      ADD COLUMN IF NOT EXISTS week_number INTEGER,
      ADD COLUMN IF NOT EXISTS section_number INTEGER,
      ADD COLUMN IF NOT EXISTS section_label VARCHAR(100)
  `);

  await pool.query(`
    ALTER TABLE ai_interactions
      ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb
  `);

  console.log('✅ Learning / AI tables ready');
};

const createLearningProject = async (data) => {
  const result = await pool.query(
    `INSERT INTO learning_projects
     (title, subject, grade, class_name, description, learning_goals, difficulty_level,
      duration_months, expected_section_count, audience_scope,
      teacher_readiness_required, code_explanation_required, source_doc_name,
      created_by_role, created_by_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 4), COALESCE($9, 16), $10,
             COALESCE($11, true), COALESCE($12, true), $13, $14, $15)
     ON CONFLICT (title) DO UPDATE SET
       subject = EXCLUDED.subject,
       grade = EXCLUDED.grade,
       class_name = EXCLUDED.class_name,
       description = EXCLUDED.description,
       learning_goals = EXCLUDED.learning_goals,
       difficulty_level = EXCLUDED.difficulty_level,
       duration_months = EXCLUDED.duration_months,
       expected_section_count = EXCLUDED.expected_section_count,
       audience_scope = EXCLUDED.audience_scope,
       teacher_readiness_required = EXCLUDED.teacher_readiness_required,
       code_explanation_required = EXCLUDED.code_explanation_required,
       source_doc_name = EXCLUDED.source_doc_name,
       updated_at = NOW()
     RETURNING *`,
    [
      data.title,
      data.subject || null,
      data.grade || null,
      data.class_name || null,
      data.description || null,
      data.learning_goals || null,
      data.difficulty_level || null,
      data.duration_months || 4,
      data.expected_section_count || 16,
      data.audience_scope || 'student_teacher',
      data.teacher_readiness_required,
      data.code_explanation_required,
      data.source_doc_name || null,
      data.created_by_role || null,
      data.created_by_id || null,
    ]
  );
  return result.rows[0];
};

const getLearningProjects = async ({ includeInactive = false, grade = null, className = null } = {}) => {
  const result = await pool.query(
    `SELECT *
     FROM learning_projects
     WHERE ($1::boolean = true OR is_active = true)
       AND ($2::text IS NULL OR grade = $2)
       AND ($3::text IS NULL OR class_name = $3)
     ORDER BY created_at DESC`,
    [includeInactive, grade, className]
  );
  return result.rows;
};

const getLearningProjectById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM learning_projects WHERE id = $1 AND is_active = true',
    [id]
  );
  return result.rows[0];
};

const addLearningContentChunk = async (projectId, data) => {
  const result = await pool.query(
    `INSERT INTO learning_content_chunks
     (project_id, title, content, step_number, source_type, audience, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      projectId,
      data.title,
      data.content,
      data.step_number || null,
      data.source_type || 'lesson',
      data.audience || 'both',
      data.tags || [],
    ]
  );
  return result.rows[0];
};

const replaceLearningContentChunks = async (projectId, chunks) => {
  await pool.query('DELETE FROM learning_content_chunks WHERE project_id = $1', [projectId]);
  const created = [];
  for (const chunk of chunks) {
    created.push(await addLearningContentChunk(projectId, chunk));
  }
  return created;
};

const getLearningContentChunks = async (projectId, audience = 'both') => {
  const result = await pool.query(
    `SELECT *
     FROM learning_content_chunks
     WHERE project_id = $1
       AND is_active = true
       AND (audience = 'both' OR audience = $2 OR $2 = 'both')
     ORDER BY COALESCE(step_number, 999999), id`,
    [projectId, audience]
  );
  return result.rows;
};

const addLearningProjectAsset = async (projectId, data) => {
  const result = await pool.query(
    `INSERT INTO learning_project_assets
     (project_id, title, file_name, file_path, asset_type, mime_type)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      projectId,
      data.title,
      data.file_name,
      data.file_path,
      data.asset_type || 'file',
      data.mime_type || null,
    ]
  );
  return result.rows[0];
};

const replaceLearningProjectAssets = async (projectId, assets) => {
  await pool.query('DELETE FROM learning_project_assets WHERE project_id = $1', [projectId]);
  const created = [];
  for (const asset of assets) {
    created.push(await addLearningProjectAsset(projectId, asset));
  }
  return created;
};

const getLearningProjectAssets = async (projectId) => {
  const result = await pool.query(
    `SELECT *
     FROM learning_project_assets
     WHERE project_id = $1
       AND is_active = true
     ORDER BY created_at ASC`,
    [projectId]
  );
  return result.rows;
};

const addLearningRoadmapDay = async (projectId, data) => {
  const result = await pool.query(
    `INSERT INTO learning_project_roadmap_days
     (project_id, day_number, month_number, week_number, section_number, section_label,
      title, teacher_goal, student_goal, activities, materials,
      code_explanation_focus, end_of_day_checklist, teacher_report_prompts, next_day_prep)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12, $13::jsonb, $14::jsonb, $15)
     ON CONFLICT (project_id, day_number) DO UPDATE SET
       month_number = EXCLUDED.month_number,
       week_number = EXCLUDED.week_number,
       section_number = EXCLUDED.section_number,
       section_label = EXCLUDED.section_label,
       title = EXCLUDED.title,
       teacher_goal = EXCLUDED.teacher_goal,
       student_goal = EXCLUDED.student_goal,
       activities = EXCLUDED.activities,
       materials = EXCLUDED.materials,
       code_explanation_focus = EXCLUDED.code_explanation_focus,
       end_of_day_checklist = EXCLUDED.end_of_day_checklist,
       teacher_report_prompts = EXCLUDED.teacher_report_prompts,
       next_day_prep = EXCLUDED.next_day_prep,
       is_active = true,
       updated_at = NOW()
     RETURNING *`,
    [
      projectId,
      data.day_number,
      data.month_number || null,
      data.week_number || null,
      data.section_number || data.day_number,
      data.section_label || null,
      data.title,
      data.teacher_goal || null,
      data.student_goal || null,
      JSON.stringify(data.activities || []),
      JSON.stringify(data.materials || []),
      data.code_explanation_focus || null,
      JSON.stringify(data.end_of_day_checklist || []),
      JSON.stringify(data.teacher_report_prompts || []),
      data.next_day_prep || null,
    ]
  );
  return result.rows[0];
};

const replaceLearningRoadmapDays = async (projectId, days) => {
  await pool.query('DELETE FROM learning_project_roadmap_days WHERE project_id = $1', [projectId]);
  const created = [];
  for (const day of days) {
    created.push(await addLearningRoadmapDay(projectId, day));
  }
  return created;
};

const getLearningRoadmapDays = async (projectId) => {
  const result = await pool.query(
    `SELECT *
     FROM learning_project_roadmap_days
     WHERE project_id = $1
       AND is_active = true
     ORDER BY day_number ASC`,
    [projectId]
  );
  return result.rows;
};

const getLearningRoadmapDay = async (projectId, dayNumber) => {
  const result = await pool.query(
    `SELECT *
     FROM learning_project_roadmap_days
     WHERE project_id = $1
       AND day_number = $2
       AND is_active = true`,
    [projectId, dayNumber]
  );
  return result.rows[0];
};

const saveLearningGroupProjectUpdate = async (data) => {
  const result = await pool.query(
    `INSERT INTO learning_group_project_updates
     (project_id, group_id, teacher_id, roadmap_day_id, day_number, section_number,
      impact_student_id, lead_student_id, impact_summary, group_progress, completed_items,
      next_actions, teacher_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13)
     ON CONFLICT (project_id, group_id, day_number) DO UPDATE SET
       teacher_id = EXCLUDED.teacher_id,
       roadmap_day_id = EXCLUDED.roadmap_day_id,
       section_number = EXCLUDED.section_number,
       impact_student_id = EXCLUDED.impact_student_id,
       lead_student_id = EXCLUDED.lead_student_id,
       impact_summary = EXCLUDED.impact_summary,
       group_progress = EXCLUDED.group_progress,
       completed_items = EXCLUDED.completed_items,
       next_actions = EXCLUDED.next_actions,
       teacher_notes = EXCLUDED.teacher_notes,
       updated_at = NOW()
     RETURNING *`,
    [
      data.project_id,
      data.group_id,
      data.teacher_id,
      data.roadmap_day_id || null,
      data.day_number,
      data.section_number || data.day_number,
      data.impact_student_id || null,
      data.lead_student_id || null,
      data.impact_summary || null,
      data.group_progress || null,
      JSON.stringify(data.completed_items || []),
      data.next_actions || null,
      data.teacher_notes || null,
    ]
  );
  return result.rows[0];
};

const getLearningGroupProjectUpdates = async ({ projectId, groupId = null, teacherId = null } = {}) => {
  const values = [projectId];
  let query = `
    SELECT lgpu.*,
           sg.name AS group_name,
           impact.full_name AS impact_student_name,
           lead.full_name AS lead_student_name,
           lprd.title AS roadmap_title
    FROM learning_group_project_updates lgpu
    JOIN student_groups sg ON sg.id = lgpu.group_id
    LEFT JOIN students impact ON impact.id = lgpu.impact_student_id
    LEFT JOIN students lead ON lead.id = lgpu.lead_student_id
    LEFT JOIN learning_project_roadmap_days lprd ON lprd.id = lgpu.roadmap_day_id
    WHERE lgpu.project_id = $1
  `;

  if (groupId) {
    values.push(groupId);
    query += ` AND lgpu.group_id = $${values.length}`;
  }

  if (teacherId) {
    values.push(teacherId);
    query += ` AND lgpu.teacher_id = $${values.length}`;
  }

  query += ' ORDER BY lgpu.day_number ASC, lgpu.updated_at DESC';

  const result = await pool.query(query, values);
  return result.rows;
};

const getTeacherReadiness = async (teacherId, projectId) => {
  const result = await pool.query(
    `SELECT *
     FROM teacher_ai_readiness
     WHERE teacher_id = $1 AND project_id = $2`,
    [teacherId, projectId]
  );
  return result.rows[0];
};

const saveTeacherReadiness = async (teacherId, projectId, data) => {
  const result = await pool.query(
    `INSERT INTO teacher_ai_readiness
     (teacher_id, project_id, is_good_typer, knows_keyboard_letters, note)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (teacher_id, project_id) DO UPDATE SET
       is_good_typer = EXCLUDED.is_good_typer,
       knows_keyboard_letters = EXCLUDED.knows_keyboard_letters,
       note = EXCLUDED.note,
       updated_at = NOW()
     RETURNING *`,
    [
      teacherId,
      projectId,
      data.is_good_typer,
      data.knows_keyboard_letters,
      data.note || null,
    ]
  );
  return result.rows[0];
};

const createAiInteraction = async (data) => {
  const result = await pool.query(
    `INSERT INTO ai_interactions
     (project_id, group_id, help_request_id, requester_type, requester_id, audience,
      question, answer, sources, readiness_answer, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11::jsonb)
     RETURNING *`,
    [
      data.project_id || null,
      data.group_id || null,
      data.help_request_id || null,
      data.requester_type,
      data.requester_id,
      data.audience,
      data.question,
      data.answer,
      JSON.stringify(data.sources || []),
      data.readiness_answer || null,
      JSON.stringify(data.metadata || {}),
    ]
  );
  return result.rows[0];
};

const saveTeacherAiDailyReport = async (data) => {
  const result = await pool.query(
    `INSERT INTO teacher_ai_daily_reports
     (project_id, teacher_id, day_number, completed_items, student_understanding,
      challenges, support_needed, teacher_notes, ai_next_steps)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9)
     ON CONFLICT (project_id, teacher_id, day_number) DO UPDATE SET
       completed_items = EXCLUDED.completed_items,
       student_understanding = EXCLUDED.student_understanding,
       challenges = EXCLUDED.challenges,
       support_needed = EXCLUDED.support_needed,
       teacher_notes = EXCLUDED.teacher_notes,
       ai_next_steps = EXCLUDED.ai_next_steps,
       updated_at = NOW()
     RETURNING *`,
    [
      data.project_id,
      data.teacher_id,
      data.day_number,
      JSON.stringify(data.completed_items || []),
      data.student_understanding || null,
      data.challenges || null,
      data.support_needed || null,
      data.teacher_notes || null,
      data.ai_next_steps || null,
    ]
  );
  return result.rows[0];
};

const getTeacherAiDailyReports = async (projectId, teacherId) => {
  const result = await pool.query(
    `SELECT *
     FROM teacher_ai_daily_reports
     WHERE project_id = $1
       AND teacher_id = $2
     ORDER BY day_number ASC`,
    [projectId, teacherId]
  );
  return result.rows;
};

const getAiInteractionsForRequester = async ({ requesterType, requesterId, projectId = null, limit = 50 } = {}) => {
  const projectFilter = projectId ? 'AND project_id = $4' : '';
  const params = projectId
    ? [requesterType, requesterId, limit, projectId]
    : [requesterType, requesterId, limit];

  const result = await pool.query(
    `SELECT ai.id,
            ai.project_id,
            lp.title AS project_title,
            ai.group_id,
            ai.help_request_id,
            ai.requester_type,
            ai.requester_id,
            ai.audience,
            ai.question,
            ai.answer,
            ai.sources,
            ai.created_at
     FROM (
       SELECT *
       FROM ai_interactions
       WHERE requester_type = $1
         AND requester_id = $2
         ${projectFilter}
       ORDER BY created_at DESC
       LIMIT $3
     ) ai
     LEFT JOIN learning_projects lp ON lp.id = ai.project_id
     ORDER BY ai.created_at ASC`,
    params
  );
  return result.rows;
};

// ── Tutoring sessions (conversational Emrys tutor mode) ──────────────────
// Lifecycle: getOrCreateActiveTutoringSession → appendTutoringTurn (n times)
// → endTutoringSession. Active = ended_at IS NULL AND last_active_at within
// the TTL window (1 hour by default, controlled by the caller).

const TUTORING_TTL_MINUTES = 60;

const getActiveTutoringSession = async ({ userType, userId, projectId }) => {
  const result = await pool.query(
    `SELECT *
       FROM ai_tutoring_sessions
      WHERE user_type = $1
        AND user_id = $2
        AND (project_id IS NOT DISTINCT FROM $3)
        AND ended_at IS NULL
        AND last_active_at > NOW() - INTERVAL '${TUTORING_TTL_MINUTES} minutes'
      ORDER BY last_active_at DESC
      LIMIT 1`,
    [userType, userId, projectId || null]
  );
  return result.rows[0] || null;
};

const createTutoringSession = async ({ userType, userId, projectId, mode = 'student' }) => {
  const result = await pool.query(
    `INSERT INTO ai_tutoring_sessions (user_type, user_id, project_id, mode)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userType, userId, projectId || null, mode]
  );
  return result.rows[0];
};

const getOrCreateActiveTutoringSession = async (opts) => {
  const existing = await getActiveTutoringSession(opts);
  if (existing) return existing;
  return createTutoringSession(opts);
};

const appendTutoringTurn = async (sessionId, { role, content, advanceTopic, checkpoint, lastAttempt }) => {
  // We keep only the last 20 turns in the JSONB column so the prompt stays
  // bounded; older context still lives in the durable session metadata
  // (current_topic, completed_topics) which is updated by markers.
  const sessionRes = await pool.query(
    `SELECT turns, completed_topics, current_topic
       FROM ai_tutoring_sessions WHERE id = $1 FOR UPDATE`,
    [sessionId]
  );
  if (!sessionRes.rows.length) return null;
  const turns = Array.isArray(sessionRes.rows[0].turns) ? sessionRes.rows[0].turns : [];
  turns.push({ role, content, t: new Date().toISOString() });
  while (turns.length > 20) turns.shift();

  const completed = Array.isArray(sessionRes.rows[0].completed_topics)
    ? sessionRes.rows[0].completed_topics : [];
  if (checkpoint && !completed.includes(checkpoint)) completed.push(checkpoint);

  const result = await pool.query(
    `UPDATE ai_tutoring_sessions
       SET turns = $2,
           current_topic = COALESCE($3, current_topic),
           completed_topics = $4,
           last_attempt = COALESCE($5, last_attempt),
           turn_count = turn_count + 1,
           last_active_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId, JSON.stringify(turns), advanceTopic || null,
     JSON.stringify(completed), lastAttempt || null]
  );
  return result.rows[0];
};

const endTutoringSession = async (sessionId) => {
  const result = await pool.query(
    `UPDATE ai_tutoring_sessions
       SET ended_at = NOW(), last_active_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createLearningTables,
  createLearningProject,
  getLearningProjects,
  getLearningProjectById,
  addLearningContentChunk,
  replaceLearningContentChunks,
  getLearningContentChunks,
  addLearningProjectAsset,
  replaceLearningProjectAssets,
  getLearningProjectAssets,
  addLearningRoadmapDay,
  replaceLearningRoadmapDays,
  getLearningRoadmapDays,
  getLearningRoadmapDay,
  saveLearningGroupProjectUpdate,
  getLearningGroupProjectUpdates,
  getTeacherReadiness,
  saveTeacherReadiness,
  createAiInteraction,
  saveTeacherAiDailyReport,
  getTeacherAiDailyReports,
  getAiInteractionsForRequester,
  getActiveTutoringSession,
  createTutoringSession,
  getOrCreateActiveTutoringSession,
  appendTutoringTurn,
  endTutoringSession,
};
