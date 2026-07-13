#!/bin/sh
# Autonomous monitor — run every minute via ops-monitor container.
set -eu

CONTAINER="${TARGET_CONTAINER:-deva-safety-nets}"
REPORT_DIR="${REPORT_DIR:-/var/log/deva-ops}"

WARN_IMAGE_MB="${WARN_IMAGE_MB:-450}"
WARN_CONTAINER_MB="${WARN_CONTAINER_MB:-1024}"
WARN_WRITABLE_MB="${WARN_WRITABLE_MB:-300}"
WARN_RAM_MB="${WARN_RAM_MB:-400}"
WARN_CPU_PCT="${WARN_CPU_PCT:-80}"
WARN_CACHE_MB="${WARN_CACHE_MB:-64}"
WARN_LOG_MB="${WARN_LOG_MB:-50}"
CRIT_RAM_MB="${CRIT_RAM_MB:-480}"

ts() { date -Iseconds; }
info() { echo "[monitor] $(ts) $*"; }
warn() { echo "[monitor] $(ts) WARNING $*" >&2; }
crit() { echo "[monitor] $(ts) CRITICAL $*" >&2; }

mkdir -p "$REPORT_DIR" 2>/dev/null || REPORT_DIR="/tmp"

if ! docker inspect "$CONTAINER" >/dev/null 2>&1; then
  crit "container $CONTAINER not running"
  exit 1
fi

# Health
if ! docker exec "$CONTAINER" sh /ops/healthcheck.sh 2>/dev/null; then
  crit "healthcheck failed for $CONTAINER"
fi

IMAGE_ID=$(docker inspect -f '{{.Image}}' "$CONTAINER")
IMAGE_MB=$(docker image inspect -f '{{.Size}}' "$IMAGE_ID" 2>/dev/null | awk '{printf "%d", $1/1024/1024}')
WRITABLE_MB=$(docker inspect -f '{{.SizeRw}}' "$CONTAINER" 2>/dev/null | awk '{printf "%d", $1/1024/1024}')
ROOTFS_MB=$(docker inspect -f '{{.SizeRootFs}}' "$CONTAINER" 2>/dev/null | awk '{printf "%d", $1/1024/1024}')
TOTAL_MB=$((WRITABLE_MB + ROOTFS_MB))

STATS=$(docker stats --no-stream --format '{{.MemUsage}}|{{.CPUPerc}}' "$CONTAINER" 2>/dev/null || echo "0MiB / 0MiB|0")
MEM_RAW=$(echo "$STATS" | cut -d'|' -f1)
CPU_RAW=$(echo "$STATS" | cut -d'|' -f2 | tr -d '% ')
MEM_MB=$(echo "$MEM_RAW" | awk -F'/' '{gsub(/MiB|GiB| /,"",$1); if ($1 ~ /GiB/) print int($1)*1024; else print int($1)}')

info "image=${IMAGE_MB}MB total=${TOTAL_MB}MB writable=${WRITABLE_MB}MB mem≈${MEM_MB}MB cpu=${CPU_RAW}%"

[ "$IMAGE_MB" -gt "$WARN_IMAGE_MB" ] && warn "image ${IMAGE_MB}MB > ${WARN_IMAGE_MB}MB"
[ "$TOTAL_MB" -gt "$WARN_CONTAINER_MB" ] && warn "container ${TOTAL_MB}MB > ${WARN_CONTAINER_MB}MB"
[ "$WRITABLE_MB" -gt "$WARN_WRITABLE_MB" ] && warn "writable ${WRITABLE_MB}MB > ${WARN_WRITABLE_MB}MB — run cleanup"
[ "$MEM_MB" -gt "$WARN_RAM_MB" ] 2>/dev/null && warn "memory ${MEM_MB}MB > ${WARN_RAM_MB}MB"
[ "$MEM_MB" -gt "$CRIT_RAM_MB" ] 2>/dev/null && crit "memory ${MEM_MB}MB > ${CRIT_RAM_MB}MB — restart may be needed"

CPU_INT=${CPU_RAW%.*}
[ -n "$CPU_INT" ] && [ "$CPU_INT" -gt "$WARN_CPU_PCT" ] 2>/dev/null && warn "cpu ${CPU_RAW}% > ${WARN_CPU_PCT}%"

# In-container sizes
docker exec "$CONTAINER" sh -c '
  for d in /app/.next /app/.next/cache /tmp; do
    [ -d "$d" ] && du -sm "$d" 2>/dev/null
  done
' 2>/dev/null | while read -r size path; do
  info "dir $path ${size}MB"
  [ "$path" = "/app/.next/cache" ] && [ "${size:-0}" -gt "${WARN_CACHE_MB}" ] 2>/dev/null && \
    warn "cache ${size}MB > ${WARN_CACHE_MB}MB"
done

# Docker log size estimate
LOG_PATH=$(docker inspect -f '{{.LogPath}}' "$CONTAINER" 2>/dev/null || true)
if [ -n "$LOG_PATH" ] && [ -f "$LOG_PATH" ]; then
  LOG_MB=$(du -m "$LOG_PATH" 2>/dev/null | awk '{print $1}')
  info "container_log_mb=$LOG_MB"
  [ "${LOG_MB:-0}" -gt "$WARN_LOG_MB" ] && warn "logs ${LOG_MB}MB > ${WARN_LOG_MB}MB"
fi

# Host disk
if command -v df >/dev/null 2>&1; then
  DISK_PCT=$(df / 2>/dev/null | awk 'NR==2 {gsub(/%/,"",$5); print $5}')
  [ -n "$DISK_PCT" ] && [ "$DISK_PCT" -gt 85 ] 2>/dev/null && warn "host disk ${DISK_PCT}% used"
fi
