#!/bin/bash
# Free SSL for devasafetynets.com via Let's Encrypt (Certbot).
# Run on VPS as root: sudo bash deploy/ssl-certbot.sh
set -euo pipefail

DOMAIN=devasafetynets.com
EMAIL="${SSL_EMAIL:-devasafetynetskochi@gmail.com}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Installing certbot..."
apt-get update -qq
apt-get install -y certbot python3-certbot-nginx

echo "==> Preparing webroot for ACME challenge..."
mkdir -p /var/www/certbot

echo "==> HTTP-only nginx (for certificate request)..."
cp "$REPO_DIR/deploy/nginx-http-bootstrap.conf" /etc/nginx/sites-available/deva-safety-nets
ln -sf /etc/nginx/sites-available/deva-safety-nets /etc/nginx/sites-enabled/deva-safety-nets
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl start nginx || systemctl reload nginx

echo "==> Requesting certificate for $DOMAIN and www.$DOMAIN ..."
certbot certonly --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --non-interactive

echo "==> Installing HTTPS nginx config..."
cp "$REPO_DIR/deploy/nginx.conf" /etc/nginx/sites-available/deva-safety-nets
nginx -t
systemctl reload nginx

echo "==> Enabling auto-renewal..."
systemctl enable certbot.timer 2>/dev/null || true
certbot renew --dry-run

echo ""
echo "Done. Open https://$DOMAIN"
echo "Renewal: certbot renew (timer runs twice daily)"
