/** Build /services/{service}/{city} or /services/{service}/{city}/{area} URLs. */
export function serviceLocationHref(
  serviceSlug: string,
  citySlug: string,
  areaSlug?: string,
): string {
  if (areaSlug) return `/services/${serviceSlug}/${citySlug}/${areaSlug}`;
  return `/services/${serviceSlug}/${citySlug}`;
}

export function serviceLocationLabel(serviceName: string, placeName: string): string {
  return `${serviceName} in ${placeName}`;
}

/** Primary market for footer and default location links. */
export const PRIMARY_CITY_SLUG = "kochi";
