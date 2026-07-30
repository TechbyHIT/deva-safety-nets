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
