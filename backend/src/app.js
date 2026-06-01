const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = rateLimit;
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const groupHelpRoutes = require('./routes/groupHelpRoutes');
const customerRoutes = require('./routes/customerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const agentRoutes = require('./routes/agentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const broadcastRoutes = require('./routes/broadcastRoutes');
const emailSettingsRoutes = require('./routes/emailSettingsRoutes');
const helpCenterRoutes = require('./routes/helpCenterRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const teacherGroupRoutes = require('./routes/teacherGroupRoutes');
const groupPhotoRoutes = require('./routes/groupPhotoRoutes');
const educationAuthRoutes = require('./routes/educationAuthRoutes');
const studentRoutes = require('./routes/studentRoutes');
const educationProfileRoutes = require('./routes/educationProfileRoutes');
const groupCallRoutes = require('./routes/groupCallRoutes');
const supportRoutes = require('./routes/supportRoutes');
const learningRoutes = require('./routes/learningRoutes');
const aiRoutes = require('./routes/aiRoutes');
const screenSessionRoutes = require('./routes/screenSessionRoutes');
const desktopAuthRoutes = require('./routes/desktopAuthRoutes');
const devicePushRoutes = require('./routes/devicePushRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const betaRoutes = require('./routes/betaRoutes');

const app = express();

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet());

// Allowed web origins in production (comma-separated in CLIENT_URL).
// Native mobile apps never send an Origin header, so they are always permitted.
const allowedWebOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// The Credent marketing/download website is hosted on Netlify, and its exact
// subdomain (and any preview/branch deploys) can change. Rather than require
// every URL to be pinned in CLIENT_URL, allow any HTTPS *.netlify.app origin,
// the credentgh.com custom domain (bare + any subdomain like www), plus
// localhost dev servers automatically. CLIENT_URL still works for adding
// further custom domains on top of these.
const isAlwaysAllowedOrigin = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    // local dev (any port) over http/https
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    // any Netlify-hosted site (prod + deploy previews) over https
    if (protocol === 'https:' && /(^|\.)netlify\.app$/.test(hostname)) return true;
    // the Credent custom domain — bare and any subdomain (www, etc.) over https
    if (protocol === 'https:' && /(^|\.)credentgh\.com$/.test(hostname)) return true;
  } catch (_) { /* not a parseable origin */ }
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    // No origin = native mobile app or same-origin server call — allow.
    if (!origin) return callback(null, true);
    // Development: allow everything for local testing.
    if (process.env.NODE_ENV === 'development') return callback(null, true);
    // Netlify sites + localhost are always permitted.
    if (isAlwaysAllowedOrigin(origin)) return callback(null, true);
    // Production: plus any extra web origins listed in CLIENT_URL.
    if (allowedWebOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' is not permitted`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-token', 'x-client-platform', 'x-app-version', 'x-audio-duration'],
  credentials: true,
}));

// ─── Rate Limiting ────────────────────────────────────────────────
const isDevelopment = process.env.NODE_ENV === 'development';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 200 : 20,
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 2000 : 200,
  skip: (req) => req.path.startsWith('/screen-session/'),
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDevelopment ? 120 : 30,
  message: { message: 'Too many AI assistance requests, please wait a moment and try again' },
  standardHeaders: true,
  legacyHeaders: false,
});

const screenSessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 6000 : 3000,
  keyGenerator: (req) => req.headers.authorization || ipKeyGenerator(req.ip),
  message: { message: 'Too many screen-session requests, please slow down and try again' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
app.use('/api/ai', aiLimiter);

// ─── Body Parser ─────────────────────────────────────────────────
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true, limit: '8mb' }));
// Uploaded media (images, audio, video) served to Electron renderer + native
// apps. Override the default helmet CORP header which blocks cross-origin
// reads — without this, <img>/<audio> tags from file:// origins (Electron) or
// other web origins fail even though the underlying request works.
// On Render free tier the local FS is wiped on every deploy. Set UPLOAD_DIR
// to a persistent disk mount path to keep files across deploys.
const UPLOADS_PATH = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(UPLOADS_PATH));

// ─── Routes ──────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/auth', educationAuthRoutes); // teacher + student auth
app.use('/api/tickets', ticketRoutes);
app.use('/api/group-help', groupHelpRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/broadcast', broadcastRoutes);
app.use('/api/email-settings', emailSettingsRoutes);
app.use('/api/help', helpCenterRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherGroupRoutes);
app.use('/api/groups', groupPhotoRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api', educationProfileRoutes);
app.use('/api/group-calls', groupCallRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/screen-session', screenSessionLimiter, screenSessionRoutes);
app.use('/api/auth/desktop', desktopAuthRoutes);
app.use('/api/devices', devicePushRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/beta', betaRoutes);

// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: '✅ Credent API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;
