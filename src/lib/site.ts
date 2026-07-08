/**
 * Central site configuration derived from environment variables with safe
 * fallbacks so the app renders even before .env is filled in.
 */
export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com").replace(/\/$/, ""),
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Deva Safety Nets",
  shortName: "Deva",
  description:
    "Kerala's trusted invisible grills and safety nets specialists — premium installation in Kochi, Ernakulam and across Kerala. Free site inspection, certified materials and up to 10-year warranty.",
  phone: process.env.NEXT_PUBLIC_BRAND_PHONE ?? "+919000000000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "919000000000",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@example.com",
  googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
  locale: "en_IN",
  currency: "INR",
  region: "Kerala",
  state: "Kerala",
  primaryCities: ["Kochi", "Ernakulam"],
  serviceArea:
    "Kochi, Ernakulam, Edapally, Kakkanad, Vyttila, Aluva, Tripunithura, Kaloor, Palarivattom and 160+ Kerala localities",
  sameAs: [
    "https://www.facebook.com/",
    "https://www.instagram.com/",
    "https://www.youtube.com/",
  ],
} as const;

export const sitemapPageSize = Number(process.env.SITEMAP_PAGE_SIZE ?? 45000);

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function telHref(): string {
  return `tel:${site.phone}`;
}

export function whatsappHref(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}
