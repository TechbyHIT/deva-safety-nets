#!/bin/sh
# Cleanup loop — 12 hour interval (43200s)
set -eu
INTERVAL="${CLEANUP_INTERVAL:-43200}"
TARGET="${TARGET_CONTAINER:-deva-safety-nets}"

echo "[cleanup-loop] starting interval=${INTERVAL}s target=$TARGET"
while true; do
  TARGET_CONTAINER="$TARGET" /ops/cleanup.sh || true
  sleep "$INTERVAL"
done
