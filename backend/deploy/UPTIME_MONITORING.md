# Uptime monitoring with UptimeRobot

Free service that pings `/api/health` every 5 minutes and emails you if the backend dies. Zero cost, zero code.

## Setup (3 minutes)

1. Sign up at **https://uptimerobot.com** with your email (no credit card)
2. After login → **+ New Monitor**
3. Settings:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: `Credent Beta API`
   - **URL**: `https://YOUR-TUNNEL-URL/api/health`
   - **Monitoring Interval**: 5 minutes (the lowest the free tier allows)
   - **HTTP Method**: GET
   - **Keyword Monitoring** (optional but recommended):
     - Keyword Type: exists
     - Keyword: `"status":"OK"`
     - This catches the case where the server is up but the DB is broken — `/api/health` would still respond but the JSON body changes.
4. Under **Alert Contacts** → confirm your email is checked
5. Click **Create Monitor**

UptimeRobot now pings every 5 min. If three consecutive checks fail you get an email.

## What to do when you get an alert

1. SSH into the VM: `ssh -i your-key.key ubuntu@<VM_IP>`
2. Check the backend process: `pm2 status`
3. If `credent-backend` is `errored` or `stopped`: `pm2 logs credent-backend --lines 50` to see the crash
4. Check the tunnel: `sudo systemctl status cloudflared`
5. Common fixes:
   - Out of memory → `pm2 restart credent-backend`
   - Neon DB hiccup → wait 30s, check Neon dashboard
   - Tunnel down → `sudo systemctl restart cloudflared`

## Free tier limits

- 50 monitors max (you'll use 1)
- 5-minute interval (enough for beta)
- Email alerts only (no SMS without paid tier)
- 2 months of uptime history
