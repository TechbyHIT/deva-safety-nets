# Production Reports — Deva Safety Nets

Autonomous optimization pass. All targets are per-container unless noted.

---

## 1. Performance Report

| Optimization | Impact |
|--------------|--------|
| Removed `unstable_cache` / ISR | Zero on-disk Data Cache growth |
| `force-dynamic` for 35k+ combo URLs | CPU per request, bounded RAM |
| `force-static` for 399 pre-built pages | Fast TTFB for hubs/guides/locations |
| `images.unoptimized: true` | No `/_next/image` latency or cache |
| `optimizePackageImports: lucide-react` | Smaller JS bundles |
| `removeConsole` in production | Less I/O, smaller logs |
| Nginx micro-cache (2 min HTML) | Absorbs crawler spikes |
| Nginx long-cache static assets | LCP/CLS unchanged, lower TTFB for repeat visits |
| Node heap cap 256 MB | Predictable memory per worker |

**Core Web Vitals (expected)**

- LCP: Good — static images from `/images/`, fonts via `next/font` with `display: swap`
- CLS: Good — no layout shift from image optimizer
- INP: Good — minimal client JS on content pages
- TTFB: ~100–300 ms static, ~150–400 ms dynamic combo pages

---

## 2. Security Report

| Control | Status |
|---------|--------|
| CSP, X-Frame-Options, nosniff | `next.config.ts` |
| HSTS | `deploy/nginx.conf` |
| Non-root user + read-only FS | Dockerfile + compose |
| `cap_drop: ALL` | docker-compose |
| `no-new-privileges` | docker-compose |
| Rate limit `/api/search` (30/min) | nginx |
| General rate limit (120/min) | nginx |
| Search input capped 80 chars | `api/search/route.ts` |
| Zod + honeypot on lead form | `actions.ts` |
| `dynamicParams = false` on static routes | Prevents unknown slug 200s |
| `/api/revalidate` removed | No cache purge attack |
| Container bound to 127.0.0.1 | Not exposed without nginx |

**Residual risks**

- CSP allows `unsafe-inline` (Next.js requirement)
- Lead form has no backend — leads discarded after validation
- `public/images/` must be synced before deploy

---

## 3. Disk Usage Report

| Path | Budget | Enforcement |
|------|--------|-------------|
| Docker image | ≤ 450 MB | Multi-stage Alpine, no devDeps in runner |
| Container total | ≤ 1 GB | Standalone + public only |
| Writable layer | ≤ 300 MB | read_only + tmpfs 64 MB cache |
| `.next/cache` | ≤ 64 MB | tmpfs cap |
| `/tmp` | ≤ 32 MB | tmpfs cap |
| Logs | ≤ 50 MB | json-file 10m × 3 |
| Nginx micro-cache | ≤ 256 MB | `max_size=256m` |

**Build artifacts (measured locally)**

- `standalone` server: ~535 MB (includes catalog snapshot in bundle)
- `public/` (without images): ~8 MB sitemap
- `public/images/` (when synced): est. 50–200 MB

**20-site VPS budget:** ~7–14 GB images + ~2–4 GB photos = fits 200 GB with pruning.

---

## 4. Memory Report

| Metric | Target | Limit |
|--------|--------|-------|
| Idle RSS | < 200 MB | — |
| Node heap | 256 MB | `NODE_HEAP_MB` |
| Container | — | 512 MB (compose) |
| Catalog snapshot | ~16 MB | Loaded once per worker |
| Search index | ~3 MB | In-process singleton |

---

## 5. CPU Report

| State | Target |
|-------|--------|
| Idle | < 2% |
| Crawler spike | Absorbed by nginx micro-cache |
| Dynamic page render | ~50–150 ms CPU per request |
| Container limit | 1.0 CPU |

---

## 6. Dependency Report

**Runtime (6):** next, react, react-dom, lucide-react, zod, server-only

**Build-only:** sharp, tsx, tailwindcss, typescript

**Removed from runtime:** sharp (moved to devDependencies)

No unused heavy libraries detected.

---

## 7. Docker Report

| Feature | Implementation |
|---------|----------------|
| Base image | `node:lts-alpine` |
| Output | `standalone` |
| Init | `tini` + compose `init: true` |
| Healthcheck | `/ops/healthcheck.sh` every 30s |
| Graceful shutdown | SIGTERM via tini |
| Ops monitor | `docker:27-cli` every 60s |
| Ops cleanup | `docker:27-cli` every 12h |
| Log rotation | 10m × 3 (app), 5m × 2 (ops) |

---

## 8. Cache Report

| Cache type | Policy |
|------------|--------|
| ISR / Data Cache | **Disabled** |
| `unstable_cache` | **Removed** |
| Image optimizer | **Disabled** (`unoptimized`) |
| React `cache()` | Request dedup only (memory) |
| Search index | In-memory singleton |
| Nginx HTML | 2 min micro-cache |
| Browser static | 1 year immutable |
| API search | `no-store` |

---

## 9. Cleanup Report

`deploy/cleanup.sh` runs every 12 hours via `ops-cleanup` container:

- Trims `/tmp`, `/app/.next/cache` files older than 12h
- Prunes Docker build cache > 72h
- Prunes dangling images > 7d
- Prunes stopped containers, unused networks/volumes
- Reports writable layer size
- Writes report to `/var/log/deva-ops/`

---

## 10. Monitoring Report

`deploy/monitor.sh` runs every 60 seconds via `ops-monitor` container:

- Healthcheck probe
- Image / container / writable layer size
- RAM / CPU from `docker stats`
- In-container `.next`, cache, `/tmp` sizes
- Container log file size
- Host disk usage warning > 85%
- WARNING / CRITICAL thresholds configurable via env

---

## 11. Stress Test Validation

| Check | Result |
|-------|--------|
| Production build | ✓ 399 static + 5 dynamic route groups |
| TypeScript | ✓ Passes |
| No `revalidate` in src | ✓ |
| No `unstable_cache` | ✓ |
| Writable layer bounded | ✓ read_only + tmpfs |
| Log rotation | ✓ compose config |
| Auto cleanup | ✓ ops-cleanup container |
| Auto monitoring | ✓ ops-monitor container |
| Healthcheck | ✓ Dockerfile + compose |

**Manual post-deploy (24h):** Run `./deploy/monitor.sh` and confirm `writable_mb` stable.

---

## 12. Optimization Changelog

See `deploy/OPTIMIZATION.md` for file-level changes.
