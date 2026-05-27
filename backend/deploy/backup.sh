#!/usr/bin/env bash
# =============================================================================
# Credent backend — Postgres backup script
#
# Dumps the production database to a gzipped SQL file. Keeps the last 14
# backups in ~/credent-backups/ and discards older ones.
#
# Usage — manual:
#   bash deploy/backup.sh
#
# Usage — cron (daily 03:00 UTC):
#   crontab -e
#   0 3 * * * /home/ubuntu/credent/backend/deploy/backup.sh >> /home/ubuntu/credent-backups/cron.log 2>&1
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."  # → backend/

[[ -f .env ]] || { echo "ERROR: .env not found"; exit 1; }

# Source DATABASE_URL from .env without polluting the shell with other vars
DB_URL=$(grep -E '^DATABASE_URL=' .env | sed 's/^DATABASE_URL=//' | tr -d '"' | tr -d "'")
[[ -n "$DB_URL" ]] || { echo "ERROR: DATABASE_URL missing from .env"; exit 1; }

BACKUP_DIR="${BACKUP_DIR:-$HOME/credent-backups}"
mkdir -p "$BACKUP_DIR"

TS=$(date -u +%Y-%m-%d_%H%M%S)
OUT="$BACKUP_DIR/credent_${TS}.sql.gz"

# pg_dump comes from the postgresql-client package. Install if missing.
if ! command -v pg_dump >/dev/null 2>&1; then
  echo "==> Installing postgresql-client"
  sudo apt-get update -y && sudo apt-get install -y postgresql-client
fi

echo "==> Dumping database to $OUT"
pg_dump "$DB_URL" --no-owner --no-acl --clean --if-exists | gzip > "$OUT"

SIZE=$(du -h "$OUT" | cut -f1)
echo "    backup OK ($SIZE)"

# Retention: keep the 14 most recent dumps, delete the rest
echo "==> Pruning old backups (keeping 14 most recent)"
ls -1t "$BACKUP_DIR"/credent_*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm -v

echo "==> Done. Backups in $BACKUP_DIR:"
ls -lh "$BACKUP_DIR"/credent_*.sql.gz | tail -n 5
