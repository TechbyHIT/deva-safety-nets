/** Core catalog services use order 0–8999; keyword SEO rows start at 9000. */
export const KEYWORD_SERVICE_ORDER_FLOOR = 9000;

export const catalogServiceFilter = { order: { lt: KEYWORD_SERVICE_ORDER_FLOOR } } as const;

/** Only these cities appear on the site (locations, nav, sitemap, search). */
export const SUPPORTED_CITY_SLUGS = ["kochi", "ernakulam"] as const;

export const catalogCityFilter = { slug: { in: [...SUPPORTED_CITY_SLUGS] as string[] } };

/** Filter areas belonging to supported cities. */
export const catalogAreaFilter = { city: catalogCityFilter };
