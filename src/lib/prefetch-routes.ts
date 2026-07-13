/** High-traffic routes warmed on idle — kept small to protect LCP. */
export const WARM_ROUTES = [
  "/",
  "/services",
  "/contact",
  "/services/invisible-grills",
  "/services/balcony-safety-nets",
] as const;

/** Core services prefetched after idle (top catalog). */
export const WARM_SERVICE_SLUGS = [
  "invisible-grills",
  "balcony-safety-nets",
  "pigeon-safety-nets",
] as const;

export function warmServicePaths() {
  return WARM_SERVICE_SLUGS.map((slug) => `/services/${slug}`);
}
