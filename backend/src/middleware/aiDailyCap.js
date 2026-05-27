const pool = require('../config/db');

const DEFAULT_DAILY_CAP = 30;
const UNCAPPED_ROLES = new Set(['agent', 'admin']);

const ensureTable = (async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_daily_usage (
      user_id INTEGER NOT NULL,
      role VARCHAR(32) NOT NULL,
      day_utc DATE NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, role, day_utc)
    )
  `);
})().catch((err) => {
  console.error('[aiDailyCap] table init failed:', err.message);
});

const getCap = () => {
  const raw = Number(process.env.AI_DAILY_CAP);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DAILY_CAP;
};

const todayUtc = () => new Date().toISOString().slice(0, 10);

// Check + increment in one round-trip. We do this BEFORE the controller runs;
// if the controller later fails we'd over-count by one — acceptable for a
// daily cap (worst case a tester sees "29 left" become "28 left" after a 500).
const aiDailyCap = async (req, res, next) => {
  if (!req.user) return next();
  if (UNCAPPED_ROLES.has(req.user.role)) return next();

  const cap = getCap();
  const day = todayUtc();

  try {
    await ensureTable;
    const result = await pool.query(
      `INSERT INTO ai_daily_usage (user_id, role, day_utc, count)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (user_id, role, day_utc)
       DO UPDATE SET count = ai_daily_usage.count + 1, updated_at = NOW()
       RETURNING count`,
      [req.user.id, req.user.role, day]
    );
    const used = result.rows[0].count;

    res.setHeader('X-AI-Daily-Cap', String(cap));
    res.setHeader('X-AI-Daily-Used', String(used));

    if (used > cap) {
      // Roll back the increment so the count reflects allowed usage only —
      // testers who get blocked don't keep accumulating phantom usage.
      await pool.query(
        `UPDATE ai_daily_usage SET count = $1 WHERE user_id = $2 AND role = $3 AND day_utc = $4`,
        [cap, req.user.id, req.user.role, day]
      );
      return res.status(429).json({
        message: `You've used your ${cap} AI questions for today. The limit resets at midnight UTC.`,
        code: 'AI_DAILY_CAP_REACHED',
        cap,
        used: cap,
      });
    }

    next();
  } catch (err) {
    console.error('[aiDailyCap] error:', err.message);
    // Fail open — a DB hiccup shouldn't block legitimate users from teaching.
    next();
  }
};

module.exports = { aiDailyCap };
