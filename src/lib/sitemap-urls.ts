import { absoluteUrl } from "./site";
import { catalogCityFilter, isExcludedService } from "./catalog";
import { catalogIndex, staticCatalog } from "./static-data/build-catalog";
import { SERVICE_MENU } from "./service-menu";

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

/**
 * Sitemap growth phase — keep Phase 1 until GSC indexing % and organic traffic
 * are healthy. Do NOT jump to massive programmatic sitemaps early.
 *
 * 1 = very high intent only (current)
 * 2 = + flagship service × area (local money pages)
 * 3 = + broader menu × area / property (still curated, not keyword spam)
 * 4 = large scale (100k–300k+) only with unique content + proven demand
 */
export const SITEMAP_PHASE = 1 as 1 | 2 | 3 | 4;

/** Flagship services for Phase 2+ area / property combos. */
const FLAGSHIP_SERVICE_SLUGS = new Set([
  "balcony-invisible-grills",
  "window-invisible-grills",
  "ss-invisible-grills",
  "balcony-safety-nets",
  "window-safety-nets",
  "children-safety-nets",
  "kids-safety-nets",
  "pet-safety-nets",
  "terrace-safety-nets",
  "pigeon-nets",
  "bird-nets",
  "bird-spikes",
]);

function getMenuServiceSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const cat of SERVICE_MENU) {
    for (const s of cat.services) {
      if (!isExcludedService(s)) slugs.add(s.slug);
    }
  }
  return slugs;
}

function buildAllSitemapEntries(): SitemapEntry[] {
  const supported = new Set(catalogCityFilter.slug.in);
  const menuSlugs = getMenuServiceSlugs();

  const services = staticCatalog.services
    .filter((s) => menuSlugs.has(s.slug) && !isExcludedService(s))
    .map((s) => ({ slug: s.slug, updatedAt: s.updatedAt }));

  const flagshipServices = services.filter((s) => FLAGSHIP_SERVICE_SLUGS.has(s.slug));

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
    .filter((g) => g.published && g.service && menuSlugs.has(g.service.slug))
    .map((g) => ({ slug: g.slug, type: g.type, service: g.service! }));

  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];

  function add(entry: SitemapEntry) {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    entries.push(entry);
  }

  // ——— Phase 1: very high intent only ———
  const staticPaths: [string, number, SitemapEntry["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/services", 0.9, "weekly"],
    ["/locations", 0.8, "weekly"],
    ["/property-types", 0.7, "monthly"],
    ["/materials", 0.6, "monthly"],
    ["/industries", 0.6, "monthly"],
    ["/compare", 0.6, "monthly"],
    ["/projects", 0.7, "weekly"],
    ["/reviews", 0.7, "weekly"],
    ["/gallery", 0.7, "weekly"],
    ["/blog", 0.7, "weekly"],
    ["/faq", 0.6, "monthly"],
    ["/about", 0.5, "yearly"],
    ["/contact", 0.8, "monthly"],
  ];
  for (const [path, priority, changeFrequency] of staticPaths) {
    add({ url: absoluteUrl(path), priority, changeFrequency });
  }

  // Real menu service hubs (buyer intent)
  for (const s of services) {
    add({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: s.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const m of materials) {
    add({
      url: absoluteUrl(`/materials/${m.slug}`),
      lastModified: m.updatedAt,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }
  for (const i of industries) {
    add({
      url: absoluteUrl(`/industries/${i.slug}`),
      lastModified: i.updatedAt,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }
  for (const p of propertyTypes) {
    add({
      url: absoluteUrl(`/property-types/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  for (const c of comparisons) {
    add({
      url: absoluteUrl(`/compare/${c.slug}`),
      lastModified: c.updatedAt,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }
  for (const b of blog) {
    add({
      url: absoluteUrl(`/blog/${b.slug}`),
      lastModified: b.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const g of guides) {
    add({
      url: absoluteUrl(`/${g.type.toLowerCase()}-guide/${g.service.slug}`),
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  // City + locality hubs (local search intent)
  for (const c of cities) {
    add({
      url: absoluteUrl(`/locations/${c.slug}`),
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }
  for (const a of areas) {
    add({
      url: absoluteUrl(`/locations/${a.city.slug}/${a.slug}`),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Menu × city — primary local money pages
  for (const s of services) {
    for (const c of cities) {
      add({
        url: absoluteUrl(`/services/${s.slug}/${c.slug}`),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  // ——— Phase 2+: only after Phase 1 indexes + converts ———
  if (SITEMAP_PHASE >= 2) {
    for (const s of flagshipServices) {
      for (const a of areas) {
        add({
          url: absoluteUrl(`/services/${s.slug}/${a.city.slug}/${a.slug}`),
          changeFrequency: "monthly",
          priority: 0.65,
        });
      }
    }
  }

  if (SITEMAP_PHASE >= 3) {
    for (const s of flagshipServices) {
      for (const p of propertyTypes) {
        add({
          url: absoluteUrl(`/services/${s.slug}/for/${p.slug}`),
          changeFrequency: "monthly",
          priority: 0.55,
        });
      }
    }
    for (const p of propertyTypes) {
      for (const c of cities) {
        add({
          url: absoluteUrl(`/property-types/${p.slug}/${c.slug}`),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  }

  // Phase 4 (100k–300k+): not implemented here on purpose.
  // Only unlock with unique local content + Ads/GBP traffic proof — never keyword spam.

  return entries;
}

let cachedEntries: SitemapEntry[] | null = null;

export function getAllSitemapEntries(): SitemapEntry[] {
  if (!cachedEntries) cachedEntries = buildAllSitemapEntries();
  return cachedEntries;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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
