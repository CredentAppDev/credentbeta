const pool = require('../config/db');

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      role VARCHAR(20) NOT NULL DEFAULT 'agent'
        CHECK (role IN ('agent', 'admin')),
      is_active BOOLEAN DEFAULT true,
      refresh_token TEXT,
      passkey VARCHAR(10),
      passkey_expires_at TIMESTAMP,
      passkey_used BOOLEAN DEFAULT false,
      device_token TEXT,
      profile_picture_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Add passkey columns if they don't exist (for existing tables)
    ALTER TABLE users ADD COLUMN IF NOT EXISTS passkey VARCHAR(10);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS passkey_expires_at TIMESTAMP;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS passkey_used BOOLEAN DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS device_token TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

    UPDATE users
    SET role = 'agent'
    WHERE role IN ('senior_agent', 'team_lead');

    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users ADD CONSTRAINT users_role_check
      CHECK (role IN ('agent', 'admin'));
  `;
  await pool.query(query);
  console.log('✅ Users table ready');
};

// ─── Find User By Email ──────────────────────────────────────────
const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  );
  return result.rows[0];
};

// ─── Find User By ID ─────────────────────────────────────────────
const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, full_name, email, role, is_active, profile_picture_url, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const updateUserProfilePicture = async (userId, profilePictureUrl) => {
  const result = await pool.query(
    `UPDATE users
     SET profile_picture_url = $1,
         updated_at = NOW()
     WHERE id = $2
       AND is_active = true
     RETURNING id, full_name, email, role, is_active, profile_picture_url, created_at`,
    [profilePictureUrl, userId]
  );
  return result.rows[0];
};

// ─── Create User ─────────────────────────────────────────────────
const createUser = async ({ full_name, email, password_hash, role }) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role, created_at`,
    [full_name, email, password_hash || null, role]
  );
  return result.rows[0];
};

// ─── Update Refresh Token ────────────────────────────────────────
const updateRefreshToken = async (userId, token) => {
  await pool.query(
    'UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2',
    [token, userId]
  );
};

// ─── Find User By Refresh Token ──────────────────────────────────
const findUserByRefreshToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE refresh_token = $1 AND is_active = true',
    [token]
  );
  return result.rows[0];
};

// ─── Save Passkey ────────────────────────────────────────────────
const savePasskey = async (userId, passkey) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const result = await pool.query(
    `UPDATE users SET
      passkey = $1,
      passkey_expires_at = $2,
      passkey_used = false,
      updated_at = NOW()
     WHERE id = $3
     RETURNING id, full_name, email, role, passkey_expires_at, passkey_used`,
    [passkey, expiresAt, userId]
  );
  return result.rows[0];
};

// ─── Find User By Passkey ────────────────────────────────────────
const findUserByPasskey = async (email, passkey) => {
  const result = await pool.query(
    `SELECT * FROM users
     WHERE email = $1
     AND passkey = $2
     AND is_active = true`,
    [email, passkey]
  );
  return result.rows[0];
};

// ─── Find User By Passkey Only (for unified first-step detection) ────────
const findUserByPasskeyOnly = async (passkey) => {
  const result = await pool.query(
    `SELECT id, full_name, email, role, is_active, created_at
     FROM users
     WHERE passkey = $1
       AND is_active = true`,
    [passkey]
  );
  return result.rows[0];
};

// ─── Mark Passkey As Used ────────────────────────────────────────
const markPasskeyUsed = async (userId) => {
  await pool.query(
    `UPDATE users SET
      passkey_used = true,
      updated_at = NOW()
     WHERE id = $1`,
    [userId]
  );
};

// ─── Save Device Token ───────────────────────────────────────────
const saveDeviceToken = async (userId, deviceToken) => {
  await pool.query(
    `UPDATE users SET
      device_token = $1,
      updated_at = NOW()
     WHERE id = $2`,
    [deviceToken, userId]
  );
};

// ─── Find User By Device Token ───────────────────────────────────
const findUserByDeviceToken = async (deviceToken) => {
  const result = await pool.query(
    `SELECT id, full_name, email, role, is_active
     FROM users
     WHERE device_token = $1
     AND is_active = true`,
    [deviceToken]
  );
  return result.rows[0];
};

// ─── Clear Device Token (on uninstall/logout) ────────────────────
const clearDeviceToken = async (userId) => {
  await pool.query(
    `UPDATE users SET
      device_token = NULL,
      updated_at = NOW()
     WHERE id = $1`,
    [userId]
  );
};

module.exports = {
  createUsersTable,
  findUserByEmail,
  findUserById,
  createUser,
  updateRefreshToken,
  findUserByRefreshToken,
  savePasskey,
  findUserByPasskey,
  findUserByPasskeyOnly,
  markPasskeyUsed,
  saveDeviceToken,
  findUserByDeviceToken,
  clearDeviceToken,
  updateUserProfilePicture,
};
