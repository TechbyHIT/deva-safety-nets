#!/bin/sh
set -eu
export HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3002/api/health}"
export HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-5}"
exec node -e "
const url = process.env.HEALTH_URL;
const ms = Number(process.env.HEALTH_TIMEOUT) * 1000;
const ctrl = new AbortController();
const t = setTimeout(() => ctrl.abort(), ms);
fetch(url, { signal: ctrl.signal })
  .then((r) => { clearTimeout(t); process.exit(r.ok ? 0 : 1); })
  .catch(() => { clearTimeout(t); process.exit(1); });
"
