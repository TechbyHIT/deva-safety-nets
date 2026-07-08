/**
 * Reusable Kochi & Ernakulam location hierarchy for programmatic SEO.
 * Areas are owned by one city (canonical URL); both city pages list the full district.
 */

export const KERALA_CITY_SLUGS = ["kochi", "ernakulam"] as const;
export type KeralaCitySlug = (typeof KERALA_CITY_SLUGS)[number];

export type KeralaAreaGroupDef = {
  tier: number;
  label: string;
  /** City slug used in /locations/{city}/{area} URLs for areas in this group. */
  ownerCitySlug: KeralaCitySlug;
  names: string[];
};

export const TIER_LABELS: Record<number, string> = {
  1: "Primary Cities",
  2: "Municipalities & Major Towns",
  3: "Major Kochi Localities",
  4: "Kakkanad & IT Corridor",
  5: "Vypin Islands",
  6: "Residential & Developing Areas",
  7: "Airport Region",
};

/** Tier 1 — primary city hubs (not stored as Area rows). */
export const KERALA_PRIMARY_CITIES = [
  { name: "Kochi", slug: "kochi" as const },
  { name: "Ernakulam", slug: "ernakulam" as const },
];

/** Tiers 2–7 — all programmatic area pages. */
export const KERALA_AREA_GROUPS: KeralaAreaGroupDef[] = [
  {
    tier: 2,
    label: TIER_LABELS[2],
    ownerCitySlug: "ernakulam",
    names: [
      "Aluva",
      "Angamaly",
      "Kalamassery",
      "Kakkanad",
      "Thrikkakara",
      "Tripunithura",
      "Maradu",
      "Perumbavoor",
      "Muvattupuzha",
      "North Paravur",
      "Piravom",
      "Kolenchery",
      "Varapuzha",
      "Eloor",
      "Chengamanad",
      "Kalady",
      "Kizhakkambalam",
      "Mulanthuruthy",
      "Chottanikkara",
      "Nedumbassery",
    ],
  },
  {
    tier: 3,
    label: TIER_LABELS[3],
    ownerCitySlug: "kochi",
    names: [
      "Edappally",
      "Vyttila",
      "Kadavanthra",
      "Panampilly Nagar",
      "Kaloor",
      "Palarivattom",
      "Vennala",
      "Elamakkara",
      "Pachalam",
      "Thevara",
      "Ravipuram",
      "Marine Drive",
      "MG Road",
      "Broadway",
      "Fort Kochi",
      "Mattancherry",
      "Palluruthy",
      "Thoppumpady",
      "Willingdon Island",
      "Mulavukad",
      "Vallarpadam",
      "Bolgatty",
      "Edakochi",
      "Nettoor",
      "Kundannoor",
      "Ponnurunni",
      "Chilavannoor",
      "Giri Nagar",
      "Kathrikadavu",
      "Mamangalam",
      "Pullepady",
      "Kacheripady",
      "Ayyappankavu",
      "Chittoor",
      "Vaduthala",
      "Cheranallur",
    ],
  },
  {
    tier: 4,
    label: TIER_LABELS[4],
    ownerCitySlug: "kochi",
    names: [
      "Infopark",
      "SmartCity",
      "Civil Station",
      "Seaport-Airport Road",
      "Padamugal",
      "Chembumukku",
      "Vazhakkala",
      "NGO Quarters",
      "Chittethukara",
      "Thengod",
      "Alinchuvadu",
      "Pukkattupady",
      "Kakkanad Junction",
      "CUSAT",
      "HMT Colony",
    ],
  },
  {
    tier: 5,
    label: TIER_LABELS[5],
    ownerCitySlug: "kochi",
    names: ["Vypin", "Njarackal", "Cherai", "Kuzhuppilly", "Pallippuram", "Edavanakkad", "Munambam", "Puthuvype"],
  },
  {
    tier: 6,
    label: TIER_LABELS[6],
    ownerCitySlug: "kochi",
    names: [
      "Eroor",
      "Irumpanam",
      "Chambakkara",
      "Thiruvankulam",
      "Udayamperoor",
      "Kureekkad",
      "Amballoor",
      "Vadavucode",
      "Kandanad",
      "Karingachira",
      "Kadamakkudy",
      "Pizhala",
      "Kothad",
      "Kumbalam",
      "Kumbalangi",
      "Chellanam",
      "Aroor",
    ],
  },
  {
    tier: 7,
    label: TIER_LABELS[7],
    ownerCitySlug: "kochi",
    names: ["Cochin International Airport", "Athani", "Desom", "Chowara", "UC College", "Malayattoor"],
  },
];

/** SEO intent modifiers woven into titles, meta keywords and on-page copy. */
export { LOCATION_PAGE_INTENTS as LOCATION_SEO_INTENTS } from "./seo-intents";

export function buildLocationKeywordList(placeName: string, service = "invisible grills and safety nets"): string[] {
  const p = placeName;
  return [
    `${service} in ${p}`,
    `${service} near me ${p}`,
    `best ${service} in ${p}`,
    `best ${service} near me ${p}`,
    `top ${service} Kerala`,
    `high quality #1 ${service} Kerala`,
    `best ${service} Kerala`,
    `premium ${service} in ${p}`,
    `${service} for ${p}`,
    `invisible grills in ${p}`,
    `safety nets in ${p}`,
    `invisible grills near me ${p}`,
    `best safety nets near me ${p}`,
    `top safety nets Kerala`,
    `high quality safety nets #1 Kerala`,
    `best safety nets ${p}`,
    `premium invisible grills ${p}`,
  ];
}

export function areaGroupsForCity(citySlug: KeralaCitySlug): KeralaAreaGroupDef[] {
  return KERALA_AREA_GROUPS.filter((g) => g.ownerCitySlug === citySlug);
}
