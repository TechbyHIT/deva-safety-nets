#!/bin/bash
# Fix nginx 502 — PM2 app not listening. Run on VPS from project root:
#   bash deploy/fix-502.sh
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

APP_NAME="${PM2_APP_NAME:-deva-safety-nets}"
APP_PORT="${APP_PORT:-3000}"
# Runtime heap for large catalog (override in .env)
NODE_HEAP_MB="${NODE_HEAP_MB:-768}"
BUILD_HEAP_MB="${BUILD_HEAP_MB:-2048}"

log() { echo "[fix-502] $(date -Iseconds) $*"; }

if [ -f .env ]; then
  # shellcheck disable=SC1091
  . "$(dirname "$0")/load-env.sh"
  load_env_file .env
  APP_NAME="${PM2_APP_NAME:-$APP_NAME}"
  APP_PORT="${APP_PORT:-3000}"
  NODE_HEAP_MB="${NODE_HEAP_MB:-768}"
  BUILD_HEAP_MB="${BUILD_HEAP_MB:-2048}"
fi

export APP_PORT NODE_HEAP_MB PM2_APP_NAME="$APP_NAME" BUILD_HEAP_MB

log "status before"
pm2 status || true
ss -ltnp | grep -E ":${APP_PORT}\\b" || echo "nothing listening on ${APP_PORT}"

log "sync code"
git fetch origin
git reset --hard origin/main

# Ensure .env has enough heap for this catalog
if [ -f .env ]; then
  if grep -q '^NODE_HEAP_MB=' .env; then
    sed -i 's/^NODE_HEAP_MB=.*/NODE_HEAP_MB=768/' .env
  else
    echo "NODE_HEAP_MB=768" >> .env
  fi
  if grep -q '^APP_PORT=' .env; then
    sed -i 's/^APP_PORT=.*/APP_PORT=3000/' .env
  else
    echo "APP_PORT=3000" >> .env
  fi
fi

log "stop crashed app"
pm2 delete "$APP_NAME" 2>/dev/null || true

log "clean + rebuild (build heap ${BUILD_HEAP_MB}MB)"
rm -rf .next
export NODE_OPTIONS="--max-old-space-size=${BUILD_HEAP_MB}"
npm ci
npm run build:prod
unset NODE_OPTIONS

if [ ! -f .next/standalone/server.js ]; then
  echo "BUILD FAILED — missing .next/standalone/server.js" >&2
  exit 1
fi

log "start PM2 on port ${APP_PORT} heap ${NODE_HEAP_MB}MB"
# Reload .env after our edits
# shellcheck disable=SC1091
. "$(dirname "$0")/load-env.sh"
load_env_file .env
export APP_PORT=3000 NODE_HEAP_MB=768 PM2_APP_NAME="$APP_NAME"
pm2 start ecosystem.config.cjs --env production
pm2 save

log "wait for listen"
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null; then
    log "health OK"
    curl -sf "http://127.0.0.1:${APP_PORT}/api/health"; echo
    pm2 status
    exit 0
  fi
  sleep 2
done

log "STILL DOWN — last logs:"
pm2 logs "$APP_NAME" --lines 60 --nostream || true
free -h || true
exit 1
