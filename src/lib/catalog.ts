/** Core catalog services use order 0–8999; keyword SEO rows start at 9000. */
export const KEYWORD_SERVICE_ORDER_FLOOR = 9000;

export const catalogServiceFilter = { order: { lt: KEYWORD_SERVICE_ORDER_FLOOR } } as const;

/** Only these cities appear on the site (locations, nav, sitemap, search). */
export const SUPPORTED_CITY_SLUGS = ["kochi", "ernakulam"] as const;

export const catalogCityFilter = { slug: { in: [...SUPPORTED_CITY_SLUGS] as string[] } };

/** Filter areas belonging to supported cities. */
export const catalogAreaFilter = { city: catalogCityFilter };

/** Categories removed from the public site. */
export const EXCLUDED_CATEGORY_SLUGS = new Set(["cloth-hangers"]);

/** Service slugs / names we never publish (cloth hangers, coconut tree nets, etc.). */
const EXCLUDED_SERVICE_RE = /cloth[- ]?hanger|coconut/i;

export function isExcludedCategorySlug(slug: string): boolean {
  return EXCLUDED_CATEGORY_SLUGS.has(slug);
}

export function isExcludedServiceSlug(slug: string, name = ""): boolean {
  const haystack = `${slug} ${name}`.toLowerCase();
  return EXCLUDED_SERVICE_RE.test(haystack);
}

export function isExcludedService(service: { slug: string; name?: string; category?: { slug?: string } | null }) {
  if (service.category?.slug && isExcludedCategorySlug(service.category.slug)) return true;
  return isExcludedServiceSlug(service.slug, service.name ?? "");
}
