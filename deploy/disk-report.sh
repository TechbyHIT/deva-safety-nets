#!/bin/bash
# Storage / RAM / CPU footprint report for multi-site VPS.
# Usage: bash deploy/disk-report.sh [project-root]
set -eu

ROOT="${1:-$(cd "$(dirname "$0")/.." && pwd)}"

echo "=== Host ==="
df -h / | tail -1
free -h | head -2
uptime

echo ""
echo "=== Largest project dirs under $(dirname "$ROOT") ==="
du -sh "$(dirname "$ROOT")"/*/ 2>/dev/null | sort -hr | head -20 || true

echo ""
echo "=== This project ($ROOT) ==="
du -sh "$ROOT" 2>/dev/null || true
du -sh "$ROOT"/.next "$ROOT"/.next/standalone "$ROOT"/node_modules "$ROOT"/public "$ROOT"/src 2>/dev/null || true

echo ""
echo "=== PM2 ==="
pm2 status 2>/dev/null || true

echo ""
echo "=== Logs (largest) ==="
du -sh "$HOME/.pm2/logs" 2>/dev/null || true
ls -lhS "$HOME/.pm2/logs" 2>/dev/null | head -15 || true

echo ""
echo "=== Tips ==="
echo "- After deploy: bash deploy/lean-post-build.sh"
echo "- Weekly: bash deploy/vps-disk-cleanup.sh"
echo "- Logrotate: bash deploy/pm2-logrotate-setup.sh"
echo "- Guide: deploy/LEAN-MULTI-SITE.md"
