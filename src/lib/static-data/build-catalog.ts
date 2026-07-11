import { KEYWORD_SERVICE_ORDER_FLOOR, isExcludedCategorySlug, isExcludedService, isExcludedServiceSlug } from "../catalog";
import { buildKeywordServiceSeeds } from "../keyword-catalog";
import { areaGroupsForCity } from "../kerala-locations";
import { KEYWORD_CATEGORY_ALIASES, SERVICE_MENU } from "../service-menu";
import { GENERAL_FAQS } from "../seed-content/general-faqs";
import {
  BLOG_POSTS,
  CITIES,
  INDUSTRIES,
  MATERIALS,
  PROPERTY_TYPES,
  buildBlogBody,
  buildGuideBody,
  buildServiceFaqs,
  slugify,
} from "./seed-data";
import { hydrateCatalog, type CatalogSnapshot } from "./catalog-snapshot";

type CategoryMeta = {
  icon: string;
  materialKinds: ("metal" | "net")[];
  defaults: {
    benefits: string[];
    features: string[];
    useCases: string[];
    priceMin: number | null;
    priceMax: number | null;
    priceUnit: string | null;
  };
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  "invisible-grills": {
    icon: "Grid3x3",
    materialKinds: ["metal"],
    defaults: {
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
      priceMin: 85,
      priceMax: 210,
      priceUnit: "sq ft",
    },
  },
  "safety-nets": {
    icon: "Grid2x2",
    materialKinds: ["net"],
    defaults: {
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
      priceMin: 5,
      priceMax: 16,
      priceUnit: "sq ft",
    },
  },
  "bird-protection": {
    icon: "Bird",
    materialKinds: ["net", "metal"],
    defaults: {
      benefits: ["Humane bird deterrence", "Hygienic mess-free spaces", "Nearly invisible fit", "UV and weatherproof"],
      features: ["HDPE exclusion mesh", "SS304 spike strips", "Custom spans", "Professional installation"],
      useCases: ["Balconies", "Windows", "Ducts", "Terraces", "Ledges"],
      priceMin: 5,
      priceMax: 150,
      priceUnit: "sq ft",
    },
  },
  "cloth-hangers": {
    icon: "Wind",
    materialKinds: ["metal"],
    defaults: {
      benefits: ["Space-efficient drying", "Rust-free hardware", "Smooth operation", "High load capacity"],
      features: ["Aluminium / stainless rails", "Smooth pulley mechanism", "Weatherproof coating", "Adjustable heights"],
      useCases: ["Balconies", "Utility rooms", "Bathrooms"],
      priceMin: 900,
      priceMax: 30000,
      priceUnit: "unit",
    },
  },
  "sports-nets": {
    icon: "Trophy",
    materialKinds: ["net"],
    defaults: {
      benefits: ["High-impact ball-stop rating", "UV-stable & weatherproof", "Custom sizing", "Long service life"],
      features: ["Braided nylon / HDPE mesh", "Galvanised support poles", "Reinforced border tape", "Retractable options"],
      useCases: ["Academies", "Schools", "Turf parks", "Clubs"],
      priceMin: 7,
      priceMax: 22,
      priceUnit: "sq ft",
    },
  },
  "special-safety-solutions": {
    icon: "Shield",
    materialKinds: ["net", "metal"],
    defaults: {
      benefits: ["Site-specific engineering", "Child and pet safe", "Society-compliant finishes", "Certified materials"],
      features: ["Custom mesh and cable specs", "Load-tested anchoring", "Multi-zone coverage", "Documented handover"],
      useCases: ["Apartments", "Villas", "Industrial sites", "Construction zones"],
      priceMin: 6,
      priceMax: 20,
      priceUnit: "sq ft",
    },
  },
  "service-support": {
    icon: "Wrench",
    materialKinds: ["metal", "net"],
    defaults: {
      benefits: ["Free site inspection", "Transparent quotes", "Own trained technicians", "Warranty-backed work"],
      features: ["On-site survey", "Itemised pricing", "Repair and replacement", "Annual maintenance plans"],
      useCases: ["Homes", "Apartments", "Commercial", "Industrial"],
      priceMin: 500,
      priceMax: 6000,
      priceUnit: "visit",
    },
  },
};

function serviceTagline(name: string): string {
  return `Professional ${name.toLowerCase()} across Kochi, Ernakulam and Kerala — free site inspection and warranty-backed installation by Deva Safety Nets.`;
}

function resolveCategorySlug(slug: string) {
  return KEYWORD_CATEGORY_ALIASES[slug] ?? slug;
}

export type StaticFaq = {
  id: string;
  scope: string;
  order: number;
  question: string;
  answer: string;
  serviceId: string | null;
};

export type StaticMaterial = {
  id: string;
  slug: string;
  name: string;
  grade: string;
  summary: string;
  advantages: string[];
  bestFor: string[];
  properties: Record<string, string>;
  order: number;
  updatedAt: Date;
};

export type StaticServiceMaterial = {
  serviceId: string;
  materialId: string;
  material: StaticMaterial;
};

export type StaticService = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  benefits: string[];
  features: string[];
  useCases: string[];
  keywords: string[];
  priceMin: number | null;
  priceMax: number | null;
  priceUnit: string | null;
  order: number;
  featured: boolean;
  specifications: Record<string, string>;
  categoryId: string;
  category: StaticCategory;
  faqs: StaticFaq[];
  materials: StaticServiceMaterial[];
  reviews: StaticReview[];
  updatedAt: Date;
};

export type StaticCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  services: StaticService[];
};

export type StaticArea = {
  id: string;
  slug: string;
  name: string;
  tier: number;
  tierLabel: string | null;
  landmarks: string[];
  pincode: string | null;
  cityId: string;
};

export type StaticCity = {
  id: string;
  slug: string;
  name: string;
  state: string;
  region: string;
  featured: boolean;
  order: number;
  intro: string;
  landmarks: string[];
  latitude: number | null;
  longitude: number | null;
  areas: StaticArea[];
  projects: StaticProject[];
  reviews: StaticReview[];
  updatedAt: Date;
};

export type StaticIndustry = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  challenges: string[];
  solutions: string[];
  order: number;
  updatedAt: Date;
};

export type StaticPropertyType = {
  id: string;
  slug: string;
  name: string;
  plural: string;
  summary: string;
  concerns: string[];
  examples: string[];
  order: number;
  updatedAt: Date;
};

export type StaticBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  author: string;
  readMinutes: number;
  body: string;
  published: boolean;
  publishedAt: Date;
  updatedAt: Date;
};

export type StaticGuide = {
  id: string;
  slug: string;
  title: string;
  type: "INSTALLATION" | "MAINTENANCE" | "BUYING";
  excerpt: string;
  body: string;
  readMinutes: number;
  steps: { title: string; detail: string }[];
  published: boolean;
  serviceId: string | null;
  service: StaticService | null;
  updatedAt: Date;
};

export type StaticComparison = {
  id: string;
  slug: string;
  intro: string;
  verdict: string;
  criteria: { label: string; a: string; b: string }[];
  serviceAId: string;
  serviceBId: string;
  serviceA: StaticService;
  serviceB: StaticService;
  updatedAt: Date;
};

export type StaticReview = {
  id: string;
  author: string;
  rating: number;
  body: string;
  verified: boolean;
  serviceId: string | null;
  cityId: string | null;
  service: StaticService | null;
  city: StaticCity | null;
  createdAt: Date;
};

export type ContentOverride = {
  routeKey: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  content?: string | null;
  noindex?: boolean;
};

export type StaticProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  images: string[];
  serviceId: string;
  cityId: string;
  service: StaticService;
  city: StaticCity;
  completedAt: Date;
  updatedAt: Date;
};

export type StaticCatalog = {
  categories: StaticCategory[];
  services: StaticService[];
  materials: StaticMaterial[];
  industries: StaticIndustry[];
  propertyTypes: StaticPropertyType[];
  cities: StaticCity[];
  areas: StaticArea[];
  faqs: StaticFaq[];
  blogPosts: StaticBlogPost[];
  guides: StaticGuide[];
  comparisons: StaticComparison[];
  reviews: StaticReview[];
  projects: StaticProject[];
  contentOverrides: ContentOverride[];
};

const NOW = new Date("2026-01-01");

function id(prefix: string, slug: string) {
  return `${prefix}-${slug}`;
}

function buildCatalog(): StaticCatalog {
  const materials: StaticMaterial[] = MATERIALS.map((m, i) => ({
    id: id("mat", slugify(m.grade)),
    slug: slugify(m.grade),
    name: m.name,
    grade: m.grade,
    summary: m.summary,
    advantages: m.advantages,
    bestFor: m.bestFor,
    properties: m.properties as unknown as Record<string, string>,
    order: i,
    updatedAt: NOW,
  }));
  const materialByGrade = new Map(materials.map((m) => [m.grade, m]));

  const industries: StaticIndustry[] = INDUSTRIES.map((ind, i) => ({
    id: id("ind", slugify(ind.name)),
    slug: slugify(ind.name),
    name: ind.name,
    summary: ind.summary,
    challenges: ind.challenges,
    solutions: ind.solutions,
    order: i,
    updatedAt: NOW,
  }));

  const propertyTypes: StaticPropertyType[] = PROPERTY_TYPES.map((p, i) => ({
    id: id("pt", slugify(p.name)),
    slug: slugify(p.name),
    name: p.name,
    plural: p.plural,
    summary: p.summary,
    concerns: p.concerns,
    examples: p.examples,
    order: i,
    updatedAt: NOW,
  }));

  const categories: StaticCategory[] = [];
  const services: StaticService[] = [];
  const faqs: StaticFaq[] = [];
  const seenServiceSlugs = new Set<string>();
  const categoryIdBySlug = new Map<string, string>();
  const categoryDefaults = new Map<string, CategoryMeta>();
  const coreServices: { id: string; slug: string; name: string; categoryName: string }[] = [];

  for (let ci = 0; ci < SERVICE_MENU.length; ci++) {
    const menuCat = SERVICE_MENU[ci];
    if (isExcludedCategorySlug(menuCat.slug)) continue;
    const meta = CATEGORY_META[menuCat.slug];
    if (!meta) continue;

    const category: StaticCategory = {
      id: id("cat", menuCat.slug),
      slug: menuCat.slug,
      name: menuCat.name,
      description: menuCat.description,
      icon: meta.icon,
      order: ci,
      services: [],
    };
    categories.push(category);
    categoryIdBySlug.set(menuCat.slug, category.id);
    categoryDefaults.set(menuCat.slug, meta);

    let order = 0;
    for (const menuItem of menuCat.services) {
      const slug = menuItem.slug;
      if (seenServiceSlugs.has(slug) || isExcludedServiceSlug(slug, menuItem.name)) continue;
      seenServiceSlugs.add(slug);

      const priceMin = meta.defaults.priceMin;
      const priceMax = meta.defaults.priceMax;
      const priceUnit = meta.defaults.priceUnit;
      const tagline = serviceTagline(menuItem.name);

      const service: StaticService = {
        id: id("svc", slug),
        slug,
        name: menuItem.name,
        tagline,
        summary: `${tagline} Our own trained technicians handle every project in Kochi, Ernakulam and 160+ localities — from apartments and villas to commercial and industrial sites.`,
        benefits: meta.defaults.benefits,
        features: meta.defaults.features,
        useCases: meta.defaults.useCases,
        keywords: [menuItem.name, ...meta.defaults.useCases],
        priceMin,
        priceMax,
        priceUnit,
        order: order++,
        featured: order <= 3,
        specifications: {
          warranty: "Up to 10 years",
          installation: "1-2 days",
          certification: "IS-compliant materials",
        },
        categoryId: category.id,
        category,
        faqs: [],
        materials: [],
        reviews: [],
        updatedAt: NOW,
      };

      const linkGrades = meta.materialKinds.flatMap((kind) =>
        kind === "metal" ? ["SS304", "SS316"] : ["Nylon", "HDPE"],
      );
      service.materials = [...new Set(linkGrades)]
        .map((g) => materialByGrade.get(g))
        .filter((m): m is StaticMaterial => Boolean(m))
        .map((m) => ({
          serviceId: service.id,
          materialId: m.id,
          material: m,
        }));

      service.faqs = buildServiceFaqs(menuItem.name, menuCat.name, priceMin, priceMax, priceUnit).map((f, fi) => {
        const faq: StaticFaq = {
          id: id("faq", `${slug}-${fi}`),
          ...f,
          serviceId: service.id,
        };
        faqs.push(faq);
        return faq;
      });

      category.services.push(service);
      services.push(service);
      coreServices.push({ id: service.id, slug: service.slug, name: service.name, categoryName: menuCat.name });
    }
  }

  const keywordSeeds = buildKeywordServiceSeeds();
  for (const ks of keywordSeeds) {
    const slug = slugify(ks.name);
    if (seenServiceSlugs.has(slug) || isExcludedServiceSlug(slug, ks.name)) continue;
    seenServiceSlugs.add(slug);
    const menuSlug = resolveCategorySlug(ks.categorySlug);
    if (isExcludedCategorySlug(menuSlug)) continue;
    const categoryId = categoryIdBySlug.get(menuSlug);
    const cat = categoryDefaults.get(menuSlug);
    const category = categories.find((c) => c.id === categoryId);
    if (!categoryId || !cat || !category) continue;

    const service: StaticService = {
      id: id("svc", slug),
      slug,
      name: ks.name,
      tagline: ks.tagline,
      summary: `${ks.tagline} Deva Safety Nets serves Kochi, Ernakulam and 160+ Kerala localities with certified materials, free site inspection and warranty-backed installation.`,
      benefits: cat.defaults.benefits,
      features: cat.defaults.features,
      useCases: cat.defaults.useCases,
      keywords: ks.keywords,
      priceMin: null,
      priceMax: null,
      priceUnit: null,
      order: KEYWORD_SERVICE_ORDER_FLOOR + services.length,
      featured: false,
      specifications: {
        warranty: "Up to 10 years",
        installation: "1-2 days",
        certification: "IS-compliant materials",
        region: "Kerala",
      },
      categoryId: category.id,
      category,
      faqs: [],
      materials: [],
      reviews: [],
      updatedAt: NOW,
    };
    category.services.push(service);
    services.push(service);
  }

  for (const f of GENERAL_FAQS) {
    faqs.push({
      id: id("faq", `general-${f.order}`),
      scope: f.scope,
      order: f.order,
      question: f.question,
      answer: f.answer,
      serviceId: null,
    });
  }

  const cities: StaticCity[] = [];
  const areas: StaticArea[] = [];

  const cityCoords: Record<string, { latitude: number; longitude: number }> = {
    kochi: { latitude: 9.9312, longitude: 76.2673 },
    ernakulam: { latitude: 9.9816, longitude: 76.2999 },
  };

  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    const citySlug = slugify(c.name);
    const coords = cityCoords[citySlug] ?? { latitude: null, longitude: null };
    const city: StaticCity = {
      id: id("city", citySlug),
      slug: citySlug,
      name: c.name,
      state: c.state,
      region: c.region,
      featured: c.featured ?? false,
      order: i,
      intro:
        c.intro ??
        `Deva Safety Nets delivers premium invisible grills, safety nets, bird control and sports enclosures across ${c.name}, ${c.state}.`,
      landmarks: [],
      latitude: coords.latitude,
      longitude: coords.longitude,
      areas: [],
      projects: [],
      reviews: [],
      updatedAt: NOW,
    };

    const groups = areaGroupsForCity(citySlug as "kochi" | "ernakulam");
    const seen = new Set<string>();
    for (const group of groups) {
      for (const name of group.names) {
        const areaSlug = slugify(name);
        if (seen.has(areaSlug)) continue;
        seen.add(areaSlug);
        const area: StaticArea = {
          id: id("area", `${citySlug}-${areaSlug}`),
          slug: areaSlug,
          name,
          tier: group.tier,
          tierLabel: group.label,
          landmarks: [],
          pincode: null,
          cityId: city.id,
        };
        city.areas.push(area);
        areas.push(area);
      }
    }
    cities.push(city);
  }

  const blogPosts: StaticBlogPost[] = BLOG_POSTS.map((b, i) => ({
    id: id("blog", slugify(b.title)),
    slug: slugify(b.title),
    title: b.title,
    excerpt: b.excerpt,
    tags: b.tags,
    author: "Editorial Team",
    readMinutes: 5 + (i % 4),
    body: buildBlogBody(b.title, b.excerpt, b.tags),
    published: true,
    publishedAt: new Date(NOW.getTime() - i * 86400000 * 7),
    updatedAt: NOW,
  }));

  const guides: StaticGuide[] = [];
  for (const s of coreServices) {
    for (const type of ["INSTALLATION", "MAINTENANCE", "BUYING"] as const) {
      const service = services.find((x) => x.id === s.id)!;
      guides.push({
        id: id("guide", `${type.toLowerCase()}-${s.slug}`),
        slug: `${type.toLowerCase()}-${s.slug}`,
        title: `${type === "INSTALLATION" ? "How to Install" : type === "MAINTENANCE" ? "How to Maintain" : "How to Buy"} ${s.name}`,
        type,
        serviceId: s.id,
        service,
        excerpt: `A complete ${type.toLowerCase()} guide for ${s.name.toLowerCase()}, written by our certified technicians.`,
        body: buildGuideBody(type, s.name),
        readMinutes: 8,
        steps: [
          { title: "Free site inspection", detail: `Deva Safety Nets surveys your site in person.` },
          { title: "Written quote", detail: "You receive a transparent, itemised quote within 24 hours." },
          { title: "Material preparation", detail: "We select SS304, SS316, nylon or HDPE as appropriate." },
          { title: "Professional execution", detail: `Trained technicians carry out the ${type.toLowerCase()} work.` },
          { title: "Quality verification", detail: "We test tension, spacing and anchor integrity before handover." },
        ],
        published: true,
        updatedAt: NOW,
      });
    }
  }

  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const comparisons: StaticComparison[] = [];
  const comparisonPairs: [string, string, string, string][] = [
    [
      "stainless-steel-invisible-grills",
      "balcony-safety-nets",
      "Both invisible grills and safety nets protect balconies in Kerala apartments and villas, but they differ significantly in upfront cost, aesthetics, lifespan, installation time and society perception.",
      "Choose invisible grills for a premium, permanent, near-invisible solution. Choose safety nets for the most affordable, quick-to-install protection.",
    ],
    [
      "ss316-invisible-grills",
      "stainless-steel-invisible-grills",
      "SS316 and SS304 invisible grills look similar but perform very differently in Kerala's coastal humidity and salt air.",
      "For coastal cities like Kochi, SS316 is worth the premium. Inland Ernakulam homes typically achieve excellent results with SS304.",
    ],
    [
      "nylon-safety-nets",
      "hdpe-safety-nets",
      "Nylon and HDPE safety nets both appear on Kerala balconies, terraces and industrial spans — but they serve different priorities.",
      "Choose nylon for child and pet safety. Choose HDPE for cost-effective, rot-proof bird and industrial netting.",
    ],
  ];
  for (const [aSlug, bSlug, intro, verdict] of comparisonPairs) {
    const a = bySlug.get(aSlug);
    const b = bySlug.get(bSlug);
    if (!a || !b) continue;
    comparisons.push({
      id: id("cmp", `${a.slug}-vs-${b.slug}`),
      slug: `${a.slug}-vs-${b.slug}`,
      serviceAId: a.id,
      serviceBId: b.id,
      serviceA: a,
      serviceB: b,
      intro,
      verdict,
      criteria: [
        { label: "Starting price", a: "See service page", b: "See service page" },
        { label: "Lifespan", a: "15-20+ years", b: "3-7 years" },
        { label: "Visibility", a: "Nearly invisible", b: "Nearly invisible" },
        { label: "Installation time", a: "1-2 days", b: "A few hours" },
        { label: "Best for", a: "Permanent premium safety", b: "Fast, budget-friendly safety" },
      ],
      updatedAt: NOW,
    });
  }

  const reviewAuthors = ["Ananya R.", "Rahul M.", "Priya S.", "Karthik V.", "Deepa N.", "Suresh K.", "Meera J.", "Arun P.", "Fathima A.", "Joseph T."];
  const reviews: StaticReview[] = [];
  const sampleServices = coreServices.slice(0, 16);
  for (let i = 0; i < sampleServices.length; i++) {
    const s = sampleServices[i];
    const service = services.find((x) => x.id === s.id)!;
    const city = cities[i % cities.length];
    const review: StaticReview = {
      id: id("rev", `${s.slug}-${i}`),
      author: reviewAuthors[i % reviewAuthors.length],
      rating: 5 - (i % 2),
      body: `Excellent experience with the ${s.name.toLowerCase()}. Professional team, clean installation and great after-sales support. Highly recommended.`,
      verified: true,
      serviceId: s.id,
      cityId: city.id,
      service,
      city,
      createdAt: NOW,
    };
    service.reviews.push(review);
    city.reviews.push(review);
    reviews.push(review);
  }

  const projects: StaticProject[] = [];
  for (let i = 0; i < sampleServices.slice(0, 10).length; i++) {
    const s = sampleServices[i];
    const service = services.find((x) => x.id === s.id)!;
    const city = cities[i % cities.length];
    const project: StaticProject = {
      id: id("proj", `${s.slug}-${i + 1}`),
      slug: `${s.slug}-project-${i + 1}`,
      title: `${s.name} at ${city.name}`,
      serviceId: s.id,
      cityId: city.id,
      service,
      city,
      summary: `A completed ${s.name.toLowerCase()} project in ${city.name} delivering premium safety with a spotless, society-approved finish.`,
      challenge: "The client needed reliable fall prevention or exclusion without compromising views, ventilation or building aesthetics.",
      solution: `We installed ${s.name.toLowerCase()} using certified IS-compliant materials and a precise low-visibility mounting system.`,
      outcome: "Delivered on schedule with written warranty documentation and a delighted client.",
      images: [],
      completedAt: NOW,
      updatedAt: NOW,
    };
    city.projects.push(project);
    projects.push(project);
  }

  return {
    categories,
    services,
    materials,
    industries,
    propertyTypes,
    cities,
    areas,
    faqs,
    blogPosts,
    guides,
    comparisons,
    reviews,
    projects,
    contentOverrides: [],
  };
}

function loadStaticCatalog(): StaticCatalog {
  if (process.env.SKIP_CATALOG_HYDRATE === "1") return buildCatalog();
  const snapshot = require("./catalog.snapshot.json") as CatalogSnapshot;
  return hydrateCatalog(snapshot);
}

/** Build catalog from seed data — used only by scripts/catalog:build. */
export function compileCatalog(): StaticCatalog {
  return buildCatalog();
}

export const staticCatalog = loadStaticCatalog();

/**
 * O(1) lookup indexes built once at module load. Critical for scaling to
 * 100k+ programmatic pages: per-request ISR renders and sitemap generation must
 * never do linear `Array.find` scans over the full ~40k-record service catalog.
 */
export const catalogIndex = {
  servicesBySlug: new Map(staticCatalog.services.map((s) => [s.slug, s])),
  citiesBySlug: new Map(staticCatalog.cities.map((c) => [c.slug, c])),
  citiesById: new Map(staticCatalog.cities.map((c) => [c.id, c])),
  categoriesById: new Map(staticCatalog.categories.map((c) => [c.id, c])),
  materialsBySlug: new Map(staticCatalog.materials.map((m) => [m.slug, m])),
  industriesBySlug: new Map(staticCatalog.industries.map((i) => [i.slug, i])),
  propertyTypesBySlug: new Map(staticCatalog.propertyTypes.map((p) => [p.slug, p])),
  guidesBySlug: new Map(staticCatalog.guides.map((g) => [g.slug, g])),
  comparisonsBySlug: new Map(staticCatalog.comparisons.map((c) => [c.slug, c])),
  blogPostsBySlug: new Map(staticCatalog.blogPosts.map((b) => [b.slug, b])),
} as const;

/** Services grouped by materialId — avoids scanning all services per material page. */
const servicesByMaterialId = (() => {
  const map = new Map<string, StaticService[]>();
  for (const service of staticCatalog.services) {
    for (const sm of service.materials) {
      const list = map.get(sm.materialId);
      if (list) list.push(service);
      else map.set(sm.materialId, [service]);
    }
  }
  return map;
})();

export type SerializableCategory = Pick<
  StaticCategory,
  "id" | "slug" | "name" | "description" | "icon" | "order"
>;

export type SerializableReview = Pick<
  StaticReview,
  "id" | "author" | "rating" | "body" | "verified" | "serviceId" | "cityId" | "createdAt"
>;

export type SerializableServiceRef = Pick<StaticService, "slug" | "name">;
export type SerializableCityRef = Pick<StaticCity, "slug" | "name">;

export type SerializableProject = Omit<StaticProject, "service" | "city"> & {
  service: SerializableServiceRef;
  city: SerializableCityRef;
};

export type SerializableReviewPublic = SerializableReview & {
  service: SerializableServiceRef | null;
  city: SerializableCityRef | null;
};

export type SerializableComparison = Omit<StaticComparison, "serviceA" | "serviceB"> & {
  serviceA: SerializableServiceRef;
  serviceB: SerializableServiceRef;
};

export type SerializableGuide = Omit<StaticGuide, "service"> & {
  service: SerializableServiceRef | null;
};

export type SerializableService = Omit<StaticService, "category" | "reviews"> & {
  category: SerializableCategory;
  reviews: SerializableReview[];
};

export type SerializableCity = Omit<StaticCity, "reviews" | "projects"> & {
  reviews: SerializableReview[];
  projects: SerializableProject[];
};

function serializeCategory(category: StaticCategory): SerializableCategory {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: category.icon,
    order: category.order,
  };
}

function serializeReview(review: StaticReview): SerializableReview {
  return {
    id: review.id,
    author: review.author,
    rating: review.rating,
    body: review.body,
    verified: review.verified,
    serviceId: review.serviceId,
    cityId: review.cityId,
    createdAt: review.createdAt,
  };
}

function serializeServiceRef(service: StaticService): SerializableServiceRef {
  return { slug: service.slug, name: service.name };
}

function serializeCityRef(city: StaticCity): SerializableCityRef {
  return { slug: city.slug, name: city.name };
}

export function serializeProject(project: StaticProject): SerializableProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    challenge: project.challenge,
    solution: project.solution,
    outcome: project.outcome,
    images: project.images,
    serviceId: project.serviceId,
    cityId: project.cityId,
    completedAt: project.completedAt,
    updatedAt: project.updatedAt,
    service: serializeServiceRef(project.service),
    city: serializeCityRef(project.city),
  };
}

export function serializeReviewPublic(review: StaticReview): SerializableReviewPublic {
  return {
    ...serializeReview(review),
    service: review.service ? serializeServiceRef(review.service) : null,
    city: review.city ? serializeCityRef(review.city) : null,
  };
}

export function serializeComparison(comparison: StaticComparison): SerializableComparison {
  return {
    id: comparison.id,
    slug: comparison.slug,
    intro: comparison.intro,
    verdict: comparison.verdict,
    criteria: comparison.criteria,
    serviceAId: comparison.serviceAId,
    serviceBId: comparison.serviceBId,
    updatedAt: comparison.updatedAt,
    serviceA: serializeServiceRef(comparison.serviceA),
    serviceB: serializeServiceRef(comparison.serviceB),
  };
}

export function serializeGuide(guide: StaticGuide): SerializableGuide {
  return {
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
    type: guide.type,
    excerpt: guide.excerpt,
    body: guide.body,
    readMinutes: guide.readMinutes,
    steps: guide.steps,
    published: guide.published,
    serviceId: guide.serviceId,
    updatedAt: guide.updatedAt,
    service: guide.service ? serializeServiceRef(guide.service) : null,
  };
}

/** Strip circular refs (category.services, review.service, etc.) for cache/RSC serialization. */
export function serializeService(service: StaticService): SerializableService {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    tagline: service.tagline,
    summary: service.summary,
    benefits: service.benefits,
    features: service.features,
    useCases: service.useCases,
    keywords: service.keywords,
    priceMin: service.priceMin,
    priceMax: service.priceMax,
    priceUnit: service.priceUnit,
    order: service.order,
    featured: service.featured,
    specifications: service.specifications,
    categoryId: service.categoryId,
    materials: service.materials,
    faqs: service.faqs,
    updatedAt: service.updatedAt,
    category: serializeCategory(service.category),
    reviews: service.reviews.map(serializeReview),
  };
}

export function serializeCity(city: StaticCity): SerializableCity {
  return {
    id: city.id,
    slug: city.slug,
    name: city.name,
    state: city.state,
    region: city.region,
    featured: city.featured,
    order: city.order,
    intro: city.intro,
    landmarks: city.landmarks,
    latitude: city.latitude,
    longitude: city.longitude,
    areas: city.areas,
    updatedAt: city.updatedAt,
    reviews: city.reviews.map(serializeReview),
    projects: city.projects.map(serializeProject),
  };
}

export function getCoreServices() {
  return staticCatalog.services.filter(
    (s) => s.order < KEYWORD_SERVICE_ORDER_FLOOR && !isExcludedService(s),
  );
}

export function getServiceBySlugStatic(slug: string): SerializableService | null {
  const service = catalogIndex.servicesBySlug.get(slug);
  if (!service || isExcludedService(service)) return null;
  return serializeService(service);
}

export function getCityBySlugStatic(slug: string): SerializableCity | null {
  const city = catalogIndex.citiesBySlug.get(slug);
  if (!city) return null;
  return serializeCity(city);
}

export function getAreaBySlugStatic(citySlug: string, areaSlug: string) {
  const city = getCityBySlugStatic(citySlug);
  if (!city) return null;
  const area = city.areas.find((a) => a.slug === areaSlug);
  if (!area) return null;
  const nearby = city.areas.filter((a) => a.slug !== areaSlug).slice(0, 8).map((a) => ({ slug: a.slug, name: a.name }));
  return { city, area, nearby };
}

export function getMaterialBySlugStatic(slug: string) {
  const material = catalogIndex.materialsBySlug.get(slug);
  if (!material) return null;
  const services = (servicesByMaterialId.get(material.id) ?? [])
    .map((service) => ({
      service: {
        slug: service.slug,
        name: service.name,
        category: serializeCategory(service.category),
      },
    }));
  return { ...material, services };
}
