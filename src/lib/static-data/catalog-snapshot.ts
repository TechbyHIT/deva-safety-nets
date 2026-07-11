import type { StaticCatalog, StaticCategory, StaticProject, StaticReview, StaticService } from "./build-catalog";
import { KEYWORD_SERVICE_ORDER_FLOOR, isExcludedService } from "../catalog";
import { scoreIntentKeyword } from "../seo-intents";

const KEYWORD_FIELD_DEFAULTS: Record<
  string,
  Pick<StaticService, "benefits" | "features" | "useCases">
> = {
  "invisible-grills": {
    benefits: [
      "Uninterrupted, unobstructed view",
      "Child & pet safe spacing",
      "Corrosion resistant hardware",
      "Low maintenance & easy to clean",
      "Engineered for Kerala humidity and monsoon",
    ],
    features: [
      "2mm SS304/SS316 wire",
      "Powder-coated aluminium frame",
      "40-60mm cable spacing",
      "High-tension turnbuckles",
      "Wind-load tested for high-rises",
    ],
    useCases: ["High-rise apartments", "Villas", "Independent homes", "Offices", "French windows"],
  },
  "safety-nets": {
    benefits: [
      "Nearly invisible protection",
      "High breaking strength",
      "UV-stabilised & weatherproof",
      "Fast installation — often same day",
      "Cost-effective for child and pet safety",
    ],
    features: [
      "Braided nylon / HDPE mesh",
      "15-40mm mesh sizes",
      "Weatherproof anchor hooks",
      "UV-treated for Kerala sun exposure",
    ],
    useCases: ["Balconies", "Terraces", "Ducts", "Apartments", "Villas"],
  },
  "bird-protection": {
    benefits: ["Humane bird deterrence", "Hygienic mess-free spaces", "Nearly invisible fit", "UV and weatherproof"],
    features: ["HDPE exclusion mesh", "SS304 spike strips", "Custom spans", "Professional installation"],
    useCases: ["Balconies", "Windows", "Ducts", "Terraces", "Ledges"],
  },
  "cloth-hangers": {
    benefits: ["Space-efficient drying", "Rust-free hardware", "Smooth operation", "High load capacity"],
    features: ["Aluminium / stainless rails", "Smooth pulley mechanism", "Weatherproof coating", "Adjustable heights"],
    useCases: ["Balconies", "Utility rooms", "Bathrooms"],
  },
  "sports-nets": {
    benefits: ["High-impact ball-stop rating", "UV-stable & weatherproof", "Custom sizing", "Long service life"],
    features: ["Braided nylon / HDPE mesh", "Galvanised support poles", "Reinforced border tape", "Retractable options"],
    useCases: ["Academies", "Schools", "Turf parks", "Clubs"],
  },
  "special-safety-solutions": {
    benefits: ["Site-specific engineering", "Child and pet safe", "Society-compliant finishes", "Certified materials"],
    features: ["Custom mesh and cable specs", "Load-tested anchoring", "Multi-zone coverage", "Documented handover"],
    useCases: ["Apartments", "Villas", "Industrial sites", "Construction zones"],
  },
  "service-support": {
    benefits: ["Free site inspection", "Transparent quotes", "Own trained technicians", "Warranty-backed work"],
    features: ["On-site survey", "Itemised pricing", "Repair and replacement", "Annual maintenance plans"],
    useCases: ["Homes", "Apartments", "Commercial", "Industrial"],
  },
};

function expandKeywordServiceFields(
  category: StaticCategory,
  tagline: string,
): Pick<StaticService, "summary" | "benefits" | "features" | "useCases" | "materials" | "faqs"> {
  const defaults = KEYWORD_FIELD_DEFAULTS[category.slug] ?? {
    benefits: [],
    features: [],
    useCases: [],
  };
  return {
    summary: `${tagline} Deva Safety Nets serves Kochi, Ernakulam and 160+ Kerala localities with certified materials, free site inspection and warranty-backed installation.`,
    benefits: defaults.benefits,
    features: defaults.features,
    useCases: defaults.useCases,
    materials: [],
    faqs: [],
  };
}

export type IntentLinkSnapshot = { slug: string; name: string; label: string };

type ServiceSnapshotRow = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  order: number;
  updatedAt: string;
  kw?: 1;
  tagline?: string;
  keywords?: string[];
  priceMin?: number | null;
  priceMax?: number | null;
  priceUnit?: string | null;
  featured?: boolean;
  specifications?: Record<string, string>;
  summary?: string;
  benefits?: string[];
  features?: string[];
  useCases?: string[];
  materials?: StaticService["materials"];
  faqs?: StaticService["faqs"];
};

export type CatalogSnapshot = {
  version: 1;
  priorityIntentLinks: IntentLinkSnapshot[];
  categories: Omit<StaticCategory, "services">[];
  services: ServiceSnapshotRow[];
  materials: Array<Record<string, unknown>>;
  industries: Array<Record<string, unknown>>;
  propertyTypes: Array<Record<string, unknown>>;
  cities: Array<Record<string, unknown>>;
  areas: Array<Record<string, unknown>>;
  faqs: Array<Record<string, unknown>>;
  blogPosts: Array<Record<string, unknown>>;
  guides: Array<Record<string, unknown>>;
  comparisons: Array<Record<string, unknown>>;
  reviews: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  contentOverrides: Array<Record<string, unknown>>;
};

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function parseDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/** Flatten catalog for JSON — no circular category ↔ service refs. */
export function serializeCatalog(catalog: StaticCatalog): CatalogSnapshot {
  const priorityIntentLinks = catalog.services
    .filter((s) => s.order >= KEYWORD_SERVICE_ORDER_FLOOR && !isExcludedService(s))
    .map((s) => ({ s, score: scoreIntentKeyword(s.slug, s.name) }))
    .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
    .slice(0, 56)
    .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name }));

  return {
    version: 1,
    priorityIntentLinks,
    categories: catalog.categories.map(({ services: _s, ...cat }) => cat),
    services: catalog.services.map((s) => {
      if (s.order >= KEYWORD_SERVICE_ORDER_FLOOR) {
        return {
          id: s.id,
          slug: s.slug,
          name: s.name,
          tagline: s.tagline,
          categoryId: s.categoryId,
          order: s.order,
          updatedAt: toIso(s.updatedAt),
          kw: 1 as const,
        };
      }
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        categoryId: s.categoryId,
        order: s.order,
        keywords: s.keywords,
        priceMin: s.priceMin,
        priceMax: s.priceMax,
        priceUnit: s.priceUnit,
        featured: s.featured,
        specifications: s.specifications,
        updatedAt: toIso(s.updatedAt),
        summary: s.summary,
        benefits: s.benefits,
        features: s.features,
        useCases: s.useCases,
        materials: s.materials,
        faqs: s.faqs,
      };
    }),
    materials: catalog.materials.map((m) => ({ ...m, updatedAt: toIso(m.updatedAt) })),
    industries: catalog.industries.map((i) => ({ ...i, updatedAt: toIso(i.updatedAt) })),
    propertyTypes: catalog.propertyTypes.map((p) => ({ ...p, updatedAt: toIso(p.updatedAt) })),
    cities: catalog.cities.map((c) => ({
      ...c,
      areas: c.areas,
      projects: c.projects.map(({ service: _s, city: _c, completedAt, updatedAt, ...p }) => ({
        ...p,
        completedAt: toIso(completedAt),
        updatedAt: toIso(updatedAt),
      })),
      reviews: c.reviews.map(({ service: _s, city: _c, ...r }) => ({
        ...r,
        createdAt: toIso(r.createdAt as Date),
      })),
      updatedAt: toIso(c.updatedAt),
    })),
    areas: catalog.areas.map((a) => ({ ...a })),
    faqs: catalog.faqs.map((f) => ({ ...f })),
    blogPosts: catalog.blogPosts.map((b) => ({
      ...b,
      publishedAt: toIso(b.publishedAt),
      updatedAt: toIso(b.updatedAt),
    })),
    guides: catalog.guides.map(({ service: _s, updatedAt, ...g }) => ({
      ...g,
      updatedAt: toIso(updatedAt),
    })),
    comparisons: catalog.comparisons.map(({ serviceA: _a, serviceB: _b, updatedAt, ...c }) => ({
      ...c,
      updatedAt: toIso(updatedAt),
    })),
    reviews: catalog.reviews.map(({ service: _s, city: _c, createdAt, ...r }) => ({
      ...r,
      createdAt: toIso(createdAt),
    })),
    projects: catalog.projects.map(({ service: _s, city: _c, completedAt, updatedAt, ...p }) => ({
      ...p,
      completedAt: toIso(completedAt),
      updatedAt: toIso(updatedAt),
    })),
    contentOverrides: catalog.contentOverrides.map((o) => ({ ...o })),
  };
}

/** Rebuild in-memory catalog + category refs from snapshot. */
export function hydrateCatalog(snapshot: CatalogSnapshot): StaticCatalog {
  const categories: StaticCategory[] = snapshot.categories.map((cat) => ({
    ...cat,
    services: [],
  }));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const services: StaticService[] = snapshot.services.map((raw) => {
    const category = categoryById.get(raw.categoryId);
    if (!category) throw new Error(`Unknown categoryId: ${raw.categoryId}`);
    const expanded =
      raw.kw === 1
        ? expandKeywordServiceFields(category, raw.tagline ?? raw.name)
        : {
            summary: raw.summary!,
            benefits: raw.benefits!,
            features: raw.features!,
            useCases: raw.useCases!,
            materials: raw.materials ?? [],
            faqs: raw.faqs ?? [],
          };
    const service: StaticService = {
      id: raw.id,
      slug: raw.slug,
      name: raw.name,
      tagline: raw.tagline ?? raw.name,
      summary: expanded.summary,
      benefits: expanded.benefits,
      features: expanded.features,
      useCases: expanded.useCases,
      keywords: raw.keywords ?? [raw.name],
      priceMin: raw.priceMin ?? null,
      priceMax: raw.priceMax ?? null,
      priceUnit: raw.priceUnit ?? null,
      order: raw.order,
      featured: raw.featured ?? false,
      specifications: raw.specifications ?? {
        warranty: "Up to 10 years",
        installation: "1-2 days",
        certification: "IS-compliant materials",
        region: "Kerala",
      },
      categoryId: raw.categoryId,
      updatedAt: parseDate(raw.updatedAt),
      category,
      materials: expanded.materials,
      faqs: expanded.faqs,
      reviews: [] as StaticReview[],
    };
    category.services.push(service);
    return service;
  });

  const serviceById = new Map(services.map((s) => [s.id, s]));
  const cityById = new Map(
    snapshot.cities.map((raw) => {
      const city = {
        ...(raw as StaticCatalog["cities"][0]),
        updatedAt: parseDate(raw.updatedAt as string),
        areas: raw.areas as StaticCatalog["cities"][0]["areas"],
        projects: [] as StaticProject[],
        reviews: [] as StaticReview[],
      };
      return [city.id, city] as const;
    }),
  );

  const cities = [...cityById.values()];

  for (const raw of snapshot.reviews) {
    const review = {
      ...(raw as StaticCatalog["reviews"][0]),
      createdAt: parseDate(raw.createdAt as string),
      service: raw.serviceId ? (serviceById.get(raw.serviceId as string) ?? null) : null,
      city: raw.cityId ? (cityById.get(raw.cityId as string) ?? null) : null,
    };
    if (review.city) review.city.reviews.push(review);
    if (review.service) review.service.reviews.push(review);
  }

  const projects = snapshot.projects.map((raw) => {
    const project = {
      ...(raw as StaticCatalog["projects"][0]),
      completedAt: parseDate(raw.completedAt as string),
      updatedAt: parseDate(raw.updatedAt as string),
      service: serviceById.get(raw.serviceId as string)!,
      city: cityById.get(raw.cityId as string)!,
    };
    project.city.projects.push(project);
    return project;
  });

  const guides = snapshot.guides.map((raw) => ({
    ...(raw as StaticCatalog["guides"][0]),
    updatedAt: parseDate(raw.updatedAt as string),
    service: raw.serviceId ? (serviceById.get(raw.serviceId as string) ?? null) : null,
  }));

  const comparisons = snapshot.comparisons.map((raw) => ({
    ...(raw as StaticCatalog["comparisons"][0]),
    updatedAt: parseDate(raw.updatedAt as string),
    serviceA: serviceById.get(raw.serviceAId as string)!,
    serviceB: serviceById.get(raw.serviceBId as string)!,
  }));

  const reviews = snapshot.reviews.map((raw) => ({
    ...(raw as StaticCatalog["reviews"][0]),
    createdAt: parseDate(raw.createdAt as string),
    service: raw.serviceId ? (serviceById.get(raw.serviceId as string) ?? null) : null,
    city: raw.cityId ? (cityById.get(raw.cityId as string) ?? null) : null,
  }));

  return {
    categories,
    services,
    materials: snapshot.materials.map((m) => ({
      ...(m as StaticCatalog["materials"][0]),
      updatedAt: parseDate(m.updatedAt as string),
    })),
    industries: snapshot.industries.map((i) => ({
      ...(i as StaticCatalog["industries"][0]),
      updatedAt: parseDate(i.updatedAt as string),
    })),
    propertyTypes: snapshot.propertyTypes.map((p) => ({
      ...(p as StaticCatalog["propertyTypes"][0]),
      updatedAt: parseDate(p.updatedAt as string),
    })),
    cities,
    areas: snapshot.areas as StaticCatalog["areas"],
    faqs: snapshot.faqs as StaticCatalog["faqs"],
    blogPosts: snapshot.blogPosts.map((b) => ({
      ...(b as StaticCatalog["blogPosts"][0]),
      publishedAt: parseDate(b.publishedAt as string),
      updatedAt: parseDate(b.updatedAt as string),
    })),
    guides,
    comparisons,
    reviews,
    projects,
    contentOverrides: snapshot.contentOverrides as StaticCatalog["contentOverrides"],
  };
}

export function getPriorityIntentLinks(snapshot: CatalogSnapshot): IntentLinkSnapshot[] {
  return snapshot.priorityIntentLinks;
}
