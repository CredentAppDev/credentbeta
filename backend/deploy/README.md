# Credent backend — beta deployment runbook

Single-page guide to go from a fresh Oracle Cloud account to a public beta URL.

Total time: ~45 minutes once your Oracle account is provisioned. Cost: $0.

---

## 0. Prerequisites

- Oracle Cloud Free Tier account (signup approved, takes 15–30 min)
- A GitHub repo containing this backend code (push it now if you haven't)
- An Anthropic API key with billing enabled (you already have one)
- Optionally, a domain — not required, we'll start with Cloudflare's free `*.trycloudflare.com`

---

## 1. Create the Neon Postgres database (5 min)

Free plan with a monthly compute allowance and 0.5 GB storage. Plenty for the beta if DB-aware pings are not run every few minutes.

1. Go to **https://neon.tech** → Sign in with GitHub
2. Click **Create project**
   - Name: `credent-beta`
   - Region: closest to Oracle VM region you'll pick (e.g. Frankfurt)
   - Postgres version: 16
3. After creation, the dashboard shows a **connection string** that looks like:
   ```
   postgresql://USER:PASS@HOST.neon.tech/credent?sslmode=require
   ```
4. Copy it. You'll paste it into the VM's `.env` in step 4.

> Neon does not require credit card or trial. Free tier is permanent.

---

## 2. Provision the Oracle Cloud VM (10 min)

Always Free tier — Arm Ampere VM, 4 OCPU, 24 GB RAM, never charged.

1. Sign in to **https://cloud.oracle.com**
2. Top-left menu → **Compute** → **Instances** → **Create instance**
3. Settings:
   - **Name**: `credent-beta`
   - **Image**: Click **Edit** → choose **Canonical Ubuntu 22.04**
   - **Shape**: Click **Edit** → **Ampere** → `VM.Standard.A1.Flex` → 4 OCPU, 24 GB RAM
   - **Networking**: Keep defaults (Oracle creates a VCN automatically). Make sure **Assign a public IPv4 address** is ON.
   - **SSH keys**: Click **Generate a key pair**. **Download both** the private key (`.key`) and public key. Save them somewhere safe — you'll need the private key to SSH in.
4. Click **Create**. Wait 1–2 minutes until status is `RUNNING`.
5. On the instance page, copy the **Public IP address**. (Looks like `150.x.x.x`.)

> If Oracle says "Out of capacity" in your region, try a different region (e.g. switch from Frankfurt to London).

---

## 3. SSH into the VM and run the setup script (5 min)

On your laptop:

```bash
# Save the private key Oracle gave you somewhere, then:
chmod 600 ~/Downloads/ssh-key-2026.key   # adjust path
ssh -i ~/Downloads/ssh-key-2026.key ubuntu@<PUBLIC_IP>
```

Once you're in (prompt becomes `ubuntu@credent-beta:~$`):

```bash
# Clone the backend
git clone https://github.com/<YOUR_USER>/<YOUR_REPO>.git credent
cd credent/backend

# Make scripts executable and run setup
chmod +x deploy/*.sh
./deploy/setup.sh
```

The setup script installs Node 20, pm2, cloudflared, and sets up the firewall. Takes about 3 minutes.

---

## 4. Configure the backend `.env` (3 min)

```bash
cd ~/credent/backend
cp .env.example .env
nano .env
```

Fill in **at minimum** these values:

```ini
NODE_ENV=production
PORT=5000

# Paste the Neon connection string from step 1:
DATABASE_URL=postgresql://USER:PASS@HOST.neon.tech/credent?sslmode=require

# Generate two unique secrets:
# Run on your laptop:  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=...paste 128 hex chars here...
JWT_REFRESH_SECRET=...paste a DIFFERENT 128 hex chars here...
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Your Anthropic key:
ANTHROPIC_API_KEY=sk-ant-...

# Daily cap (defaults to 30 if omitted):
AI_DAILY_CAP=30

# CORS: leave blank for now — the Electron app sends no Origin header so it's always allowed.
CLIENT_URL=
```

Save & exit: `Ctrl+O`, `Enter`, `Ctrl+X`.

---

## 5. Start the backend under pm2 (1 min)

```bash
bash deploy/start.sh
```

Verify:

```bash
curl http://localhost:5000/api/health
# → {"status":"OK","message":"...","timestamp":"..."}
```

If you see the health JSON, the backend is alive and connected to Neon.

If you don't, check `pm2 logs credent-backend` for the error.

---

## 6. Expose the backend via Cloudflare Tunnel (5 min)

### Option A — Quick start (random URL, fine for first day)

```bash
bash deploy/tunnel.sh quick
```

Cloudflare prints a URL like `https://random-words-abc-123.trycloudflare.com`. The backend is now public over HTTPS.

**Limitation**: the URL changes every time you restart the tunnel. Don't bake it into the Electron build yet — use it for `curl` testing only.

### Option B — Stable named tunnel (recommended for beta)

```bash
bash deploy/tunnel.sh named
```

The script will:
1. Open a one-time browser-login link — copy it to your laptop, authorize Cloudflare
2. Create a permanent tunnel
3. Ask you to set `TUNNEL_HOSTNAME` before re-running

For a stable URL **without buying a domain**: register a free `*.duckdns.org` or use `*.trycloudflare.com` quick mode. For a real stable HTTPS URL we recommend buying a $10/yr `.com` and adding it to Cloudflare DNS.

If/when you have a domain `credent.app` added to Cloudflare:
```bash
TUNNEL_HOSTNAME=api.credent.app bash deploy/tunnel.sh named
```

The tunnel becomes a systemd service that auto-starts on every reboot.

---

## 7. Smoke test from your laptop (1 min)

```bash
# Replace with your actual public URL
curl https://credent-beta.example.com/api/health
```

Should return the same JSON as the localhost test.

---

## 8. Update the Electron app's production URL (2 min)

On your laptop:

```bash
# In credent-desktop/main.js around line 40:
const PRODUCTION_URL = 'https://YOUR_TUNNEL_URL';
```

Then build:

```bash
# Windows
cd credent-desktop
npm install
npm run build:win

# On your Mac (when you build there)
npm run build:mac
```

Output installers land in `credent-desktop/dist/`.

---

## 9. Create the first agent account (3 min)

The DB is empty. SSH back into the VM and seed the first agent:

```bash
cd ~/credent/backend
node -e "
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');
(async () => {
  await new Promise(r => setTimeout(r, 1500));  // wait for schema CREATE TABLE
  const hash = await bcrypt.hash('CHANGE_ME_STRONG_PW', 10);
  await pool.query(\`
    INSERT INTO users (full_name, email, password_hash, role, passkey, is_active)
    VALUES ('Beta Agent', 'agent@credent.beta', \$1, 'agent', 'AGENT1', true)
    ON CONFLICT (email) DO NOTHING
  \`, [hash]);
  console.log('Agent created with passkey AGENT1');
  await pool.end();
})();
"
```

Log into the Electron app with passkey `AGENT1` and start creating schools / teachers / students through the agent UI.

---

## 10. Hand out installers to testers (ongoing)

1. Create a GitHub Release in your repo
2. Upload the `.exe` (Windows) and `.dmg` (Mac) from `credent-desktop/dist/`
3. Write release notes: "Beta v0.1 — known issues: A, B, C. Feedback to email@..."
4. Share the release page link

### Two onboarding flows — pick one

**A. Pre-created accounts (you control everything)**
1. As agent in the app, create the teacher/student row, copy the auto-generated passkey.
2. Email tester: "Download from [release link], install, log in with passkey ABC1234567."

**B. Invite codes (testers self-register, faster)**
1. As agent, mint an invite code:
   ```bash
   curl -X POST https://YOUR_URL/api/beta/invites \
     -H "Authorization: Bearer <your-agent-token>" \
     -H "Content-Type: application/json" \
     -d '{"role":"teacher","grade":"Class 4","class_name":"Class 4","max_uses":10,"label":"Pilot school A"}'
   ```
   Returns a code like `CRD-A7K9-XQ2P`.
2. Share the code with up to 10 testers. They redeem at the login screen:
   ```bash
   curl -X POST https://YOUR_URL/api/beta/redeem \
     -H "Content-Type: application/json" \
     -d '{"code":"CRD-A7K9-XQ2P","full_name":"Jane Doe","email":"jane@school.com"}'
   ```
   Returns `{ role, passkey, teacher: {...} }`. Tester uses the passkey to log into the desktop app.
3. Once `max_uses` is reached, the code auto-deactivates.

(A UI for redeeming on the login screen can be added later — for now the agent passes both the code and the resulting passkey to testers, or runs the curl on the tester's behalf.)

---

## Updates & maintenance

**Deploy new backend code:**
```bash
ssh ubuntu@<VM_IP>
cd ~/credent
git pull
cd backend
bash deploy/start.sh  # re-installs deps + zero-downtime pm2 restart
```

**View logs:**
```bash
pm2 logs credent-backend          # backend
sudo journalctl -u cloudflared -f # tunnel
```

**Restart everything:**
```bash
pm2 restart credent-backend
sudo systemctl restart cloudflared
```

**Check daily AI usage:**
```bash
node -e "
const pool = require('./src/config/db');
(async () => {
  const r = await pool.query('SELECT day_utc, role, SUM(count) as total FROM ai_daily_usage GROUP BY day_utc, role ORDER BY day_utc DESC LIMIT 10');
  console.table(r.rows);
  await pool.end();
})();
"
```

**Daily backups (cron):**
```bash
crontab -e
# Add this line (runs every day at 03:00 UTC, keeps last 14 backups):
0 3 * * * /home/ubuntu/credent/backend/deploy/backup.sh >> /home/ubuntu/credent-backups/cron.log 2>&1
```
Manual backup any time: `bash deploy/backup.sh`. Restore: `gunzip < credent_2026-05-26_030000.sql.gz | psql "$DATABASE_URL"`.

**Read tester feedback:**
```bash
# Latest 20 unread:
curl https://YOUR_URL/api/beta/feedback?status=new \
  -H "Authorization: Bearer <agent-token>" | jq
```
Or query directly:
```bash
node -e "
const pool = require('./src/config/db');
(async () => {
  const r = await pool.query(\"SELECT id, category, severity, message, status, created_at FROM beta_feedback WHERE status = 'new' ORDER BY created_at DESC LIMIT 20\");
  console.table(r.rows);
  await pool.end();
})();
"
```

**Uptime monitoring:** see `deploy/UPTIME_MONITORING.md` for free UptimeRobot setup. Use `/api/live` for 5-minute keep-warm pings; reserve `/api/health` for DB-aware checks.

---

## What's NOT included (deliberate beta scope)

- **No code signing** — testers will see "unrecognized app" warnings. Acceptable for 10–50 person beta.
- **No CI/CD** — every deploy is a manual `git pull` + `bash deploy/start.sh`. Fine for beta velocity.
- **No automated backups of Neon** — Neon does point-in-time recovery automatically on the paid tier; for free tier, export periodically with `pg_dump`.
- **No monitoring / alerting** — for beta, eyeball `pm2 logs` and check `/api/health` manually. UptimeRobot free tier can ping `/api/live` every 5 min if you want process-down notifications without burning Neon compute.

---

## Troubleshooting

**Health endpoint returns 500**
→ DB connection failed. `pm2 logs credent-backend` will show the pg error. Most common: SSL not enabled. Make sure `DATABASE_URL` ends with `?sslmode=require`.

**"Out of capacity" creating Oracle VM**
→ Different region. Oracle's Always Free Ampere is constrained in some regions. Try another.

**Tunnel URL works on the VM but not from laptop**
→ Cloudflare might be caching an old 502. Wait 1 minute, retry. Or check `sudo systemctl status cloudflared` for errors.

**Electron app shows "session expired" immediately**
→ JWT_SECRET differs between when the token was issued and when it's verified. If you regenerated `.env`, all old tokens are invalid. Tester needs to log in again.

**Daily cap hits unexpectedly**
→ Check the `ai_daily_usage` table; agents should be exempt. If a non-agent tester is teaching all day, raise `AI_DAILY_CAP` in `.env` and restart.
