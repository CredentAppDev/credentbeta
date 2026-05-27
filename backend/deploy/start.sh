#!/usr/bin/env bash
# =============================================================================
# Credent backend — install deps + start under pm2
#
# Run from the backend/ directory after cloning and creating .env:
#   cd ~/credent/backend
#   bash deploy/start.sh
#
# Re-running this is the "deploy update" command — pulls latest deps and
# restarts the process under pm2 with zero downtime.
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."  # → backend/

[[ -f .env ]] || { echo "ERROR: .env not found. Copy .env.example and fill in production values."; exit 1; }
[[ -f server.js ]] || { echo "ERROR: server.js not found in $(pwd)"; exit 1; }

echo "==> Installing production dependencies"
npm ci --omit=dev || npm install --omit=dev

echo "==> Starting/restarting under pm2"
APP_NAME=credent-backend
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start server.js --name "$APP_NAME" --time
fi

pm2 save

echo
echo "==> Status:"
pm2 ls

echo
echo "Backend is running on http://localhost:5000 (inside the VM)."
echo "Run 'pm2 logs $APP_NAME' to tail logs."
echo "Next: bash deploy/tunnel.sh to expose it via Cloudflare Tunnel."
