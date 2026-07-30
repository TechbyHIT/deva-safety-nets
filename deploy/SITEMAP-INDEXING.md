# Sitemap & indexing

## Current (all phases + all service hubs)

| Indexable (in sitemap) | Noindex (not in sitemap) |
|------------------------|--------------------------|
| Home, hubs, blog, materials, guides | Privacy, terms, search |
| **All** `/services/{slug}` hubs (~35k menu + long-tail) | Keyword service × city |
| Menu × Kochi / Ernakulam | Keyword service × area |
| Menu × areas + property combos | Keyword service × property |
| Location city + area pages | |

`SITEMAP_PHASE = 4` in `src/lib/sitemap-urls.ts`.

~**44k** URLs — under Google’s 50k/sitemap limit. Kochi+Ernakulam location combos stay menu-only (quality ceiling).

## After deploy

```bash
bash deploy/pm2-deploy.sh
```

Resubmit `https://devasafetynets.com/sitemap.xml` in GSC.
