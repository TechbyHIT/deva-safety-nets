#!/bin/bash
# Quick production diagnostics — run on VPS: bash deploy/diagnose.sh
set -eu

echo "=== Docker ==="
docker compose ps 2>/dev/null || docker ps --filter name=deva

echo ""
echo "=== Health ==="
curl -sf http://127.0.0.1:3000/api/health && echo || echo "FAIL: app not responding"

echo ""
echo "=== Sample images (app direct) ==="
for path in \
  /images/invisible-grill-balcony/i3.jpg \
  /images/safety-nets-balcony/b1.jpg \
  /logo.png; do
  code=$(curl -so /dev/null -w "%{http_code}" "http://127.0.0.1:3000${path}")
  echo "  ${path} -> ${code}"
done

echo ""
echo "=== Images in container ==="
docker exec deva-safety-nets sh -c 'ls public/images/invisible-grill-balcony 2>/dev/null | wc -l' 2>/dev/null || echo "container not running"

echo ""
echo "=== Nginx ==="
sudo nginx -t 2>&1
curl -sko /dev/null -w "https homepage: %{http_code}\n" https://devasafetynets.com/ 2>/dev/null || true
curl -sko /dev/null -w "https image: %{http_code}\n" https://devasafetynets.com/images/invisible-grill-balcony/i3.jpg 2>/dev/null || true

echo ""
echo "=== Recent app logs ==="
docker logs deva-safety-nets --tail 20 2>&1 || true
