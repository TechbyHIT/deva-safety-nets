# Sitemap & indexing

## Indexable

| In sitemap (indexable) | Notes |
|------------------------|--------|
| All `/services/{slug}` hubs | Menu + long-tail |
| All services × Kochi / Ernakulam | Keyword × city included |
| All services × property types | Keyword × property included |
| **Menu** services × areas | Area capped (not 35k × 102) |
| Locations, blog, materials, guides | |

`SITEMAP_PHASE = 4`. Keyword × city / area / property **pages are indexable** (no `noindex`). Area URLs in the sitemap stay menu-scale.

## Size

~**535k** URLs across sharded urlsets (build-time).

## Sitemap format

- `public/sitemap.xml` — **sitemap index** (committed)
- `public/sitemaps/sitemap-N.xml` — urlset shards ≤40k each (gitignored; created on `npm run build`)

## After deploy

```bash
bash deploy/pm2-deploy.sh
```

Resubmit `https://devasafetynets.com/sitemap.xml` in GSC.

Google may still leave many programmatic URLs as “Discovered – not indexed”; that is normal at this scale.
