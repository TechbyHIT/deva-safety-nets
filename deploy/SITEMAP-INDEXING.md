# Sitemap & indexing — phased growth

## Rule

**Very high-intent pages only** until they index well and bring traffic.  
Do **not** publish 100k–300k+ URLs early. That burns crawl budget and creates thin-page debt.

## Phases

| Phase | When to unlock | What’s in the sitemap | Approx size |
|-------|----------------|----------------------|-------------|
| **1 (now)** | Default | Hubs, menu services, menu × Kochi/Ernakulam, location city/area, blog, materials, guides | ~400–600 |
| **2** | Phase 1 has solid index % + organic clicks | + flagship service × area | ~1.5–2.5k |
| **3** | Phase 2 converting (calls / WhatsApp / forms) | + flagship × property, property × city | ~3–5k |
| **4** | Strong brand + content ops | Large curated expansion (never keyword “best near me / #1” spam) | 100k–300k+ only with unique value |

Control: `SITEMAP_PHASE` in `src/lib/sitemap-urls.ts` (`1` | `2` | `3` | `4`).

## Phase 1 include / exclude

| In sitemap | Out of sitemap / noindex |
|------------|--------------------------|
| Home, contact, gallery, services hub… | Keyword SEO rows (`order ≥ 9000`) — **noindex** |
| Menu `/services/{slug}` | “Best near me / Top Kerala / #1” spam hubs |
| Menu × Kochi / Ernakulam | Service × every area (until Phase 2) |
| `/locations/{city}` + areas | AI essay filler pages |
| Blog, materials, industries, property hubs, guides | Mass programmatic keyword combos |

## Go / no-go before Phase 2

Wait until most of these are true (check GSC + analytics for 2–4 weeks):

- [ ] Sitemap processed (GSC shows current URL count)
- [ ] Majority of Phase 1 money URLs indexed (or rising weekly)
- [ ] Organic clicks growing on main services + Kochi/Ernakulam pages
- [ ] Leads from organic (calls / forms), not only impressions

Then set `SITEMAP_PHASE = 2`, rebuild, resubmit sitemap.

## Phase 4 (300k+) — only later

Allowed only if:

1. Phases 1–3 index and convert  
2. Each new URL has a clear search intent + non-duplicate value  
3. No keyword-farm titles or AI long-form spam  

Otherwise stay small and strong.

## After every phase change

```bash
bash deploy/pm2-deploy.sh   # rebuilds public/sitemap.xml
```

Resubmit `https://devasafetynets.com/sitemap.xml` in Search Console.
