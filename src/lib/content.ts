/**
 * High-intent page copy — curated facts for Deva Safety Nets (Kerala).
 * No long randomized “AI essay” sections. Same facts everywhere; location
 * lines only add place name + coastal/society context where relevant.
 */

export type LocationContext = {
  cityName?: string;
  state?: string;
  region?: string | null;
  areaName?: string;
  landmarks?: string[];
  propertyType?: string;
  propertyTypePlural?: string;
};

export type PricingFactor = { factor: string; detail: string };
export type GuideSection = { heading: string; paragraphs: string[] };
export type GeneratedQA = { question: string; answer: string };

export type GeneratedContent = {
  heading: string;
  intro: string;
  introParagraphs: string[];
  localInfo: string;
  whyMatters: string;
  localChallenges: string;
  benefitsIntro: string;
  ctaLine: string;
  whyLocal: string;
  keyTakeaways: string[];
  safetyStandards: string[];
  pricingFactors: PricingFactor[];
  buyingConsiderations: string[];
  maintenanceTips: string[];
  guideSections: GuideSection[];
  generatedFaqs: GeneratedQA[];
};

const SAFETY_STANDARDS = [
  "IS-compliant nylon / HDPE mesh or SS304 / SS316 cable as specified for the job",
  "Site-measured spans — no guesswork quotes",
  "Anchors and fixings matched to wall type (concrete, AAC, metal)",
  "Tension and spacing checked before handover",
  "Written warranty terms shared at completion",
  "Own trained technicians — not outsourced crews",
];

const PRICING_FACTORS: PricingFactor[] = [
  {
    factor: "Measured opening size",
    detail: "Price follows on-site length × height — you only pay for the area we protect.",
  },
  {
    factor: "Material grade",
    detail: "SS304 for most Kochi inland homes; SS316 recommended for salt-air / Fort Kochi / Vypin zones.",
  },
  {
    factor: "Access & floor height",
    detail: "High-rise work may need extra access time; we flag this at survey, not after.",
  },
  {
    factor: "Finish & society rules",
    detail: "RWA-approved colours and fixing methods where apartments require uniform façades.",
  },
];

const BUYING_CHECKS = [
  "Ask for a free site survey with measurements — not a phone-only quote",
  "Confirm material grade in writing (SS304 vs SS316, nylon vs HDPE)",
  "Check warranty length and what it covers (cables, nets, workmanship)",
  "Prefer installers who use their own technicians in Kochi / Ernakulam",
  "Share society guidelines early so finish and colour get approved once",
];

const MAINTENANCE = [
  "Rinse salt spray and dust with fresh water every few months on coastal balconies",
  "After heavy monsoon, check corner anchors and cable / mesh tension",
  "Do not hang heavy objects on invisible grill cables",
  "Call for a paid inspection if you see rust, sagging or loose clips",
  "Keep drainage clear so water does not pool at sill fixings",
];

const TAKEAWAYS = [
  "Free site survey across Kochi, Ernakulam and nearby Kerala localities",
  "Itemised quote within 24 hours — no hidden add-ons at install",
  "Materials chosen for Kerala humidity and coastal exposure",
  "Install typically completes in 1–2 days for a standard balcony",
  "Up to 10-year warranty on eligible systems — terms in writing",
  "After-sales support from the same local team",
];

function placeLabel(loc: LocationContext): string {
  if (loc.areaName && loc.cityName) return `${loc.areaName}, ${loc.cityName}`;
  if (loc.cityName) return loc.cityName;
  return "Kerala";
}

function isCoastalHint(loc: LocationContext): boolean {
  const hay = `${loc.areaName ?? ""} ${loc.cityName ?? ""} ${loc.region ?? ""}`.toLowerCase();
  return /fort kochi|vypin|marine|coast|beach|willingdon|mattancherry|ernakulam|kochi/.test(hay);
}

/** Keep list order stable per route without inventing new sentences. */
export function varyList<T>(items: T[], _routeKey: string): T[] {
  return items;
}

/**
 * Build short, high-intent copy for service and location pages.
 * Prefer curated lists + service summary over long generated essays.
 */
export function generateContent(
  serviceName: string,
  _routeKey: string,
  loc: LocationContext = {},
): GeneratedContent {
  const place = placeLabel(loc);
  const state = loc.state ?? "Kerala";
  const service = serviceName.toLowerCase();
  const coastal = isCoastalHint(loc);

  const heading = loc.areaName
    ? `${serviceName} in ${loc.areaName}, ${loc.cityName}`
    : loc.cityName
      ? `${serviceName} in ${loc.cityName}`
      : loc.propertyTypePlural
        ? `${serviceName} for ${loc.propertyTypePlural}`
        : serviceName;

  const intro = loc.cityName
    ? `Need ${service} in ${place}? Deva Safety Nets provides free site survey, clear pricing and warranty-backed installation across ${state}.`
    : `Need ${service} in Kerala? Deva Safety Nets provides free site survey, clear pricing and warranty-backed installation in Kochi, Ernakulam and 160+ localities.`;

  const localInfo = loc.areaName
    ? `We install ${service} for homes and businesses in ${loc.areaName} (${loc.cityName}). Local technicians measure on site, recommend the right material for your building, and finish to a clean, society-friendly standard.`
    : loc.cityName
      ? `Our ${loc.cityName} team handles apartments, villas and commercial sites across the city and nearby localities. ${
          coastal
            ? "For salt-air and high-humidity zones we often recommend SS316 or UV-stabilised nets."
            : "Specs are matched to floor height, wall type and RWA rules where they apply."
        }`
      : `We cover Kochi, Ernakulam and surrounding Kerala localities with our own survey and install teams — not call-centre subcontractors.`;

  const whyMatters = `In ${place}, ${service} protects children, pets and guests from falls and keeps balconies usable without blocking light or views when the right system is specified.`;

  const localChallenges = coastal
    ? `Coastal and humid Kerala weather accelerates corrosion if the wrong grade is used. We specify materials for exposure, then tension and check the system before handover.`
    : `High-rise wind load, society finish rules and monsoon moisture all affect the right design. We resolve these on the free survey so the quote matches what gets installed.`;

  const generatedFaqs: GeneratedQA[] = [
    {
      question: `Do you install ${service} in ${place}?`,
      answer: `Yes. Deva Safety Nets surveys and installs ${service} in ${place}, ${state}. Book a free site inspection — we measure, quote and schedule with our own technicians.`,
    },
    {
      question: `How much does ${service} cost in ${place}?`,
      answer: `Pricing depends on measured size, material grade and access. After a free survey in ${place} you get an itemised quote within 24 hours — no pressure to buy.`,
    },
    {
      question: `How long does installation take?`,
      answer: `Most balcony or window jobs in ${place} finish in 1–2 days after materials are confirmed. Larger commercial spans are planned in phases.`,
    },
    {
      question: `Is there a warranty?`,
      answer: `Eligible systems include written warranty terms (up to 10 years depending on product). We explain coverage at handover.`,
    },
  ];

  return {
    heading,
    intro,
    introParagraphs: [intro, localInfo],
    localInfo,
    whyMatters,
    localChallenges,
    benefitsIntro: `Why customers choose our ${service}:`,
    ctaLine: `Book a free site survey for ${service} in ${place} — call or WhatsApp Deva Safety Nets today.`,
    whyLocal: `Local Kerala team, transparent quotes and warranty-backed work across Kochi and Ernakulam.`,
    keyTakeaways: TAKEAWAYS,
    safetyStandards: SAFETY_STANDARDS,
    pricingFactors: PRICING_FACTORS,
    buyingConsiderations: BUYING_CHECKS,
    maintenanceTips: MAINTENANCE,
    // No long AI “complete guide” — keep empty so pages stay high-intent
    guideSections: [],
    generatedFaqs,
  };
}
