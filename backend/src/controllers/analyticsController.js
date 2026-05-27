const pool = require('../config/db');

// ─── Overview Stats ──────────────────────────────────────────────
const getOverviewStats = async (req, res) => {
  try {
    const [tickets, agents, customers, categories] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) as total_tickets,
          COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_tickets,
          COUNT(*) FILTER (WHERE status = 'closed') as closed_tickets,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as new_today,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_this_week,
          COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_tickets,
          COUNT(*) FILTER (WHERE priority = 'high') as high_tickets
        FROM tickets
      `),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE role = 'agent') as total_agents,
          COUNT(*) FILTER (WHERE role = 'agent' AND is_active = true) as active_agents,
          COUNT(*) FILTER (WHERE role = 'agent') as agents_count,
          COUNT(*) FILTER (WHERE role = 'admin') as admins_count
        FROM users
      `),
      pool.query(`
        SELECT COUNT(*) as total_customers FROM customers
      `),
      pool.query(`
        SELECT COUNT(*) as total_categories FROM categories
      `)
    ]);

    res.status(200).json({
      tickets: tickets.rows[0],
      agents: agents.rows[0],
      customers: customers.rows[0],
      categories: categories.rows[0],
    });
  } catch (error) {
    console.error('Overview stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Ticket Volume Over Time ─────────────────────────────────────
const getTicketVolume = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'closed') as closed,
        COUNT(*) FILTER (WHERE status = 'open') as open,
        COUNT(*) FILTER (WHERE status = 'pending') as pending
      FROM tickets
      WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.status(200).json({ volume: result.rows });
  } catch (error) {
    console.error('Ticket volume error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Agent Performance ───────────────────────────────────────────
const getAgentPerformance = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(`
      SELECT
        u.id,
        u.full_name,
        u.role,
        COUNT(t.id) as total_assigned,
        COUNT(t.id) FILTER (WHERE t.status = 'closed') as total_closed,
        COUNT(t.id) FILTER (WHERE t.status = 'open') as total_open,
        COUNT(t.id) FILTER (WHERE t.status = 'pending') as total_pending,
        ROUND(
          AVG(
            EXTRACT(EPOCH FROM (t.closed_at - t.created_at)) / 3600
          ) FILTER (WHERE t.closed_at IS NOT NULL),
          2
        ) as avg_resolution_hours
      FROM users u
      LEFT JOIN tickets t ON u.id = t.assigned_to
        AND t.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      WHERE u.role = 'agent'
      AND u.is_active = true
      GROUP BY u.id, u.full_name, u.role
      ORDER BY total_closed DESC
    `);

    res.status(200).json({ agents: result.rows });
  } catch (error) {
    console.error('Agent performance error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Tickets by Category ─────────────────────────────────────────
const getTicketsByCategory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        COUNT(t.id) as total_tickets,
        COUNT(t.id) FILTER (WHERE t.status = 'open') as open_tickets,
        COUNT(t.id) FILTER (WHERE t.status = 'closed') as closed_tickets
      FROM categories c
      LEFT JOIN tickets t ON c.id = t.category_id
      GROUP BY c.id, c.name
      ORDER BY total_tickets DESC
    `);

    res.status(200).json({ categories: result.rows });
  } catch (error) {
    console.error('Tickets by category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Tickets by Priority ─────────────────────────────────────────
const getTicketsByPriority = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        priority,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'open') as open,
        COUNT(*) FILTER (WHERE status = 'closed') as closed
      FROM tickets
      GROUP BY priority
      ORDER BY
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          WHEN 'low' THEN 4
        END
    `);

    res.status(200).json({ priorities: result.rows });
  } catch (error) {
    console.error('Tickets by priority error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Response Time Report ────────────────────────────────────────
const getResponseTimes = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(`
      SELECT
        t.id,
        t.title,
        t.priority,
        t.created_at,
        t.closed_at,
        u.full_name as assigned_to_name,
        ROUND(
          EXTRACT(EPOCH FROM (t.closed_at - t.created_at)) / 3600,
          2
        ) as resolution_hours,
        (
          SELECT MIN(tr.created_at)
          FROM ticket_replies tr
          WHERE tr.ticket_id = t.id
          AND tr.is_internal_note = false
        ) as first_reply_at,
        ROUND(
          EXTRACT(EPOCH FROM (
            (SELECT MIN(tr.created_at) FROM ticket_replies tr
             WHERE tr.ticket_id = t.id AND tr.is_internal_note = false)
            - t.created_at
          )) / 3600,
          2
        ) as first_response_hours
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      AND t.closed_at IS NOT NULL
      ORDER BY t.closed_at DESC
      LIMIT 100
    `);

    // Calculate averages
    const avgResult = await pool.query(`
      SELECT
        ROUND(AVG(
          EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600
        ), 2) as avg_resolution_hours,
        ROUND(AVG(
          EXTRACT(EPOCH FROM (
            (SELECT MIN(tr.created_at) FROM ticket_replies tr
             WHERE tr.ticket_id = t.id AND tr.is_internal_note = false)
            - created_at
          )) / 3600
        ), 2) as avg_first_response_hours
      FROM tickets t
      WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      AND closed_at IS NOT NULL
    `);

    res.status(200).json({
      tickets: result.rows,
      averages: avgResult.rows[0],
    });
  } catch (error) {
    console.error('Response times error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Full Analytics Report ───────────────────────────────────────
const getFullReport = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const [overview, volume, agentPerf, categories, priorities] =
      await Promise.all([
        pool.query(`
          SELECT
            COUNT(*) as total_tickets,
            COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
            COUNT(*) FILTER (WHERE status = 'pending') as pending_tickets,
            COUNT(*) FILTER (WHERE status = 'closed') as closed_tickets,
            COUNT(*) FILTER (
              WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
            ) as tickets_in_period
          FROM tickets
        `),
        pool.query(`
          SELECT
            DATE(created_at) as date,
            COUNT(*) as total
          FROM tickets
          WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `),
        pool.query(`
          SELECT
            u.full_name,
            u.role,
            COUNT(t.id) as total_assigned,
            COUNT(t.id) FILTER (WHERE t.status = 'closed') as total_closed
          FROM users u
          LEFT JOIN tickets t ON u.id = t.assigned_to
          WHERE u.role = 'agent' AND u.is_active = true
          GROUP BY u.id, u.full_name, u.role
          ORDER BY total_closed DESC
        `),
        pool.query(`
          SELECT c.name, COUNT(t.id) as total
          FROM categories c
          LEFT JOIN tickets t ON c.id = t.category_id
          GROUP BY c.id, c.name
          ORDER BY total DESC
        `),
        pool.query(`
          SELECT priority, COUNT(*) as total
          FROM tickets
          GROUP BY priority
        `)
      ]);

    res.status(200).json({
      period_days: days,
      overview: overview.rows[0],
      volume: volume.rows,
      agent_performance: agentPerf.rows,
      by_category: categories.rows,
      by_priority: priorities.rows,
    });
  } catch (error) {
    console.error('Full report error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLearningLeaderboard = async (req, res) => {
  try {
    let accessJoin = '';
    const params = [];

    if (req.user.role === 'teacher') {
      params.push(req.user.id);
      accessJoin = `JOIN teacher_group_access viewer_tga
                      ON viewer_tga.group_id = sg.id
                     AND viewer_tga.teacher_id = $1
                     AND viewer_tga.is_active = true`;
    } else if (req.user.role === 'student') {
      // Students used to be scoped to ONLY the groups they're in, which made
      // the leaderboard look broken (one row on the podium, list empty).
      // Now they see their full CLASS: every group in the same school +
      // class_name. NULL class_name on either side counts as a wildcard so
      // school-wide / un-classified groups still appear for that student.
      params.push(req.user.id);
      accessJoin = `JOIN students viewer_s
                      ON viewer_s.id = $1
                     AND viewer_s.school_id = sg.school_id
                     AND (
                          sg.class_name IS NULL
                       OR viewer_s.class_name IS NULL
                       OR LOWER(sg.class_name) = LOWER(viewer_s.class_name)
                     )`;
    }

    const result = await pool.query(
      `SELECT (ROW_NUMBER() OVER (ORDER BY AVG(gr.score) DESC, MAX(gr.submitted_at) DESC))::integer AS rank,
              sg.id AS group_id,
              sg.name AS group_name,
              gr.project_name,
              ROUND(AVG(gr.score))::integer AS score,
              COUNT(DISTINCT gm.student_id)::integer AS member_count,
              CASE
                WHEN AVG(gr.score) >= 90 THEN 'excellent'
                WHEN AVG(gr.score) >= 75 THEN 'strong'
                WHEN AVG(gr.score) >= 60 THEN 'improvement'
                ELSE 'needs_support'
              END AS badge
       FROM group_ratings gr
       JOIN student_groups sg ON sg.id = gr.group_id
       ${accessJoin}
       LEFT JOIN group_members gm ON gm.group_id = sg.id
       GROUP BY sg.id, sg.name, gr.project_name
       ORDER BY score DESC, MAX(gr.submitted_at) DESC
       LIMIT 50`,
      params
    );

    res.status(200).json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Learning leaderboard error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Per-Project Analytics ───────────────────────────────────────
const getProjectAnalytics = async (req, res) => {
  try {
    const ratings = await getRatingProjectAnalytics(req.user);
    const progress = await getLearningProjectProgressAnalytics(req.user);

    const merged = new Map();

    progress.forEach((row) => {
      merged.set(row.project_name, normalizeProjectAnalyticsRow(row, 'progress'));
    });

    ratings.forEach((row) => {
      const existing = merged.get(row.project_name) || {};
      merged.set(row.project_name, {
        ...existing,
        ...normalizeProjectAnalyticsRow(row, 'ratings'),
        group_count: Math.max(Number(existing.group_count || 0), Number(row.group_count || 0)),
        student_count: Math.max(Number(existing.student_count || 0), Number(row.student_count || 0)),
        top_group_name: row.top_group_name || existing.top_group_name || null,
        last_updated: newestDateValue(existing.last_updated, row.last_updated),
      });
    });

    const projects = Array.from(merged.values())
      .sort((a, b) => Number(b.avg_score || 0) - Number(a.avg_score || 0));

    res.status(200).json({ projects });
  } catch (error) {
    // Surface the real cause to both the backend log AND the response body
    // so the renderer's diagnostic catch shows something useful instead of
    // just "Server error". This is dev-only diagnostic noise — the catch
    // on the renderer logs it; we can strip the response detail later.
    console.error('Project analytics error:', error.stack || error.message || error);
    res.status(500).json({
      message: error.message || 'Server error',
      detail: error.stack ? error.stack.split('\n').slice(0, 4).join(' | ') : null,
    });
  }
};

const getRatingProjectAnalytics = async (user) => {
  let accessJoin = '';
  const params = [];

  if (user.role === 'teacher') {
    params.push(user.id);
    accessJoin = `JOIN teacher_group_access tga
                    ON tga.group_id = sg.id
                   AND tga.teacher_id = $1
                   AND tga.is_active = true`;
  } else if (user.role === 'student') {
    params.push(user.id);
    accessJoin = `JOIN group_members gm_v
                    ON gm_v.group_id = sg.id
                   AND gm_v.student_id = $1`;
  }

  const result = await pool.query(
    `SELECT
       gr.project_name,
       ROUND(AVG(gr.score))::integer                        AS avg_score,
       MAX(gr.score)                                        AS top_score,
       MIN(gr.score)                                        AS low_score,
       COUNT(DISTINCT gr.group_id)::integer                 AS group_count,
       COUNT(DISTINCT gm.student_id)::integer               AS student_count,
       MAX(gr.submitted_at)                                 AS last_updated,
       (SELECT sg2.name
          FROM student_groups sg2
          JOIN group_ratings gr2 ON gr2.group_id = sg2.id
         WHERE gr2.project_name = gr.project_name
         ORDER BY gr2.score DESC
         LIMIT 1)                                           AS top_group_name,
       COUNT(gr.id)::integer                                AS rating_count,
       0::integer                                           AS update_count
     FROM group_ratings gr
     JOIN student_groups sg ON sg.id = gr.group_id
     ${accessJoin}
     LEFT JOIN group_members gm ON gm.group_id = gr.group_id
     GROUP BY gr.project_name
     ORDER BY avg_score DESC`,
    params
  );

  return result.rows;
};

const getLearningProjectProgressAnalytics = async (user) => {
  const values = [];
  let visibleGroupCte = `SELECT id, name, grade, class_name FROM student_groups`;
  let projectGroupJoin = 'LEFT JOIN';

  if (user.role === 'teacher') {
    values.push(user.id);
    projectGroupJoin = 'JOIN';
    visibleGroupCte = `
      SELECT sg.id, sg.name, sg.grade, sg.class_name
      FROM student_groups sg
      JOIN teacher_group_access tga
        ON tga.group_id = sg.id
       AND tga.teacher_id = $1
       AND tga.is_active = true
    `;
  } else if (user.role === 'student') {
    values.push(user.id);
    projectGroupJoin = 'JOIN';
    visibleGroupCte = `
      SELECT sg.id, sg.name, sg.grade, sg.class_name
      FROM student_groups sg
      JOIN group_members gm_v
        ON gm_v.group_id = sg.id
       AND gm_v.student_id = $1
    `;
  }

  const result = await pool.query(
    `WITH visible_groups AS (
       ${visibleGroupCte}
     ),
     project_groups AS (
       SELECT lp.id AS project_id,
              lp.title AS project_name,
              lp.expected_section_count,
              lp.updated_at AS project_updated_at,
              vg.id AS group_id,
              vg.name AS group_name
       FROM learning_projects lp
       ${projectGroupJoin} visible_groups vg
         ON (lp.grade IS NULL OR vg.grade IS NULL OR LOWER(lp.grade) = LOWER(vg.grade))
        AND (lp.class_name IS NULL OR vg.class_name IS NULL OR LOWER(lp.class_name) = LOWER(vg.class_name))
       WHERE lp.is_active = true
     ),
     update_progress AS (
       SELECT pg.project_name,
              pg.group_id,
              pg.group_name,
              pg.expected_section_count,
              pg.project_updated_at,
              MAX(lgpu.day_number) AS latest_day,
              MAX(lgpu.updated_at) AS latest_update,
              COUNT(lgpu.id)::integer AS update_count
       FROM project_groups pg
       LEFT JOIN learning_group_project_updates lgpu
         ON lgpu.project_id = pg.project_id
        AND lgpu.group_id = pg.group_id
       GROUP BY pg.project_name, pg.group_id, pg.group_name, pg.expected_section_count, pg.project_updated_at
     )
     SELECT project_name,
            COALESCE(
              ROUND(
                AVG(
                  LEAST(
                    100,
                    CASE
                      WHEN COALESCE(expected_section_count, 0) > 0
                        THEN COALESCE(latest_day, 0)::numeric * 100 / expected_section_count
                      ELSE 0
                    END
                  )
                )
              )::integer,
              0
            ) AS avg_score,
            COALESCE(
              MAX(
                LEAST(
                  100,
                  CASE
                    WHEN COALESCE(expected_section_count, 0) > 0
                      THEN COALESCE(latest_day, 0)::numeric * 100 / expected_section_count
                    ELSE 0
                  END
                )
              )::integer,
              0
            ) AS top_score,
            COALESCE(
              MIN(
                LEAST(
                  100,
                  CASE
                    WHEN COALESCE(expected_section_count, 0) > 0
                      THEN COALESCE(latest_day, 0)::numeric * 100 / expected_section_count
                    ELSE 0
                  END
                )
              )::integer,
              0
            ) AS low_score,
            COUNT(DISTINCT up.group_id)::integer AS group_count,
            COUNT(DISTINCT gm.student_id)::integer AS student_count,
            COALESCE(MAX(latest_update), MAX(project_updated_at)) AS last_updated,
            (ARRAY_AGG(group_name ORDER BY latest_day DESC NULLS LAST, latest_update DESC NULLS LAST))[1] AS top_group_name,
            0::integer AS rating_count,
            COALESCE(SUM(update_count), 0)::integer AS update_count
     FROM update_progress up
     LEFT JOIN group_members gm ON gm.group_id = up.group_id
     GROUP BY project_name
     ORDER BY avg_score DESC, project_name ASC`,
    values
  );

  return result.rows;
};

const normalizeProjectAnalyticsRow = (row, source) => ({
  project_name: row.project_name,
  avg_score: Number(row.avg_score || 0),
  top_score: Number(row.top_score || 0),
  low_score: Number(row.low_score || 0),
  group_count: Number(row.group_count || 0),
  student_count: Number(row.student_count || 0),
  last_updated: row.last_updated || null,
  top_group_name: row.top_group_name || null,
  rating_count: Number(row.rating_count || 0),
  update_count: Number(row.update_count || 0),
  source,
});

const newestDateValue = (left, right) => {
  if (!left) return right || null;
  if (!right) return left || null;
  return new Date(left).getTime() >= new Date(right).getTime() ? left : right;
};

module.exports = {
  getOverviewStats,
  getTicketVolume,
  getAgentPerformance,
  getTicketsByCategory,
  getTicketsByPriority,
  getResponseTimes,
  getFullReport,
  getLearningLeaderboard,
  getProjectAnalytics,
  getAnalyticsSummary,
};

// ─── Analytics Summary — what iOS + desktop expect at /api/analytics/summary ──
// Returns headline counts (students, groups, average rating) plus a per-project
// row list, all scoped to the caller's role:
//   teacher → only their accessible groups (via teacher_group_access)
//   student → only their own groups (via group_members)
//   agent/admin → everything
//
// The shape matches EngineAnalyticsSummary on the iOS side:
//   { summary: { total_students, total_groups, average_score,
//                projects: [{ id, title, student_count, avg_score }] } }
async function getAnalyticsSummary(req, res) {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;

    // Scope join shared across all three sub-queries. Empty for agent/admin.
    let scopeJoin = '';
    const scopeParams = [];
    if (role === 'teacher' && Number.isInteger(userId)) {
      scopeParams.push(userId);
      scopeJoin = `JOIN teacher_group_access tga
                     ON tga.group_id = sg.id
                    AND tga.teacher_id = $1
                    AND tga.is_active = true`;
    } else if (role === 'student' && Number.isInteger(userId)) {
      scopeParams.push(userId);
      scopeJoin = `JOIN group_members gm_v
                     ON gm_v.group_id = sg.id
                    AND gm_v.student_id = $1`;
    }

    // 1) Top-line counts.
    const totalsResult = await pool.query(
      `SELECT
         COUNT(DISTINCT sg.id)::integer            AS total_groups,
         COUNT(DISTINCT gm.student_id)::integer    AS total_students,
         COALESCE(ROUND(AVG(gr.score)::numeric, 1), 0)::float AS average_score
       FROM student_groups sg
       ${scopeJoin}
       LEFT JOIN group_members gm ON gm.group_id = sg.id
       LEFT JOIN group_ratings gr ON gr.group_id = sg.id`,
      scopeParams
    );

    // 2) Per-project rows from group_ratings, also scoped.
    const projectsResult = await pool.query(
      `SELECT
         MIN(gr.id)::integer                                          AS id,
         gr.project_name                                              AS title,
         COUNT(DISTINCT gm.student_id)::integer                       AS student_count,
         COALESCE(ROUND(AVG(gr.score)::numeric, 1), 0)::float         AS avg_score
       FROM group_ratings gr
       JOIN student_groups sg ON sg.id = gr.group_id
       ${scopeJoin}
       LEFT JOIN group_members gm ON gm.group_id = gr.group_id
       GROUP BY gr.project_name
       ORDER BY avg_score DESC, gr.project_name ASC`,
      scopeParams
    );

    const totals = totalsResult.rows[0] || {};
    const summary = {
      total_students: totals.total_students || 0,
      total_groups:   totals.total_groups   || 0,
      average_score:  totals.average_score  || 0,
      projects:       projectsResult.rows,
    };
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Analytics summary error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}
