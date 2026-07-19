#!/bin/bash
# Build + restart with PM2 (no Docker). Run from project root on VPS.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

APP_NAME="${PM2_APP_NAME:-deva-safety-nets}"
APP_PORT="${APP_PORT:-3000}"
NODE_HEAP_MB="${NODE_HEAP_MB:-384}"

log() { echo "[pm2-deploy] $(date -Iseconds) $*"; }

if [ ! -f .env ]; then
  echo "Missing .env — run: cp .env.example .env && nano .env" >&2
  exit 1
fi

# Load .env for build-time NEXT_PUBLIC_* and runtime PORT
set -a
# shellcheck disable=SC1091
. ./.env
set +a

export APP_PORT NODE_HEAP_MB PM2_APP_NAME="$APP_NAME"

log "pull latest"
git pull origin main

log "install dependencies"
npm ci

log "production build"
npm run build:prod

log "restart PM2 app=$APP_NAME port=$APP_PORT"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart ecosystem.config.cjs --env production --update-env
else
  pm2 start ecosystem.config.cjs --env production
fi

pm2 save

log "health check"
sleep 3
curl -sf "http://127.0.0.1:${APP_PORT}/api/health" && echo || {
  echo "Health check failed — run: pm2 logs $APP_NAME" >&2
  exit 1
}

log "done — $APP_NAME on http://127.0.0.1:$APP_PORT"
