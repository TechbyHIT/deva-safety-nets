# Sitemap & indexing — all four phases

## Control

`SITEMAP_PHASE` in `src/lib/sitemap-urls.ts` — currently **`4`** (all phases on).

Keyword-spam services (`order ≥ 9000`, “best near me / #1”) stay **out of the sitemap** and **noindex**.

## What’s included

| Phase | Content |
|-------|---------|
| **1** | Hubs, menu `/services/{slug}`, menu × Kochi/Ernakulam, location city/area, blog, materials, industries, property hubs, guides |
| **2** | + service × area (flagship at phase 2–3; **full menu** at phase 4) |
| **3** | + service × property type, property × city (flagship → **full menu** at phase 4) |
| **4** | Same routes as 1–3 with **full menu** for area & property combos (~9–10k high-intent URLs with current Kochi/Ernakulam scope) |

## Size reality

With **2 cities + ~102 areas + ~80 menu services**, a quality sitemap tops out around **~10k URLs**, not 300k.

**300k+** later only if you add more real cities/areas **and** unique local value — never by indexing keyword-farm pages.

## After deploy

```bash
bash deploy/pm2-deploy.sh
```

Resubmit `https://devasafetynets.com/sitemap.xml` in GSC.
