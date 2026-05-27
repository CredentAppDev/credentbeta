const pool = require('../config/db');

const normalizePrincipal = (principalOrId, fallbackType = 'staff') => {
  if (typeof principalOrId === 'number' || typeof principalOrId === 'string') {
    const id = parseInt(principalOrId, 10);
    if (!Number.isInteger(id)) throw new Error('Invalid principal id');
    return { type: fallbackType, id };
  }

  const type = principalOrId.type || principalOrId.principalType || fallbackType;
  const id = parseInt(
    principalOrId.id || principalOrId.principalId || principalOrId.member_id,
    10
  );

  if (!['staff', 'student', 'teacher'].includes(type)) {
    throw new Error('Invalid principal type');
  }

  if (!Number.isInteger(id)) {
    throw new Error('Invalid principal id');
  }

  return { type, id };
};

const staffUserId = (principal) => (principal.type === 'staff' ? principal.id : null);

const createMessagingTables = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS channels (
      id SERIAL PRIMARY KEY,
      type VARCHAR(10) NOT NULL CHECK (type IN ('dm', 'group')),
      name VARCHAR(100),
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS channel_members (
      id SERIAL PRIMARY KEY,
      channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      joined_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(channel_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
      sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      body TEXT NOT NULL,
      message_type VARCHAR(20) DEFAULT 'text',
      media_url TEXT,
      audio_duration INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      deleted_at TIMESTAMP
    );

    ALTER TABLE channel_members ADD COLUMN IF NOT EXISTS member_type VARCHAR(20) DEFAULT 'staff';
    ALTER TABLE channel_members ADD COLUMN IF NOT EXISTS member_id INTEGER;
    UPDATE channel_members
    SET member_type = 'staff'
    WHERE member_type IS NULL;
    UPDATE channel_members
    SET member_id = user_id
    WHERE member_id IS NULL AND user_id IS NOT NULL;
    ALTER TABLE channel_members DROP CONSTRAINT IF EXISTS channel_members_channel_id_user_id_key;
    ALTER TABLE channel_members DROP CONSTRAINT IF EXISTS channel_members_member_unique;
    ALTER TABLE channel_members ADD CONSTRAINT channel_members_member_unique
      UNIQUE(channel_id, member_type, member_id);
    ALTER TABLE channel_members DROP CONSTRAINT IF EXISTS channel_members_member_type_check;
    ALTER TABLE channel_members ADD CONSTRAINT channel_members_member_type_check
      CHECK (member_type IN ('staff', 'student', 'teacher'));

    ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_type VARCHAR(20) DEFAULT 'staff';
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_entity_id INTEGER;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(20) DEFAULT 'text';
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url TEXT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS audio_duration INTEGER;
    UPDATE messages
    SET sender_type = 'staff'
    WHERE sender_type IS NULL;
    UPDATE messages
    SET sender_entity_id = sender_id
    WHERE sender_entity_id IS NULL AND sender_id IS NOT NULL;
    ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_type_check;
    ALTER TABLE messages ADD CONSTRAINT messages_sender_type_check
      CHECK (sender_type IN ('staff', 'student', 'teacher'));
    ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_type_check;
    UPDATE messages
    SET message_type = 'text'
    WHERE message_type IS NULL;
    UPDATE messages
    SET message_type = 'audio'
    WHERE body = '[Voice message]'
      AND message_type = 'text';
    ALTER TABLE messages ADD CONSTRAINT messages_message_type_check
      CHECK (message_type IN ('text', 'audio', 'image', 'file', 'system'));
  `;
  await pool.query(query);
  console.log('✅ Messaging tables ready');
};

// ─── Find Existing DM Channel ────────────────────────────────────
const findPrincipalDMChannel = async (principalA, principalB) => {
  const first = normalizePrincipal(principalA);
  const second = normalizePrincipal(principalB);

  const result = await pool.query(
    `SELECT c.* FROM channels c
     JOIN channel_members cm1 ON c.id = cm1.channel_id
     JOIN channel_members cm2 ON c.id = cm2.channel_id
     WHERE c.type = 'dm'
       AND cm1.member_type = $1
       AND cm1.member_id = $2
       AND cm2.member_type = $3
       AND cm2.member_id = $4
     LIMIT 1`,
    [first.type, first.id, second.type, second.id]
  );
  return result.rows[0];
};

const findDMChannel = async (userId1, userId2) => {
  return findPrincipalDMChannel(
    { type: 'staff', id: userId1 },
    { type: 'staff', id: userId2 }
  );
};

// ─── Create DM Channel ───────────────────────────────────────────
const createPrincipalDMChannel = async (principalA, principalB) => {
  const first = normalizePrincipal(principalA);
  const second = normalizePrincipal(principalB);
  const createdBy = staffUserId(first) || staffUserId(second);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const channel = await client.query(
      `INSERT INTO channels (type, created_by)
       VALUES ('dm', $1) RETURNING *`,
      [createdBy]
    );

    const channelId = channel.rows[0].id;

    await client.query(
      `INSERT INTO channel_members (channel_id, user_id, member_type, member_id)
       VALUES ($1, $2, $3, $4), ($1, $5, $6, $7)
       ON CONFLICT (channel_id, member_type, member_id) DO NOTHING`,
      [
        channelId,
        staffUserId(first),
        first.type,
        first.id,
        staffUserId(second),
        second.type,
        second.id,
      ]
    );

    await client.query('COMMIT');
    return channel.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const createDMChannel = async (userId1, userId2) => {
  return createPrincipalDMChannel(
    { type: 'staff', id: userId1 },
    { type: 'staff', id: userId2 }
  );
};

// ─── Create Group Channel ────────────────────────────────────────
const createGroupChannel = async (name, createdBy, memberIds) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const channel = await client.query(
      `INSERT INTO channels (type, name, created_by)
       VALUES ('group', $1, $2) RETURNING *`,
      [name, createdBy]
    );

    const channelId = channel.rows[0].id;

    const allMembers = [...new Set([createdBy, ...memberIds])];
    for (const userId of allMembers) {
      await client.query(
        `INSERT INTO channel_members (channel_id, user_id, member_type, member_id)
         VALUES ($1, $2, 'staff', $2)
         ON CONFLICT (channel_id, member_type, member_id) DO NOTHING`,
        [channelId, userId]
      );
    }

    await client.query('COMMIT');
    return channel.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// ─── Get User Channels ───────────────────────────────────────────
const getPrincipalChannels = async (principalOrId, fallbackType = 'staff') => {
  const principal = normalizePrincipal(principalOrId, fallbackType);

  const result = await pool.query(
    `SELECT
      c.*,
      (
        SELECT COALESCE(u.full_name, s.full_name, t.full_name)
        FROM channel_members cm2
        LEFT JOIN users u ON cm2.member_type = 'staff' AND u.id = cm2.member_id
        LEFT JOIN students s ON cm2.member_type = 'student' AND s.id = cm2.member_id
        LEFT JOIN teachers t ON cm2.member_type = 'teacher' AND t.id = cm2.member_id
        WHERE cm2.channel_id = c.id
          AND NOT (cm2.member_type = $1 AND cm2.member_id = $2)
        ORDER BY cm2.id ASC
        LIMIT 1
      ) as other_user_name,
      (
        SELECT m.body FROM messages m
        WHERE m.channel_id = c.id
        AND m.deleted_at IS NULL
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message,
      (
        SELECT m.created_at FROM messages m
        WHERE m.channel_id = c.id
        AND m.deleted_at IS NULL
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message_at
     FROM channels c
     JOIN channel_members cm ON c.id = cm.channel_id
     WHERE cm.member_type = $1
       AND cm.member_id = $2
     ORDER BY last_message_at DESC NULLS LAST, c.created_at DESC`,
    [principal.type, principal.id]
  );
  return result.rows;
};

const getUserChannels = async (userId) => {
  return getPrincipalChannels({ type: 'staff', id: userId });
};

// ─── Get Channel Messages ────────────────────────────────────────
const getChannelMessages = async (channelId, limit = 50, offset = 0) => {
  const result = await pool.query(
    `SELECT
      m.id,
      m.channel_id,
      COALESCE(m.sender_entity_id, m.sender_id) as sender_id,
      m.sender_type,
      m.body,
      COALESCE(m.message_type, 'text') AS message_type,
      m.media_url,
      m.audio_duration,
      (COALESCE(m.message_type, 'text') = 'audio' OR m.body = '[Voice message]') AS is_audio,
      m.created_at,
      m.deleted_at,
      COALESCE(u.full_name, s.full_name, t.full_name) as sender_name,
      COALESCE(
        u.role,
        CASE
          WHEN s.id IS NOT NULL THEN 'student'
          WHEN t.id IS NOT NULL THEN 'teacher'
          ELSE m.sender_type
        END
      ) as sender_role
     FROM messages m
     LEFT JOIN users u
       ON COALESCE(m.sender_type, 'staff') = 'staff'
      AND u.id = COALESCE(m.sender_entity_id, m.sender_id)
     LEFT JOIN students s
       ON m.sender_type = 'student'
      AND s.id = m.sender_entity_id
     LEFT JOIN teachers t
       ON m.sender_type = 'teacher'
      AND t.id = m.sender_entity_id
     WHERE m.channel_id = $1
     AND m.deleted_at IS NULL
     ORDER BY m.created_at ASC
     LIMIT $2 OFFSET $3`,
    [channelId, limit, offset]
  );
  return result.rows;
};

// ─── Send Message ────────────────────────────────────────────────
const sendPrincipalMessage = async (channelId, principalOrId, body, options = {}) => {
  const principal = normalizePrincipal(principalOrId);
  const messageType = options.message_type || options.messageType || 'text';
  const mediaUrl = options.media_url || options.mediaUrl || null;
  const audioDuration = Number.isInteger(options.audio_duration)
    ? options.audio_duration
    : Number.isInteger(options.audioDuration)
      ? options.audioDuration
      : null;

  const result = await pool.query(
    `INSERT INTO messages
     (channel_id, sender_id, sender_type, sender_entity_id, body, message_type, media_url, audio_duration)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING
       id,
       channel_id,
       COALESCE(sender_entity_id, sender_id) as sender_id,
       sender_type,
       body,
       message_type,
       media_url,
       audio_duration,
       (message_type = 'audio') AS is_audio,
       created_at,
       deleted_at`,
    [channelId, staffUserId(principal), principal.type, principal.id, body, messageType, mediaUrl, audioDuration]
  );
  return result.rows[0];
};

const sendMessage = async (channelId, senderId, body) => {
  return sendPrincipalMessage(channelId, { type: 'staff', id: senderId }, body);
};

// ─── Delete Message ──────────────────────────────────────────────
const deleteMessage = async (messageId) => {
  await pool.query(
    `UPDATE messages SET deleted_at = NOW()
     WHERE id = $1`,
    [messageId]
  );
};

// ─── Check if User is Channel Member ────────────────────────────
const isPrincipalChannelMember = async (channelId, principalOrId, fallbackType = 'staff') => {
  const principal = normalizePrincipal(principalOrId, fallbackType);

  const result = await pool.query(
    `SELECT id FROM channel_members
     WHERE channel_id = $1
       AND member_type = $2
       AND member_id = $3`,
    [channelId, principal.type, principal.id]
  );
  return result.rows.length > 0;
};

const isChannelMember = async (channelId, userId) => {
  return isPrincipalChannelMember(channelId, { type: 'staff', id: userId });
};

// ─── Add Member to Group Channel ────────────────────────────────
const addChannelMember = async (channelId, userId) => {
  await pool.query(
    `INSERT INTO channel_members (channel_id, user_id, member_type, member_id)
     VALUES ($1, $2, 'staff', $2)
     ON CONFLICT (channel_id, member_type, member_id) DO NOTHING`,
    [channelId, userId]
  );
};

module.exports = {
  createMessagingTables,
  findDMChannel,
  findPrincipalDMChannel,
  createDMChannel,
  createPrincipalDMChannel,
  createGroupChannel,
  getUserChannels,
  getPrincipalChannels,
  getChannelMessages,
  sendMessage,
  sendPrincipalMessage,
  deleteMessage,
  isChannelMember,
  isPrincipalChannelMember,
  addChannelMember,
};
