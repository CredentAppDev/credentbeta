/**
 * Group profile picture + photo-edit permission management.
 *
 * Permission model:
 *   - Agents (and admins) always have permission to change a group's photo
 *     and to grant/revoke that permission to others.
 *   - Everyone else needs an explicit row in `group_photo_editors` for the
 *     group before they can upload. Default state = locked; the agent
 *     delegates by inserting a row via POST /:groupId/photo-editors.
 *
 * The image-saving logic mirrors the existing student/teacher profile-picture
 * flow in educationProfileController.js — same uploads folder, same naming
 * convention, same content-type detection — so the served URL shape is
 * uniform across all profile photos in the system.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const uploadsRoot = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
// Store the RELATIVE path (e.g. "/uploads/group-1-…png") rather than the
// absolute URL. Previously we built `${req.protocol}://${req.get('host')}/…`,
// which captured the LAN IP the uploader happened to be using
// (e.g. 192.168.100.4:5000 when the Mac student uploaded). The teacher on
// Windows then couldn't load the image because their renderer dereferenced
// the URL literally and never reached its own localhost backend. Storing
// a relative path leaves URL resolution to the renderer — every client
// prefixes its own engine.baseUrl, so the same DB row works from any
// machine on the LAN.
const publicUploadUrl = (_req, filename) => `/uploads/${filename}`;

const ROLE_AGENT_LIKE = new Set(['agent', 'admin']);
const VALID_ROLES = new Set(['student', 'teacher', 'agent']);

const isAgentLike = (user) => Boolean(user && ROLE_AGENT_LIKE.has(user.role));

/** Returns true if `user` is allowed to change the photo of `groupId`. */
const canEditGroupPhoto = async (user, groupId) => {
  if (!user || !groupId) return false;
  if (isAgentLike(user)) return true;
  const r = await pool.query(
    `SELECT 1 FROM group_photo_editors
      WHERE group_id = $1 AND user_role = $2 AND user_id = $3
      LIMIT 1`,
    [groupId, user.role, user.id]
  );
  return r.rowCount > 0;
};

const saveRawGroupImage = (req, groupId) => {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    const error = new Error('Image body is required');
    error.statusCode = 400;
    throw error;
  }
  fs.mkdirSync(uploadsRoot, { recursive: true });
  const contentType = String(req.get('content-type') || '').toLowerCase();
  const ext = contentType.includes('png') ? 'png'
            : contentType.includes('webp') ? 'webp'
            : 'jpg';
  const filename = `group-${groupId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  fs.writeFileSync(path.join(uploadsRoot, filename), req.body);
  return publicUploadUrl(req, filename);
};

// POST /api/groups/:groupId/profile-picture/upload
const uploadGroupProfilePicture = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }

    const groupExists = await pool.query(
      `SELECT 1 FROM student_groups WHERE id = $1 LIMIT 1`,
      [groupId]
    );
    if (groupExists.rowCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const allowed = await canEditGroupPhoto(req.user, groupId);
    if (!allowed) {
      return res.status(403).json({
        message: 'You do not have permission to change this group\'s photo. Ask an agent to grant access.',
      });
    }

    const url = saveRawGroupImage(req, groupId);
    const updated = await pool.query(
      `UPDATE student_groups
         SET profile_picture_url = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, profile_picture_url`,
      [url, groupId]
    );
    return res.json({
      message: 'Group profile picture uploaded',
      profile_picture_url: url,
      group: updated.rows[0],
    });
  } catch (error) {
    console.error('uploadGroupProfilePicture error:', error.message);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Server error',
    });
  }
};

// GET /api/groups/:groupId/photo-editors
// Returns the list of users currently allowed to edit the photo, plus a
// `can_edit_photo` flag for the caller so the client knows whether to show
// the "Change photo" button without a second call. Anyone with read access to
// the group can call this — it's not sensitive info, and members benefit from
// knowing who they can ask to update the picture.
const listGroupPhotoEditors = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }
    // Resolve each editor's display name from the appropriate table so the
    // client can render "Jane Doe (student)" without separate lookups.
    const rows = await pool.query(
      `SELECT e.id, e.user_role, e.user_id, e.created_at,
              COALESCE(
                CASE e.user_role
                  WHEN 'student' THEN (SELECT full_name FROM students WHERE id = e.user_id)
                  WHEN 'teacher' THEN (SELECT full_name FROM teachers WHERE id = e.user_id)
                  WHEN 'agent'   THEN (SELECT full_name FROM users    WHERE id = e.user_id)
                END,
                '—'
              ) AS display_name
         FROM group_photo_editors e
        WHERE e.group_id = $1
        ORDER BY e.created_at ASC`,
      [groupId]
    );
    // Returning the current photo URL alongside the permission flag lets
    // clients render the existing avatar without a second roundtrip on
    // initial open.
    const group = await pool.query(
      `SELECT profile_picture_url FROM student_groups WHERE id = $1`,
      [groupId]
    );
    const canEdit = await canEditGroupPhoto(req.user, groupId);
    return res.json({
      editors: rows.rows,
      can_edit_photo: canEdit,
      profile_picture_url: group.rows[0]?.profile_picture_url || null,
    });
  } catch (error) {
    console.error('listGroupPhotoEditors error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/groups/:groupId/photo-editors
// body: { user_role: 'student'|'teacher'|'agent', user_id: number }
// Agent-only.
const grantGroupPhotoEditor = async (req, res) => {
  try {
    if (!isAgentLike(req.user)) {
      return res.status(403).json({ message: 'Agent role required' });
    }
    const groupId = parseInt(req.params.groupId, 10);
    const userRole = String(req.body.user_role || '').toLowerCase();
    const userId = parseInt(req.body.user_id, 10);
    if (!Number.isInteger(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId' });
    }
    if (!VALID_ROLES.has(userRole)) {
      return res.status(400).json({ message: 'user_role must be student, teacher, or agent' });
    }
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: 'user_id must be an integer' });
    }

    // Verify the target user exists in their own table.
    const userTable = userRole === 'student' ? 'students'
                    : userRole === 'teacher' ? 'teachers'
                    : 'users';
    const userExists = await pool.query(`SELECT 1 FROM ${userTable} WHERE id = $1 LIMIT 1`, [userId]);
    if (userExists.rowCount === 0) {
      return res.status(404).json({ message: `${userRole} not found` });
    }

    const inserted = await pool.query(
      `INSERT INTO group_photo_editors (group_id, user_role, user_id, granted_by_agent_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (group_id, user_role, user_id) DO NOTHING
       RETURNING *`,
      [groupId, userRole, userId, req.user.id]
    );
    return res.status(201).json({
      message: inserted.rowCount > 0 ? 'Photo editor granted' : 'Already a photo editor',
      editor: inserted.rows[0] || null,
    });
  } catch (error) {
    console.error('grantGroupPhotoEditor error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/groups/:groupId/photo-editors/:userRole/:userId
// Agent-only.
const revokeGroupPhotoEditor = async (req, res) => {
  try {
    if (!isAgentLike(req.user)) {
      return res.status(403).json({ message: 'Agent role required' });
    }
    const groupId = parseInt(req.params.groupId, 10);
    const userRole = String(req.params.userRole || '').toLowerCase();
    const userId = parseInt(req.params.userId, 10);
    if (!Number.isInteger(groupId) || !VALID_ROLES.has(userRole) || !Number.isInteger(userId)) {
      return res.status(400).json({ message: 'Invalid group id, user_role, or user_id' });
    }
    const r = await pool.query(
      `DELETE FROM group_photo_editors
        WHERE group_id = $1 AND user_role = $2 AND user_id = $3
        RETURNING id`,
      [groupId, userRole, userId]
    );
    if (r.rowCount === 0) {
      return res.status(404).json({ message: 'Editor not found' });
    }
    return res.json({ message: 'Photo editor revoked', id: r.rows[0].id });
  } catch (error) {
    console.error('revokeGroupPhotoEditor error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  canEditGroupPhoto,
  uploadGroupProfilePicture,
  listGroupPhotoEditors,
  grantGroupPhotoEditor,
  revokeGroupPhotoEditor,
};
