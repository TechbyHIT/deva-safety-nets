#!/bin/bash
# Fix /images 403 — nginx cannot read files under /root (www-data).
# Restores proxy_pass for /images/ and reloads nginx.
# Run: bash deploy/fix-images-nginx.sh
set -eu

log() { echo "[fix-images-nginx] $*"; }

SITE=""
for c in \
  /etc/nginx/sites-available/deva-safety-nets \
  /etc/nginx/sites-enabled/deva-safety-nets \
  /etc/nginx/sites-available/devasafetynets.com \
  /etc/nginx/sites-enabled/devasafetynets.com \
  /etc/nginx/conf.d/deva-safety-nets.conf; do
  if [ -f "$c" ]; then SITE="$c"; break; fi
done

if [ -z "$SITE" ]; then
  log "Could not find nginx site file. Enabled sites:"
  ls -la /etc/nginx/sites-enabled/ 2>/dev/null || true
  exit 1
fi

log "patching $SITE"
sudo cp -a "$SITE" "${SITE}.bak-$(date +%Y%m%d%H%M%S)"

export SITE
sudo -E python3 <<'PY'
from pathlib import Path
import os, re
path = Path(os.environ["SITE"])
text = path.read_text()
block = """    location /images/ {
        proxy_pass http://deva_app;
        add_header Cache-Control \"public, max-age=31536000, immutable\";
        access_log off;
    }
"""
new, n = re.subn(
    r"\n[ \t]*location\s+/images/\s*\{.*?\n[ \t]*\}",
    "\n" + block.rstrip(),
    text,
    flags=re.S,
)
if n == 0:
    if "location /api/" in text:
        new = text.replace("location /api/", block + "\n    location /api/", 1)
    else:
        new = text.replace("location / {", block + "\n    location / {", 1)
    print("inserted /images/ proxy_pass block")
else:
    print(f"replaced {n} /images/ location block(s)")
path.write_text(new)
PY

sudo nginx -t
sudo systemctl reload nginx
log "nginx reloaded"

echo -n "app direct: "
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:3000/images/invisible-grill-balcony/i3.jpg" || echo fail
echo -n "via https:  "
curl -sk -o /dev/null -w "%{http_code}\n" "https://devasafetynets.com/images/invisible-grill-balcony/i3.jpg" || echo fail
log "done — expect 200 on both"
