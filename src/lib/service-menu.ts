import { slugify } from "./static-data/seed-data";

export type ServiceMenuItem = { name: string; slug: string };

export type ServiceMenuCategory = {
  name: string;
  slug: string;
  description: string;
  services: ServiceMenuItem[];
};

function item(name: string, slug?: string): ServiceMenuItem {
  return { name, slug: slug ?? slugify(name) };
}

/** Canonical site menu — matches approved Services hierarchy. */
export const SERVICE_MENU: ServiceMenuCategory[] = [
  {
    name: "Invisible Grills",
    slug: "invisible-grills",
    description:
      "Nearly invisible stainless steel cable grills for balconies, windows and open edges — unobstructed views with certified child and pet safety.",
    services: [
      item("Balcony Invisible Grills"),
      item("Window Invisible Grills"),
      item("SS Invisible Grills"),
      item("Stainless Steel Invisible Grills"),
      item("Invisible Grills for Apartments"),
      item("Invisible Grills for Villas"),
      item("Invisible Grills for High Rise Buildings"),
      item("Invisible Grills for Kids Safety"),
      item("Invisible Grills for Pets Safety"),
      item("Invisible Grill Installation"),
      item("Invisible Grill Repair"),
      item("Invisible Grill Replacement"),
    ],
  },
  {
    name: "Safety Nets",
    slug: "safety-nets",
    description:
      "Certified nylon and HDPE safety nets for balconies, windows, terraces and open areas — fast installation across Kochi and Ernakulam.",
    services: [
      item("Balcony Safety Nets"),
      item("Window Safety Nets"),
      item("Children Safety Nets"),
      item("Kids Safety Nets"),
      item("Pet Safety Nets"),
      item("Terrace Safety Nets"),
      item("Duct Area Safety Nets"),
      item("Staircase Safety Nets"),
      item("Open Area Safety Nets"),
      item("Apartment Safety Nets"),
      item("Building Safety Nets"),
      item("High Rise Safety Nets"),
      item("Home Safety Nets"),
      item("Villa Safety Nets"),
      item("Flat Safety Nets"),
      item("Construction Safety Nets"),
      item("Industrial Safety Nets"),
      item("Swimming Pool Safety Nets"),
      item("Car Parking Safety Nets"),
      item("Monkey Safety Nets"),
    ],
  },
  {
    name: "Bird Protection",
    slug: "bird-protection",
    description:
      "Humane pigeon and bird exclusion — nets, spikes and control services for balconies, windows, ducts and terraces.",
    services: [
      item("Pigeon Nets"),
      item("Bird Nets"),
      item("Anti Bird Nets"),
      item("Bird Protection Nets"),
      item("Pigeon Protection Nets"),
      item("Balcony Pigeon Nets"),
      item("Window Pigeon Nets"),
      item("Duct Area Bird Nets"),
      item("Terrace Bird Nets"),
      item("Open Area Bird Nets"),
      item("Bird Spikes"),
      item("Anti Bird Spikes"),
      item("Pigeon Spikes"),
      item("Bird Control Services"),
      item("Pigeon Control Services"),
      item("Bird Net Installation"),
      item("Pigeon Net Installation"),
    ],
  },
  {
    name: "Cloth Hangers",
    slug: "cloth-hangers",
    description:
      "Ceiling, balcony and wall-mounted cloth drying systems — rust-free hardware built for Kerala humidity.",
    services: [
      item("Ceiling Cloth Hangers"),
      item("Balcony Cloth Hangers"),
      item("Wall Mounted Cloth Hangers"),
      item("Pulley Cloth Hangers"),
      item("SS Cloth Hangers"),
      item("Stainless Steel Cloth Hangers"),
      item("Cloth Drying Hangers"),
      item("Manual Cloth Hangers"),
      item("Automatic Cloth Hangers"),
      item("Cloth Hanger Installation"),
      item("Cloth Hanger Repair"),
      item("Cloth Hanger Replacement"),
    ],
  },
  {
    name: "Sports Nets",
    slug: "sports-nets",
    description:
      "Cricket, football, volleyball, badminton and turf enclosure nets for schools, academies and home practice.",
    services: [
      item("Cricket Nets"),
      item("Practice Cricket Nets"),
      item("Box Cricket Nets"),
      item("Indoor Cricket Nets"),
      item("Outdoor Cricket Nets"),
      item("Football Nets"),
      item("Volleyball Nets"),
      item("Badminton Nets"),
      item("Tennis Nets"),
      item("Turf Nets"),
      item("Ground Nets"),
      item("School Sports Nets"),
      item("College Sports Nets"),
      item("Academy Sports Nets"),
      item("Sports Net Installation"),
    ],
  },
  {
    name: "Special Safety Solutions",
    slug: "special-safety-solutions",
    description:
      "Tailored child safety, pet protection, high-rise and industrial fall-protection solutions surveyed to your site.",
    services: [
      item("Balcony Child Safety Solutions"),
      item("Pet Protection Solutions"),
      item("High Rise Apartment Safety"),
      item("Terrace Fall Protection"),
      item("Duct Area Protection"),
      item("Open Space Safety Covering"),
      item("Construction Area Safety Nets"),
      item("Industrial Area Safety Nets"),
    ],
  },
  {
    name: "Service Support",
    slug: "service-support",
    description:
      "Free inspections, installation, repair, replacement and maintenance by Deva Safety Nets trained technicians.",
    services: [
      item("Free Site Inspection"),
      item("Safety Net Installation"),
      item("Invisible Grill Installation", "invisible-grill-installation"),
      item("Net Repair Services"),
      item("Net Replacement Services"),
      item("Grill Repair Services", "invisible-grill-repair"),
      item("Maintenance Services"),
      item("Custom Size Installation"),
    ],
  },
];

/** Flat list of every menu service slug (deduped). */
export const MENU_SERVICE_SLUGS = [
  ...new Set(SERVICE_MENU.flatMap((c) => c.services.map((s) => s.slug))),
];

/** Maps legacy keyword-catalog category slugs to the new menu categories. */
export const KEYWORD_CATEGORY_ALIASES: Record<string, string> = {
  "bird-spikes": "bird-protection",
  "bird-nets": "bird-protection",
  "pigeon-nets": "bird-protection",
  "balcony-nets": "safety-nets",
  "maintenance-services": "service-support",
  "industrial-commercial-safety": "special-safety-solutions",
};
