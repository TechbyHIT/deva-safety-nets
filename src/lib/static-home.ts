import { catalogCityFilter, KEYWORD_SERVICE_ORDER_FLOOR } from "./catalog";
import { SERVICE_MENU } from "./service-menu";
import { scoreIntentKeyword } from "./seo-intents";
import {
  serializeReviewPublic,
  serializeService,
  staticCatalog,
} from "./static-data/build-catalog";
import { STATIC_CITIES } from "./static-nav";

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

/** Precomputed homepage catalog — zero async/cache on static render. */
export const STATIC_CATEGORIES_WITH_SERVICES = SERVICE_MENU.map((cat, order) => ({
  id: `cat-${cat.slug}`,
  slug: cat.slug,
  name: cat.name,
  description: cat.description,
  icon: staticCatalog.categories.find((c) => c.slug === cat.slug)?.icon ?? "Grid2x2",
  order,
  services: menuCategoryServices(cat.slug),
}));

export const STATIC_FEATURED_SERVICES = staticCatalog.services
  .filter((s) => s.featured)
  .sort((a, b) => a.order - b.order)
  .slice(0, 8)
  .map((s) => {
    const { category, reviews, faqs, materials, ...rest } = serializeService(s);
    return { ...rest, category };
  });

export const STATIC_GENERAL_FAQS = staticCatalog.faqs
  .filter((f) => !f.serviceId)
  .sort((a, b) => a.order - b.order);

export const STATIC_REVIEWS = [...staticCatalog.reviews]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 40)
  .map(serializeReviewPublic);

export const STATIC_CATALOG_COUNTS = {
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

export const STATIC_POPULAR_KEYWORD_LINKS = staticCatalog.services
  .filter((s) => s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
  .map((s) => ({ s, score: scoreIntentKeyword(s.slug, s.name) }))
  .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
  .slice(0, 40)
  .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name }));

export { STATIC_CITIES };
