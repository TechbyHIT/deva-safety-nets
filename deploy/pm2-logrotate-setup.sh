#!/bin/bash
# Configure pm2-logrotate for 50+ sites (small disk footprint).
# Run once as root: bash deploy/pm2-logrotate-setup.sh
set -eu

pm2 install pm2-logrotate || true

pm2 set pm2-logrotate:max_size 5M
pm2 set pm2-logrotate:retain 3
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:workerInterval 60
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
pm2 set pm2-logrotate:rotateModule true

echo "pm2-logrotate configured: 5MB max, retain 3, compress=true"
pm2 conf pm2-logrotate || true
