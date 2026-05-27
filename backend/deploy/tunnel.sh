#!/usr/bin/env bash
# =============================================================================
# Credent backend — Cloudflare Tunnel launcher
#
# Exposes localhost:5000 to the public internet through Cloudflare's edge,
# automatic HTTPS, no open ports on the VM.
#
# Two modes:
#
#   1. QUICK MODE (default)  — gives you a random *.trycloudflare.com URL
#      every time you run it. Free, zero setup, but the URL changes every
#      restart. Good for early testing only.
#
#         bash deploy/tunnel.sh quick
#
#   2. NAMED TUNNEL (recommended for beta) — stable URL that survives reboots
#      and supports a custom domain if you ever buy one. Requires one-time
#      browser login to Cloudflare.
#
#         bash deploy/tunnel.sh named
#
# After running once with `named`, the tunnel auto-starts on every boot.
# =============================================================================
set -euo pipefail

MODE="${1:-quick}"
SERVICE_NAME=credent-tunnel

case "$MODE" in
  quick)
    echo "==> Starting quick tunnel (random *.trycloudflare.com URL)"
    echo "    The URL Cloudflare prints below is what the Electron app must"
    echo "    point at. NOTE: this URL changes every restart — for a stable"
    echo "    URL use:  bash deploy/tunnel.sh named"
    echo
    exec cloudflared tunnel --url http://localhost:5000
    ;;

  named)
    if ! [[ -f "$HOME/.cloudflared/cert.pem" ]]; then
      echo "==> First-time setup: logging in to Cloudflare"
      echo "    Opening a browser link — copy it to your laptop and authorize."
      cloudflared tunnel login
    fi

    TUNNEL_NAME=credent-beta
    if ! cloudflared tunnel list 2>/dev/null | grep -q "$TUNNEL_NAME"; then
      echo "==> Creating tunnel: $TUNNEL_NAME"
      cloudflared tunnel create "$TUNNEL_NAME"
    fi

    TUNNEL_ID=$(cloudflared tunnel list | awk -v n="$TUNNEL_NAME" '$2==n {print $1}')
    [[ -n "$TUNNEL_ID" ]] || { echo "Could not resolve tunnel ID"; exit 1; }

    mkdir -p "$HOME/.cloudflared"
    cat > "$HOME/.cloudflared/config.yml" <<EOF
tunnel: ${TUNNEL_ID}
credentials-file: ${HOME}/.cloudflared/${TUNNEL_ID}.json
ingress:
  - hostname: ${TUNNEL_HOSTNAME:-credent-beta.example.com}
    service: http://localhost:5000
  - service: http_status:404
EOF

    if [[ "${TUNNEL_HOSTNAME:-}" ]]; then
      echo "==> Routing ${TUNNEL_HOSTNAME} to tunnel ${TUNNEL_ID}"
      cloudflared tunnel route dns "$TUNNEL_NAME" "$TUNNEL_HOSTNAME"
    else
      echo
      echo "TUNNEL_HOSTNAME env var not set — the tunnel is created but not"
      echo "routed to a domain yet. You have two options:"
      echo "  a) buy a domain, add it to Cloudflare, then re-run with"
      echo "     TUNNEL_HOSTNAME=api.yourdomain.com bash deploy/tunnel.sh named"
      echo "  b) use 'quick' mode for now and switch later."
      echo
      exit 1
    fi

    echo "==> Installing tunnel as a systemd service (auto-start on boot)"
    sudo cloudflared service install || true
    sudo systemctl enable cloudflared
    sudo systemctl restart cloudflared

    echo
    echo "Tunnel is live at https://${TUNNEL_HOSTNAME}"
    echo "Check status:    sudo systemctl status cloudflared"
    echo "Check logs:      sudo journalctl -u cloudflared -f"
    ;;

  *)
    echo "Usage: $0 {quick|named}"
    exit 1
    ;;
esac
