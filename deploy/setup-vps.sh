#!/usr/bin/env bash
# One-time Hostinger VPS preparation. Run as root:
#   curl -fsSL ... | bash
#   OR: bash deploy/setup-vps.sh
set -euo pipefail

echo "==> Hostinger VPS setup for Deva Safety Nets"

# --- Swap (helps Next.js Docker builds on 2–4 GB VPS) ---
if ! swapon --show | grep -q '/swapfile'; then
  echo "==> Adding 2 GB swap..."
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "    Swap enabled."
else
  echo "==> Swap already configured."
fi

# --- Docker ---
if ! command -v docker >/dev/null 2>&1; then
  echo "==> Installing Docker..."
  apt-get update -qq
  apt-get install -y docker.io docker-compose-plugin
  systemctl enable --now docker
else
  echo "==> Docker already installed: $(docker --version)"
fi

# --- Project directory ---
mkdir -p /opt/deva
echo "==> Project directory: /opt/deva"
echo ""
echo "Next steps:"
echo "  1. Upload your project files into /opt/deva (see deploy/hostinger.md)"
echo "  2. cd /opt/deva && cp .env.example .env && nano .env"
echo "  3. cd /opt/deva && bash deploy/deploy.sh"
