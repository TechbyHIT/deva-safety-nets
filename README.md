# InvisibleGrills & SafetyNets — Enterprise Programmatic SEO Platform

A production-grade, database-driven **Next.js 16 + React 19** platform for the
Invisible Grills & Safety Nets industry, architected to scale to **500,000+
high-quality URLs** through combinations of curated entities — not thin,
duplicate, or doorway pages.

Every generated page satisfies a distinct user need (a specific service, in a
specific place, with local context, pricing, materials, FAQs, reviews and
strong CTAs) and is rendered from structured data plus a deterministic content
engine that keeps each URL unique and useful.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (60/30/10: white / royal blue / gold), dark + light mode |
| Database | PostgreSQL + Prisma ORM |
| Caching | Redis (optional) + Next.js Data Cache / ISR |
| Rendering | Server Components, Server Actions, ISR, SSR, static where appropriate |
| SEO | Dynamic Metadata API, JSON-LD, split XML sitemaps + index, robots |
| Security | CSP, secure headers, input validation (Zod), honeypot + rate limiting |

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

**The reusable location hierarchy** (see `prisma/seed.ts`) models Kochi &
Ernakulam across 7 tiers — primary cities, municipalities, major localities, the
Kakkanad/IT corridor, Vypin islands, residential belts and the airport region —
so you extend coverage by adding **locations once** and every service page
inherits them. Each area carries a `tier` + `tierLabel`, and city pages group
areas by tier automatically.

**The multiplier math** (printed by `npm run db:seed`): with ~107 services,
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
- PostgreSQL 14+
- (Optional) Redis 6+

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# then edit .env — at minimum set DATABASE_URL and NEXT_PUBLIC_SITE_URL
```

### 4. Set up the database

```bash
npm run db:push      # create tables from the Prisma schema
npm run db:seed      # populate categories, services, cities, areas, content
```

The seed prints the combinatorial URL capacity from the current data.

### 5. Run

```bash
npm run dev          # http://localhost:3000
```

### 6. Build for production

```bash
npm run build
npm run start
```

---

## Project structure

```
prisma/
  schema.prisma        # data model (taxonomy, geography, content, leads)
  seed.ts              # curated seed data + content
src/
  app/                 # App Router routes
    services/[service]/[city]/[area]/   # 3-level programmatic service pages
    services/[service]/for/[propertyType]/  # service × property type
    locations/[city]/[area]/            # location pages (areas grouped by tier)
    property-types/[propertyType]/[city]/   # property-type hubs & combos
    materials/, industries/, compare/, blog/, *-guide/
    sitemap.ts         # split sitemaps + auto index (generateSitemaps)
    robots.ts, manifest.ts
    api/revalidate/    # on-demand ISR revalidation
  components/          # Header/MegaMenu, Footer, FloatingCTAs, Hero, forms, cards
  lib/
    prisma.ts, redis.ts, queries.ts    # data access + caching
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
- Split XML sitemaps (≤ 45k URLs/file) + auto-generated sitemap index at
  `/sitemap.xml`, scaling to 500k+ URLs
- `robots.txt`, breadcrumb navigation, internal-link automation (related
  services, nearby areas, other cities), topical clustering by category
- Programmatic + local + semantic SEO built into every combination page

## Performance

- Server Components + streaming + `Suspense` (route-level `loading.tsx`)
- ISR with tag-based revalidation; Redis cache-aside layer
- AVIF/WebP image formats, font optimization (`next/font`), long-cache static assets
- Route-level code splitting, `optimizePackageImports`

## Security

- Content Security Policy + secure headers (HSTS, X-Frame-Options, nosniff, etc.)
  in `next.config.ts`
- Zod input validation, honeypot field and Redis-backed rate limiting on lead forms
- Prisma parameterised queries (SQL-injection safe), secrets via env vars

## Accessibility & UX

- WCAG-minded: skip link, focus-visible rings, semantic landmarks, ARIA labels,
  `prefers-reduced-motion` support
- Mobile-first: sticky header, mega menu, mobile drawer, sticky bottom CTA bar,
  floating WhatsApp + Call
- Dark/light mode with no-flash theme script

---

## Editing content

- Update taxonomy/geography/content in the database (Prisma Studio: `npm run db:studio`).
- After edits, refresh caches without a redeploy:

```bash
curl -X POST "https://your-site/api/revalidate?tag=catalog&secret=YOUR_SECRET"
# tags: catalog | locations | content
```

## Deployment

Deploy to any Node host or Vercel. Put Cloudflare in front for CDN/edge caching.
Set all environment variables from `.env.example` in your host, run migrations
(`prisma migrate deploy`) and seed once.
