import "server-only";
import { absoluteUrl, sitemapPageSize } from "./site";
import { catalogServiceFilter, catalogCityFilter } from "./catalog";
import { catalogIndex, staticCatalog } from "./static-data/build-catalog";

export type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

function buildAllSitemapEntries(): SitemapEntry[] {
  const supported = new Set(catalogCityFilter.slug.in);

  const services = staticCatalog.services.map((s) => ({ slug: s.slug, updatedAt: s.updatedAt }));
  const coreServices = staticCatalog.services
    .filter((s) => s.order < catalogServiceFilter.order.lt)
    .map((s) => ({ slug: s.slug, updatedAt: s.updatedAt }));
  const cities = staticCatalog.cities
    .filter((c) => supported.has(c.slug))
    .map((c) => ({ slug: c.slug, updatedAt: c.updatedAt }));
  const areas = staticCatalog.areas
    .filter((a) => {
      const city = catalogIndex.citiesById.get(a.cityId);
      return city && supported.has(city.slug);
    })
    .map((a) => {
      const city = catalogIndex.citiesById.get(a.cityId)!;
      return { slug: a.slug, city: { slug: city.slug } };
    });
  const materials = staticCatalog.materials.map((m) => ({ slug: m.slug, updatedAt: m.updatedAt }));
  const industries = staticCatalog.industries.map((i) => ({ slug: i.slug, updatedAt: i.updatedAt }));
  const propertyTypes = staticCatalog.propertyTypes.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
  const comparisons = staticCatalog.comparisons.map((c) => ({ slug: c.slug, updatedAt: c.updatedAt }));
  const blog = staticCatalog.blogPosts
    .filter((b) => b.published)
    .map((b) => ({ slug: b.slug, updatedAt: b.updatedAt }));
  const guides = staticCatalog.guides
    .filter((g) => g.published)
    .map((g) => ({ slug: g.slug, type: g.type, service: g.service ? { slug: g.service.slug } : null }));

  const entries: SitemapEntry[] = [];

  const staticPaths: [string, number, SitemapEntry["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/services", 0.9, "weekly"],
    ["/locations", 0.8, "weekly"],
    ["/property-types", 0.7, "monthly"],
    ["/materials", 0.6, "monthly"],
    ["/industries", 0.6, "monthly"],
    ["/compare", 0.6, "monthly"],
    ["/projects", 0.6, "weekly"],
    ["/reviews", 0.6, "weekly"],
    ["/gallery", 0.5, "monthly"],
    ["/blog", 0.7, "daily"],
    ["/faq", 0.6, "monthly"],
    ["/about", 0.5, "yearly"],
    ["/contact", 0.7, "yearly"],
  ];
  for (const [path, priority, changeFrequency] of staticPaths) {
    entries.push({ url: absoluteUrl(path), priority, changeFrequency });
  }

  for (const s of services)
    entries.push({ url: absoluteUrl(`/services/${s.slug}`), lastModified: s.updatedAt, changeFrequency: "weekly", priority: 0.9 });
  for (const m of materials)
    entries.push({ url: absoluteUrl(`/materials/${m.slug}`), lastModified: m.updatedAt, changeFrequency: "monthly", priority: 0.6 });
  for (const i of industries)
    entries.push({ url: absoluteUrl(`/industries/${i.slug}`), lastModified: i.updatedAt, changeFrequency: "monthly", priority: 0.6 });
  for (const p of propertyTypes)
    entries.push({ url: absoluteUrl(`/property-types/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly", priority: 0.6 });
  for (const c of comparisons)
    entries.push({ url: absoluteUrl(`/compare/${c.slug}`), lastModified: c.updatedAt, changeFrequency: "monthly", priority: 0.6 });
  for (const b of blog)
    entries.push({ url: absoluteUrl(`/blog/${b.slug}`), lastModified: b.updatedAt, changeFrequency: "monthly", priority: 0.7 });
  for (const g of guides)
    if (g.service)
      entries.push({ url: absoluteUrl(`/${g.type.toLowerCase()}-guide/${g.service.slug}`), changeFrequency: "monthly", priority: 0.6 });

  for (const c of cities)
    entries.push({ url: absoluteUrl(`/locations/${c.slug}`), lastModified: c.updatedAt, changeFrequency: "weekly", priority: 0.8 });
  for (const a of areas)
    entries.push({ url: absoluteUrl(`/locations/${a.city.slug}/${a.slug}`), changeFrequency: "monthly", priority: 0.6 });

  for (const s of coreServices) {
    for (const c of cities) {
      entries.push({ url: absoluteUrl(`/services/${s.slug}/${c.slug}`), changeFrequency: "weekly", priority: 0.7 });
    }
  }
  for (const s of coreServices) {
    for (const a of areas) {
      entries.push({
        url: absoluteUrl(`/services/${s.slug}/${a.city.slug}/${a.slug}`),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  for (const s of coreServices) {
    for (const p of propertyTypes) {
      entries.push({ url: absoluteUrl(`/services/${s.slug}/for/${p.slug}`), changeFrequency: "monthly", priority: 0.6 });
    }
  }
  for (const p of propertyTypes) {
    for (const c of cities) {
      entries.push({ url: absoluteUrl(`/property-types/${p.slug}/${c.slug}`), changeFrequency: "monthly", priority: 0.5 });
    }
  }

  return entries;
}

// Built once per server process. The catalog is fully static (deterministic at
// module load), so memoizing avoids rebuilding ~46k entries on every sitemap
// shard request while a crawler walks the sitemap index.
let cachedEntries: SitemapEntry[] | null = null;

export function getAllSitemapEntries(): SitemapEntry[] {
  if (!cachedEntries) cachedEntries = buildAllSitemapEntries();
  return cachedEntries;
}

/** Number of segmented sitemap files needed at the configured page size. */
export function getSitemapShardCount(): number {
  const total = getAllSitemapEntries().length;
  return Math.max(1, Math.ceil(total / sitemapPageSize));
}

/** Entries for a single segmented sitemap (0-indexed). Returns [] if out of range. */
export function getSitemapShard(id: number): SitemapEntry[] {
  if (!Number.isInteger(id) || id < 0) return [];
  const start = id * sitemapPageSize;
  return getAllSitemapEntries().slice(start, start + sitemapPageSize);
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Serialize a shard of entries into a <urlset> sitemap document. */
export function renderUrlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const parts = [`<loc>${xmlEscape(e.url)}</loc>`];
      if (e.lastModified) parts.push(`<lastmod>${e.lastModified.toISOString()}</lastmod>`);
      if (e.changeFrequency) parts.push(`<changefreq>${e.changeFrequency}</changefreq>`);
      if (typeof e.priority === "number") parts.push(`<priority>${e.priority.toFixed(1)}</priority>`);
      return `<url>${parts.join("")}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

/** Serialize the top-level <sitemapindex> pointing at each segmented sitemap. */
export function renderSitemapIndexXml(lastModified: Date = new Date()): string {
  const count = getSitemapShardCount();
  const items = Array.from({ length: count }, (_, id) => {
    const loc = xmlEscape(absoluteUrl(`/sitemaps/${id}.xml`));
    return `<sitemap><loc>${loc}</loc><lastmod>${lastModified.toISOString()}</lastmod></sitemap>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
