import { absoluteUrl, site } from "./site";

/**
 * JSON-LD builders. Each returns a plain object rendered via a <script> tag by
 * the <JsonLd> component. Keep entity @id values stable so search engines can
 * link the graph together.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    description: site.description,
    logo: absoluteUrl("/logo.png"),
    sameAs: [...site.sameAs],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema(opts: {
  cityName?: string;
  state?: string;
  areaName?: string;
  latitude?: number | null;
  longitude?: number | null;
  path: string;
}) {
  const areaServed = [opts.areaName, opts.cityName, opts.state].filter(Boolean).join(", ");
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl(opts.path)}#localbusiness`,
    name: opts.cityName ? `${site.name} — ${opts.cityName}` : site.name,
    url: absoluteUrl(opts.path),
    telephone: site.phone,
    email: site.email,
    priceRange: "$$",
    image: absoluteUrl("/og-default.png"),
    ...(areaServed ? { areaServed } : {}),
    ...(opts.latitude && opts.longitude
      ? { geo: { "@type": "GeoCoordinates", latitude: opts.latitude, longitude: opts.longitude } }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: opts.cityName ?? "India",
      addressRegion: opts.state ?? "India",
      addressCountry: "IN",
    },
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  priceMin?: number | null;
  priceMax?: number | null;
  priceUnit?: string | null;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { "@id": `${site.url}/#organization` },
    serviceType: opts.name,
    ...(opts.areaServed ? { areaServed: opts.areaServed } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      description: "Free site inspection and custom quote",
      url: absoluteUrl("/contact"),
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function reviewAggregateSchema(opts: {
  itemName: string;
  path: string;
  reviews: { author: string; rating: number; body: string }[];
}) {
  if (!opts.reviews.length) return null;
  const avg =
    opts.reviews.reduce((sum, r) => sum + r.rating, 0) / opts.reviews.length;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.itemName,
    url: absoluteUrl(opts.path),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: opts.reviews.length,
    },
    review: opts.reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.body,
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntityOfPage: absoluteUrl(opts.path),
    image: opts.image ? (opts.image.startsWith("http") ? opts.image : absoluteUrl(opts.image)) : absoluteUrl("/og-default.png"),
    author: { "@type": "Person", name: opts.author },
    publisher: { "@id": `${site.url}/#organization` },
    datePublished: opts.publishedTime,
    dateModified: opts.modifiedTime ?? opts.publishedTime,
  };
}
