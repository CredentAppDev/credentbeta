const http = require('http');
const app = require('./src/app');
const pool = require('./src/config/db');
const { createUsersTable }         = require('./src/models/userModel');
const { createCustomersTable }     = require('./src/models/customerModel');
const { createCategoriesTable }    = require('./src/models/categoryModel');
const { createTicketsTable }       = require('./src/models/ticketModel');
const { createNotificationsTable } = require('./src/models/notificationModel');
const { createMessagingTables }    = require('./src/models/messageModel');
const { createEmailSettingsTable } = require('./src/controllers/emailSettingsController');
const { createAuditLogsTable }     = require('./src/models/auditModel');
const { createHelpCenterTable }    = require('./src/models/helpCenterModel');
const { createSchoolTables }       = require('./src/models/schoolModel');
const { createAssignmentTables }   = require('./src/models/assignmentModel');
const { createGroupCallTables }    = require('./src/models/groupCallModel');
const { createLearningTables }     = require('./src/models/learningModel');
const { createScreenSessionTables, purgeStaleSignals } = require('./src/models/screenSessionModel');
const { createDesktopAuthTable }   = require('./src/controllers/desktopAuthController');
const { createDevicePushTokensTable } = require('./src/models/devicePushTokenModel');
const { createRemoteControlAuditTable } = require('./src/models/remoteControlAuditModel');
const { createFeedbackTable }      = require('./src/models/feedbackModel');
const { createInviteCodeTable }    = require('./src/models/inviteCodeModel');
const { initSocket }               = require('./src/services/socketService');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');

const dbInfo = await pool.query('SELECT current_database() AS db, current_user AS user');
    console.log('📦 Backend confirmed database:', dbInfo.rows[0]);
    
    // 2. Create core tables
    await createUsersTable();
    await createCustomersTable();
    await createCategoriesTable();
    await createTicketsTable();
    await createNotificationsTable();
    await createMessagingTables();

    // 3. Create broadcasts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS broadcasts (
        id SERIAL PRIMARY KEY,
        sent_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        target_role VARCHAR(20) DEFAULT 'all',
        recipient_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Broadcasts table ready');

    // 4. Create email settings table
    await createEmailSettingsTable();

    // 5. Create audit logs table
    await createAuditLogsTable();

    // 6. Create help center table
    await createHelpCenterTable();

    // 7. Create school, teacher, student tables
    await createSchoolTables();

    // 7b. Create assignments + submissions tables (depends on school tables)
    await createAssignmentTables();

    // 8. Create group call tables
    await createGroupCallTables();

    // 9. Create learning / controlled AI tutor tables
    await createLearningTables();

    // 10. Create screen session tables
    await createScreenSessionTables();

    // 11. Create desktop auth codes table
    await createDesktopAuthTable();

    // 11b. Create device push tokens table
    await createDevicePushTokensTable();

    // 11c. Create remote-control audit table
    await createRemoteControlAuditTable();

    // 11d. Create beta feedback + invite-code tables
    await createFeedbackTable();
    await createInviteCodeTable();

    // 12. Create HTTP server
    const server = http.createServer(app);

    // 11. Initialize Socket.io
    initSocket(server);

    // 12. Schedule background jobs
    // screen_session_signals grows by ~10–40 rows per session and the table
    // is never read for historical purposes — purge once at startup and
    // every hour after that so it stays bounded.
    purgeStaleSignals()
      .then((n) => n > 0 && console.log(`🧹 Purged ${n} stale screen-session signals`))
      .catch((e) => console.warn('signal purge failed:', e.message));
    setInterval(() => {
      purgeStaleSignals()
        .then((n) => n > 0 && console.log(`🧹 Purged ${n} stale screen-session signals`))
        .catch((e) => console.warn('signal purge failed:', e.message));
    }, 60 * 60 * 1000);

    // 13. Start server
    server.listen(PORT, () => {
      console.log('🚀 Credent API Server started');
      console.log(`📡 Running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message || error);
    if (error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

startServer();
