# Multi-site VPS — disk & hosting plan (8–10 websites)

## Why `/var/lib/containerd` hits 200 GB+

| Cause | What happens |
|-------|----------------|
| **`docker compose build --no-cache`** every deploy | Keeps full build layers (node_modules, Next build) — **10–30 GB per rebuild** |
| Old unused images | Each site rebuild leaves previous image layers |
| Build cache never pruned | Default Docker cache grows without limit |
| **10 sites × 3 containers each** | 30 containers if every site runs its own ops-monitor + ops-cleanup |

One site should use **~1–2 GB** on disk (running image + photos). **200 GB = leftover cache**, not normal usage.

---

## Fix now (run on VPS once)

```bash
cd ~/deva-safety-nets
git pull origin main
chmod +x deploy/vps-disk-cleanup.sh
sudo bash deploy/vps-disk-cleanup.sh --aggressive
```

Check space:

```bash
df -h /
du -sh /var/lib/docker /var/lib/containerd 2>/dev/null
docker system df
```

Target after cleanup: **Docker TOTAL under 20–40 GB** for several sites.

---

## Deploy rule (save disk forever)

| Do | Don't |
|----|--------|
| `docker compose build` | `docker compose build --no-cache` (only when images broken) |
| `docker compose up -d` | Rebuild all 10 sites every day |
| Run **one** server cleanup weekly | Run ops-cleanup container on **every** site |

Weekly cron on host:

```bash
sudo crontab -e
# Every Sunday 3am
0 3 * * 0 /root/deva-safety-nets/deploy/vps-disk-cleanup.sh >> /var/log/vps-cleanup.log 2>&1
```

---

## Host 8–10 sites on one VPS

### Port plan

| Site | Folder | Port | Container name |
|------|--------|------|----------------|
| 1 | `~/deva-safety-nets` | 3000 | `deva-safety-nets` |
| 2 | `~/site-2` | 3001 | `site-2-app` |
| 3 | `~/site-3` | 3002 | `site-3-app` |
| … | … | 3003–3009 | … |

Copy `docker-compose.site.yml` per site — set `APP_PORT`, `CONTAINER_NAME`, `NEXT_PUBLIC_SITE_URL`.

### One nginx, many domains

One `/etc/nginx/sites-enabled/` file per domain → `proxy_pass http://127.0.0.1:3000` (or 3001, 3002…).

### Skip extra ops containers on sites 2–10

For sites 2–10 use a **minimal** compose (app only):

```yaml
services:
  app:
    build: .
    container_name: site-2-app
    ports:
      - "127.0.0.1:3001:3000"
    restart: unless-stopped
```

Use **one** host cleanup script for the whole server — not 10 cleanup containers.

### RAM budget (example 8 GB VPS)

| Sites | RAM each | Total app RAM |
|-------|----------|----------------|
| 8 sites | 512–768 MB | ~4–6 GB |
| nginx + OS | — | ~1–2 GB |

Do not give every site 768 MB on a small VPS — use **512 MB** for sites 2–10.

---

## Expected disk per site (after cleanup)

| Item | Size |
|------|------|
| Running Docker image (with photos) | ~800 MB – 1.5 GB |
| Git repo on disk | ~200–500 MB |
| **10 sites (running only)** | **~10–15 GB** |
| Build cache (if not pruned) | **50–200 GB** ← problem |

---

## Quick checks

```bash
# What uses space
docker system df -v
du -sh /var/lib/docker/* 2>/dev/null | sort -hr | head

# List all images
docker images --format '{{.Size}}\t{{.Repository}}:{{.Tag}}'

# List containers
docker ps -a
```

---

## This project (Deva Safety Nets)

- Image includes `public/images/` — large but normal (~hundreds of MB).
- `ops-cleanup` prunes every 12h but **only dangling** images — run `vps-disk-cleanup.sh` for full cache wipe.
- After aggressive cleanup, redeploy only sites you updated:

```bash
cd ~/deva-safety-nets
docker compose build
docker compose up -d
```
