import { catalogCityFilter } from "./catalog";
import { SERVICE_MENU } from "./service-menu";
import { staticCatalog } from "./static-data/build-catalog";

/** Sync nav data — zero async/cache lookup on every request. */
export const STATIC_CITIES = staticCatalog.cities
  .filter((c) => catalogCityFilter.slug.in.includes(c.slug))
  .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
  .map(({ slug, name, featured }) => ({ slug, name, featured }));

export const STATIC_NAV_CATEGORIES = SERVICE_MENU.map((cat) => ({
  slug: cat.slug,
  name: cat.name,
  description: cat.description,
  services: cat.services.map((s) => ({
    slug: s.slug,
    name: s.name,
    tagline: staticCatalog.services.find((svc) => svc.slug === s.slug)?.tagline ?? "",
  })),
}));
