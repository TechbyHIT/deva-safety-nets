# Sitemap & indexing (Google Search Console)

## Goal

Only **high-intent, curated pages** in the sitemap. No keyword-spam URLs (“best near me”, “#1 Kerala”, etc.).

## Current sitemap (~2–3k URLs)

| Included | Excluded / noindex |
|----------|-------------------|
| Home, hubs (services, locations, gallery, contact…) | Keyword SEO service hubs (`order ≥ 9000`) — **noindex** |
| **Menu** `/services/{slug}` only | Priority-intent keyword JSON links |
| Menu × Kochi / Ernakulam | Thin keyword × city / area (already noindex) |
| **Flagship** services × areas (~15 money services) | Full menu × every area |
| Flagship × property type | AI “complete guide” filler copy |
| Location city + area pages | |
| Materials, industries, blog, guides (menu services) | |

## Page copy

`src/lib/content.ts` uses short curated Kerala facts (standards, pricing factors, buying checks, maintenance, FAQs). No randomized long-form AI essays.

## After deploy

1. `bash deploy/pm2-deploy.sh` (rebuilds `public/sitemap.xml`)
2. GSC → **Sitemaps** → resubmit `https://devasafetynets.com/sitemap.xml`
3. Expect old thin URLs to move to **Excluded by noindex** over 1–2 weeks

## Do not expect

- All previously discovered URLs to stay indexed
- Overnight ranking jumps
