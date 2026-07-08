/** High-traffic routes warmed on idle for instant client navigations. */
export const WARM_ROUTES = [
  "/",
  "/services",
  "/locations",
  "/about",
  "/contact",
  "/gallery",
  "/faq",
  "/blog",
  "/projects",
  "/reviews",
  "/compare",
  "/property-types",
  "/locations/kochi",
  "/locations/ernakulam",
] as const;

/** Core services prefetched after first paint (top catalog). */
export const WARM_SERVICE_SLUGS = [
  "invisible-grills",
  "balcony-invisible-grills",
  "balcony-safety-nets",
  "pigeon-safety-nets",
  "cricket-nets",
  "children-safety-nets",
  "bird-spikes",
  "cloth-hangers",
] as const;

export function warmServicePaths() {
  return WARM_SERVICE_SLUGS.map((slug) => `/services/${slug}`);
}
