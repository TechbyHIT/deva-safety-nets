import { KEYWORD_SERVICE_ORDER_FLOOR } from "./catalog";
import { SERVICE_MENU } from "./service-menu";
import { staticCatalog, getCityBySlugStatic } from "./static-data/build-catalog";
import { PRIMARY_CITY_SLUG } from "./service-location-url";

export const STATIC_FOOTER_DIRECTORY = {
  cityName: getCityBySlugStatic(PRIMARY_CITY_SLUG)?.name ?? "Kochi",
  categories: SERVICE_MENU.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    services: cat.services.map((s) => ({ slug: s.slug, name: s.name })),
  })),
};

export const STATIC_KEYWORD_LINKS_BY_CATEGORY = SERVICE_MENU.map((cat) => {
  const category = staticCatalog.categories.find((c) => c.slug === cat.slug);
  const links = staticCatalog.services
    .filter((s) => s.categoryId === category?.id && s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
    .slice(0, 10)
    .map(({ slug, name }) => ({ slug, name }));
  return { slug: cat.slug, name: cat.name, links };
});
