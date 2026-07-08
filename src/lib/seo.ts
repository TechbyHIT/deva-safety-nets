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

/**
 * Single source of truth for page metadata: canonical URLs, Open Graph,
 * Twitter cards and robots directives. Titles are clamped and templated by the
 * root layout, so pass the page-specific portion only.
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
  const canonical = absoluteUrl(path);
  const ogImages = (images && images.length > 0 ? images : ["/og-default.png"]).map((src) =>
    src.startsWith("http") ? src : absoluteUrl(src),
  );
  const ogImageObjects = ogImages.map((url) => ({ url, width: 1200, height: 630, alt: title }));

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          url: canonical,
          title,
          description,
          siteName: site.name,
          locale: site.locale,
          images: ogImageObjects,
          ...(publishedTime ? { publishedTime } : {}),
        }
      : {
          type: "website",
          url: canonical,
          title,
          description,
          siteName: site.name,
          locale: site.locale,
          images: ogImageObjects,
        };

  return {
    title,
    description,
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
      title,
      description,
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
    title = `${serviceName} in ${place} — Free Quote | Deva Safety Nets`;
    description = `Looking for ${serviceName.toLowerCase()} in ${place}, ${state}? Free site survey, transparent itemised quote and professional installation. Deva Safety Nets — Kochi, Ernakulam and Kerala-wide.`;
  } else if (isInstallIntent) {
    title = `${serviceName} in ${place} — Certified Installers | Deva Safety Nets`;
    description = `Professional ${serviceName.toLowerCase()} in ${place}, ${state}. Trained Deva Safety Nets technicians, IS-compliant materials, warranty-backed work. Book a free survey today.`;
  } else {
    title = `${serviceName} in ${place} — Free Survey | Deva Safety Nets`;
    description = `${serviceName} in ${place}, ${state}. Local Deva Safety Nets team, free inspection, premium materials and long-term warranty. Request your quote today.`;
  }

  const keywords = [
    serviceName,
    `${serviceName} in ${place}`,
    `${serviceName} near me ${place}`,
    `best ${serviceName} in ${place}`,
    `best ${serviceName} near me ${place}`,
    `top ${serviceName} Kerala`,
    `high quality #1 ${serviceName} Kerala`,
    `best ${serviceName} Kerala`,
    `premium ${serviceName} in ${place}`,
    `${serviceName} for ${place}`,
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
    `high quality safety nets #1 Kerala`,
    `best safety nets Kerala`,
    `premium invisible grills in ${p}`,
    `invisible grills near me ${p}`,
    `safety nets near me ${p}`,
    `best invisible grills near me ${p}`,
    `top invisible grills Kerala`,
    `high quality #1 invisible grills Kerala`,
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
