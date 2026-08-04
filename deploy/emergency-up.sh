#!/bin/bash
# Emergency: bring site back from nginx 502 with a light build (small sitemap).
# Run on VPS:
#   cd ~/deva-safety-nets && bash deploy/emergency-up.sh
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { echo "[emergency-up] $(date -Iseconds) $*"; }

# shellcheck disable=SC1091
. "$(dirname "$0")/load-env.sh"
[ -f .env ] && load_env_file .env

APP_NAME="${PM2_APP_NAME:-deva-safety-nets}"
APP_PORT="${APP_PORT:-3000}"

# Force safe values for this recovery
export PM2_APP_NAME="$APP_NAME"
export APP_PORT=3000
export NODE_HEAP_MB=1024
export BUILD_HEAP_MB=3072
export SITEMAP_PHASE=1
export NODE_OPTIONS="--max-old-space-size=${BUILD_HEAP_MB}"

log "disk / memory"
df -h . | tail -1 || true
free -h || true

log "sync origin/main"
git fetch origin
git reset --hard origin/main

# Parent lockfile makes Next write standalone to /root/.next instead of this project
if [ -f /root/package-lock.json ] && [ "$(pwd)" = "/root/deva-safety-nets" ]; then
  log "moving misplaced /root/package-lock.json aside (Next workspace root bug)"
  mv -f /root/package-lock.json /root/package-lock.json.bak-deva 2>/dev/null || true
fi
rm -rf /root/.next

# Persist runtime heap / port in .env
touch .env
grep -q '^APP_PORT=' .env && sed -i 's/^APP_PORT=.*/APP_PORT=3000/' .env || echo 'APP_PORT=3000' >> .env
grep -q '^NODE_HEAP_MB=' .env && sed -i 's/^NODE_HEAP_MB=.*/NODE_HEAP_MB=1024/' .env || echo 'NODE_HEAP_MB=1024' >> .env
grep -q '^PM2_APP_NAME=' .env && sed -i "s/^PM2_APP_NAME=.*/PM2_APP_NAME=${APP_NAME}/" .env || echo "PM2_APP_NAME=${APP_NAME}" >> .env

log "stop old process"
pm2 delete "$APP_NAME" 2>/dev/null || true
pkill -f ".next/standalone/server.js" 2>/dev/null || true
sleep 1

log "clean + light production build (SITEMAP_PHASE=1)"
rm -rf .next
npm ci
log "generate responsive WebP variants (skip if up to date)"
npm run images:responsive || log "WARN: images:responsive failed — originals still used"
npm run build:prod

if [ ! -f .next/standalone/server.js ]; then
  log "FATAL: standalone missing after build"
  exit 1
fi

# Ensure public (incl. sitemaps) is inside standalone
node scripts/prepare-standalone.mjs

log "lean post-build (drop node_modules + build cache; keep standalone)"
bash "$(dirname "$0")/lean-post-build.sh"

log "start PM2"
unset NODE_OPTIONS
load_env_file .env
export APP_PORT=3000 NODE_HEAP_MB=1024 PM2_APP_NAME="$APP_NAME"
pm2 start ecosystem.config.cjs --env production
pm2 save

log "health loop"
ok=0
for i in $(seq 1 20); do
  if curl -sf "http://127.0.0.1:3000/api/health" >/dev/null; then
    ok=1
    break
  fi
  sleep 2
done

log "listeners on 3000"
ss -ltnp | grep ':3000' || netstat -tlnp 2>/dev/null | grep ':3000' || true

if [ "$ok" -eq 1 ]; then
  log "SUCCESS"
  curl -sf http://127.0.0.1:3000/api/health; echo
  pm2 status
  exit 0
fi

log "FAILED — dumps"
pm2 describe "$APP_NAME" || true
pm2 logs "$APP_NAME" --lines 80 --nostream || true
ls -la .next/standalone/server.js || true
journalctl -u nginx --no-pager -n 20 2>/dev/null || true
exit 1
