#!/bin/sh
# Production startup — graceful shutdown, bounded Node heap, pre-flight checks.
set -eu

PORT="${PORT:-3000}"
HOSTNAME="${HOSTNAME:-0.0.0.0}"
NODE_HEAP_MB="${NODE_HEAP_MB:-256}"

echo "[startup] $(date -Iseconds) node=$(node -v) port=$PORT heap=${NODE_HEAP_MB}MB"

mkdir -p /tmp /app/.next/cache 2>/dev/null || true

export NODE_ENV="${NODE_ENV:-production}"
export NEXT_TELEMETRY_DISABLED="${NEXT_TELEMETRY_DISABLED:-1}"
export NODE_OPTIONS="--max-old-space-size=${NODE_HEAP_MB} --enable-source-maps=false"

if [ ! -f /app/server.js ]; then
  echo "[startup] CRITICAL: server.js missing — rebuild Docker image" >&2
  exit 1
fi

shutdown() {
  echo "[startup] $(date -Iseconds) SIGTERM received — shutting down"
  kill -TERM "$child" 2>/dev/null || true
  wait "$child" 2>/dev/null || true
  exit 0
}
trap shutdown INT TERM

node server.js &
child=$!
wait "$child"
