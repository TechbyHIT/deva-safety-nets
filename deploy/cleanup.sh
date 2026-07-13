#!/bin/sh
# Autonomous cleanup — run every 12 hours via ops-cleanup container.
set -eu

REPORT_DIR="${REPORT_DIR:-/var/log/deva-ops}"
CONTAINER="${TARGET_CONTAINER:-deva-safety-nets}"
PRUNE_IMAGES="${PRUNE_IMAGES:-true}"
PRUNE_BUILD_CACHE="${PRUNE_BUILD_CACHE:-true}"

ts() { date -Iseconds; }
log() { echo "[cleanup] $(ts) $*"; }
warn() { echo "[cleanup] $(ts) WARNING $*" >&2; }
crit() { echo "[cleanup] $(ts) CRITICAL $*" >&2; }

mkdir -p "$REPORT_DIR" 2>/dev/null || REPORT_DIR="/tmp"
REPORT="$REPORT_DIR/cleanup-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$REPORT") 2>&1

log "start container=$CONTAINER report=$REPORT"

# --- In-container tmpfs / cache trim ----------------------------------------
if docker inspect "$CONTAINER" >/dev/null 2>&1; then
  docker exec "$CONTAINER" sh -c '
    for dir in /tmp /app/.next/cache /var/tmp; do
      [ -d "$dir" ] || continue
      find "$dir" -type f -mmin +720 -delete 2>/dev/null || true
      find "$dir" -mindepth 1 -type d -empty -delete 2>/dev/null || true
    done
  ' 2>/dev/null || warn "in-container trim failed"

  WRITABLE=$(docker inspect -f '{{.SizeRw}}' "$CONTAINER" 2>/dev/null || echo 0)
  WRITABLE_MB=$((WRITABLE / 1024 / 1024))
  log "writable_layer_mb=$WRITABLE_MB"
  [ "$WRITABLE_MB" -gt 300 ] && crit "writable layer ${WRITABLE_MB}MB exceeds 300 MB — redeploy recommended"
else
  warn "target container $CONTAINER not found"
fi

# --- Docker system prune (bounded) --------------------------------------------
if [ "$PRUNE_BUILD_CACHE" = "true" ]; then
  docker builder prune -f --filter "until=72h" 2>/dev/null || true
  log "builder cache pruned (>72h)"
fi

if [ "$PRUNE_IMAGES" = "true" ]; then
  docker image prune -f --filter "until=168h" 2>/dev/null || true
  log "dangling images pruned (>7d)"
fi

docker container prune -f --filter "until=168h" 2>/dev/null || true
docker network prune -f 2>/dev/null || true
docker volume prune -f --filter "label!=keep" 2>/dev/null || true

# --- Host disk report ---------------------------------------------------------
if command -v df >/dev/null 2>&1; then
  df -h / /var/lib/docker 2>/dev/null | while read -r line; do log "disk $line"; done
fi

# --- Rotate old cleanup reports -----------------------------------------------
find "$REPORT_DIR" -name 'cleanup-*.log' -mtime +14 -delete 2>/dev/null || true

log "done"
echo "$REPORT"
