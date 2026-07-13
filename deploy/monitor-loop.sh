#!/bin/sh
# Monitor loop — 60s interval
set -eu
INTERVAL="${MONITOR_INTERVAL:-60}"
TARGET="${TARGET_CONTAINER:-deva-safety-nets}"

echo "[monitor-loop] starting interval=${INTERVAL}s target=$TARGET"
while true; do
  /ops/monitor.sh || true
  sleep "$INTERVAL"
done
