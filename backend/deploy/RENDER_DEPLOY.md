# Credent backend — Render deployment runbook

Single-page guide to go from a fresh laptop to a live `https://credent-backend.onrender.com` URL.

Total time: ~25 minutes. Cost: $0. No card required.

---

## 0. Prerequisites

- A GitHub account (free)
- The Credent repo pushed to GitHub (private is fine)
- An Anthropic API key with billing enabled

---

## 1. Push the repo to GitHub (if you haven't) — 5 min

On your laptop, from the repo root:

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create credent --private --source=. --push
```

If you don't have GitHub CLI installed, do it through the web:
- Create the repo at https://github.com/new
- Then locally:
  ```bash
  git init
  git remote add origin https://github.com/YOUR_USER/credent.git
  git add . && git commit -m "Initial commit"
  git branch -M main
  git push -u origin main
  ```

---

## 2. Create the Neon Postgres database — 5 min

Free plan with a monthly compute allowance and 0.5 GB storage. No card.

1. Go to **https://neon.tech** → Sign in with GitHub
2. Click **Create project**
   - Name: `credent-beta`
   - Region: **Frankfurt** (matches the Render region we picked for low latency)
   - Postgres version: 16
3. After creation, the dashboard shows a connection string like:
   ```
   postgresql://USER:PASS@HOST.neon.tech/credent?sslmode=require
   ```
4. Copy it. You'll paste it into Render in step 4.

---

## 3. Create the Render web service — 5 min

1. Go to **https://render.com** → Sign in with GitHub
2. Top-right → **New** → **Blueprint**
3. Select your `credent` repo from the list (Render asks for permission first time)
4. Render reads `render.yaml` from the repo root and shows:
   - **credent-backend** (web service, free plan, Frankfurt, Node runtime)
5. Click **Apply**

Render starts the first build immediately. It'll fail until you set the env vars in the next step — that's expected.

---

## 4. Set the secrets in the Render dashboard — 5 min

On your laptop, generate the JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Run this TWICE and save both outputs — you need two DIFFERENT secrets
```

In Render dashboard → click `credent-backend` → **Environment** tab → **Add Environment Variable** for each:

| Key | Value |
|---|---|
| `DATABASE_URL` | the Neon connection string from step 2 |
| `JWT_SECRET` | first 128-char hex you generated |
| `JWT_REFRESH_SECRET` | second 128-char hex (different from above) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` |

Click **Save Changes**. Render automatically triggers a redeploy with the new env vars.

Watch the **Logs** tab — within 2–3 minutes you should see:
```
✅ Database connected
✅ Users table ready
... (more table-ready logs)
🚀 Credent API Server started
```

---

## 5. Smoke test — 1 min

From your laptop:

```bash
curl https://credent-backend.onrender.com/api/health
# → {"status":"OK","message":"...","timestamp":"..."}
```

If you see the JSON, **the backend is live, public, on HTTPS, and connected to Neon**. Save this URL — it's what the Electron app will point at.

> Your actual URL will be `https://<service-name>.onrender.com` — Render shows it at the top of your service page.

---

## 6. Keep the service warm (UptimeRobot) — 3 min

Render's free tier spins down after 15 min of no requests. UptimeRobot should ping `/api/live` every 5 min to keep the Node service awake without touching Postgres. Do not ping `/api/health` every 5 min on Neon free; that route queries the database and can exhaust the monthly compute quota.

See `deploy/UPTIME_MONITORING.md` for the 3-step setup.

After this is configured, your first tester each morning won't wait for a cold start — it'll feel like a normal hosted app.

---

## 7. Update the Electron app's production URL — 2 min

On your laptop:

```bash
# credent-desktop/main.js around line 40:
const PRODUCTION_URL = 'https://credent-backend.onrender.com';
```

Then build:

```bash
cd credent-desktop
npm install
npm run build:win    # Windows installer → dist/
# On your Mac:
npm run build:mac    # → dist/
```

---

## 8. Create the first agent account — 3 min

The DB is empty. From your laptop, run:

```bash
# Replace DATABASE_URL with your Neon string from step 2
DATABASE_URL="postgresql://..." node -e "
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});
(async () => {
  const hash = await bcrypt.hash('CHANGE_ME_STRONG_PW', 10);
  await pool.query(\`
    INSERT INTO users (full_name, email, password_hash, role, passkey, is_active)
    VALUES ('Beta Agent', 'agent@credent.beta', \$1, 'agent', 'AGENT1', true)
    ON CONFLICT (email) DO NOTHING
  \`, [hash]);
  console.log('Agent created — passkey: AGENT1');
  await pool.end();
})();
"
```

> Wait until step 5 succeeded (so the schema exists) before running this.

Open the Electron app, log in with passkey `AGENT1`. You're the agent — create schools, teachers, students, mint invite codes from the UI.

---

## 9. Mint your first invite codes — 2 min

Once logged in as agent, you can mint codes via the API:

```bash
# Get your agent JWT (the Electron app stores it; or use the login response)
TOKEN="paste-jwt-here"

curl -X POST https://credent-backend.onrender.com/api/beta/invites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"teacher","grade":"Class 4","class_name":"Class 4","max_uses":10,"label":"Pilot teachers"}'
```

Returns a code like `CRD-A7K9-XQ2P`. Share with up to 10 teachers — they redeem at:
```bash
curl -X POST https://credent-backend.onrender.com/api/beta/redeem \
  -H "Content-Type: application/json" \
  -d '{"code":"CRD-A7K9-XQ2P","full_name":"Jane Doe","email":"jane@school.com"}'
```
Returns their passkey. They log into the Electron app with it.

---

## 10. Hand out installers to testers (ongoing)

1. Create a GitHub Release in the `credent` repo
2. Upload the `.exe` (Windows) and `.dmg` (Mac) from `credent-desktop/dist/`
3. Release notes: "Beta v0.1 — Beta runs June 1–8. Feedback button in-app or email feedback@credent.app."
4. Share the release page link with testers

---

## Day-to-day operations

### Deploy new code
```bash
# On your laptop
git add . && git commit -m "Fix scrolling bug"
git push
# Render auto-detects, builds, and deploys. Watch progress at:
# https://dashboard.render.com → credent-backend → Events tab
```
Zero-downtime. Typical deploy: 2–4 minutes.

### View live logs
Render dashboard → `credent-backend` → **Logs** tab (live tail) or **Shell** tab for an interactive bash.

### Read tester feedback
```bash
TOKEN="agent-jwt"
curl https://credent-backend.onrender.com/api/beta/feedback?status=new \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Check daily AI usage
Render Shell → run the Node one-liner from `RENDER_DEPLOY.md` step 8 against `ai_daily_usage`.

### Database backups
Neon does automatic point-in-time recovery for 7 days on the free tier — no setup. For a manual export:
```bash
# Locally
DATABASE_URL="postgresql://..." pg_dump "$DATABASE_URL" --no-owner --no-acl | gzip > credent_backup.sql.gz
```

### Roll back a bad deploy
Render dashboard → **Events** → find the previous deploy → **Roll back to this deploy**. Reverts in 30 seconds.

---

## Troubleshooting

**Build failed: "Cannot find module"**
→ A dependency wasn't in `package.json`. `npm install <pkg> --save` locally, commit, push.

**Health endpoint returns 500**
→ DB connection failed. Logs tab will show the pg error. Verify `DATABASE_URL` ends with `?sslmode=require`.

**"Service Unavailable" on first request of the day**
→ Cold start in progress (30–60s). Means UptimeRobot isn't pinging yet — set it up.

**Electron app shows "session expired" immediately**
→ `JWT_SECRET` changed since the token was issued. Tester needs to log in again.

**Daily AI cap hits unexpectedly**
→ Check `ai_daily_usage` table. Agents should be exempt. Raise `AI_DAILY_CAP` in Render's Environment tab and redeploy.

**Render says "Free instance hours exhausted"**
→ 750 hrs/month free covers one always-on service. If you ever exceed it, the service is paused until next month's reset. Worst case, bump to the $7/mo Starter plan (no cold starts, more instance hours).

---

## What's NOT included (deliberate beta scope)

- **No code signing** for Mac/Windows installers — testers see "unrecognized app" warnings. Acceptable for 10–50 person closed beta.
- **No multi-region failover** — single Frankfurt instance. Down means down (rare with UptimeRobot keep-warm).
- **No custom domain** — uses `*.onrender.com` URL. To use `api.credent.app` later: buy domain → Render dashboard → Settings → Custom Domain → follow CNAME instructions.
- **No staging environment** — every push goes straight to prod. For a beta this is fine. Add a `staging` branch + second Render service later if needed.

## ⚠️ Important: file uploads are ephemeral on Render free tier

Render's free filesystem is **wiped on every deploy**. Anything in `backend/uploads/`
(teacher/student profile pictures, group photos, application attachments, learning
assets) **disappears when you push new code**.

For the beta, this is acceptable IF:
- Testers know to re-upload pictures after a deploy
- You don't deploy often during the beta week
- Critical data (passkeys, lessons, feedback, AI usage) is in Postgres, NOT the filesystem ✓

**To make uploads persistent ($1/mo):**
1. Render dashboard → `credent-backend` → **Disks** tab → **Add Disk**
2. Name: `uploads`, Mount path: `/var/data/uploads`, Size: 1 GB
3. Add env var `UPLOAD_DIR=/var/data/uploads` (code already checks for it)
4. Redeploy

Cost crosses $0 but $12/year buys persistent files. If/when you do this, all
upload paths automatically use the disk — no code change.
