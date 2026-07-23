# Uptime Monitoring With UptimeRobot

Use UptimeRobot to ping `/api/live` every 5 minutes and email you if the
backend process dies. `/api/live` does not touch Postgres, so it keeps Render
awake without keeping the Neon database compute awake.

Do not ping `/api/health` every 5 minutes on the Neon free plan. That endpoint
queries Postgres, and frequent pings can burn through the monthly compute quota.

## Setup

1. Sign up at **https://uptimerobot.com** with your email.
2. After login, choose **+ New Monitor**.
3. Settings:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: `Credent API liveness`
   - **URL**: `https://credent-backend.onrender.com/api/live`
   - **Monitoring Interval**: 5 minutes
   - **HTTP Method**: GET
   - **Keyword Monitoring**: optional, keyword `"status":"OK"`
4. Under **Alert Contacts**, confirm your email is checked.
5. Click **Create Monitor**.

UptimeRobot now pings the Node service every 5 minutes. If consecutive checks
fail, you get an email.

## DB Health

Use `/api/health` when you specifically want to verify Postgres:

```bash
curl https://credent-backend.onrender.com/api/health
```

Expected states:

- `200 OK` with `db: "connected"` means the API and database are both working.
- `503 DEGRADED` means the Node service is up but Postgres is unavailable or
  the Neon quota is exhausted.

## What To Do When You Get An Alert

1. Check the Render service logs.
2. If the process is down, restart or redeploy `credent-backend`.
3. If `/api/live` is up but `/api/health` returns 503, check Neon usage/quota
   and the `DATABASE_URL` value in Render.
4. If Neon says compute quota is exhausted, upgrade the Neon project, wait for
   quota reset, or switch `DATABASE_URL` to a database with available compute.

## Free Tier Notes

- UptimeRobot free tier supports 5-minute intervals and email alerts.
- Neon free projects have a monthly compute allowance; DB-aware pings consume it.
- Render free services can sleep when idle, so `/api/live` is the safe keep-warm
  target.
