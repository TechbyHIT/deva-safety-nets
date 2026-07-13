import "server-only";
import { cache } from "react";
import { catalogCityFilter, isExcludedService, SUPPORTED_CITY_SLUGS, KEYWORD_SERVICE_ORDER_FLOOR } from "./catalog";
import { PRIMARY_CITY_SLUG } from "./service-location-url";
import { scoreIntentKeyword, matchesIntentPattern, type SeoIntentLink } from "./seo-intents";
import { SERVICE_MENU } from "./service-menu";
import {
  catalogIndex,
  getAreaBySlugStatic,
  getCityBySlugStatic,
  getCoreServices,
  getMaterialBySlugStatic,
  getServiceBySlugStatic,
  serializeCity,
  serializeComparison,
  serializeGuide,
  serializeProject,
  serializeReviewPublic,
  serializeService,
  staticCatalog,
  type ContentOverride,
} from "./static-data/build-catalog";

/** In-memory reads only — never writes to Next.js Data Cache on disk. */

function menuCategoryServices(catSlug: string) {
  const menu = SERVICE_MENU.find((c) => c.slug === catSlug);
  if (!menu) return [];
  return menu.services.map((item) => {
    const svc = staticCatalog.services.find((s) => s.slug === item.slug);
    return {
      slug: item.slug,
      name: item.name,
      tagline: svc?.tagline ?? "",
      featured: svc?.featured ?? false,
      order: svc?.order ?? 0,
      priceMin: svc?.priceMin ?? null,
      priceMax: svc?.priceMax ?? null,
      priceUnit: svc?.priceUnit ?? null,
    };
  });
}

export async function getCategoriesWithServices() {
  return SERVICE_MENU.map((cat, order) => ({
    id: `cat-${cat.slug}`,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    icon: staticCatalog.categories.find((c) => c.slug === cat.slug)?.icon ?? "Grid2x2",
    order,
    services: menuCategoryServices(cat.slug),
  }));
}

export async function getSiteNavData() {
  return {
    categories: SERVICE_MENU.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      services: cat.services.map((s) => ({
        slug: s.slug,
        name: s.name,
        tagline: staticCatalog.services.find((svc) => svc.slug === s.slug)?.tagline ?? "",
      })),
    })),
    cities: staticCatalog.cities
      .filter((c) => catalogCityFilter.slug.in.includes(c.slug))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
      .map(({ slug, name, featured }) => ({ slug, name, featured })),
  };
}

export async function getFooterDirectoryData() {
  const city = getCityBySlugStatic(PRIMARY_CITY_SLUG);
  return {
    categories: SERVICE_MENU.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      services: cat.services.map((s) => ({ slug: s.slug, name: s.name })),
    })),
    cityName: city?.name ?? "Kochi",
  };
}

export async function getServiceBySlug(slug: string) {
  return getServiceBySlugStatic(slug);
}

export async function getAllServiceSlugs() {
  return staticCatalog.services
    .filter((s) => !isExcludedService(s))
    .map(({ slug }) => ({ slug }));
}

export async function getCoreServiceSlugs() {
  return getCoreServices().map(({ slug }) => ({ slug }));
}

export type GuideType = "INSTALLATION" | "MAINTENANCE" | "BUYING";

export async function getGuideServiceSlugs(type: GuideType) {
  return staticCatalog.guides
    .filter((g) => g.published && g.type === type && g.service)
    .map((g) => g.service!.slug);
}

export async function getFeaturedServices() {
  return staticCatalog.services
    .filter((s) => s.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 8)
    .map((s) => {
      const { category, reviews, faqs, materials, ...rest } = serializeService(s);
      return { ...rest, category };
    });
}

export async function getRelatedServices(categoryId: string, excludeId: string) {
  return staticCatalog.services
    .filter((s) => s.categoryId === categoryId && s.id !== excludeId)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6)
    .map(({ slug, name, tagline }) => ({ slug, name, tagline }));
}

export async function getAllCities() {
  return staticCatalog.cities
    .filter((c) => catalogCityFilter.slug.in.includes(c.slug))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .map(serializeCity);
}

export async function getCityBySlug(slug: string) {
  if (!SUPPORTED_CITY_SLUGS.includes(slug as (typeof SUPPORTED_CITY_SLUGS)[number])) return null;
  return getCityBySlugStatic(slug);
}

export async function getAreaBySlug(citySlug: string, areaSlug: string) {
  if (!SUPPORTED_CITY_SLUGS.includes(citySlug as (typeof SUPPORTED_CITY_SLUGS)[number])) return null;
  return getAreaBySlugStatic(citySlug, areaSlug);
}

export type DistrictArea = {
  id: string;
  slug: string;
  name: string;
  tier: number;
  tierLabel: string | null;
  citySlug: string;
  cityName: string;
};

export type DistrictAreaGroup = {
  tier: number;
  label: string;
  areas: DistrictArea[];
};

export async function getDistrictAreasGrouped(): Promise<DistrictAreaGroup[]> {
  const rows = staticCatalog.areas
    .filter((a) => {
      const city = staticCatalog.cities.find((c) => c.id === a.cityId);
      return city && catalogCityFilter.slug.in.includes(city.slug);
    })
    .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));

  const map = new Map<string, DistrictAreaGroup>();
  for (const a of rows) {
    const city = staticCatalog.cities.find((c) => c.id === a.cityId)!;
    const label = a.tierLabel ?? "Localities";
    const key = `${a.tier}:${label}`;
    if (!map.has(key)) map.set(key, { tier: a.tier, label, areas: [] });
    map.get(key)!.areas.push({
      id: a.id,
      slug: a.slug,
      name: a.name,
      tier: a.tier,
      tierLabel: a.tierLabel,
      citySlug: city.slug,
      cityName: city.name,
    });
  }
  return [...map.values()].sort((a, b) => a.tier - b.tier);
}

export async function getDistrictAreaStaticParams() {
  return staticCatalog.areas
    .filter((a) => {
      const city = staticCatalog.cities.find((c) => c.id === a.cityId);
      return city && catalogCityFilter.slug.in.includes(city.slug);
    })
    .map((a) => {
      const city = staticCatalog.cities.find((c) => c.id === a.cityId)!;
      return { city: city.slug, area: a.slug };
    });
}

export async function getMaterials() {
  return [...staticCatalog.materials].sort((a, b) => a.order - b.order);
}

export const getMaterialBySlug = cache(async (slug: string) => getMaterialBySlugStatic(slug));

export async function getIndustries() {
  return [...staticCatalog.industries].sort((a, b) => a.order - b.order);
}

export const getIndustryBySlug = cache(async (slug: string) =>
  catalogIndex.industriesBySlug.get(slug) ?? null,
);

export async function getPropertyTypes() {
  return [...staticCatalog.propertyTypes].sort((a, b) => a.order - b.order);
}

export const getPropertyTypeBySlug = cache(async (slug: string) =>
  catalogIndex.propertyTypesBySlug.get(slug) ?? null,
);

export async function getGeneralFaqs() {
  return staticCatalog.faqs.filter((f) => !f.serviceId).sort((a, b) => a.order - b.order);
}

export async function getBlogPosts() {
  return staticCatalog.blogPosts
    .filter((b) => b.published)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export const getBlogPostBySlug = cache(async (slug: string) =>
  catalogIndex.blogPostsBySlug.get(slug) ?? null,
);

export async function getComparisons() {
  return staticCatalog.comparisons.map(serializeComparison);
}

export const getComparisonBySlug = cache(async (slug: string) => {
  const comparison = catalogIndex.comparisonsBySlug.get(slug);
  return comparison ? serializeComparison(comparison) : null;
});

export async function getProjects() {
  return [...staticCatalog.projects]
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .map(serializeProject);
}

export async function getReviews() {
  return [...staticCatalog.reviews]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 40)
    .map(serializeReviewPublic);
}

export const getGuideBySlug = cache(async (slug: string) => {
  const guide = catalogIndex.guidesBySlug.get(slug);
  return guide ? serializeGuide(guide) : null;
});

export const getContentOverride = cache(async (_routeKey: string): Promise<ContentOverride | null> => null);

export async function getKeywordLinksByCategory(limitPerCategory = 12) {
  return SERVICE_MENU.map((cat) => {
    const category = staticCatalog.categories.find((c) => c.slug === cat.slug);
    const links = staticCatalog.services
      .filter((s) => s.categoryId === category?.id && s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
      .sort((a, b) => a.order - b.order)
      .slice(0, limitPerCategory)
      .map(({ slug, name }) => ({ slug, name }));
    return { slug: cat.slug, name: cat.name, links };
  });
}

export async function getKeywordLinksForService(serviceSlug: string, limit = 28) {
  const svc = getServiceBySlugStatic(serviceSlug);
  if (!svc) return [];
  const words = serviceSlug.split("-").filter((w) => w.length > 3);
  return staticCatalog.services
    .filter((s) => s.categoryId === svc.categoryId && s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
    .map((s) => {
      let score = scoreIntentKeyword(s.slug, s.name);
      if (s.slug.includes(serviceSlug)) score += 12;
      for (const w of words) if (s.slug.includes(w)) score += 2;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
    .slice(0, limit)
    .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name }));
}

export async function getPriorityIntentKeywordLinks(limit = 48): Promise<SeoIntentLink[]> {
  return staticCatalog.services
    .filter((s) => s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
    .map((s) => ({ s, score: scoreIntentKeyword(s.slug, s.name) }))
    .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
    .slice(0, limit)
    .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name }));
}

export async function getIntentLinksForService(serviceSlug: string): Promise<SeoIntentLink[]> {
  const svc = getServiceBySlugStatic(serviceSlug);
  if (!svc) return [];
  const baseName = svc.name;
  const patterns: { pattern: string; label: string }[] = [
    { pattern: "best-near-me", label: `Best ${baseName} near me Kerala` },
    { pattern: "top-kerala", label: `Top ${baseName} Kerala` },
    { pattern: "high-quality-1", label: `High Quality #1 ${baseName} Kerala` },
    { pattern: "best-kerala", label: `Best ${baseName} Kerala` },
  ];

  const pool = staticCatalog.services.filter(
    (s) => s.categoryId === svc.categoryId && s.order >= KEYWORD_SERVICE_ORDER_FLOOR,
  );

  const links: SeoIntentLink[] = [];
  const usedSlugs = new Set<string>();

  for (const { pattern, label } of patterns) {
    const match = pool
      .map((s) => ({
        s,
        score:
          matchesIntentPattern(s.slug, s.name, pattern) * 100 +
          scoreIntentKeyword(s.slug, s.name),
      }))
      .filter((x) => x.score > 0 && !usedSlugs.has(x.s.slug))
      .sort((a, b) => b.score - a.score)[0];
    if (match) {
      usedSlugs.add(match.s.slug);
      links.push({ slug: match.s.slug, name: match.s.name, label });
    }
  }
  return links;
}

export async function getPopularKeywordLinks(limit = 36) {
  return staticCatalog.services
    .filter((s) => s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
    .map((s) => ({ s, score: scoreIntentKeyword(s.slug, s.name) }))
    .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
    .slice(0, limit)
    .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name }));
}

export async function getCatalogCounts() {
  return {
    services: staticCatalog.services.length,
    cities: staticCatalog.cities.filter((c) => catalogCityFilter.slug.in.includes(c.slug)).length,
    areas: staticCatalog.areas.filter((a) => {
      const city = staticCatalog.cities.find((c) => c.id === a.cityId);
      return city && catalogCityFilter.slug.in.includes(city.slug);
    }).length,
    materials: staticCatalog.materials.length,
    industries: staticCatalog.industries.length,
    blog: staticCatalog.blogPosts.length,
  };
}
