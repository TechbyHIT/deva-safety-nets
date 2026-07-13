# Hostinger VPS — Docker Manager deploy

## 1. DNS (required)

Point your domain **A record** to the VPS IP (e.g. `200.97.163.178`):

| Type | Name | Value |
|------|------|-------|
| A | `@` | VPS IP |
| A | `www` | VPS IP |

Remove Hostinger **parked domain** / parking page for `devasafetynets.com`.

## 2. Deploy in Docker Manager

1. On the VPS, prepare images before build:
   ```bash
   npm run images:prepare && npm run favicons:generate
   ```
2. Push latest `main` to GitHub.
3. Hostinger → VPS → **Docker Manager** → **Compose from URL**.
4. Paste:

   ```
   https://raw.githubusercontent.com/TechbyHIT/deva-safety-nets/main/docker-compose.yml
   ```

5. **Rebuild** the stack (not just restart) after every config change.
6. The stack starts three containers:
   - `deva-safety-nets` — app on `127.0.0.1:3000`
   - `deva-ops-monitor` — health/disk/RAM checks every 60s
   - `deva-ops-cleanup` — cache/Docker prune every 12h
7. Map domain SSL/proxy to container port **3000** (or install `deploy/nginx.conf` on the VPS).

## 3. Verify

- Health: `http://YOUR_VPS_IP:3000/api/health` → `{"status":"ok"}`
- CSS loads: DevTools → Network → filter `css` → status **200** on `/_next/static/...`
- Images: Network → `/images/...` → **200** (production uses unoptimized static images)

## 4. Resource limits (multi-site VPS)

This stack is hardened for **10–20 sites on one 200 GB VPS**:

- Read-only container filesystem + tmpfs cache caps
- Docker logs: `10m` × 3 files
- Memory limit: 512 MB per container
- No ISR / on-disk Data Cache growth

Monitor and cleanup:

```bash
chmod +x deploy/monitor.sh deploy/cleanup.sh
./deploy/monitor.sh deva-safety-nets
./deploy/cleanup.sh deva-safety-nets
```

See `deploy/OPTIMIZATION.md` for full reports.

## 5. Use HTTP until SSL is configured

Before TLS is active on the domain, open **`http://devasafetynets.com`** (not `https://`).

After Hostinger SSL / Cloudflare is enabled, use `https://devasafetynets.com`.

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Unstyled HTML | Rebuild Docker image (old CSP cached). Hard-refresh browser (Ctrl+Shift+R). |
| Parked domain page | Fix DNS A record; wait for propagation. |
| `ERR_SSL_PROTOCOL_ERROR` on IP | Use `http://IP:3000`, not `https://`. |
| Images missing | Rebuild image; ensure `public/images` is in the repo. |
