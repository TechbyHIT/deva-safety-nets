import type { Metadata } from "next";
import { buildGlobalSeoKeywords } from "./seo-intents";
import { absoluteUrl, site } from "./site";

type BuildMetaArgs = {
  title: string;
  description: string;
  path: string;
  images?: string[];
  noindex?: boolean;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
};

/** Strip brand suffix — layout template already appends `| Deva Safety Nets`. */
export function normalizePageTitle(title: string): string {
  const brand = site.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let t = title
    .replace(new RegExp(`\\s*[|–—-]\\s*${brand}\\s+Kerala\\s*$`, "i"), "")
    .replace(new RegExp(`\\s*[|–—-]\\s*${brand}\\s*$`, "i"), "")
    .replace(/\s+/g, " ")
    .trim();
  // Keep Google-friendly length for the page segment (~50–55 chars + brand)
  if (t.length > 58) {
    const cut = t.slice(0, 55);
    const lastSpace = cut.lastIndexOf(" ");
    t = (lastSpace > 30 ? cut.slice(0, lastSpace) : cut).trim();
  }
  return t;
}

/** Ensure guide/article titles mention Kerala when missing (better local CTR). */
export function withKeralaTitle(title: string): string {
  const t = normalizePageTitle(title);
  if (/kerala|kochi|ernakulam/i.test(t)) return t;
  return normalizePageTitle(`${t} Kerala`);
}

/**
 * Single source of truth for page metadata: canonical URLs, Open Graph,
 * Twitter cards and robots directives. Pass the page-specific title only —
 * root layout adds `| Deva Safety Nets`.
 */
export function buildMetadata({
  title,
  description,
  path,
  images,
  noindex,
  type = "website",
  keywords,
  publishedTime,
}: BuildMetaArgs): Metadata {
  const cleanTitle = normalizePageTitle(title);
  const cleanDescription = description.replace(/\s+/g, " ").trim().slice(0, 160);
  const canonical = absoluteUrl(path);
  const ogImages = (images && images.length > 0 ? images : ["/og-default.png"]).map((src) =>
    src.startsWith("http") ? src : absoluteUrl(src),
  );
  const ogImageObjects = ogImages.map((url) => ({ url, width: 1200, height: 630, alt: cleanTitle }));

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          url: canonical,
          title: cleanTitle,
          description: cleanDescription,
          siteName: site.name,
          locale: site.locale,
          images: ogImageObjects,
          ...(publishedTime ? { publishedTime } : {}),
        }
      : {
          type: "website",
          url: canonical,
          title: cleanTitle,
          description: cleanDescription,
          siteName: site.name,
          locale: site.locale,
          images: ogImageObjects,
        };

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: ogImages,
    },
  };
}

/** Intent-aware titles/descriptions for service × location programmatic pages (Kerala SEO). */
export function buildServiceLocationMetadata(args: {
  serviceName: string;
  serviceKeywords?: string[];
  cityName: string;
  state?: string;
  areaName?: string;
  path: string;
}): Metadata {
  const { serviceName, serviceKeywords = [], cityName, state = "Kerala", areaName, path } = args;
  const place = areaName ? `${areaName}, ${cityName}` : cityName;
  const lower = serviceName.toLowerCase();
  const isQuoteIntent = /price|cost|rate|charges|quote|estimate|cheap|affordable|per sq ft|price list/i.test(
    lower,
  );
  const isInstallIntent = /installation|installer|installers|fitting|setup|professional installation/i.test(
    lower,
  );

  let title: string;
  let description: string;

  if (isQuoteIntent) {
    title = `${serviceName} Price in ${place} — Free Quote`;
    description = `Get ${serviceName.toLowerCase()} price in ${place}, ${state}. Free site survey, itemised quote in 24 hours, expert install. Call Deva Safety Nets Kochi.`;
  } else if (isInstallIntent) {
    title = `${serviceName} in ${place} — Expert Install`;
    description = `Book ${serviceName.toLowerCase()} in ${place}, ${state}. Certified installers, IS materials, warranty. Free survey across Kochi & Ernakulam.`;
  } else if (areaName) {
    title = `${serviceName} in ${areaName}, ${cityName}`;
    description = `${serviceName} installation in ${areaName}, ${cityName}, ${state}. Free inspection, fast install, up to 10-year warranty. Deva Safety Nets near you.`;
  } else {
    title = `${serviceName} in ${place} — Free Survey`;
    description = `Best ${serviceName.toLowerCase()} in ${place}, ${state}. Free site inspection, premium materials, warranty-backed install. Serving Kochi, Ernakulam & Kerala.`;
  }

  const keywords = [
    serviceName,
    `${serviceName} in ${place}`,
    `${serviceName} near me ${place}`,
    `best ${serviceName} in ${place}`,
    `best ${serviceName} near me ${place}`,
    `top ${serviceName} Kerala`,
    `best ${serviceName} Kerala`,
    `${serviceName} ${cityName}`,
    `${serviceName} Kerala`,
    ...serviceKeywords.slice(0, 12),
    ...buildGlobalSeoKeywords(serviceName.toLowerCase()).slice(0, 8),
    cityName,
    state,
    ...(areaName ? [areaName, `${serviceName} near me ${areaName}`] : []),
  ];

  return buildMetadata({ title, description, path, keywords });
}

/** Meta keywords for city/area hub pages (in, near me, best, premium, for). */
export function buildLocationSeoKeywords(placeName: string, cityName?: string): string[] {
  const p = placeName;
  const c = cityName ?? placeName;
  return [
    `invisible grills in ${p}`,
    `safety nets in ${p}`,
    `best invisible grills ${p}`,
    `best safety nets ${p}`,
    `best safety nets near me ${p}`,
    `top safety nets Kerala`,
    `best safety nets Kerala`,
    `premium invisible grills in ${p}`,
    `invisible grills near me ${p}`,
    `safety nets near me ${p}`,
    `best invisible grills near me ${p}`,
    `top invisible grills Kerala`,
    `invisible grills for ${p}`,
    `safety nets for ${p}`,
    `invisible grills ${c}`,
    `safety nets ${c}`,
    `invisible grills near me`,
    `safety nets near me`,
    "invisible grills Kochi Ernakulam",
    "safety nets Kerala",
    ...buildGlobalSeoKeywords().slice(0, 6),
  ];
}
