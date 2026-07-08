/**
 * Programmatic SEO keyword catalog for Deva Safety Nets (Kerala).
 * Generates service records for long-tail search phrases (invisible grills,
 * safety nets, cloth hangers, sports nets, bird spikes) combined with
 * intent modifiers and use-case suffixes — each maps to /services/[slug]/[city]/[area].
 */

export type KeywordServiceSeed = {
  name: string;
  categorySlug: string;
  phrase: string;
  tagline: string;
  keywords: string[];
};

const MODIFIERS = [
  "price",
  "cost",
  "rate",
  "charges",
  "price list",
  "cost per square feet",
  "per sq ft price",
  "installation cost",
  "installation",
  "installers",
  "installer",
  "service",
  "services",
  "company",
  "companies",
  "contractor",
  "contractors",
  "dealer",
  "dealers",
  "supplier",
  "suppliers",
  "manufacturer",
  "manufacturers",
  "shop",
  "store",
  "online",
  "best",
  "top",
  "best near me",
  "best kerala",
  "top kerala",
  "#1",
  "#1 kerala",
  "high quality kerala",
  "premium",
  "affordable",
  "low cost",
  "cheap",
  "high quality",
  "durable",
  "strong",
  "safe",
  "custom",
  "customized",
  "repair",
  "maintenance",
  "replacement",
  "fitting",
  "fixing",
  "setup",
  "material",
  "accessories",
  "design",
  "designs",
  "ideas",
  "solution",
  "solutions",
  "booking",
  "quote",
  "estimate",
  "near me",
  "nearby",
  "in kochi",
  "in ernakulam",
  "in kerala",
] as const;

const USE_CASES = [
  "for home",
  "for house",
  "for apartment",
  "for apartments",
  "for flats",
  "for balcony",
  "for balconies",
  "for window",
  "for windows",
  "for terrace",
  "for building",
  "for villa",
  "for high rise",
  "for high rise building",
  "for kids safety",
  "for child safety",
  "for baby safety",
  "for pets",
  "for cats",
  "for dogs",
  "for pigeon protection",
  "for bird protection",
  "for fall protection",
  "without drilling",
  "anti rust",
  "stainless steel",
  "nylon",
  "hdpe",
  "with installation",
  "professional installation",
  "commercial",
  "residential",
  "home installation",
  "apartment installation",
] as const;

const PRIORITY_SEO_PHRASES: { phrase: string; category: string }[] = [
  { phrase: "best safety nets near me kerala", category: "safety-nets" },
  { phrase: "top safety nets kerala", category: "safety-nets" },
  { phrase: "high quality safety nets #1 kerala", category: "safety-nets" },
  { phrase: "best safety nets kerala", category: "safety-nets" },
  { phrase: "best invisible grills near me kerala", category: "invisible-grills" },
  { phrase: "top invisible grills kerala", category: "invisible-grills" },
  { phrase: "high quality invisible grills #1 kerala", category: "invisible-grills" },
  { phrase: "best invisible grills kerala", category: "invisible-grills" },
  { phrase: "best balcony safety nets near me kerala", category: "safety-nets" },
  { phrase: "top cricket nets kerala", category: "sports-nets" },
  { phrase: "best cloth hangers near me kerala", category: "cloth-hangers" },
  { phrase: "high quality bird spikes #1 kerala", category: "bird-spikes" },
];

/** Standard bases — modifiers + use cases, no nested modifier×use-case combos. */
const STANDARD_BASES: { phrase: string; category: string }[] = [
  { phrase: "invisible grills", category: "invisible-grills" },
  { phrase: "invisible grill", category: "invisible-grills" },
  { phrase: "transparent grill", category: "invisible-grills" },
  { phrase: "transparent balcony grill", category: "invisible-grills" },
  { phrase: "transparent window grill", category: "invisible-grills" },
  { phrase: "balcony safety grill", category: "invisible-grills" },
  { phrase: "window safety grill", category: "invisible-grills" },
  { phrase: "modern balcony grill", category: "invisible-grills" },
  { phrase: "modern window grill", category: "invisible-grills" },
  { phrase: "balcony grill design", category: "invisible-grills" },
  { phrase: "window grill design", category: "invisible-grills" },
  { phrase: "invisible grill design", category: "invisible-grills" },
  { phrase: "invisible grill designs", category: "invisible-grills" },
  { phrase: "stainless steel invisible grill", category: "invisible-grills" },
  { phrase: "ss invisible grill", category: "invisible-grills" },
  { phrase: "316 stainless steel invisible grill", category: "invisible-grills" },
  { phrase: "316 ss invisible grill", category: "invisible-grills" },
  { phrase: "invisible grill wire", category: "invisible-grills" },
  { phrase: "invisible grill cable", category: "invisible-grills" },
  { phrase: "safety nets", category: "safety-nets" },
  { phrase: "safety net", category: "safety-nets" },
  { phrase: "balcony safety net", category: "safety-nets" },
  { phrase: "safety net for balcony", category: "safety-nets" },
  { phrase: "window safety net", category: "safety-nets" },
  { phrase: "terrace safety net", category: "safety-nets" },
  { phrase: "duct area safety net", category: "safety-nets" },
  { phrase: "staircase safety net", category: "safety-nets" },
  { phrase: "kids safety net", category: "safety-nets" },
  { phrase: "child safety net", category: "safety-nets" },
  { phrase: "children safety net", category: "safety-nets" },
  { phrase: "baby safety net", category: "safety-nets" },
  { phrase: "pet safety net", category: "safety-nets" },
  { phrase: "balcony nets", category: "safety-nets" },
  { phrase: "balcony net", category: "safety-nets" },
  { phrase: "balcony safety nets", category: "safety-nets" },
  { phrase: "cloth hanger", category: "cloth-hangers" },
  { phrase: "cloth hangers", category: "cloth-hangers" },
  { phrase: "clothes hanger", category: "cloth-hangers" },
  { phrase: "clothes hangers", category: "cloth-hangers" },
  { phrase: "cloth drying hanger", category: "cloth-hangers" },
  { phrase: "clothes drying hanger", category: "cloth-hangers" },
  { phrase: "ceiling cloth hanger", category: "cloth-hangers" },
  { phrase: "ceiling cloth hangers", category: "cloth-hangers" },
  { phrase: "balcony cloth hanger", category: "cloth-hangers" },
  { phrase: "sports nets", category: "sports-nets" },
  { phrase: "sports net", category: "sports-nets" },
  { phrase: "sports netting", category: "sports-nets" },
  { phrase: "cricket net", category: "sports-nets" },
  { phrase: "cricket nets", category: "sports-nets" },
  { phrase: "cricket practice net", category: "sports-nets" },
  { phrase: "cricket practice nets", category: "sports-nets" },
  { phrase: "cricket net for practice", category: "sports-nets" },
  { phrase: "bird spikes", category: "bird-spikes" },
  { phrase: "pigeon spikes", category: "bird-spikes" },
  { phrase: "anti bird spikes", category: "bird-spikes" },
  { phrase: "anti pigeon spikes", category: "bird-spikes" },
  { phrase: "bird control spikes", category: "bird-spikes" },
  { phrase: "pigeon control spikes", category: "bird-spikes" },
  { phrase: "bird repellent spikes", category: "bird-spikes" },
];

/** Nested bases — full modifier × use-case matrix (balcony/window grill variants). */
const NESTED_BASES: { phrase: string; category: string }[] = [
  { phrase: "invisible grill for balcony", category: "invisible-grills" },
  { phrase: "balcony invisible grill", category: "invisible-grills" },
  { phrase: "invisible balcony grill", category: "invisible-grills" },
  { phrase: "invisible grill for window", category: "invisible-grills" },
  { phrase: "window invisible grill", category: "invisible-grills" },
  { phrase: "invisible window grill", category: "invisible-grills" },
  { phrase: "balcony net for child safety", category: "safety-nets" },
  { phrase: "balcony net for kids safety", category: "safety-nets" },
  { phrase: "balcony net for pets", category: "safety-nets" },
  { phrase: "balcony net for cats", category: "safety-nets" },
  { phrase: "balcony net for dogs", category: "safety-nets" },
  { phrase: "balcony net for pigeons", category: "safety-nets" },
  { phrase: "balcony bird net", category: "safety-nets" },
];

const KERALA_LOCAL = ["Kerala", "Kochi", "Ernakulam"];

/** Major areas for keyword enrichment (subset — full list on location pages). */
const KERALA_AREA_SAMPLES = [
  "Edappally",
  "Kakkanad",
  "Vyttila",
  "Aluva",
  "Tripunithura",
  "Infopark",
  "Fort Kochi",
  "Kalamassery",
  "Angamaly",
  "Marine Drive",
];

function toServiceName(phrase: string): string {
  const small = new Set(["for", "and", "or", "the", "a", "an", "in", "on", "at", "to", "of", "per"]);
  return phrase
    .split(" ")
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i > 0 && small.has(lower)) return lower;
      if (lower === "ss" || lower === "316") return w.toUpperCase();
      if (lower === "hdpe") return "HDPE";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function buildTagline(phrase: string, name: string): string {
  const p = phrase.toLowerCase();
  if (/price|cost|rate|charges|price list|per sq ft|square feet|cheap|affordable|low cost/.test(p)) {
    return `Free site survey and transparent quote for ${name.toLowerCase()} across Kerala — Kochi, Ernakulam and 160+ localities. No hidden charges.`;
  }
  if (/installation|installer|installers|fitting|setup|professional installation|home installation|apartment installation/.test(p)) {
    return `Certified ${name.toLowerCase()} by trained Deva Safety Nets technicians — warranty-backed installation across Kerala.`;
  }
  if (/repair|maintenance|replacement|fixing/.test(p)) {
    return `Expert ${name.toLowerCase()} in Kerala — re-tensioning, genuine parts and long-term support from Deva Safety Nets.`;
  }
  if (/quote|estimate|booking/.test(p)) {
    return `Book a free inspection for ${name.toLowerCase()} in Kerala — itemised quote within 24 hours from Deva Safety Nets.`;
  }
  if (/best|top|premium|high quality|durable|strong|safe/.test(p)) {
    return `Premium ${name.toLowerCase()} with IS-compliant materials — trusted across Kochi, Ernakulam and Kerala since 2014.`;
  }
  return `${name} by Deva Safety Nets — Kerala-wide service, free survey and warranty-backed installation.`;
}

function buildKeywords(phrase: string, name: string): string[] {
  const set = new Set<string>([phrase, name, name.toLowerCase()]);
  for (const loc of KERALA_LOCAL) {
    set.add(`${phrase} ${loc.toLowerCase()}`);
    set.add(`${phrase} in ${loc.toLowerCase()}`);
    set.add(`${name} ${loc}`);
    set.add(`best ${phrase} ${loc.toLowerCase()}`);
    set.add(`premium ${phrase} ${loc.toLowerCase()}`);
  }
  for (const area of KERALA_AREA_SAMPLES) {
    set.add(`${phrase} in ${area.toLowerCase()}`);
    set.add(`${phrase} near me ${area.toLowerCase()}`);
    set.add(`best ${phrase} ${area.toLowerCase()}`);
  }
  set.add(`${phrase} near me`);
  set.add(`${phrase} kerala`);
  set.add(`best ${phrase}`);
  set.add(`best ${phrase} near me`);
  set.add(`best ${phrase} near me kerala`);
  set.add(`top ${phrase} kerala`);
  set.add(`high quality ${phrase} #1 kerala`);
  set.add(`#1 ${phrase} kerala`);
  set.add(`best ${phrase} kerala`);
  set.add(`premium ${phrase}`);
  return [...set];
}

function expandBase(phrase: string, nested: boolean): string[] {
  const out = new Set<string>();
  out.add(phrase);
  for (const m of MODIFIERS) out.add(`${phrase} ${m}`);
  for (const u of USE_CASES) out.add(`${phrase} ${u}`);
  if (nested) {
    for (const m of MODIFIERS) {
      for (const u of USE_CASES) out.add(`${phrase} ${m} ${u}`);
    }
  }
  return [...out];
}

/** All unique keyword phrases → service seed definitions (deduped by normalized phrase). */
export function buildKeywordServiceSeeds(): KeywordServiceSeed[] {
  const seen = new Set<string>();
  const seeds: KeywordServiceSeed[] = [];

  const addPhrase = (phrase: string, categorySlug: string) => {
    const normalized = phrase.trim().toLowerCase().replace(/\s+/g, " ");
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);

    const name = toServiceName(normalized);
    seeds.push({
      name,
      categorySlug,
      phrase: normalized,
      tagline: buildTagline(normalized, name),
      keywords: buildKeywords(normalized, name),
    });
  };

  for (const { phrase, category } of PRIORITY_SEO_PHRASES) {
    addPhrase(phrase, category);
  }

  for (const { phrase, category } of STANDARD_BASES) {
    for (const expanded of expandBase(phrase, false)) addPhrase(expanded, category);
  }
  for (const { phrase, category } of NESTED_BASES) {
    for (const expanded of expandBase(phrase, true)) addPhrase(expanded, category);
  }

  return seeds;
}

/** Count for logging / capacity reports without building full array twice. */
export function countKeywordPhrases(): number {
  return buildKeywordServiceSeeds().length;
}
