#!/usr/bin/env bash
# Build and start the app. Run from project root on the VPS:
#   cd /opt/deva && bash deploy/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f docker-compose.yml ]]; then
  echo "ERROR: docker-compose.yml not found in $(pwd)"
  echo "Upload the full project to this folder first (see deploy/hostinger.md)."
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "Creating .env from .env.example — edit it before production use."
  cp .env.example .env
fi

if [[ ! -f package-lock.json ]]; then
  echo "ERROR: package-lock.json missing. Upload the complete project."
  exit 1
fi

echo "==> Building Docker image (first run: 5–15 minutes)..."
docker compose build --no-cache

echo "==> Starting container..."
docker compose up -d

echo ""
echo "==> Status:"
docker compose ps

echo ""
echo "==> Health check (waiting up to 60s)..."
for i in $(seq 1 12); do
  if curl -sf http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    echo "OK — app is healthy at http://127.0.0.1:3000"
    exit 0
  fi
  sleep 5
done

echo "WARN — health check timed out. Check logs:"
echo "  docker compose logs web --tail 80"
exit 1
