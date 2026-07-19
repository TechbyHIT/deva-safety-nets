# InvisibleGrills & SafetyNets — Enterprise Programmatic SEO Platform

A production-grade **Next.js 16 + React 19** platform for the Invisible Grills &
Safety Nets industry, architected to scale to **100,000+ high-quality URLs**
through combinations of curated entities — not thin, duplicate, or doorway pages.
Content is compiled from an in-repo static catalog (no runtime database) and
served via ISR.

Every generated page satisfies a distinct user need (a specific service, in a
specific place, with local context, pricing, materials, FAQs, reviews and
strong CTAs) and is rendered from structured data plus a deterministic content
engine that keeps each URL unique and useful.

---

## Tech stack

This project uses the **same architecture** as a modern programmatic SEO site (App Router, SSG/ISR, static catalog, JSON-LD, sitemap) with **newer versions** tuned for Deva Safety Nets — **Kerala** (not Bengaluru), **Next.js 16**, **Tailwind 4**, and **Docker VPS** deploy.

### Core

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x | React framework (App Router, static + ISR, SEO) |
| **React** | 19.x | UI components |
| **TypeScript** | 5.7.x | Type-safe development |
| **Node.js** | ≥ 20.11 | Build scripts, standalone server, tooling |

### Styling & UI

| Technology | Purpose |
|---|---|
| **Tailwind CSS** 4.x (`@tailwindcss/postcss`) | Utility-first styling |
| **Google Fonts** (`next/font`) | **Inter** (body), **Poppins** (headings) |
| **Custom brand palette** | Charcoal + gold `#d4af37`, cream `#fdf9f3` |
| **lucide-react** | Icons (no UI library) |

### Architecture

- **Next.js App Router** — `src/app/` directory structure
- **Static + ISR** — core pages pre-rendered; service × city × area combos on demand
- **Standalone output** — `output: "standalone"` for Docker / VPS
- **Server + Client Components** — e.g. `SiteNav` (server) → `MobileNav` (client + portal)
- **React Portals** — mobile drawer, floating WhatsApp / Call buttons
- **No middleware** — sitemap is a static file in `public/sitemap.xml` (built at compile time)
- **No database** — all content from `src/lib/static-data/**`

### Programmatic SEO engine

Built-in data-driven page generation for **Kerala** (Kochi, Ernakulam, 160+ localities):

- **Services** — invisible grills, safety nets, bird spikes, cricket nets, etc.
- **Cities & areas** — tiered Kerala location hierarchy (`src/lib/kerala-locations.ts`)
- **Intents** — long-tail keyword links (`src/lib/seo-intents.ts`)
- **Route patterns** — `/services/[service]/[city]/[area]`, property types, guides, compare
- **SEO config** — metadata templates, canonical URLs, indexability rules
- **Internal linking** — hub pages, breadcrumbs, cross-links on service pages

~**44,000+ URLs** in `public/sitemap.xml` (regenerated on every `npm run build`).

### SEO & structured data

- **Metadata API** — titles, descriptions, Open Graph, canonical URLs
- **JSON-LD** — Organization, LocalBusiness, WebSite, FAQ, Breadcrumbs
- **Sitemap** — `scripts/generate-sitemap.mjs` → `public/sitemap.xml`
- **`robots.txt`** — `src/app/robots.ts`
- **Semantic HTML** — headings, nav landmarks, aria labels

### Images & media

- **`SiteImage` / `GalleryGrid`** — server-friendly plain `<img>` (reliable on VPS; no broken WebP srcSet)
- **Image manifest** — `src/lib/image-manifest.ts` + `public/images/**`
- **Build scripts** — `images:sync`, `logos:generate`, `validate-images.mjs` (Sharp in scripts only)
- **Cache headers** — long-lived caching for `_next/static` and `/images/*`

### Data layer (TypeScript files — no DB)

| Location | Contents |
|---|---|
| `src/lib/static-data/seed-data.ts` | Curated services, cities, FAQs, blog |
| `src/lib/static-data/build-catalog.ts` | Catalog assembly + serializers |
| `src/lib/static-data/catalog.snapshot.json` | Compiled snapshot for fast load |
| `src/lib/kerala-locations.ts` | Area tiers and locality metadata |
| `src/lib/content.ts` | Deterministic unique copy per route |

### Build & dev tools

| Script | Command | Purpose |
|---|---|---|
| Dev | `npm run dev` | Turbopack dev server |
| Build | `npm run build` | Logos → validate images → catalog → sitemap → Next build |
| Build (PM2) | `npm run build:prod` | Build + copy assets into `.next/standalone` |
| Start | `npm run start` | Standalone Node server |
| PM2 | `bash deploy/pm2-deploy.sh` | VPS deploy without Docker |
| Catalog | `npm run catalog:build` | Rebuild `catalog.snapshot.json` |
| Sitemap | `npm run sitemap:build` | Write `public/sitemap.xml` |
| Images | `npm run images:sync` | Sync photos into `public/images/` |

### Performance & production

- **Turbopack** in dev
- **Dynamic imports** — quote form, FAQ accordion, homepage gallery (smaller initial JS)
- **Console stripping** in production
- **Compression** + immutable cache headers
- **Google Ads tag** — `NEXT_PUBLIC_GOOGLE_ADS_ID` (lazy-loaded)
- **PM2 + nginx** (recommended multi-site VPS) — see `deploy/PM2-DEPLOY.md`
- **Docker + nginx** — see `docker-compose.yml` (optional)

### Deployment

- **VPS / PM2** (recommended, less disk) — `bash deploy/pm2-deploy.sh` — full guide: `deploy/PM2-DEPLOY.md`
- **VPS / Docker** — `docker compose build && docker compose up -d` (avoid `--no-cache` unless needed)
- **Vercel** — compatible (native Next.js)
- **Windows** — supported for local development

### What is NOT used

- No database (PostgreSQL, MongoDB, Prisma, etc.)
- No CMS (WordPress, Contentful, etc.)
- No UI library (MUI, shadcn, Bootstrap)
- No Redux / Zustand
- No authentication or payment gateway
- No `next/image` in production (plain images for VPS reliability)

---

## How it scales to 500k+ URLs (without low-value pages)

URLs are generated from **combinations of a small number of curated base
entities** — 90+ services, a reusable tiered location hierarchy, and a
reusable property-type dimension — rather than by inventing place names:

```
/services/[service]                          ~ 90+ services
/services/[service]/[city]                   ~ service × city
/services/[service]/[city]/[area]            ~ service × city × area     ← main multiplier
/services/[service]/for/[propertyType]       ~ service × property type
/property-types/[propertyType]               ~ property-type hubs
/property-types/[propertyType]/[city]        ~ property type × city
/locations/[city] , /locations/[city]/[area]
/materials/[material] , /industries/[industry]
/compare/[a]-vs-[b] , /blog/[slug]
/installation-guide/[service] , /maintenance-guide/[service] , /buying-guide/[service]
```

**The reusable location hierarchy** (see `src/lib/kerala-locations.ts`) models Kochi &
Ernakulam across 7 tiers — primary cities, municipalities, major localities, the
Kakkanad/IT corridor, Vypin islands, residential belts and the airport region —
so you extend coverage by adding **locations once** and every service page
inherits them. Each area carries a `tier` + `tierLabel`, and city pages group
areas by tier automatically.

**The multiplier math**: with ~107 services,
12+ cities, 190+ areas and 12 property types, the combination formula
(service × city × area, service × city × property type, service × property type,
property type × city, plus guides/FAQs/comparisons/blog) scales linearly to
**500,000+** unique, useful URLs. `service × area × property type` is available
on demand via ISR for deeper long-tail reach.

Programmatic formula supported: **Service × City · Service × Area · Service ×
Property Type · Service × City × Property Type · Property Type × City · Service ×
Guide (install/maintenance/buying) · Service × FAQ · Service × Comparison ·
Service × Material · Service × Industry**.

Quality safeguards:

- **Deterministic content engine** (`src/lib/content.ts`) composes unique intros,
  local information and benefit ordering per route via a stable route hash — the
  same URL always renders the same copy, but different combinations differ
  meaningfully.
- **Structured data everywhere**: each page carries service/location-specific
  benefits, features, specs, materials, pricing factors, FAQs and reviews.
- **Editorial overrides** (`ContentOverride` model): tune metadata/content for
  the highest-value combinations, or `noindex` any page you don't want indexed.
- **On-demand generation (ISR)**: combination pages are built lazily and cached,
  so builds stay fast at any scale.

---

## Getting started

### 1. Prerequisites

- Node.js ≥ 20.11

There is **no database, Redis or migration step** — all content is compiled from
the in-repo static catalog.

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# then edit .env — at minimum set NEXT_PUBLIC_SITE_URL and REVALIDATE_SECRET
```

### 4. Run

```bash
npm run dev          # http://localhost:3000
```

### 5. Build for production

```bash
npm run build
npm run start
```

### Editing catalog content

Edit the curated data directly in `src/lib/static-data/seed-data.ts`
(materials, industries, property types, cities, blog posts and the content
builders). `src/lib/static-data/build-catalog.ts` assembles it into the runtime
catalog at module load — no database, migration or codegen step.

---

## Project structure

```
src/
  app/                 # App Router routes
    services/[service]/[city]/[area]/   # 3-level programmatic service pages
    services/[service]/for/[propertyType]/  # service × property type
    locations/[city]/[area]/            # location pages (areas grouped by tier)
    property-types/[propertyType]/[city]/   # property-type hubs & combos
    materials/, industries/, compare/, blog/, *-guide/
    sitemap.xml/route.ts   # sitemap INDEX
    sitemaps/[id]/route.ts # segmented sitemap shards
    robots.ts, manifest.ts
    api/revalidate/    # on-demand ISR revalidation
  components/          # Header/MegaMenu, Footer, FloatingCTAs, Hero, forms, cards
  lib/
    queries.ts                         # cached data access over the static catalog
    static-data/build-catalog.ts       # builds the catalog + O(1) lookup indexes
    sitemap-urls.ts                    # sitemap entry generation + XML serializers
    seo.ts, schema.ts                  # metadata + JSON-LD
    content.ts                         # deterministic content engine
    actions.ts                         # lead capture server action (validated)
    site.ts, format.ts
```

---

## Content depth & uniqueness (every page)

Every generated page carries substantial, **unique** long-form content produced
by the deterministic engine in `src/lib/content.ts`, so the platform can scale to
500,000+ URLs without thin or duplicate pages. Each service/location/property
combination renders:

- Multiple unique intro paragraphs + a "why it matters here" section + local challenges
- A **key-takeaways** box
- **Safety standards** we follow (checklist)
- **Pricing factors** breakdown (what affects the price)
- A multi-section **complete guide** (5–6 H2/H3 sections, chosen and personalised per route)
- **Buying considerations** and **maintenance & care** checklists
- Generated, location/property-aware **FAQs** merged with any editorial FAQs
- Trust band, process timeline, materials, reviews and internal-link clusters

Because copy is composed from large template pools seeded by a stable hash of the
route, the same URL always renders the same content, but different combinations
produce meaningfully different, locally-relevant pages.

## Fast site search

- Instant search box in the header (desktop + mobile) with debounced queries,
  keyboard navigation and a typed dropdown of results
- `GET /api/search?q=` backed by an in-memory, cached index (`src/lib/search.ts`)
  over base entities (services, cities, areas, property types, materials,
  industries, guides, comparisons, blog) — fast even at scale
- Full `/search` results page; index revalidates with the `catalog`/`locations`/`content` tags

## SEO features

- Dynamic, per-page metadata with canonical URLs, Open Graph & Twitter cards
- JSON-LD: Organization, WebSite, LocalBusiness, Service, FAQPage, BreadcrumbList,
  Product/AggregateRating, BlogPosting, HowTo
- Sitemap **index** at `/sitemap.xml` + segmented shards at `/sitemaps/[id].xml`
  (≤ `SITEMAP_PAGE_SIZE` URLs/file, default 45k), scaling to 100k+ URLs
- `robots.txt`, breadcrumb navigation, internal-link automation (related
  services, nearby areas, other cities), topical clustering by category
- Programmatic + local + semantic SEO built into every combination page

## Performance

- Server Components + streaming + `Suspense` (route-level `loading.tsx`)
- ISR with tag-based revalidation; `unstable_cache` + O(1) catalog lookup indexes
- AVIF/WebP image formats, font optimization (`next/font`), long-cache static assets
- Route-level code splitting, `optimizePackageImports`

## Security

- Content Security Policy + secure headers (HSTS, X-Frame-Options, nosniff, etc.)
  in `next.config.ts`
- Zod input validation and honeypot field on lead forms
- No runtime database/ORM (static catalog); secrets via env vars

## Accessibility & UX

- WCAG-minded: skip link, focus-visible rings, semantic landmarks, ARIA labels,
  `prefers-reduced-motion` support
- Mobile-first: sticky header, mega menu, mobile drawer, sticky bottom CTA bar,
  floating WhatsApp + Call
- Dark/light mode with no-flash theme script

---

## Editing content

- Update taxonomy/geography/content directly in `src/lib/static-data/seed-data.ts`.
- After deploying edits, refresh caches without a rebuild:

```bash
curl -X POST "https://your-site/api/revalidate?tag=catalog&secret=YOUR_SECRET"
# tags: catalog | locations | content
```

## Deployment (PM2 + Nginx)

The app builds to a self-contained Node server (`output: "standalone"`) and ships
with ready-to-use `ecosystem.config.cjs` (PM2) and `deploy/nginx.conf` (Nginx).
Content is compiled from the in-repo static catalog, so **there is no database,
migration or seed step** at deploy time.

### 1. Server prerequisites

```bash
# Node.js ≥ 20.11 (nvm recommended) and PM2
node -v
npm i -g pm2
```

### 2. Build the app

```bash
git clone <repo> /var/www/deva && cd /var/www/deva
cp .env.example .env      # set NEXT_PUBLIC_SITE_URL, REVALIDATE_SECRET, etc.
npm ci
npm run build
```

### 3. Run under PM2

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup               # run the printed command to persist across reboots
```

The app listens on `127.0.0.1:3000` (never exposed directly).

### 4. Nginx reverse proxy

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/deva-safety-nets
sudo ln -s /etc/nginx/sites-available/deva-safety-nets /etc/nginx/sites-enabled/
sudo mkdir -p /var/cache/nginx/deva
# edit server_name + TLS cert paths in the file, then:
sudo nginx -t && sudo systemctl reload nginx
```

`deploy/nginx.conf` includes: HTTP→HTTPS redirect, HTTP/2, gzip, a full-HTML
micro-cache that honors Next's `s-maxage`/`stale-while-revalidate`, hard caching
for `/_next/static` and `/images`, and Cloudflare real-IP restoration
(`CF-Connecting-IP`). Security headers come from `next.config.ts` (not duplicated
in Nginx).

### 5. Cloudflare

- DNS: proxied (orange cloud) A/AAAA records to the VPS IP.
- SSL/TLS mode: **Full (strict)** with a Cloudflare Origin CA cert installed at the
  paths referenced in `deploy/nginx.conf`.
- Caching: default; the origin already emits correct `Cache-Control`. Optionally add
  a cache rule for `/_next/static/*` and `/images/*` (Edge Cache TTL a year).
- Keep "Rocket Loader" off (it can interfere with hydration).

### 6. Sitemaps & indexing

- Sitemap **index** at `/sitemap.xml`, segmented shards at `/sitemaps/[id].xml`
  (each ≤ `SITEMAP_PAGE_SIZE`, default 45,000 URLs — under the 50k/50MB spec limit),
  scaling to 100k+ URLs unchanged. Submit `/sitemap.xml` to Google Search Console.
- After editing catalog content, refresh caches without a redeploy:

```bash
curl -X POST "https://your-site/api/revalidate?tag=catalog&secret=YOUR_SECRET"
# tags: catalog | locations | content
```
#   d e v a - s a f e t y - n e t s 
 
 