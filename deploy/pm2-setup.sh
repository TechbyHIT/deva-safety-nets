#!/bin/bash
# One-time VPS setup for PM2 deploy (no Docker). Run as root or with sudo for pm2 startup.
set -eu

echo "=== Node.js ==="
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v
npm -v

echo ""
echo "=== PM2 ==="
npm install -g pm2
pm2 -v

echo ""
echo "=== PM2 startup on boot ==="
pm2 startup systemd -u "${SUDO_USER:-$USER}" --hp "$(eval echo ~${SUDO_USER:-$USER})" || true

echo ""
echo "Done. Next:"
echo "  cd ~/deva-safety-nets"
echo "  cp .env.example .env && nano .env"
echo "  bash deploy/pm2-deploy.sh"
