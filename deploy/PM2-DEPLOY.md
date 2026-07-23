# PM2 deploy (no Docker) — less disk, 8–10 sites on one VPS

Use **Node.js + PM2 + nginx** instead of Docker. Typical disk: **~800 MB–1 GB per site** (no containerd bloat).

---

## One-time VPS setup

```bash
ssh root@YOUR_VPS_IP
git clone https://github.com/TechbyHIT/deva-safety-nets.git
cd deva-safety-nets
cp .env.example .env
nano .env   # set NEXT_PUBLIC_SITE_URL, phone, email, etc.

chmod +x deploy/pm2-setup.sh deploy/pm2-deploy.sh
sudo bash deploy/pm2-setup.sh
```

### Migrate from Docker (optional)

```bash
bash deploy/pm2-stop-docker.sh
sudo bash deploy/vps-disk-cleanup.sh --aggressive   # recover 100+ GB
bash deploy/pm2-deploy.sh
```

### nginx (same as before)

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/deva-safety-nets
sudo ln -sf /etc/nginx/sites-available/deva-safety-nets /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

App listens on **127.0.0.1:3000** — nginx proxies HTTPS to it.

---

## Deploy updates (every time you change code)

```bash
cd ~/deva-safety-nets
bash deploy/pm2-deploy.sh
```

This runs: `git pull` → `npm ci` → `npm run build:prod` → `pm2 restart`.

**Do not use Docker** for this site after switching to PM2.

---

## Useful PM2 commands

```bash
pm2 status
pm2 logs deva-safety-nets
pm2 restart deva-safety-nets
pm2 stop deva-safety-nets
curl http://127.0.0.1:3000/api/health
```

---

## Host multiple sites (8–10 websites)

| Site | Folder | `.env` `APP_PORT` | `.env` `PM2_APP_NAME` |
|------|--------|-------------------|-------------------------|
| 1 | `~/deva-safety-nets` | 3000 | `deva-safety-nets` |
| 2 | `~/site-2` | 3001 | `site-2-app` |
| 3 | `~/site-3` | 3002 | `site-3-app` |
| … | … | 3003–3009 | … |

Per site:

```bash
git clone REPO_URL ~/site-2
cd ~/site-2
cp .env.example .env
nano .env   # APP_PORT=3001, PM2_APP_NAME=site-2-app, NEXT_PUBLIC_SITE_URL=...
bash deploy/pm2-deploy.sh
```

Add nginx `server` block per domain → `proxy_pass http://127.0.0.1:3001;`

**No Docker, no ops-monitor, no ops-cleanup per site** — much less disk.

---

## Disk per site (PM2 vs Docker)

| | Docker | **PM2 (your setup)** |
|---|--------|----------------------|
| Disk per site | ~1–1.5 GB | **~800 MB–1 GB** |
| Build cache location | `/var/lib/containerd` (200 GB risk) | Project folder (auto-trimmed on deploy) |
| 10 sites total | ~12–18 GB + cache bloat | **~8–12 GB** |

After each `pm2-deploy.sh`, `node_modules` and extra `.next` files are removed. Only `.next/standalone` + `public` photos + git repo remain.

---

## Troubleshooting

**502 from nginx**

```bash
pm2 status
curl http://127.0.0.1:3000/api/health
pm2 logs deva-safety-nets --lines 50
```

**Images 404**

```bash
ls .next/standalone/public/images/invisible-grill-balcony | head
npm run build:prod
pm2 restart deva-safety-nets
```

**Out of memory**

In `.env`: `NODE_HEAP_MB=512` then redeploy.

---

## Build scripts reference

| Command | Purpose |
|---------|---------|
| `npm run build:prod` | Build + copy `public/` and `.next/static` into standalone |
| `npm run start:pm2` | Manual start (debug) |
| `bash deploy/pm2-deploy.sh` | Full VPS deploy |
