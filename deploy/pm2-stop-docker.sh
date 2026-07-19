#!/bin/bash
# Stop Docker stack before switching to PM2 (optional migration step).
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Stopping Docker containers for this project..."
docker compose down 2>/dev/null || true

echo ""
echo "Optional: free Docker disk (does not affect PM2):"
echo "  sudo bash deploy/vps-disk-cleanup.sh --aggressive"
echo ""
echo "Then start PM2:"
echo "  bash deploy/pm2-deploy.sh"
