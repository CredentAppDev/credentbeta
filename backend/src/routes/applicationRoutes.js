const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const pool = require('../config/db');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { createNotification } = require('../models/notificationModel');

const router = express.Router();
const isAgent = allowRoles('agent', 'admin');

// ─── Upload Storage ───────────────────────────────────────────────
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const APP_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'applications');
fs.mkdirSync(APP_UPLOAD_DIR, { recursive: true });

const appStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, APP_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, `app-${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage: appStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// ─── Ensure Table Exists ──────────────────────────────────────────
const ensureTable = pool.query(`
  CREATE TABLE IF NOT EXISTS website_applications (
    id          SERIAL PRIMARY KEY,
    type        TEXT NOT NULL CHECK (type IN ('instructor','demo')),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    role        TEXT,
    subject     TEXT,
    experience  TEXT,
    school_name TEXT,
    location    TEXT,
    message     TEXT,
    cv_url      TEXT,
    letter_url  TEXT,
    degree_url  TEXT,
    status      TEXT NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`).catch(err => console.error('applications table error:', err.message));

// ─── POST /api/applications — public, called by website ──────────
router.post(
  '/',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'letter', maxCount: 1 },
    { name: 'degree', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      await ensureTable;
      const {
        type, name, email, phone, role, subject, experience,
        school_name, location, message,
      } = req.body;

      if (!type || !name || !email) {
        return res.status(400).json({ message: 'type, name, and email are required' });
      }

      const fileUrl = (fieldName) => {
        const f = req.files?.[fieldName]?.[0];
        return f ? `/uploads/applications/${f.filename}` : null;
      };

      const { rows } = await pool.query(
        `INSERT INTO website_applications
           (type, name, email, phone, role, subject, experience,
            school_name, location, message, cv_url, letter_url, degree_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING *`,
        [
          type, name, email,
          phone || null, role || null, subject || null, experience || null,
          school_name || null, location || null, message || null,
          fileUrl('cv'), fileUrl('letter'), fileUrl('degree'),
        ]
      );

      const app = rows[0];

      // Fan-out a notification to every agent/admin so they see the new
      // submission even if they're not on the Applications tab. Best-effort —
      // a notification failure must not break the public submit endpoint.
      try {
        const isInstructor = app.type === 'instructor';
        const title = isInstructor
          ? `📩 New teacher application — ${app.name}`
          : `🏫 New school demo request — ${app.school_name || app.name}`;
        const bodyText = isInstructor
          ? `${app.subject ? app.subject + ' · ' : ''}${app.email}${app.phone ? ' · ' + app.phone : ''}`
          : `${app.name}${app.role ? ' (' + app.role + ')' : ''} · ${app.email}${app.location ? ' · ' + app.location : ''}`;

        const { rows: agents } = await pool.query(
          `SELECT id FROM users WHERE role IN ('agent','admin')`
        );
        await Promise.all(agents.map(u =>
          createNotification({
            user_id: u.id,
            type: 'application',
            title,
            body: bodyText,
            reference_id: app.id,
            reference_type: 'application',
          }).catch(e => console.error('notify agent failed', u.id, e.message))
        ));
      } catch (notifyErr) {
        console.error('application notify error:', notifyErr.message);
      }

      return res.status(201).json({ message: 'Application received', application: app });
    } catch (err) {
      console.error('application submit error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// ─── GET /api/applications — agent only ──────────────────────────
router.get('/', protect, isAgent, async (req, res) => {
  try {
    await ensureTable;
    const { type, status } = req.query;
    const conditions = [];
    const values = [];
    if (type) { conditions.push(`type = $${values.length + 1}`); values.push(type); }
    if (status) { conditions.push(`status = $${values.length + 1}`); values.push(status); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT * FROM website_applications ${where} ORDER BY created_at DESC`,
      values
    );
    return res.json({ applications: rows });
  } catch (err) {
    console.error('application list error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ─── PATCH /api/applications/:id/status — agent only ─────────────
router.patch('/:id/status', protect, isAgent, async (req, res) => {
  try {
    await ensureTable;
    const { status } = req.body;
    if (!['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const { rows } = await pool.query(
      `UPDATE website_applications SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    return res.json({ application: rows[0] });
  } catch (err) {
    console.error('application status error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
