#!/usr/bin/env bash
# =============================================================================
# Credent backend — one-shot Ubuntu setup script
#
# Run this ONCE on a fresh Oracle Cloud Free Tier VM (Ubuntu 22.04 LTS).
# It installs Node 20, pm2, the Cloudflare Tunnel daemon (cloudflared), and
# everything else the backend needs. Does NOT clone the repo — that's the
# deploy step.
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
#
# Idempotent: safe to re-run.
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
RESET='\033[0m'
log() { echo -e "${GREEN}==>${RESET} $*"; }
warn() { echo -e "${YELLOW}WARN:${RESET} $*"; }
die() { echo -e "${RED}ERROR:${RESET} $*"; exit 1; }

[[ $EUID -ne 0 ]] || die "Do NOT run as root. Run as the ubuntu user; the script uses sudo where needed."

log "Updating apt index"
sudo apt-get update -y
sudo apt-get upgrade -y

log "Installing base packages"
sudo apt-get install -y curl git build-essential ufw ca-certificates gnupg

# ─── Node.js 20 (NodeSource) ─────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v)" != v20* ]]; then
  log "Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  log "Node.js 20 already installed: $(node -v)"
fi

log "Installing pm2 (process manager)"
sudo npm install -g pm2

# ─── Cloudflare Tunnel (cloudflared) ─────────────────────────────────────────
# This is what exposes the backend to the internet without opening ports.
if ! command -v cloudflared >/dev/null 2>&1; then
  log "Installing cloudflared"
  ARCH=$(dpkg --print-architecture)
  curl -L --output cloudflared.deb "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}.deb"
  sudo dpkg -i cloudflared.deb
  rm cloudflared.deb
else
  log "cloudflared already installed: $(cloudflared --version | head -n1)"
fi

# ─── Firewall ────────────────────────────────────────────────────────────────
# We do NOT open port 5000 to the internet — cloudflared tunnels traffic from
# Cloudflare's edge to localhost:5000 on this VM. Only SSH stays open.
log "Configuring UFW firewall (SSH only)"
sudo ufw --force reset >/dev/null
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw --force enable

# Oracle's default iptables blocks everything including SSH after a fresh boot
# unless you save UFW rules. This persists them across reboots.
sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save

# ─── pm2 startup script ──────────────────────────────────────────────────────
log "Configuring pm2 to start on boot"
sudo env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$USER" --hp "$HOME"
# pm2 startup prints a command if not already configured — capturing it once
# is enough; subsequent runs are idempotent.

log "Setup complete."
echo
echo "Next steps:"
echo "  1. Clone the backend:  git clone <repo> ~/credent && cd ~/credent/backend"
echo "  2. Create .env from .env.example with production values"
echo "  3. Run: bash deploy/start.sh"
echo "  4. Set up Cloudflare Tunnel:  bash deploy/tunnel.sh"
