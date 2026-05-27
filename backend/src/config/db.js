const { Pool } = require('pg');
require('dotenv').config();

// Two ways to configure the DB connection:
//   1. DATABASE_URL — single connection string (Neon, Supabase, Render, Heroku)
//   2. DB_HOST + DB_PORT + DB_NAME + DB_USER + DB_PASSWORD — discrete fields (local dev)
//
// DATABASE_URL wins if both are set. SSL is enabled automatically when the URL
// includes sslmode=require or when running in production — managed Postgres
// providers (Neon, Supabase) require SSL.
const databaseUrl = (process.env.DATABASE_URL || '').trim();
const isProduction = process.env.NODE_ENV === 'production';
const useUrl = !!databaseUrl;
const useDiscrete = !!process.env.DB_HOST;

if (isProduction && !useUrl) {
  console.error('❌ DATABASE_URL is missing in production. Set it on Render and redeploy.');
  process.exit(1);
}

if (!useUrl && !useDiscrete) {
  console.error('❌ DB config missing — set DATABASE_URL (production) or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD (local dev) in .env');
  process.exit(1);
}

const needsSsl =
  (useUrl && /sslmode=require/i.test(databaseUrl))
  || process.env.PGSSL === 'true'
  || isProduction;

const poolConfig = useUrl
  ? {
      connectionString: databaseUrl,
      ssl: needsSsl ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: needsSsl ? { rejectUnauthorized: false } : false,
    };

if (useUrl) {
  try {
    const parsedUrl = new URL(databaseUrl);
    const dbName = parsedUrl.pathname.replace(/^\//, '') || '(no database)';
    console.log(`[db] Using DATABASE_URL target: ${parsedUrl.hostname}/${dbName}`);
  } catch {
    console.log('[db] Using DATABASE_URL target: (unable to parse safe target)');
  }
} else {
  console.log(`[db] Using DB_HOST target: ${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || ''}`);
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

// In production, a transient pg error (Neon cold start, brief network blip)
// would kill the whole server with the original process.exit. Log and let
// pg's pool reconnect on the next query instead.
pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

module.exports = pool;
