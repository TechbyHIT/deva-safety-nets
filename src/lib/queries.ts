import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { catalogServiceFilter, catalogCityFilter, SUPPORTED_CITY_SLUGS, KEYWORD_SERVICE_ORDER_FLOOR } from "./catalog";
import { PRIMARY_CITY_SLUG } from "./service-location-url";
import { scoreIntentKeyword, matchesIntentPattern, type SeoIntentLink } from "./seo-intents";
import { SERVICE_MENU } from "./service-menu";
import {
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

const DAY = 60 * 60 * 24;

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

export const getCategoriesWithServices = unstable_cache(
  async () =>
    SERVICE_MENU.map((cat, order) => ({
      id: `cat-${cat.slug}`,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      icon: staticCatalog.categories.find((c) => c.slug === cat.slug)?.icon ?? "Grid2x2",
      order,
      services: menuCategoryServices(cat.slug),
    })),
  ["nav-categories-v3"],
  { revalidate: DAY, tags: ["catalog"] },
);

export const getSiteNavData = unstable_cache(
  async () => ({
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
  }),
  ["site-nav-data-v1"],
  { revalidate: DAY, tags: ["catalog", "locations"] },
);

export const getFooterDirectoryData = unstable_cache(
  async () => {
    const city = getCityBySlugStatic(PRIMARY_CITY_SLUG);
    return {
      categories: SERVICE_MENU.map((cat) => ({
        slug: cat.slug,
        name: cat.name,
        services: cat.services.map((s) => ({ slug: s.slug, name: s.name })),
      })),
      cityName: city?.name ?? "Kochi",
    };
  },
  ["footer-directory-v1"],
  { revalidate: DAY, tags: ["catalog", "locations"] },
);

export async function getServiceBySlug(slug: string) {
  return unstable_cache(async () => getServiceBySlugStatic(slug), ["service-page", slug], {
    revalidate: DAY,
    tags: ["catalog", `service:${slug}`],
  })();
}

export const getAllServiceSlugs = unstable_cache(
  async () => staticCatalog.services.map(({ slug }) => ({ slug })),
  ["all-service-slugs"],
  { revalidate: DAY, tags: ["catalog"] },
);

export const getCoreServiceSlugs = unstable_cache(
  async () => getCoreServices().map(({ slug }) => ({ slug })),
  ["core-service-slugs"],
  { revalidate: DAY, tags: ["catalog"] },
);

export type GuideType = "INSTALLATION" | "MAINTENANCE" | "BUYING";

export async function getGuideServiceSlugs(type: GuideType) {
  return staticCatalog.guides
    .filter((g) => g.published && g.type === type && g.service)
    .map((g) => g.service!.slug);
}

export const getFeaturedServices = unstable_cache(
  async () =>
    staticCatalog.services
      .filter((s) => s.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, 8)
      .map((s) => {
        const { category, reviews, faqs, materials, ...rest } = serializeService(s);
        return { ...rest, category };
      }),
  ["featured-services"],
  { revalidate: DAY, tags: ["catalog"] },
);

export async function getRelatedServices(categoryId: string, excludeId: string) {
  return unstable_cache(
    async () =>
      staticCatalog.services
        .filter((s) => s.categoryId === categoryId && s.id !== excludeId)
        .sort((a, b) => a.order - b.order)
        .slice(0, 6)
        .map(({ slug, name, tagline }) => ({ slug, name, tagline })),
    ["related-services", categoryId, excludeId],
    { revalidate: DAY, tags: ["catalog"] },
  )();
}

export const getAllCities = unstable_cache(
  async () =>
    staticCatalog.cities
      .filter((c) => catalogCityFilter.slug.in.includes(c.slug))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
      .map(serializeCity),
  ["all-cities-kerala"],
  { revalidate: DAY, tags: ["locations"] },
);

export async function getCityBySlug(slug: string) {
  if (!SUPPORTED_CITY_SLUGS.includes(slug as (typeof SUPPORTED_CITY_SLUGS)[number])) return null;
  return unstable_cache(async () => getCityBySlugStatic(slug), ["city-by-slug-v2", slug], {
    revalidate: DAY,
    tags: ["locations", `city:${slug}`],
  })();
}

export async function getAreaBySlug(citySlug: string, areaSlug: string) {
  if (!SUPPORTED_CITY_SLUGS.includes(citySlug as (typeof SUPPORTED_CITY_SLUGS)[number])) return null;
  return unstable_cache(async () => getAreaBySlugStatic(citySlug, areaSlug), ["area-by-slug-v2", citySlug, areaSlug], {
    revalidate: DAY,
    tags: ["locations", `city:${citySlug}`, `area:${areaSlug}`],
  })();
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

export const getDistrictAreasGrouped = unstable_cache(
  async (): Promise<DistrictAreaGroup[]> => {
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
  },
  ["district-areas-grouped"],
  { revalidate: DAY, tags: ["locations"] },
);

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

export const getMaterials = unstable_cache(
  async () => [...staticCatalog.materials].sort((a, b) => a.order - b.order),
  ["materials"],
  { revalidate: DAY, tags: ["catalog"] },
);

export const getMaterialBySlug = cache(async (slug: string) => getMaterialBySlugStatic(slug));

export const getIndustries = unstable_cache(
  async () => [...staticCatalog.industries].sort((a, b) => a.order - b.order),
  ["industries"],
  { revalidate: DAY, tags: ["catalog"] },
);

export const getIndustryBySlug = cache(async (slug: string) =>
  staticCatalog.industries.find((i) => i.slug === slug) ?? null,
);

export const getPropertyTypes = unstable_cache(
  async () => [...staticCatalog.propertyTypes].sort((a, b) => a.order - b.order),
  ["property-types"],
  { revalidate: DAY, tags: ["catalog"] },
);

export const getPropertyTypeBySlug = cache(async (slug: string) =>
  staticCatalog.propertyTypes.find((p) => p.slug === slug) ?? null,
);

export const getGeneralFaqs = unstable_cache(
  async () => staticCatalog.faqs.filter((f) => !f.serviceId).sort((a, b) => a.order - b.order),
  ["general-faqs"],
  { revalidate: DAY, tags: ["content"] },
);

export const getBlogPosts = unstable_cache(
  async () =>
    staticCatalog.blogPosts
      .filter((b) => b.published)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
  ["blog-posts"],
  { revalidate: 60 * 60, tags: ["content"] },
);

export const getBlogPostBySlug = cache(async (slug: string) =>
  staticCatalog.blogPosts.find((b) => b.slug === slug) ?? null,
);

export const getComparisons = unstable_cache(
  async () => staticCatalog.comparisons.map(serializeComparison),
  ["comparisons"],
  { revalidate: DAY, tags: ["content"] },
);

export const getComparisonBySlug = cache(async (slug: string) => {
  const comparison = staticCatalog.comparisons.find((c) => c.slug === slug);
  return comparison ? serializeComparison(comparison) : null;
});

export const getProjects = unstable_cache(
  async () =>
    [...staticCatalog.projects]
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .map(serializeProject),
  ["projects"],
  { revalidate: DAY, tags: ["content"] },
);

export const getReviews = unstable_cache(
  async () =>
    [...staticCatalog.reviews]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 40)
      .map(serializeReviewPublic),
  ["reviews"],
  { revalidate: DAY, tags: ["content"] },
);

export const getGuideBySlug = cache(async (slug: string) => {
  const guide = staticCatalog.guides.find((g) => g.slug === slug);
  return guide ? serializeGuide(guide) : null;
});

export const getContentOverride = cache(async (_routeKey: string): Promise<ContentOverride | null> => null);

export async function getKeywordLinksByCategory(limitPerCategory = 12) {
  return unstable_cache(
    async () =>
      SERVICE_MENU.map((cat) => {
        const category = staticCatalog.categories.find((c) => c.slug === cat.slug);
        const links = staticCatalog.services
          .filter((s) => s.categoryId === category?.id && s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
          .sort((a, b) => a.order - b.order)
          .slice(0, limitPerCategory)
          .map(({ slug, name }) => ({ slug, name }));
        return { slug: cat.slug, name: cat.name, links };
      }),
    ["keyword-links-by-category", String(limitPerCategory)],
    { revalidate: DAY, tags: ["catalog"] },
  )();
}

export async function getKeywordLinksForService(serviceSlug: string, limit = 28) {
  return unstable_cache(
    async () => {
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
    },
    ["keyword-links-for-service", serviceSlug, String(limit)],
    { revalidate: DAY, tags: ["catalog"] },
  )();
}

export const getPriorityIntentKeywordLinks = unstable_cache(
  async (limit = 48): Promise<SeoIntentLink[]> =>
    staticCatalog.services
      .filter((s) => s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
      .map((s) => ({ s, score: scoreIntentKeyword(s.slug, s.name) }))
      .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
      .slice(0, limit)
      .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name })),
  ["priority-intent-keyword-links"],
  { revalidate: DAY, tags: ["catalog"] },
);

export async function getIntentLinksForService(serviceSlug: string): Promise<SeoIntentLink[]> {
  return unstable_cache(
    async () => {
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
      for (const { pattern, label } of patterns) {
        const match = pool
          .map((s) => ({
            s,
            score:
              matchesIntentPattern(s.slug, s.name, pattern) * 100 +
              scoreIntentKeyword(s.slug, s.name),
          }))
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)[0];
        if (match) {
          links.push({ slug: match.s.slug, name: match.s.name, label });
        }
      }
      return links;
    },
    ["intent-links-for-service", serviceSlug],
    { revalidate: DAY, tags: ["catalog"] },
  )();
}

export async function getPopularKeywordLinks(limit = 36) {
  return unstable_cache(
    async () =>
      staticCatalog.services
        .filter((s) => s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
        .map((s) => ({ s, score: scoreIntentKeyword(s.slug, s.name) }))
        .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
        .slice(0, limit)
        .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name })),
    ["popular-keyword-links", String(limit)],
    { revalidate: DAY, tags: ["catalog"] },
  )();
}

export const getCatalogCounts = unstable_cache(
  async () => ({
    services: staticCatalog.services.length,
    cities: staticCatalog.cities.filter((c) => catalogCityFilter.slug.in.includes(c.slug)).length,
    areas: staticCatalog.areas.filter((a) => {
      const city = staticCatalog.cities.find((c) => c.id === a.cityId);
      return city && catalogCityFilter.slug.in.includes(city.slug);
    }).length,
    materials: staticCatalog.materials.length,
    industries: staticCatalog.industries.length,
    blog: staticCatalog.blogPosts.length,
  }),
  ["catalog-counts"],
  { revalidate: DAY, tags: ["catalog", "locations"] },
);
