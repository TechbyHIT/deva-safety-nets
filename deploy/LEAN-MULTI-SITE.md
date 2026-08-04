# Lean multi-site hosting (50+ Next.js sites on one VPS)

## Goal

Smallest practical footprint: **storage → RAM → CPU → build speed → stability**, without cutting SEO or uptime.

## Architecture (required)

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | **PM2 + `output: "standalone"`** | No Docker layer bloat; one Node process per site |
| Process | `fork`, `instances: 1` | Cluster doubles RAM for no gain until real traffic |
| Edge | One **nginx** (HTTP/2, gzip, keepalive) | TLS + cache headers once for all domains |
| Ports | `3000 + N` per site | Unique upstream per domain |
| Deploy artifact | `.next/standalone` + `public` | Never ship tests/docs/git to runtime |

## Per-site disk budget (target)

| Item | Keep after deploy? | Approx |
|------|--------------------|--------|
| `.next/standalone/` | **Yes** (runtime) | 200–800 MB |
| `public/` (photos) | **Yes** | 50–500 MB |
| `node_modules/` | **No** (delete after build) | saves 300–800 MB |
| `.next/cache` | **No** | saves 100–500 MB |
| Git `.git/` | Optional (needed for `git pull`) | 50–200 MB |

**50 lean sites ≈ 40–80 GB** if you prune after every deploy. Without prune, easily **200 GB+**.

## RAM budget (16 GB example)

| Site type | `NODE_HEAP_MB` | Notes |
|-----------|----------------|-------|
| Small brochure | 256–384 | Default fork |
| Medium | 384–512 | |
| Large programmatic SEO (this repo) | 768–1024 | Big catalog snapshot |

Leave **2–3 GB** free for OS + nginx + spikes.

## Deploy flow (every site)

```bash
cd ~/SITE_NAME
git pull origin main          # or reset --hard
npm ci                       # build-only; removed after
npm run build:prod
bash deploy/lean-post-build.sh   # drops node_modules + .next cache
pm2 start|restart ecosystem.config.cjs --env production
pm2 save
curl -sf http://127.0.0.1:$APP_PORT/api/health
```

Or: `bash deploy/pm2-deploy.sh` (calls lean cleanup automatically).

## What never to deploy to runtime

- tests, docs, `.github`, markdown, demos, source maps  
- Docker build cache / `containerd` leftovers (prefer PM2)  
- Unlimited PM2 logs (use `deploy/pm2-logrotate-setup.sh`)

## Nginx

- HTTP/2 on, gzip on (host `nginx.conf`)  
- `keepalive` to upstream  
- Cache-Control on `/_next/static/` and `/images/`  
- Do **not** `alias` files under `/root/...` (www-data → 403)

Optional Brotli: `sudo apt install libnginx-mod-http-brotli-filter` then enable module.

## Weekly host hygiene

```bash
bash deploy/disk-report.sh
bash deploy/vps-disk-cleanup.sh
# prune unused npm cache
npm cache clean --force
journalctl --vacuum-time=7d
```

## SEO note

Lean deploy does **not** remove routes or sitemaps. It only removes **build** artifacts. Dynamic programmatic URLs still render on demand from the standalone server.
