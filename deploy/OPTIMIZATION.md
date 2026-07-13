# Production optimization changelog

## Cache & routing

- Removed all `unstable_cache` from `queries.ts` and `search.ts`
- Removed all `export const revalidate` from pages
- `force-static` on 399 pre-built pages (`dynamicParams = false`)
- `force-dynamic` on combo/keyword routes (no ISR disk files)
- Removed `/api/revalidate`
- Search API: `force-dynamic`, `no-store`
- `/search` page: `force-dynamic` (uses `searchParams`)

## Docker

- `node:lts-alpine` multi-stage Dockerfile
- `tini` init, `/ops/startup.sh`, `/ops/healthcheck.sh`
- Strip source maps, build cache, node_modules from image
- `read_only`, tmpfs, `cap_drop: ALL`, ulimits, memory limits
- Bind `127.0.0.1:3000` (nginx terminates TLS)
- `ops-monitor` container (60s interval)
- `ops-cleanup` container (12h interval)
- `docker-compose.site.yml` multi-site template

## Nginx

- Rate limiting on `/api/search` and general traffic
- HSTS, security headers
- Bounded micro-cache (256 MB max)
- API routes bypass cache
- Removed stale ISR / `/_next/image` assumptions

## Dependencies

- `sharp` → devDependencies (build scripts only)
- `tsx` → devDependencies (reproducible builds)

## App

- `error.tsx`, `global-error.tsx` added
- `ecosystem.config.cjs` updated for standalone path

## Ops scripts

- `deploy/startup.sh` — bounded heap, graceful shutdown
- `deploy/healthcheck.sh` — health probe
- `deploy/monitor.sh` + `monitor-loop.sh` — 60s monitoring
- `deploy/cleanup.sh` + `cleanup-loop.sh` — 12h cleanup
- `deploy/reports/PRODUCTION-REPORTS.md` — all reports

## Pre-deploy requirement

```bash
npm run images:prepare
npm run favicons:generate
npm run build
```

Without `public/images/`, all page photos 404 in production.
