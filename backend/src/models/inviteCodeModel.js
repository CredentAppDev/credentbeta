const pool = require('../config/db');
const crypto = require('crypto');

const createInviteCodeTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS beta_invite_codes (
      id SERIAL PRIMARY KEY,
      code VARCHAR(24) UNIQUE NOT NULL,
      role VARCHAR(16) NOT NULL CHECK (role IN ('teacher', 'student')),
      grade VARCHAR(64),
      class_name VARCHAR(64),
      school_code VARCHAR(64),
      max_uses INTEGER NOT NULL DEFAULT 1,
      uses INTEGER NOT NULL DEFAULT 0,
      label VARCHAR(255),
      created_by INTEGER,
      expires_at TIMESTAMP,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_invite_codes_active
      ON beta_invite_codes (code) WHERE is_active = true;
  `);
  console.log('✅ Beta invite codes table ready');
};

// Codes look like CRD-A7K9-XQ2P — short enough to type, long enough to be
// hard to guess (24 bits of entropy after the prefix).
const generateCode = () => {
  const chunk = () =>
    crypto.randomBytes(2).toString('hex').toUpperCase()
      .replace(/[OIL01]/g, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 30)]);
  return `CRD-${chunk()}-${chunk()}`;
};

const createInviteCode = async (data) => {
  for (let i = 0; i < 10; i += 1) {
    const code = generateCode();
    try {
      const result = await pool.query(
        `INSERT INTO beta_invite_codes
           (code, role, grade, class_name, school_code, max_uses, label, created_by, expires_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING *`,
        [
          code,
          data.role,
          data.grade || null,
          data.class_name || null,
          data.school_code || null,
          Math.max(1, Number(data.max_uses) || 1),
          data.label || null,
          data.created_by || null,
          data.expires_at || null,
        ]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '23505') continue; // unique collision, try again
      throw err;
    }
  }
  throw new Error('Could not generate a unique invite code');
};

const findInviteCode = async (code) => {
  const result = await pool.query(
    `SELECT * FROM beta_invite_codes
      WHERE code = $1
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > NOW())
        AND uses < max_uses`,
    [String(code || '').trim().toUpperCase()]
  );
  return result.rows[0];
};

const incrementInviteUse = async (id) => {
  await pool.query(
    `UPDATE beta_invite_codes
        SET uses = uses + 1,
            is_active = CASE WHEN uses + 1 >= max_uses THEN false ELSE is_active END
      WHERE id = $1`,
    [id]
  );
};

const listInviteCodes = async () => {
  const result = await pool.query(
    `SELECT * FROM beta_invite_codes ORDER BY created_at DESC LIMIT 200`
  );
  return result.rows;
};

const revokeInviteCode = async (id) => {
  const result = await pool.query(
    `UPDATE beta_invite_codes SET is_active = false WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createInviteCodeTable,
  createInviteCode,
  findInviteCode,
  incrementInviteUse,
  listInviteCodes,
  revokeInviteCode,
};
