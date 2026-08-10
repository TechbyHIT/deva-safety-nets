#!/bin/bash
# Ensure header logo files exist in standalone (PM2 public root).
# Run from project root: bash deploy/fix-logo.sh
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { echo "[fix-logo] $*"; }

if [ ! -f public/logo.png ]; then
  log "ERROR: public/logo.png missing — pull from git:"
  echo "  git fetch origin && git checkout origin/main -- public/logo.png public/logo-*.webp"
  exit 1
fi

# Regenerate webp variants if sharp/build tools available
if [ -f package.json ] && [ -d node_modules ]; then
  npm run logos:generate || log "WARN: logos:generate failed"
elif [ ! -f public/logo-384.webp ]; then
  log "WARN: logo-*.webp missing and node_modules absent — run npm ci && npm run logos:generate"
fi

STANDALONE_PUBLIC=".next/standalone/public"
if [ ! -d .next/standalone ]; then
  log "No standalone yet — run: npm run build:prod"
  exit 1
fi

mkdir -p "$STANDALONE_PUBLIC"
cp -f public/logo.png "$STANDALONE_PUBLIC/"
cp -f public/logo-*.webp "$STANDALONE_PUBLIC/" 2>/dev/null || true

log "files in standalone public:"
ls -la "$STANDALONE_PUBLIC"/logo* 2>/dev/null || true

# Restart if PM2 app exists
if pm2 describe "${PM2_APP_NAME:-deva-safety-nets}" >/dev/null 2>&1; then
  pm2 restart "${PM2_APP_NAME:-deva-safety-nets}" --update-env
  sleep 2
fi

PORT="${APP_PORT:-3006}"
curl -sI "http://127.0.0.1:${PORT}/logo.png" | head -5 || true
curl -sI "http://127.0.0.1:${PORT}/logo-384.webp" | head -3 || true
log "done — expect HTTP/1.1 200 for /logo.png"
