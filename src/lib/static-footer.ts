import { SERVICE_MENU } from "./service-menu";
import { getCityBySlugStatic } from "./static-data/build-catalog";
import { PRIMARY_CITY_SLUG } from "./service-location-url";

export const STATIC_FOOTER_DIRECTORY = {
  cityName: getCityBySlugStatic(PRIMARY_CITY_SLUG)?.name ?? "Kochi",
  categories: SERVICE_MENU.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    services: cat.services.map((s) => ({ slug: s.slug, name: s.name })),
  })),
};

/**
 * @deprecated Prefer STATIC_FOOTER_DIRECTORY. Kept so mixed/stale VPS checkouts
 * that still import the old name can typecheck. Links are real menu services.
 */
export const STATIC_KEYWORD_LINKS_BY_CATEGORY = STATIC_FOOTER_DIRECTORY.categories.map(
  (cat) => ({
    slug: cat.slug,
    name: cat.name,
    links: cat.services.slice(0, 10).map((s) => ({ slug: s.slug, name: s.name })),
  }),
);
