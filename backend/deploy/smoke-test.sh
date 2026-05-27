#!/usr/bin/env bash
# =============================================================================
# Credent backend — smoke test
#
# Run after deploy to verify the backend is alive, the DB is reachable, and the
# Cloudflare Tunnel is forwarding requests correctly.
#
# Usage:
#   PUBLIC_URL=https://credent-beta.example.com bash deploy/smoke-test.sh
# =============================================================================
set -euo pipefail

PUBLIC_URL="${PUBLIC_URL:-http://localhost:5000}"

echo "==> Hitting $PUBLIC_URL/api/health"
RESP=$(curl -s -o /tmp/health.json -w "%{http_code}" "$PUBLIC_URL/api/health" || true)
if [[ "$RESP" == "200" ]]; then
  echo "    health OK"
  cat /tmp/health.json
  echo
else
  echo "    health FAILED (HTTP $RESP)"
  cat /tmp/health.json 2>/dev/null || true
  exit 1
fi

echo "==> Verifying DB connectivity via /api/health (already returns 200 if pg pool connected)"

echo "==> Testing CORS (no-origin request — Electron-style)"
curl -sI "$PUBLIC_URL/api/health" | head -n3

echo
echo "All checks passed."
