#!/bin/bash
# Free disk on a multi-site VPS — run on the HOST (not inside a container).
# Safe: keeps running containers. Removes old build cache, dangling images, stopped containers.
#
#   chmod +x deploy/vps-disk-cleanup.sh
#   sudo bash deploy/vps-disk-cleanup.sh          # normal cleanup
#   sudo bash deploy/vps-disk-cleanup.sh --aggressive  # also remove unused images (keep running)
#
set -eu

AGGRESSIVE=false
[ "${1:-}" = "--aggressive" ] && AGGRESSIVE=true

echo "=== Disk BEFORE ==="
df -h / /var/lib/docker /var/lib/containerd 2>/dev/null || df -h /

echo ""
echo "=== Docker disk usage ==="
docker system df 2>/dev/null || true

echo ""
echo "=== Running containers (will NOT be stopped) ==="
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

echo ""
echo "=== Step 1: trim logs in running containers ==="
for name in $(docker ps --format '{{.Names}}'); do
  docker exec "$name" sh -c '
    for d in /tmp /app/.next/cache /var/tmp; do
      [ -d "$d" ] || continue
      find "$d" -type f -mmin +720 -delete 2>/dev/null || true
    done
  ' 2>/dev/null && echo "  trimmed $name" || true
done

echo ""
echo "=== Step 2: remove stopped containers, unused networks ==="
docker container prune -f 2>/dev/null || true
docker network prune -f 2>/dev/null || true

echo ""
echo "=== Step 3: remove build cache (main cause of 100GB+ bloat) ==="
docker builder prune -f --filter "until=24h" 2>/dev/null || true
# Remove all build cache if still huge (safe — next build will recreate)
docker builder prune -af 2>/dev/null || true

echo ""
echo "=== Step 4: remove dangling images ==="
docker image prune -f 2>/dev/null || true

if [ "$AGGRESSIVE" = "true" ]; then
  echo ""
  echo "=== Step 5 (aggressive): remove ALL unused images ==="
  echo "    Running containers keep their current image."
  docker image prune -af 2>/dev/null || true
fi

echo ""
echo "=== Step 6: unused volumes (no label keep) ==="
docker volume ls -q --filter dangling=true | xargs -r docker volume rm 2>/dev/null || true

echo ""
echo "=== Disk AFTER ==="
df -h / /var/lib/docker /var/lib/containerd 2>/dev/null || df -h /
docker system df 2>/dev/null || true

echo ""
echo "Done. Rebuild a site only when needed:"
echo "  cd ~/site-folder && docker compose build && docker compose up -d"
echo "Avoid 'build --no-cache' unless fixing a broken deploy."
