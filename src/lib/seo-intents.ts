/** Priority local SEO intents — best near me, top Kerala, high quality #1, etc. */

export type SeoIntentLink = { slug: string; name: string; label: string };

export const LOCATION_PAGE_INTENTS = [
  {
    key: "in",
    format: (service: string, place: string) => `${service} in ${place}`,
  },
  {
    key: "near-me",
    format: (service: string, place: string) => `${service} near me ${place}`,
  },
  {
    key: "best",
    format: (service: string, place: string) => `Best ${service} in ${place}`,
  },
  {
    key: "best-near-me",
    format: (service: string, place: string) => `Best ${service} near me ${place}`,
  },
  {
    key: "top-kerala",
    format: (service: string) => `Top ${service} Kerala`,
  },
  {
    key: "high-quality-1",
    format: (service: string) => `High Quality #1 ${service} Kerala`,
  },
  {
    key: "best-kerala",
    format: (service: string) => `Best ${service} Kerala`,
  },
  {
    key: "premium",
    format: (service: string, place: string) => `Premium ${service} in ${place}`,
  },
] as const;

/** Score keyword service slugs for priority intent phrases. */
export function scoreIntentKeyword(slug: string, name: string): number {
  const text = `${slug} ${name}`.toLowerCase();
  let score = 0;
  if (/best/.test(text) && /near/.test(text) && /me/.test(text)) score += 40;
  if (/top/.test(text) && /kerala/.test(text)) score += 36;
  if (/high.?quality/.test(text) && /kerala/.test(text)) score += 34;
  if (/#1|number-1|no-1|1-kerala/.test(text)) score += 32;
  if (/best/.test(text) && /kerala/.test(text)) score += 30;
  if (/best/.test(text) && /safety.?net/.test(text)) score += 14;
  if (/top/.test(text) && /safety.?net/.test(text)) score += 12;
  if (/best/.test(text)) score += 10;
  if (/near/.test(text) && /me/.test(text)) score += 10;
  if (/top/.test(text)) score += 8;
  if (/high.?quality/.test(text)) score += 8;
  if (/kerala/.test(text)) score += 4;
  return score;
}

export function matchesIntentPattern(slug: string, name: string, pattern: string): number {
  const text = `${slug} ${name}`.toLowerCase();
  switch (pattern) {
    case "best-near-me":
      return /best/.test(text) && /near/.test(text) && /me/.test(text) ? 1 : 0;
    case "top-kerala":
      return /top/.test(text) && /kerala/.test(text) ? 1 : 0;
    case "high-quality-1":
      return (/high.?quality/.test(text) && /kerala/.test(text)) || /#1|number-1|no-1/.test(text) ? 1 : 0;
    case "best-kerala":
      return /best/.test(text) && /kerala/.test(text) ? 1 : 0;
    default:
      return 0;
  }
}

/** Meta keyword bundle for every Kerala page. */
export function buildGlobalSeoKeywords(topic = "safety nets and invisible grills"): string[] {
  return [
    `best ${topic} near me`,
    `best ${topic} near me kerala`,
    `top ${topic} kerala`,
    `high quality ${topic} #1 kerala`,
    `best ${topic} kerala`,
    `#1 ${topic} kerala`,
    `premium ${topic} kerala`,
    `${topic} near me`,
    `${topic} kochi`,
    `${topic} ernakulam`,
    "best safety nets kerala",
    "top safety nets kerala",
    "high quality safety nets #1 kerala",
    "best invisible grills kerala",
    "top invisible grills kerala",
    "best safety nets near me",
    "best invisible grills near me",
  ];
}
