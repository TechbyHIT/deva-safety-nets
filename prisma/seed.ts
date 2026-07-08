import { FaqScope, Prisma, PrismaClient } from "@prisma/client";
import { buildKeywordServiceSeeds } from "../src/lib/keyword-catalog";
import { KERALA_AREA_GROUPS, areaGroupsForCity } from "../src/lib/kerala-locations";
import { GENERAL_FAQS } from "../src/lib/seed-content/general-faqs";

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (façade -> facade)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---------------------------------------------------------------------------
// Services (7 categories, 90+ services)
//
// Each category defines default building blocks (benefits/features/use cases +
// pricing) that keep every generated page substantive, plus a per-service
// tagline so each page has distinct, useful copy. The content engine further
// varies ordering per route to keep combination pages unique.
// ---------------------------------------------------------------------------

type ServiceSeed = {
  name: string;
  tagline: string;
  priceMin?: number | null;
  priceMax?: number | null;
  priceUnit?: string;
  featured?: boolean;
};

type CategorySeed = {
  name: string;
  icon: string;
  description: string;
  materialKinds: ("metal" | "net")[];
  defaults: {
    benefits: string[];
    features: string[];
    useCases: string[];
    priceMin: number | null;
    priceMax: number | null;
    priceUnit: string | null;
  };
  services: ServiceSeed[];
};

const CATEGORIES: CategorySeed[] = [
  {
    name: "Invisible Grills",
    icon: "Grid3x3",
    description:
      "Nearly invisible stainless steel cable grills that secure balconies, windows and open edges without blocking your view.",
    materialKinds: ["metal"],
    defaults: {
      benefits: [
        "Uninterrupted, unobstructed view",
        "Child & pet safe spacing",
        "Corrosion resistant hardware",
        "Low maintenance & easy to clean",
        "Anti-theft strength",
        "Society-approved uniform finish",
        "Engineered for Kerala humidity and monsoon",
      ],
      features: [
        "2mm SS304/SS316 wire",
        "Powder-coated aluminium frame",
        "40-60mm cable spacing",
        "High-tension turnbuckles",
        "Concealed fasteners",
        "Rounded child-safe fittings",
        "Wind-load tested for high-rises",
      ],
      useCases: ["High-rise apartments", "Villas", "Independent homes", "Offices", "Penthouses", "French windows"],
      priceMin: 85,
      priceMax: 210,
      priceUnit: "sq ft",
    },
    services: [
      { name: "Invisible Grills", tagline: "Flagship near-invisible cable grill systems for total edge protection.", featured: true, priceMin: 90, priceMax: 180 },
      { name: "Balcony Invisible Grills", tagline: "Fall protection for balconies with an unobstructed skyline view.", featured: true, priceMin: 90, priceMax: 160 },
      { name: "Window Invisible Grills", tagline: "Slim, near-invisible protection for every window opening.", featured: true, priceMin: 85, priceMax: 150 },
      { name: "Invisible Grills for Apartments", tagline: "Society-compliant grills that keep apartment façades uniform.", featured: true, priceMin: 90, priceMax: 160 },
      { name: "Invisible Grills for Villas", tagline: "Bespoke protection that preserves villa architecture and sight lines.", featured: true, priceMin: 100, priceMax: 180 },
      { name: "Invisible Grills for Child Safety", tagline: "Anti-climb spacing and rounded fittings for homes with children.", featured: true, priceMin: 95, priceMax: 170 },
      { name: "Invisible Grills for Pets", tagline: "Keep cats, dogs and birds safe on open balconies.", featured: true, priceMin: 95, priceMax: 170 },
      { name: "High-Rise Invisible Grills", tagline: "Wind-load certified tension systems engineered for tall towers.", priceMin: 110, priceMax: 190 },
      { name: "SS316 Invisible Grills", tagline: "Marine-grade SS316 for coastal and high-humidity locations.", featured: true, priceMin: 120, priceMax: 210 },
      { name: "Stainless Steel Invisible Grills", tagline: "Premium SS304 cable systems engineered for lasting durability.", priceMin: 95, priceMax: 170 },
      { name: "Premium Invisible Grills", tagline: "Top-tier finishes, designer frames and the most discreet hardware.", priceMin: 130, priceMax: 210 },
      { name: "Child Safety Invisible Grills", tagline: "Anti-climb spacing and rounded fittings for homes with children.", featured: true, priceMin: 95, priceMax: 170 },
      { name: "Pet Safety Invisible Grills", tagline: "Keep cats, dogs and birds safe on open balconies.", priceMin: 95, priceMax: 170 },
      { name: "Office Invisible Grills", tagline: "Workplace safety compliance without blocking daylight.", priceMin: 95, priceMax: 165 },
      { name: "Commercial Invisible Grills", tagline: "Durable, tamper-resistant systems for high-footfall spaces.", priceMin: 100, priceMax: 185 },
      { name: "Staircase Invisible Grills", tagline: "Protect stairwells and mezzanine edges with clear cable guards.", priceMin: 95, priceMax: 175 },
      { name: "Terrace Invisible Grills", tagline: "Enclose terrace edges and parapets while keeping the view open.", priceMin: 95, priceMax: 175 },
      { name: "French Window Invisible Grills", tagline: "Floor-to-ceiling French window protection that stays invisible.", priceMin: 100, priceMax: 185 },
      { name: "Sliding Window Invisible Grills", tagline: "Grills tailored to sliding window tracks and openings.", priceMin: 90, priceMax: 165 },
      { name: "Custom Invisible Grills", tagline: "Made-to-measure solutions for irregular spans and unique designs.", priceMin: 100, priceMax: 210 },
      { name: "Invisible Grill Installation", tagline: "Professional, certified installation by trained technicians.", priceMin: 90, priceMax: 180 },
      { name: "Invisible Grill Repair", tagline: "Re-tension, re-anchor and restore existing invisible grills.", priceMin: 500, priceMax: 3000, priceUnit: "visit" },
      { name: "Invisible Grill Replacement", tagline: "Swap out corroded cables and hardware, with grade upgrades.", priceMin: 90, priceMax: 170 },
      { name: "Invisible Grill Maintenance", tagline: "Scheduled tension checks and care to keep grills safe for decades.", priceMin: 999, priceMax: 6000, priceUnit: "year" },
    ],
  },
  {
    name: "Safety Nets",
    icon: "Grid2x2",
    description:
      "Certified nylon and HDPE safety nets that prevent falls and keep birds, pests and debris out.",
    materialKinds: ["net"],
    defaults: {
      benefits: [
        "Nearly invisible protection",
        "High breaking strength",
        "UV-stabilised & weatherproof",
        "Removable & reusable",
        "Airflow and light friendly",
        "Fast installation — often same day",
        "Cost-effective for bird and child safety",
      ],
      features: [
        "Braided nylon / HDPE mesh",
        "15-40mm mesh sizes",
        "Weatherproof anchor hooks",
        "Tensioned perimeter rope",
        "UV-treated for Kerala sun exposure",
        "Knotless options for premium finish",
      ],
      useCases: ["Balconies", "Terraces", "Ducts", "Open shafts", "Apartments", "Villas"],
      priceMin: 5,
      priceMax: 16,
      priceUnit: "sq ft",
    },
    services: [
      { name: "Safety Nets", tagline: "Certified fall-prevention and bird-control nets for every opening.", featured: true, priceMin: 6, priceMax: 14 },
      { name: "Balcony Safety Nets", tagline: "Transparent nets that childproof balconies in hours.", featured: true, priceMin: 6, priceMax: 14 },
      { name: "Kids Safety Nets", tagline: "Fall-prevention nets engineered specifically for child safety.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Child Safety Nets", tagline: "Anti-fall mesh with child-safe spacing for balconies and windows.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Pet Safety Nets", tagline: "Secure balconies for cats, dogs and rabbits.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Cat Safety Nets", tagline: "Cat-proof balcony nets with fine mesh and strong anchors.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Dog Safety Nets", tagline: "Heavy-duty nets that keep dogs safe on open balconies.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Pigeon Safety Nets", tagline: "Keep pigeons off balconies and utility areas hygienically.", featured: true, priceMin: 5, priceMax: 12 },
      { name: "Bird Safety Nets", tagline: "General-purpose bird exclusion netting for any opening.", priceMin: 5, priceMax: 12 },
      { name: "Anti-Bird Nets", tagline: "Heavy-duty anti-bird protection for large spans.", priceMin: 5, priceMax: 13 },
      { name: "Monkey Safety Nets", tagline: "High-strength nets that deter monkeys in hill and temple zones.", priceMin: 9, priceMax: 20 },
      { name: "Duct Area Safety Nets", tagline: "Seal duct openings against birds and debris while keeping airflow.", priceMin: 6, priceMax: 14 },
      { name: "Terrace Safety Nets", tagline: "Enclose terraces for kids, pets and rooftop play.", priceMin: 7, priceMax: 16 },
      { name: "Construction Safety Nets", tagline: "IS-code site debris and personnel fall protection.", priceMin: 4, priceMax: 11 },
      { name: "Building Safety Nets", tagline: "Full-height perimeter protection for multi-storey buildings.", priceMin: 5, priceMax: 13 },
      { name: "Industrial Safety Nets", tagline: "Fall arrest and machinery guarding for plants.", priceMin: 6, priceMax: 15 },
      { name: "Warehouse Safety Nets", tagline: "Rack-back, mezzanine and bird protection for warehouses.", priceMin: 5, priceMax: 13 },
      { name: "School Safety Nets", tagline: "Atrium and corridor fall protection for schools.", priceMin: 7, priceMax: 15 },
      { name: "Hospital Safety Nets", tagline: "Hygienic safety netting for healthcare facilities.", priceMin: 7, priceMax: 16 },
      { name: "Apartment Safety Nets", tagline: "Society-approved nets for balconies, shafts and cut-outs.", priceMin: 6, priceMax: 14 },
      { name: "Open Area Safety Nets", tagline: "Cover atriums, cut-outs and open shafts safely.", priceMin: 7, priceMax: 16 },
      { name: "Lift Shaft Safety Nets", tagline: "Protect open lift shafts during construction and maintenance.", priceMin: 6, priceMax: 15 },
      { name: "Staircase Safety Nets", tagline: "Guard stairwell voids and railings against falls.", priceMin: 6, priceMax: 14 },
      { name: "Swimming Pool Safety Nets", tagline: "Prevent accidental pool falls for children and pets.", priceMin: 8, priceMax: 18 },
      { name: "Skylight Safety Nets", tagline: "Fall-through protection beneath skylights and roof glazing.", priceMin: 7, priceMax: 16 },
      { name: "Car Parking Safety Nets", tagline: "Shield parking areas from falling objects and birds.", priceMin: 5, priceMax: 13 },
      { name: "Roof Safety Nets", tagline: "Fall arrest for roof work and open roof edges.", priceMin: 6, priceMax: 15 },
      { name: "Garden Safety Nets", tagline: "Protect gardens and patios from birds, leaves and debris.", priceMin: 5, priceMax: 12 },
      { name: "Balcony Protection Nets", tagline: "All-round balcony protection against falls and pests.", priceMin: 6, priceMax: 14 },
      { name: "Nylon Safety Nets", tagline: "High-tenacity braided nylon nets for child and pet safety.", priceMin: 7, priceMax: 15 },
      { name: "HDPE Safety Nets", tagline: "UV-treated HDPE nets, rot-proof and cost effective.", priceMin: 5, priceMax: 12 },
      { name: "Knotless Safety Nets", tagline: "Smooth knotless mesh for premium strength and appearance.", priceMin: 7, priceMax: 16 },
      { name: "Safety Net Installation", tagline: "Fast, professional safety net installation and tensioning.", priceMin: 5, priceMax: 16 },
      { name: "Safety Net Repair", tagline: "Patch, re-tie and re-tension damaged safety nets.", priceMin: 400, priceMax: 2500, priceUnit: "visit" },
      { name: "Safety Net Replacement", tagline: "Full replacement of degraded or aged safety nets.", priceMin: 6, priceMax: 15 },
      { name: "Safety Net Maintenance", tagline: "Periodic inspection and upkeep to keep nets safe year-round.", priceMin: 999, priceMax: 5000, priceUnit: "year" },
    ],
  },
  {
    name: "Balcony Nets",
    icon: "Grid2x2",
    description:
      "Dedicated balcony protection nets for children, pets and bird control — fast installation across Kerala.",
    materialKinds: ["net"],
    defaults: {
      benefits: [
        "Nearly invisible on balconies",
        "Child and pet safe",
        "UV-stabilised for Kerala sun",
        "Same-day installation available",
      ],
      features: [
        "Braided nylon / HDPE mesh",
        "Weatherproof anchor hooks",
        "15-40mm mesh options",
        "Society-approved finishes",
      ],
      useCases: ["Apartments", "Villas", "High-rises", "Gated communities"],
      priceMin: 6,
      priceMax: 16,
      priceUnit: "sq ft",
    },
    services: [
      { name: "Balcony Nets", tagline: "All-purpose balcony safety and bird nets.", featured: true, priceMin: 6, priceMax: 14 },
      { name: "Balcony Protection Nets", tagline: "Complete fall and pest protection for open balconies.", featured: true, priceMin: 6, priceMax: 14 },
      { name: "Balcony Children Safety Nets", tagline: "Child-safe balcony nets with certified mesh spacing.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Balcony Pet Safety Nets", tagline: "Pet-proof balcony nets for cats and dogs.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Balcony Cat Nets", tagline: "Fine-mesh cat safety nets for apartment balconies.", featured: true, priceMin: 7, priceMax: 15 },
      { name: "Apartment Balcony Nets", tagline: "Society-compliant balcony nets for flats and towers.", featured: true, priceMin: 6, priceMax: 14 },
      { name: "High Rise Balcony Nets", tagline: "Wind-rated balcony nets engineered for tall buildings.", featured: true, priceMin: 8, priceMax: 16 },
    ],
  },
  {
    name: "Bird Nets",
    icon: "Bird",
    description: "Humane bird exclusion netting for balconies, windows, ducts and open areas.",
    materialKinds: ["net"],
    defaults: {
      benefits: ["Humane bird deterrence", "Hygienic mess-free spaces", "Nearly invisible fit", "UV and weatherproof"],
      features: ["HDPE exclusion mesh", "Stainless anchor hooks", "Custom spans", "Low-visibility black mesh"],
      useCases: ["Balconies", "Windows", "Ducts", "Terraces"],
      priceMin: 5,
      priceMax: 14,
      priceUnit: "sq ft",
    },
    services: [
      { name: "Bird Nets", tagline: "General-purpose bird exclusion netting.", featured: true, priceMin: 5, priceMax: 12 },
      { name: "Anti Bird Nets", tagline: "Heavy-duty anti-bird nets for large openings.", featured: true, priceMin: 5, priceMax: 13 },
      { name: "Bird Protection Nets", tagline: "Protect balconies and terraces from nesting birds.", featured: true, priceMin: 5, priceMax: 12 },
      { name: "Balcony Bird Nets", tagline: "Keep balconies bird-free without blocking the view.", featured: true, priceMin: 5, priceMax: 13 },
      { name: "Window Bird Nets", tagline: "Discreet bird nets fitted to window openings.", featured: true, priceMin: 5, priceMax: 12 },
      { name: "Duct Area Bird Nets", tagline: "Seal duct and service areas against birds and debris.", featured: true, priceMin: 6, priceMax: 14 },
      { name: "Solar Panel Bird Protection", tagline: "Mesh guards that stop birds nesting under solar panels.", priceMin: 8, priceMax: 18 },
      { name: "Bird Net Installation", tagline: "Professional installation of durable bird exclusion nets.", priceMin: 5, priceMax: 13 },
    ],
  },
  {
    name: "Pigeon Nets",
    icon: "Bird",
    description: "Targeted pigeon exclusion nets for balconies, windows and utility areas across Kerala.",
    materialKinds: ["net"],
    defaults: {
      benefits: ["Stops pigeon roosting", "Hygienic living spaces", "Fast installation", "Long-lasting UV mesh"],
      features: ["Fine HDPE mesh", "Corrosion-proof hooks", "Custom-cut panels", "Low-visibility finish"],
      useCases: ["Balconies", "Windows", "Ducts", "Parapets"],
      priceMin: 5,
      priceMax: 14,
      priceUnit: "sq ft",
    },
    services: [
      { name: "Pigeon Nets", tagline: "Dedicated pigeon exclusion netting for homes and offices.", featured: true, priceMin: 5, priceMax: 12 },
      { name: "Anti Pigeon Nets", tagline: "Comprehensive anti-pigeon proofing systems.", featured: true, priceMin: 5, priceMax: 13 },
      { name: "Pigeon Safety Nets", tagline: "Safety-grade pigeon nets for balconies and ducts.", featured: true, priceMin: 5, priceMax: 12 },
      { name: "Balcony Pigeon Nets", tagline: "Balcony pigeon nets installed in hours.", featured: true, priceMin: 5, priceMax: 13 },
      { name: "Window Pigeon Nets", tagline: "Window-level pigeon exclusion without blocking light.", featured: true, priceMin: 5, priceMax: 12 },
      { name: "Duct Area Pigeon Nets", tagline: "Pigeon-proof duct and shaft openings.", featured: true, priceMin: 6, priceMax: 14 },
    ],
  },
  {
    name: "Bird Spikes",
    icon: "Bird",
    description: "Stainless steel bird and pigeon spikes for ledges, parapets and façades.",
    materialKinds: ["metal"],
    defaults: {
      benefits: ["Humane roosting deterrent", "Low visibility", "Weatherproof SS304", "Long service life"],
      features: ["SS304 spike strips", "UV-stable bases", "Adhesive or screw mount", "Custom ledge lengths"],
      useCases: ["Ledges", "Parapets", "AC units", "Signage"],
      priceMin: 60,
      priceMax: 150,
      priceUnit: "running ft",
    },
    services: [
      { name: "Bird Spikes", tagline: "Stainless steel spikes that deter roosting birds on ledges.", featured: true, priceMin: 60, priceMax: 140, priceUnit: "running ft" },
      { name: "Pigeon Spikes", tagline: "Targeted pigeon spike systems for balconies and ledges.", featured: true, priceMin: 60, priceMax: 140, priceUnit: "running ft" },
      { name: "Anti Bird Spikes", tagline: "Anti-bird spike strips for commercial and residential ledges.", featured: true, priceMin: 60, priceMax: 140, priceUnit: "running ft" },
      { name: "Anti Pigeon Spikes", tagline: "Anti-pigeon spikes for parapets and window sills.", featured: true, priceMin: 60, priceMax: 140, priceUnit: "running ft" },
      { name: "Bird Control Spikes", tagline: "Integrated bird control spike solutions surveyed to your site.", featured: true, priceMin: 60, priceMax: 140, priceUnit: "running ft" },
      { name: "Pigeon Control Spikes", tagline: "Pigeon control spikes for ducts, AC units and ledges.", featured: true, priceMin: 60, priceMax: 140, priceUnit: "running ft" },
      { name: "Stainless Steel Bird Spikes", tagline: "Premium SS304 spikes for maximum durability.", featured: true, priceMin: 70, priceMax: 150, priceUnit: "running ft" },
    ],
  },
  {
    name: "Cloth Hangers",
    icon: "Wind",
    description:
      "Ceiling and wall-mounted cloth drying systems for balconies and utility areas.",
    materialKinds: ["metal"],
    defaults: {
      benefits: [
        "Space-efficient drying",
        "Rust-free hardware",
        "Smooth, easy operation",
        "High load capacity",
      ],
      features: [
        "Aluminium / stainless rails",
        "Smooth pulley mechanism",
        "Weatherproof coating",
        "Adjustable heights",
      ],
      useCases: ["Balconies", "Utility rooms", "Bathrooms"],
      priceMin: 900,
      priceMax: 30000,
      priceUnit: "unit",
    },
    services: [
      { name: "Cloth Hangers", tagline: "Ceiling and wall-mounted cloth drying systems.", featured: true, priceMin: 1800, priceMax: 5000 },
      { name: "Ceiling Cloth Hangers", tagline: "Space-saving ceiling-mounted drying racks.", featured: true, priceMin: 1800, priceMax: 4500 },
      { name: "Pulley Cloth Hangers", tagline: "Individually adjustable pulley drying systems.", priceMin: 2200, priceMax: 5500 },
      { name: "Foldable Cloth Hangers", tagline: "Wall-folding racks for compact spaces.", priceMin: 1500, priceMax: 3500 },
      { name: "Motorized Cloth Hangers", tagline: "Remote-operated automatic drying systems.", priceMin: 12000, priceMax: 30000 },
      { name: "Wall Mounted Cloth Hangers", tagline: "Retractable and fixed wall-mounted racks.", priceMin: 900, priceMax: 2800 },
      { name: "Balcony Cloth Hangers", tagline: "Weatherproof drying solutions built for balconies.", priceMin: 1800, priceMax: 5000 },
      { name: "Stainless Steel Cloth Hangers", tagline: "Premium rust-free SS drying systems for long life.", priceMin: 2500, priceMax: 7000 },
      { name: "Automatic Cloth Drying Systems", tagline: "One-touch automated drying for premium homes.", priceMin: 12000, priceMax: 30000 },
      { name: "Ceiling Drying Racks", tagline: "Durable ceiling racks that keep floors clutter-free.", priceMin: 1800, priceMax: 4500 },
      { name: "Clothes Drying Pulley Systems", tagline: "Reliable pulley systems with independent rails.", priceMin: 2200, priceMax: 5500 },
    ],
  },
  {
    name: "Sports Nets",
    icon: "Trophy",
    description: "Practice, boundary and enclosure nets for every sport, indoor or outdoor.",
    materialKinds: ["net"],
    defaults: {
      benefits: [
        "High-impact ball-stop rating",
        "UV-stable & weatherproof",
        "Custom sizing & spans",
        "Long service life",
      ],
      features: [
        "Braided nylon / HDPE mesh",
        "Galvanised support poles",
        "Reinforced border tape",
        "Retractable options",
      ],
      useCases: ["Academies", "Schools", "Turf parks", "Clubs"],
      priceMin: 7,
      priceMax: 22,
      priceUnit: "sq ft",
    },
    services: [
      { name: "Sports Nets", tagline: "Practice, boundary and enclosure nets for every sport.", featured: true, priceMin: 7, priceMax: 18 },
      { name: "Cricket Nets", tagline: "Cricket practice cages and boundary nets.", featured: true, priceMin: 8, priceMax: 18 },
      { name: "Cricket Practice Nets", tagline: "Practice cages and boundary nets for cricket.", featured: true, priceMin: 8, priceMax: 18 },
      { name: "Football Nets", tagline: "Goal and boundary netting for football turfs.", priceMin: 7, priceMax: 16 },
      { name: "Volleyball Nets", tagline: "Regulation and practice volleyball nets.", priceMin: 7, priceMax: 15 },
      { name: "Badminton Nets", tagline: "Indoor and outdoor badminton netting.", priceMin: 7, priceMax: 15 },
      { name: "Tennis Nets", tagline: "Court dividers and boundary tennis nets.", priceMin: 8, priceMax: 17 },
      { name: "Golf Practice Nets", tagline: "High-impact nets for golf driving practice.", priceMin: 10, priceMax: 22 },
      { name: "Hockey Nets", tagline: "Goal and boundary nets for hockey grounds.", priceMin: 8, priceMax: 17 },
      { name: "Basketball Nets", tagline: "Court enclosure and rebound nets for basketball.", priceMin: 8, priceMax: 17 },
      { name: "Multi-Sports Nets", tagline: "Configurable enclosures for multi-sport arenas.", featured: true, priceMin: 9, priceMax: 20 },
      { name: "School Sports Nets", tagline: "Durable, safe sports netting for school grounds.", priceMin: 7, priceMax: 16 },
      { name: "Academy Sports Nets", tagline: "Professional-grade nets for sports academies.", priceMin: 8, priceMax: 18 },
      { name: "Indoor Sports Nets", tagline: "Space-optimised netting for indoor sports halls.", priceMin: 7, priceMax: 16 },
      { name: "Outdoor Sports Nets", tagline: "Weatherproof enclosures for outdoor grounds.", priceMin: 7, priceMax: 17 },
      { name: "Practice Cage Nets", tagline: "Modular practice cages for focused training.", priceMin: 8, priceMax: 18 },
    ],
  },
  {
    name: "Industrial & Commercial Safety",
    icon: "HardHat",
    description:
      "Certified fall protection, debris containment and bird netting for factories, sites and warehouses.",
    materialKinds: ["net"],
    defaults: {
      benefits: [
        "IS-code load certification",
        "High visibility options",
        "Heavy-duty & weatherproof",
        "Large-span coverage",
      ],
      features: [
        "Heavy-gauge nylon / HDPE",
        "Load-tested anchoring",
        "Scaffold & debris variants",
        "Documented compliance",
      ],
      useCases: ["Factories", "Construction sites", "Warehouses", "Loading bays"],
      priceMin: 4,
      priceMax: 16,
      priceUnit: "sq ft",
    },
    services: [
      { name: "Factory Safety Nets", tagline: "Fall arrest and machine guarding netting for factories.", featured: true, priceMin: 6, priceMax: 15 },
      { name: "Industrial Bird Netting", tagline: "Large-span bird exclusion for industrial buildings.", priceMin: 5, priceMax: 13 },
      { name: "Industrial Safety Solutions", tagline: "Tailored, surveyed safety systems for industrial sites.", priceMin: 6, priceMax: 16 },
      { name: "Construction Debris Nets", tagline: "Containment nets that catch falling debris on sites.", priceMin: 4, priceMax: 11 },
      { name: "Scaffolding Safety Nets", tagline: "Scaffold-mounted nets for worker and public safety.", priceMin: 4, priceMax: 12 },
      { name: "Building Façade Safety Nets", tagline: "Full-façade protection during construction and repair.", priceMin: 5, priceMax: 13 },
      { name: "Worker Fall Protection Nets", tagline: "Certified fall-arrest nets that protect workers at height.", featured: true, priceMin: 6, priceMax: 15 },
      { name: "Loading Bay Safety Nets", tagline: "Edge protection and containment for loading bays.", priceMin: 5, priceMax: 13 },
      { name: "Industrial Fall Protection Systems", tagline: "Engineered, code-compliant fall protection systems.", priceMin: 6, priceMax: 16 },
    ],
  },
  {
    name: "Maintenance Services",
    icon: "Wrench",
    description:
      "Inspection, cleaning, repair and annual maintenance to keep every safety system performing.",
    materialKinds: ["metal", "net"],
    defaults: {
      benefits: [
        "Preventive, documented care",
        "Extends system lifespan",
        "Priority response",
        "Certified technicians",
      ],
      features: [
        "Scheduled site visits",
        "Tension & integrity checks",
        "Photo inspection reports",
        "Genuine replacement parts",
      ],
      useCases: ["Societies", "Commercial", "Industrial", "Homes"],
      priceMin: 500,
      priceMax: 6000,
      priceUnit: "visit",
    },
    services: [
      { name: "Annual Maintenance Contract (AMC)", tagline: "Scheduled AMC to keep grills and nets safe all year.", featured: true, priceMin: 999, priceMax: 6000, priceUnit: "year" },
      { name: "Safety Inspection", tagline: "Certified safety inspection with a documented report.", priceMin: 500, priceMax: 2500, priceUnit: "visit" },
      { name: "Net Cleaning", tagline: "Professional cleaning to restore net appearance and airflow.", priceMin: 500, priceMax: 3000, priceUnit: "visit" },
      { name: "Bird Spike Replacement", tagline: "Replace worn or damaged bird spikes and bases.", priceMin: 500, priceMax: 3000, priceUnit: "visit" },
      { name: "Invisible Grill Wire Replacement", tagline: "Replace corroded cables and hardware on invisible grills.", priceMin: 90, priceMax: 170, priceUnit: "sq ft" },
      { name: "Safety Net Reinstallation", tagline: "Re-fit and re-tension nets after painting or repairs.", priceMin: 400, priceMax: 2500, priceUnit: "visit" },
      { name: "Emergency Repair Services", tagline: "Rapid-response repairs for urgent safety issues.", priceMin: 800, priceMax: 4000, priceUnit: "visit" },
      { name: "On-Site Inspection", tagline: "Detailed on-site assessment of your safety systems.", priceMin: 500, priceMax: 2500, priceUnit: "visit" },
      { name: "Custom Safety Solutions", tagline: "Tailored safety designs for unusual requirements." },
      { name: "Consultation & Site Survey", tagline: "Free consultation and precise measurement before any quote." },
    ],
  },
];

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

const MATERIALS = [
  { name: "SS304 Stainless Steel", grade: "SS304", kind: "metal", summary: "The industry-standard grade for invisible grills, offering excellent strength and corrosion resistance for most urban environments.", advantages: ["Great value", "High tensile strength", "Rust resistant"], bestFor: ["Apartments", "Inland cities"], properties: { tensile: "515 MPa", nickel: "8-10%", chromium: "18%" } },
  { name: "SS316 Marine Grade", grade: "SS316", kind: "metal", summary: "Marine-grade stainless steel with added molybdenum for superior corrosion resistance in coastal and high-humidity areas.", advantages: ["Best corrosion resistance", "Longest lifespan", "Salt-air ready"], bestFor: ["Coastal cities", "High humidity"], properties: { tensile: "515 MPa", molybdenum: "2-3%", chromium: "16-18%" } },
  { name: "Nylon Safety Net", grade: "Nylon", kind: "net", summary: "High-tenacity braided nylon with excellent knot strength and a skin-friendly finish, ideal for child and pet safety nets.", advantages: ["High breaking strength", "Soft on skin", "UV stabilised"], bestFor: ["Child safety", "Pet safety"], properties: { mesh: "15-25mm", uv: "Stabilised" } },
  { name: "HDPE Netting", grade: "HDPE", kind: "net", summary: "UV-treated high-density polyethylene, rot-proof and cost-effective for bird protection and industrial use.", advantages: ["Rot proof", "Cost effective", "Weatherproof"], bestFor: ["Bird control", "Industrial"], properties: { mesh: "40mm", uv: "Treated" } },
];

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------

const INDUSTRIES = [
  { name: "Residential Apartments", summary: "High-rise and gated communities that need consistent, society-approved safety across hundreds of balconies.", challenges: ["Uniform facade", "Bulk timelines", "RWA approvals"], solutions: ["Standardised kits", "Phased rollout", "Approved color palettes"] },
  { name: "Villas & Independent Homes", summary: "Premium homes requiring bespoke, near-invisible protection that respects architecture.", challenges: ["Large spans", "Aesthetics"], solutions: ["Custom tensioning", "Designer frames"] },
  { name: "Commercial & Retail", summary: "Malls, showrooms and hotels needing durable, tamper-resistant systems for high footfall.", challenges: ["Durability", "Brand aesthetics"], solutions: ["Heavy-duty hardware", "Discreet installs"] },
  { name: "Industrial & Warehousing", summary: "Factories and warehouses requiring certified fall arrest and bird exclusion.", challenges: ["Load certification", "Large areas"], solutions: ["IS-code nets", "Rack protection"] },
  { name: "Education & Healthcare", summary: "Schools and hospitals prioritising child safety and hygiene.", challenges: ["Child certification", "Hygiene"], solutions: ["Fall-arrest mesh", "Anti-microbial options"] },
  { name: "Hospitality & Resorts", summary: "Hotels and resorts balancing guest safety with scenic views.", challenges: ["Aesthetics", "Coastal wear"], solutions: ["SS316 grills", "Coconut tree nets"] },
  { name: "Construction & Infrastructure", summary: "Active build sites requiring debris containment and worker fall protection.", challenges: ["Site safety compliance", "Changing layouts"], solutions: ["Debris & scaffold nets", "Rapid deployment"] },
];

// ---------------------------------------------------------------------------
// Property types (reusable programmatic dimension)
// ---------------------------------------------------------------------------

const PROPERTY_TYPES = [
  { name: "Apartment", plural: "Apartments", summary: "Flats and apartment units in gated communities and standalone blocks, where balcony and window safety must satisfy both families and society norms.", concerns: ["Child falls from balconies", "Society-approved uniform look", "Bulk installation timelines"], examples: ["2-3 BHK flats", "Gated community towers", "Studio apartments"] },
  { name: "Villa", plural: "Villas", summary: "Independent villas with larger spans and premium aesthetics that demand bespoke, near-invisible protection.", concerns: ["Large custom spans", "Preserving architecture", "Premium finishes"], examples: ["Gated villas", "Farmhouses", "Luxury bungalows"] },
  { name: "Independent House", plural: "Independent Houses", summary: "Standalone homes needing flexible, cost-effective safety across windows, balconies and staircases.", concerns: ["Mixed opening sizes", "Budget flexibility", "Ground-floor security"], examples: ["Row-plot homes", "Two-storey houses"] },
  { name: "Duplex Home", plural: "Duplex Homes", summary: "Two-level homes with internal voids and tall balconies that benefit from staircase and edge protection.", concerns: ["Internal stair voids", "Double-height balconies"], examples: ["Duplex flats", "Maisonettes"] },
  { name: "Penthouse", plural: "Penthouses", summary: "Top-floor premium residences with terraces and expansive glazing requiring discreet, high-wind-rated systems.", concerns: ["High wind loads", "Terrace edges", "Uninterrupted views"], examples: ["Sky villas", "Terrace penthouses"] },
  { name: "Row House", plural: "Row Houses", summary: "Compact multi-level homes in planned layouts needing consistent, neat safety solutions.", concerns: ["Compact balconies", "Consistent street look"], examples: ["Township row houses"] },
  { name: "Commercial Building", plural: "Commercial Buildings", summary: "Offices, malls and showrooms requiring durable, tamper-resistant and compliant safety systems.", concerns: ["High footfall durability", "Brand aesthetics", "Compliance"], examples: ["Malls", "Showrooms", "Business parks"] },
  { name: "Office Space", plural: "Office Spaces", summary: "Workplaces balancing daylight, aesthetics and employee safety compliance.", concerns: ["Daylight retention", "Professional look", "Fire safety"], examples: ["Corporate offices", "Co-working spaces"] },
  { name: "Industrial Facility", plural: "Industrial Facilities", summary: "Factories and plants that require certified fall arrest, machine guarding and bird exclusion.", concerns: ["Load certification", "Large open areas", "Bird exclusion"], examples: ["Factories", "Processing plants"] },
  { name: "Warehouse", plural: "Warehouses", summary: "Storage and logistics facilities needing rack protection, bird netting and mezzanine safety.", concerns: ["Rack-back protection", "Bird nesting", "Mezzanine edges"], examples: ["Distribution centres", "Godowns"] },
  { name: "Gated Community", plural: "Gated Communities", summary: "Large residential communities standardising safety across many units for a uniform, approved finish.", concerns: ["Uniform façade", "Bulk pricing", "RWA approval"], examples: ["Apartment complexes", "Township clusters"] },
  { name: "High-Rise Tower", plural: "High-Rise Towers", summary: "Tall towers where wind-load engineering and certified anchoring are essential for balcony and window safety.", concerns: ["Wind-load rating", "Certified anchoring", "Height access"], examples: ["15+ floor towers", "Sky-rise apartments"] },
];

// ---------------------------------------------------------------------------
// Locations — imported from src/lib/kerala-locations.ts (single source of truth)
// ---------------------------------------------------------------------------

type CitySeed = {
  name: string;
  state: string;
  region: string;
  featured?: boolean;
  intro?: string;
};

const CITIES: CitySeed[] = [
  {
    name: "Kochi",
    state: "Kerala",
    region: "South",
    featured: true,
    intro:
      "Deva Safety Nets delivers premium invisible grills, safety nets, bird control and sports enclosures across Kochi — from Fort Kochi and Marine Drive to Kakkanad's IT corridor, Edapally towers and the Vypin islands. Our Kochi teams understand coastal salt air, society RWA requirements and the mix of heritage homes and high-rise apartments that define the city. Every project starts with a free site survey, marine-grade SS316 where exposure demands it, and warranty-backed installation by our own technicians — never subcontractors.",
  },
  {
    name: "Ernakulam",
    state: "Kerala",
    region: "South",
    featured: true,
    intro:
      "Serving the wider Ernakulam district — Aluva, Angamaly, Perumbavoor, Tripunithura, Kalamassery, Muvattupuzha and dozens of municipalities — Deva Safety Nets installs invisible grills, safety nets, pigeon exclusion and commercial bird control with local survey teams and materials chosen for Kerala's humid, monsoon-heavy climate. From airport-region apartments to Tripunithura villas and industrial sheds near Eloor, we tailor specifications to building type, floor height and exposure while keeping society-approved finishes and transparent itemised pricing.",
  },
];

const BLOG_POSTS = [
  { title: "Invisible Grills vs Safety Nets: Which Is Right for Your Balcony?", tags: ["comparison", "balcony", "safety"], excerpt: "A practical breakdown of cost, aesthetics, durability and safety to help you choose between invisible grills and safety nets." },
  { title: "How Invisible Grills Are Installed: A Step-by-Step Guide", tags: ["installation", "invisible grills"], excerpt: "From site survey to final tensioning, here is exactly what happens during a professional invisible grill installation." },
  { title: "SS304 vs SS316: Choosing the Right Stainless Steel for Coastal Homes", tags: ["materials", "coastal"], excerpt: "Why marine-grade SS316 outlasts standard SS304 near the sea, and when the upgrade is worth it — especially in Kochi." },
  { title: "Child Safety on High-Rise Balconies: A Parent's Checklist", tags: ["child safety", "high rise"], excerpt: "Evidence-based steps every parent should take to childproof balconies in tall apartment buildings." },
  { title: "The True Cost of Balcony Safety Nets in 2026", tags: ["pricing", "safety nets"], excerpt: "Understand the factors that drive safety net pricing and how to budget accurately for your home." },
  { title: "How to Maintain Your Invisible Grills for 20+ Years", tags: ["maintenance"], excerpt: "Simple seasonal care that keeps cables tensioned, rust-free and safe for decades." },
  { title: "Bird Netting in Kochi: Keeping Coastal Balconies Pigeon-Free", tags: ["bird control", "kochi"], excerpt: "Why humid coastal cities see more pigeon problems and how the right netting solves it for good." },
  { title: "Apartment Society Approval for Invisible Grills: What RWAs Expect", tags: ["apartment", "kochi"], excerpt: "How to prepare documentation, finishes and vendor credentials so your society approves safety installation smoothly." },
  { title: "Pet Safety Nets for Cats and Dogs: Sizing, Mesh and Anchors", tags: ["pet safety", "safety nets"], excerpt: "What pet owners in Kerala apartments should know before choosing nets versus invisible grills." },
  { title: "Cricket Nets at Home: Planning Space, Height and Ball-Stop Rating", tags: ["sports nets", "cricket"], excerpt: "A practical guide to backyard and terrace cricket nets — materials, poles and safety clearances." },
  { title: "Bird Spikes vs Bird Nets: When to Use Each in Kerala Buildings", tags: ["bird spikes", "bird control"], excerpt: "Ledges, ducts and balconies need different bird-proofing strategies. Here is how to choose correctly." },
  { title: "Ceiling Cloth Hangers for Kerala Apartments: Buyer's Guide", tags: ["cloth hangers", "apartment"], excerpt: "Compare pulley, ceiling and foldable drying systems for humid coastal living." },
  { title: "Monsoon Care for Safety Nets and Invisible Grills", tags: ["maintenance", "kerala"], excerpt: "Post-monsoon inspection checklist for Kerala homeowners — tension, anchors and corrosion." },
  { title: "Industrial Safety Nets: Fall Protection and Bird Exclusion in Factories", tags: ["industrial", "safety nets"], excerpt: "How warehouses and plants use certified netting for personnel safety and bird control." },
];

// ---------------------------------------------------------------------------
// General FAQ content — imported from src/lib/seed-content/general-faqs.ts
// ---------------------------------------------------------------------------

function buildServiceFaqs(
  name: string,
  categoryName: string,
  priceMin: number | null,
  priceMax: number | null,
  priceUnit: string | null,
): { scope: FaqScope; order: number; question: string; answer: string }[] {
  const lower = name.toLowerCase();
  const priceAnswer = priceMin
    ? `${name} typically costs between ₹${priceMin} and ₹${priceMax} per ${priceUnit}, depending on measured area, material grade and site conditions in Kerala. Deva Safety Nets provides a free survey for an exact itemised quote.`
    : `Pricing for ${lower} depends on scope, materials and site access. Request a free inspection anywhere in Kerala for an accurate quote.`;
  return [
    { scope: "SERVICE", order: 0, question: `How much do ${lower} cost in Kerala?`, answer: priceAnswer },
    { scope: "INSTALLATION", order: 1, question: `How long does ${lower} installation take?`, answer: `Most ${lower} jobs with Deva Safety Nets are completed within 1–2 days of the free site survey in Kochi, Ernakulam and across Kerala, with minimal disruption to your home or workplace.` },
    { scope: "SAFETY", order: 2, question: `Are ${lower} safe for children and pets?`, answer: `Yes. Our ${lower} use engineered spacing, certified materials and professional tensioning designed to keep children and pets safe. We assess your specific balcony or window during the free inspection.` },
    { scope: "MAINTENANCE", order: 3, question: `What maintenance do ${lower} need?`, answer: `${name} require minimal upkeep — periodic cleaning and occasional tension or integrity checks. Deva Safety Nets also offers repair services and annual maintenance contracts across Kerala.` },
    { scope: "GENERAL", order: 4, question: `What is included in ${lower} installation?`, answer: `Your quote includes site survey, materials, labour, quality inspection and warranty documentation. Deva Safety Nets installs with our own trained technicians — we do not subcontract.` },
    { scope: "GENERAL", order: 5, question: `What materials are used for ${lower}?`, answer: `${name} under our ${categoryName} category uses IS-compliant materials selected for Kerala's humidity and monsoon conditions — including SS304, SS316, nylon or HDPE as appropriate. Material grade is confirmed in your quote.` },
    { scope: "GENERAL", order: 6, question: `Do you offer ${lower} near me in Kochi and Ernakulam?`, answer: `Yes. Deva Safety Nets serves Kochi, Ernakulam and 160+ Kerala localities with local teams. Book a free site inspection to confirm availability in your area.` },
    { scope: "GENERAL", order: 7, question: `Why choose Deva Safety Nets for ${lower}?`, answer: `We offer free inspection, transparent itemised pricing, certified materials, warranty in writing and after-sales support. Every ${lower} project is installed by our own technicians, not outsourced crews.` },
    { scope: "INSTALLATION", order: 8, question: `What is the installation process for ${lower}?`, answer: `We survey on site, send an itemised quote within 24 hours, prepare materials for Kerala conditions, install with our own team, and complete a quality check before handover.` },
    { scope: "SAFETY", order: 9, question: `What safety standards apply to ${lower}?`, answer: `${name} installations use IS-compliant materials, engineered spacing, load-tested anchoring and post-install inspection — documented on request for societies and commercial clients.` },
    { scope: "GENERAL", order: 10, question: `Can ${lower} be used in apartments and villas?`, answer: `Yes. We customise ${lower} for apartments, villas, commercial and industrial properties across Kerala with finishes and specifications matched to each building type.` },
    { scope: "MAINTENANCE", order: 11, question: `How do I clean and care for ${lower}?`, answer: `Use plain water for cables and frames; hose nets gently. Avoid harsh chemicals. Deva Safety Nets offers repair, re-tensioning and AMC plans across Kerala.` },
  ];
}

function buildBlogBody(title: string, excerpt: string, tags: string[]) {
  const kerala = tags.some((t) => /kochi|kerala|coastal|ernakulam/i.test(t));
  const region = kerala ? "Kerala — from Kochi apartments to Ernakulam villas and coastal properties" : "India";
  return `${excerpt}

Deva Safety Nets has installed invisible grills, safety nets, bird control systems, sports nets and cloth hangers across thousands of homes and businesses in ${region}. This article reflects what our field teams see every week: real measurements, real material trade-offs, and the questions customers ask before they commit.

## Who this guide is for

Homeowners comparing balcony safety options, apartment residents seeking society approval, facility managers responsible for compliance, parents childproofing high-rise balconies, and anyone researching professional installation rather than DIY shortcuts will find practical, experience-based advice here.

## Understanding the problem

Balconies, windows, terraces and open edges cause preventable falls every year — especially in fast-growing cities where glass railings and large openings are fashionable but risky for children and pets. Bird droppings and pigeon nesting create hygiene issues in ducts and utility areas. The right solution depends on your building type, exposure, budget and how you use the space.

## How professional installation differs

Safety is not only about buying cables or mesh. Correct spacing, tested anchoring, appropriate material grade and professional tensioning determine whether a system actually works when it matters. Vendors who quote without surveying, subcontract installation, or use unbranded wire create the failures we are called to replace.

## Material selection in humid climates

${kerala ? "Kerala's humidity, monsoon rain and coastal salt air punish low-grade hardware. SS316 marine-grade stainless, UV-stabilised nylon and treated HDPE cost more upfront but often outlast bargain materials by many years. We explain these trade-offs during every free site inspection." : "Humidity and weather exposure affect hardware lifespan. Material grade should match your environment — not just your initial budget."}

## What to ask on the site survey

Before you approve any quote, confirm: Who installs — the company's own team or subcontractors? What exact material grade is specified? What warranty is in writing? How are anchors rated for your floor height? Are finishes society-compliant? The answers separate professional installers from brokers.

## Cost factors explained transparently

Pricing reflects measured area, material grade, access difficulty, design complexity and warranty tier — not arbitrary per-foot numbers copied from the internet. A free on-site inspection is the only reliable way to price ${title.toLowerCase().includes("net") ? "safety nets" : "invisible grills and safety solutions"} for your exact openings.

## Maintenance and long-term value

Quality installations need minimal care: periodic cleaning, post-monsoon checks and occasional re-tensioning. Annual maintenance contracts suit busy homeowners and apartment associations who want documented upkeep without remembering schedules themselves.

## Common mistakes to avoid

Choosing the lowest quote without comparing specifications. Skipping the site survey. Approving wide cable spacing where children are present. Using non-UV mesh in sunny terraces. Hiring vendors with no written warranty or local after-sales team.

## Why Kerala customers choose Deva Safety Nets

We are a local team with own trained technicians — not a call centre forwarding jobs. Free inspection, itemised quotes within 24 hours, IS-compliant materials, warranty in writing and responsive repair support across Kochi, Ernakulam and 160+ localities.

## Next steps

Ready to apply this guide to your home or facility? Contact Deva Safety Nets for a free inspection anywhere in Kerala. Call, WhatsApp or submit the quote form on our website — we respond quickly and never pressure you to decide on the spot.`;
}

function buildGuideBody(type: "INSTALLATION" | "MAINTENANCE" | "BUYING", serviceName: string) {
  const lower = serviceName.toLowerCase();
  const intro =
    type === "INSTALLATION"
      ? `This installation guide for ${lower} walks through what Deva Safety Nets does on every Kerala project — from the first survey to final handover and warranty documentation.`
      : type === "MAINTENANCE"
        ? `Proper maintenance keeps ${lower} safe and good-looking for years. This guide covers seasonal care for owners in Kochi, Ernakulam and across Kerala — and when to call a professional.`
        : `Before you buy ${lower}, read this buying guide from Deva Safety Nets. It explains how to compare quotes, materials and installers so you get real safety — not just the lowest price.`;
  return `${intro}

## Why professional specification matters

Professional ${lower} depend on accurate measurement, the right material grade for your location, and trained installation. Skipping any step is the most common reason systems fail prematurely or fail society approval. DIY or untrained fitting creates liability — not savings.

## Materials for Kerala conditions

For coastal and high-humidity areas — common across Kerala — material selection matters as much as installation skill. SS316 marine-grade stainless, UV-treated nets and corrosion-resistant hardware cost slightly more upfront but often save money over five to ten years. Inland homes may use SS304 or HDPE where exposure is milder.

## The survey and quote process

Deva Safety Nets recommends a free site inspection before any purchase decision. On-site, we assess span length, wind exposure, fixing surfaces, child or pet requirements and society guidelines, then provide an itemised written quote within 24 hours. Photos alone cannot replace measurement.

## Comparing vendors fairly

If you compare multiple vendors, ask each one: Who installs — their own team or subcontractors? What warranty is in writing? Which exact material grade is quoted? Are anchors rated for your floor height and exposure? Do they provide society documentation? Equal answers make price comparison meaningful.

## Installation day expectations

Our technicians prepare surfaces, fit anchors, install cables or mesh under correct tension, and walk you through the finished work before leaving. Most residential ${lower} jobs complete within one to two days. We protect your home during work and leave sites clean.

## After installation care

${type === "MAINTENANCE" ? `Wipe cables or frames with plain water, hose nets gently, and inspect anchors after monsoon. Schedule professional inspection annually or enroll in an AMC plan for hassle-free upkeep.` : `Follow the care sheet provided at handover. Report any loosening promptly — early re-tensioning is inexpensive compared to failure.`}

## When to call Deva Safety Nets

Contact us to schedule your free inspection in Kochi, Ernakulam or your Kerala locality. We serve apartments, villas, commercial and industrial clients with the same safety-first standard on every ${lower} project.`;
}

// ---------------------------------------------------------------------------
// Seed routine
// ---------------------------------------------------------------------------

async function main() {
  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.project.deleteMany(),
    prisma.comparison.deleteMany(),
    prisma.guide.deleteMany(),
    prisma.faq.deleteMany(),
    prisma.serviceMaterial.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.area.deleteMany(),
    prisma.city.deleteMany(),
    prisma.service.deleteMany(),
    prisma.category.deleteMany(),
    prisma.material.deleteMany(),
    prisma.industry.deleteMany(),
    prisma.propertyType.deleteMany(),
    prisma.contentOverride.deleteMany(),
  ]);

  console.log("Seeding materials...");
  const materials = await Promise.all(
    MATERIALS.map((m, i) =>
      prisma.material.create({
        data: {
          slug: slugify(m.grade),
          name: m.name,
          grade: m.grade,
          summary: m.summary,
          advantages: m.advantages,
          bestFor: m.bestFor,
          properties: m.properties,
          order: i,
        },
      }),
    ),
  );
  const materialByGrade = new Map(materials.map((m) => [m.grade, m]));

  console.log("Seeding industries...");
  await Promise.all(
    INDUSTRIES.map((ind, i) =>
      prisma.industry.create({
        data: {
          slug: slugify(ind.name),
          name: ind.name,
          summary: ind.summary,
          challenges: ind.challenges,
          solutions: ind.solutions,
          order: i,
        },
      }),
    ),
  );

  console.log("Seeding property types...");
  await Promise.all(
    PROPERTY_TYPES.map((p, i) =>
      prisma.propertyType.create({
        data: {
          slug: slugify(p.name),
          name: p.name,
          plural: p.plural,
          summary: p.summary,
          concerns: p.concerns,
          examples: p.examples,
          order: i,
        },
      }),
    ),
  );

  console.log("Seeding categories & services...");
  const coreServices: { id: string; slug: string; name: string; categoryName: string }[] = [];
  const seenServiceSlugs = new Set<string>();
  const categoryIdBySlug = new Map<string, string>();
  const categoryDefaults = new Map<string, CategorySeed>();

  for (let ci = 0; ci < CATEGORIES.length; ci++) {
    const cat = CATEGORIES[ci];
    const catSlug = slugify(cat.name);
    const category = await prisma.category.create({
      data: {
        slug: catSlug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        order: ci,
      },
    });
    categoryIdBySlug.set(catSlug, category.id);
    categoryDefaults.set(catSlug, cat);

    let order = 0;
    for (const s of cat.services) {
      const slug = slugify(s.name);
      if (seenServiceSlugs.has(slug)) {
        console.warn(`  Skipping duplicate service slug: ${slug}`);
        continue;
      }
      seenServiceSlugs.add(slug);

      const priceMin = s.priceMin !== undefined ? s.priceMin : cat.defaults.priceMin;
      const priceMax = s.priceMax !== undefined ? s.priceMax : cat.defaults.priceMax;
      const priceUnit = s.priceUnit ?? cat.defaults.priceUnit;

      const service = await prisma.service.create({
        data: {
          slug,
          name: s.name,
          categoryId: category.id,
          tagline: s.tagline,
          summary: `${s.tagline} Deva Safety Nets installs ${s.name.toLowerCase()} across Kerala with certified IS-compliant materials, free site inspection, transparent itemised pricing and warranty-backed workmanship. Our own trained technicians handle every project in Kochi, Ernakulam and 160+ localities — from apartments and villas to commercial and industrial sites. Whether you need child-safe balcony protection, pet safety, pigeon and bird control, or premium near-invisible finishes, we tailor each installation to your building type, society guidelines and local weather exposure. Every survey includes honest guidance on material grade — SS304, SS316, nylon or HDPE — and what your space actually requires for long-term safety.`,
          benefits: cat.defaults.benefits,
          features: cat.defaults.features,
          useCases: cat.defaults.useCases,
          keywords: [s.name, ...cat.defaults.useCases],
          priceMin: priceMin ?? null,
          priceMax: priceMax ?? null,
          priceUnit: priceUnit ?? null,
          order: order++,
          featured: s.featured ?? false,
          specifications: {
            warranty: "Up to 10 years",
            installation: "1-2 days",
            certification: "IS-compliant materials",
          },
        },
      });
      coreServices.push({ id: service.id, slug: service.slug, name: service.name, categoryName: cat.name });

      // Link relevant materials by category kind.
      const linkGrades = cat.materialKinds.flatMap((kind) =>
        kind === "metal" ? ["SS304", "SS316"] : ["Nylon", "HDPE"],
      );
      const uniqueGrades = [...new Set(linkGrades)];
      await Promise.all(
        uniqueGrades
          .map((g) => materialByGrade.get(g))
          .filter((m): m is NonNullable<typeof m> => Boolean(m))
          .map((m) =>
            prisma.serviceMaterial.create({
              data: { serviceId: service.id, materialId: m.id },
            }),
          ),
      );

      // Service-scoped FAQs.
      await prisma.faq.createMany({
        data: buildServiceFaqs(s.name, cat.name, priceMin, priceMax, priceUnit).map((f) => ({
          ...f,
          serviceId: service.id,
        })),
      });
    }
  }
  console.log(`  Created ${coreServices.length} core services.`);

  console.log("Seeding keyword SEO services (long-tail phrases x Kerala areas)...");
  const keywordSeeds = buildKeywordServiceSeeds();
  const KEYWORD_BATCH = 250;
  let keywordCreated = 0;
  for (let i = 0; i < keywordSeeds.length; i += KEYWORD_BATCH) {
    const chunk = keywordSeeds.slice(i, i + KEYWORD_BATCH);
    const rows: Prisma.ServiceCreateManyInput[] = [];
    for (const ks of chunk) {
      const slug = slugify(ks.name);
      if (seenServiceSlugs.has(slug)) continue;
      seenServiceSlugs.add(slug);
      const categoryId = categoryIdBySlug.get(ks.categorySlug);
      const cat = categoryDefaults.get(ks.categorySlug);
      if (!categoryId || !cat) continue;
      rows.push({
        slug,
        name: ks.name,
        categoryId,
        tagline: ks.tagline,
        summary: `${ks.tagline} Deva Safety Nets serves Kochi, Ernakulam and 160+ Kerala localities with certified materials, free site inspection and warranty-backed installation. Search for "${ks.phrase}" — we install with our own trained technicians, never subcontractors.`,
        benefits: cat.defaults.benefits,
        features: cat.defaults.features,
        useCases: cat.defaults.useCases,
        keywords: ks.keywords,
        priceMin: null,
        priceMax: null,
        priceUnit: null,
        order: 9000 + rows.length,
        featured: false,
        specifications: {
          warranty: "Up to 10 years",
          installation: "1-2 days",
          certification: "IS-compliant materials",
          region: "Kerala",
        },
      });
    }
    if (rows.length) {
      await prisma.service.createMany({ data: rows, skipDuplicates: true });
      keywordCreated += rows.length;
    }
    if ((i + KEYWORD_BATCH) % 2000 === 0 || i + KEYWORD_BATCH >= keywordSeeds.length) {
      console.log(`  ... ${Math.min(i + KEYWORD_BATCH, keywordSeeds.length)} / ${keywordSeeds.length} keyword phrases processed`);
    }
  }
  console.log(`  Created ${keywordCreated} keyword SEO services (${keywordSeeds.length} phrases in catalog).`);

  const allServices = await prisma.service.findMany({
    select: { id: true, slug: true, name: true, category: { select: { name: true } } },
  });
  const allServicesMeta = allServices.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    categoryName: s.category.name,
  }));

  console.log("Seeding general FAQs...");
  await prisma.faq.createMany({ data: GENERAL_FAQS });

  console.log("Seeding cities & areas...");
  const cityRecords: { id: string; name: string; slug: string }[] = [];
  let totalAreas = 0;
  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    const citySlug = slugify(c.name);
    const city = await prisma.city.create({
      data: {
        slug: citySlug,
        name: c.name,
        state: c.state,
        region: c.region,
        featured: c.featured ?? false,
        order: i,
        intro:
          c.intro ??
          `Deva Safety Nets delivers premium invisible grills, safety nets, bird control, sports enclosures and cloth hangers across ${c.name}, ${c.state}. Our local ${c.name} team offers free site inspections, fast professional installation, materials chosen for ${c.state === "Kerala" ? "Kerala's humid and coastal climate — including monsoon wind load and salt-air exposure where applicable" : "local weather conditions"}, and long-term warranty support. From apartments and villas to commercial offices, warehouses and industrial plants, we install with our own trained technicians — never subcontractors. Residents choose us for transparent itemised quotes, society-friendly finishes, child and pet safety expertise, and responsive after-sales repair across every major locality in ${c.name}.`,
        landmarks: [],
      },
    });
    cityRecords.push({ id: city.id, name: city.name, slug: citySlug });

    const groups = areaGroupsForCity(citySlug as "kochi" | "ernakulam");
    const areaRows: { cityId: string; slug: string; name: string; tier: number; tierLabel: string; landmarks: string[] }[] = [];
    for (const group of groups) {
      for (const name of group.names) {
        areaRows.push({
          cityId: city.id,
          slug: slugify(name),
          name,
          tier: group.tier,
          tierLabel: group.label,
          landmarks: [],
        });
      }
    }
    const seen = new Set<string>();
    const deduped = areaRows.filter((r) => (seen.has(r.slug) ? false : (seen.add(r.slug), true)));
    if (deduped.length) await prisma.area.createMany({ data: deduped });
    totalAreas += deduped.length;
  }
  console.log(`  Created ${cityRecords.length} cities and ${totalAreas} areas (${KERALA_AREA_GROUPS.reduce((n, g) => n + g.names.length, 0)} in hierarchy).`);

  console.log("Seeding blog posts...");
  await Promise.all(
    BLOG_POSTS.map((b, i) =>
      prisma.blogPost.create({
        data: {
          slug: slugify(b.title),
          title: b.title,
          excerpt: b.excerpt,
          tags: b.tags,
          readMinutes: 5 + (i % 4),
          body: buildBlogBody(b.title, b.excerpt, b.tags),
          publishedAt: new Date(Date.now() - i * 86400000 * 7),
        },
      }),
    ),
  );

  console.log("Seeding guides (installation / maintenance / buying) for core services...");
  const guideChunks: Promise<unknown>[] = [];
  for (const s of coreServices) {
    for (const type of ["INSTALLATION", "MAINTENANCE", "BUYING"] as const) {
      guideChunks.push(
        prisma.guide.create({
          data: {
            slug: `${type.toLowerCase()}-${s.slug}`,
            title: `${type === "INSTALLATION" ? "How to Install" : type === "MAINTENANCE" ? "How to Maintain" : "How to Buy"} ${s.name}`,
            type,
            serviceId: s.id,
            excerpt: `A complete ${type.toLowerCase()} guide for ${s.name.toLowerCase()}, written by our certified technicians.`,
            body: buildGuideBody(type, s.name),
            steps: [
              { title: "Free site inspection", detail: `Deva Safety Nets surveys your site in ${type === "INSTALLATION" ? "person and measures every opening" : type === "MAINTENANCE" ? "person to assess wear, tension and anchor condition" : "person to recommend the right specification and material grade"}.` },
              { title: "Written quote", detail: "You receive a transparent, itemised quote within 24 hours — no hidden hardware or labour charges." },
              { title: "Material preparation", detail: "We select SS304, SS316, nylon or HDPE as appropriate for your Kerala location and prepare anchors and frames." },
              { title: "Professional execution", detail: `Trained Deva Safety Nets technicians carry out the ${type.toLowerCase()} work following IS-compliant safety standards.` },
              { title: "Quality verification", detail: "We test tension, spacing and anchor integrity, then walk you through care instructions and warranty terms before handover." },
            ],
          },
        }),
      );
    }
  }
  await Promise.all(guideChunks);
  console.log(`  Created ${guideChunks.length} guides.`);

  console.log("Seeding comparisons...");
  const bySlug = new Map(allServicesMeta.map((s) => [s.slug, s]));
  const comparisonPairs: [string, string, string, string][] = [
    ["stainless-steel-invisible-grills", "balcony-safety-nets", "Both invisible grills and safety nets protect balconies in Kerala apartments and villas, but they differ significantly in upfront cost, aesthetics, lifespan, installation time and society perception. Invisible grills use high-tensile stainless steel cables spaced for fall prevention while staying nearly invisible from inside the home. Safety nets use UV-treated nylon or HDPE mesh that installs quickly, allows full airflow and excels at bird control as well as child safety. This comparison walks through price bands, maintenance, visibility, durability in humid coastal climates, RWA approval patterns in Kochi and Ernakulam, and which option suits permanent premium protection versus fast, economical coverage.", "Choose invisible grills for a premium, permanent, near-invisible solution with the longest lifespan — ideal when society aesthetics and long-term value matter. Choose safety nets for the most affordable, quick-to-install protection — especially when bird exclusion, rental-friendly removal or budget is the priority. Many Kerala homes use grills on main living balconies and nets on utility ducts; Deva Safety Nets recommends the right mix during your free site inspection."],
    ["ss316-invisible-grills", "stainless-steel-invisible-grills", "SS316 and SS304 invisible grills look similar but perform very differently in Kerala's coastal humidity and salt air. SS304 suits most inland apartments in Kakkanad, Edapally and Ernakulam municipalities with excellent value. SS316 marine-grade stainless resists pitting and corrosion near the sea — Fort Kochi, Vypin, Cherai and waterfront towers — often doubling effective cable life. This guide compares initial cost, corrosion resistance, warranty implications, when societies specify marine grade, and how monsoon salt spray accelerates cheap wire failures.", "For coastal cities like Kochi and properties within a few kilometres of the sea, SS316 is worth the premium for superior corrosion resistance and lower lifetime replacement cost. Inland Ernakulam homes with mild exposure typically achieve excellent results with SS304. Deva Safety Nets assesses your exact exposure during the free survey — never upsells grade without reason."],
    ["nylon-safety-nets", "hdpe-safety-nets", "Nylon and HDPE safety nets both appear on Kerala balconies, terraces and industrial spans — but they serve different priorities. Nylon offers higher breaking strength and a softer hand — preferred for child and pet safety where impact load matters. HDPE is UV-treated, rot-proof and cost-effective for large bird-exclusion areas, warehouses and ducts. Compare mesh life in full sun, tension behaviour after monsoon winds, cleaning effort, visibility from inside the home and typical price per square foot in Kochi and Ernakulam.", "Choose nylon for child and pet safety where breaking strength and finer mesh options matter most. Choose HDPE for cost-effective, rot-proof bird and industrial netting over large spans. Mixed buildings often use nylon on family balconies and HDPE on ducts — we specify both during inspection."],
  ];
  for (const [aSlug, bSlug, intro, verdict] of comparisonPairs) {
    const a = bySlug.get(aSlug);
    const b = bySlug.get(bSlug);
    if (!a || !b) continue;
    await prisma.comparison.create({
      data: {
        slug: `${a.slug}-vs-${b.slug}`,
        serviceAId: a.id,
        serviceBId: b.id,
        intro,
        verdict,
        criteria: [
          { label: "Starting price", a: "See service page", b: "See service page" },
          { label: "Lifespan", a: "15-20+ years", b: "3-7 years" },
          { label: "Visibility", a: "Nearly invisible", b: "Nearly invisible" },
          { label: "Installation time", a: "1-2 days", b: "A few hours" },
          { label: "Best for", a: "Permanent premium safety", b: "Fast, budget-friendly safety" },
        ],
      },
    });
  }

  console.log("Seeding reviews & projects...");
  const sampleServices = coreServices.slice(0, 16);
  const reviewAuthors = ["Ananya R.", "Rahul M.", "Priya S.", "Karthik V.", "Deepa N.", "Suresh K.", "Meera J.", "Arun P.", "Fathima A.", "Joseph T."];
  await Promise.all(
    sampleServices.map((s, i) =>
      prisma.review.create({
        data: {
          author: reviewAuthors[i % reviewAuthors.length],
          rating: 5 - (i % 2),
          body: `Excellent experience with the ${s.name.toLowerCase()}. Professional team, clean installation and great after-sales support. Highly recommended.`,
          serviceId: s.id,
          cityId: cityRecords[i % cityRecords.length].id,
        },
      }),
    ),
  );

  await Promise.all(
    sampleServices.slice(0, 10).map((s, i) =>
      prisma.project.create({
        data: {
          slug: `${s.slug}-project-${i + 1}`,
          title: `${s.name} at ${cityRecords[i % cityRecords.length].name}`,
          serviceId: s.id,
          cityId: cityRecords[i % cityRecords.length].id,
          summary: `A completed ${s.name.toLowerCase()} project in ${cityRecords[i % cityRecords.length].name} delivering premium safety with a spotless, society-approved finish. Deva Safety Nets measured on site, specified materials for local humidity and exposure, and installed with our own trained technicians.`,
          challenge: "The client needed reliable fall prevention or exclusion without compromising views, ventilation or building aesthetics. Previous quotes lacked itemised specifications or proposed ungraded materials unsuited to Kerala's monsoon climate.",
          solution: `We installed ${s.name.toLowerCase()} using certified IS-compliant materials, engineered spacing or mesh size for the client's safety priority, and a precise low-visibility mounting system with tested anchors and tension.`,
          outcome: "Delivered on schedule with written warranty documentation, a clean handover walkthrough and a delighted client who referred neighbours in the same building.",
          images: [],
        },
      }),
    ),
  );

  // ------------------------------------------------------------------
  // Capacity report
  // ------------------------------------------------------------------
  const counts = {
    categories: await prisma.category.count(),
    services: await prisma.service.count(),
    cities: await prisma.city.count(),
    areas: await prisma.area.count(),
    materials: await prisma.material.count(),
    industries: await prisma.industry.count(),
    propertyTypes: await prisma.propertyType.count(),
    faqs: await prisma.faq.count(),
    blog: await prisma.blogPost.count(),
    guides: await prisma.guide.count(),
    reviews: await prisma.review.count(),
    projects: await prisma.project.count(),
  };
  console.log("Seed complete:", counts);

  const S = counts.services;
  const C = counts.cities;
  const A = counts.areas;
  const P = counts.propertyTypes;
  const serviceCity = S * C;
  const serviceArea = S * A;
  const servicePropertyType = S * P;
  const propertyTypeCity = P * C;
  const serviceCityPropertyType = S * C * P;
  const serviceAreaPropertyType = S * A * P; // available on-demand (ISR)
  const guides = counts.guides;
  const addressable =
    serviceCity + serviceArea + servicePropertyType + propertyTypeCity + serviceCityPropertyType + guides;
  console.log("\nProgrammatic URL capacity from current data:");
  console.table({
    "Service x City": serviceCity,
    "Service x Area": serviceArea,
    "Service x PropertyType": servicePropertyType,
    "PropertyType x City": propertyTypeCity,
    "Service x City x PropertyType": serviceCityPropertyType,
    "Guides (install/maint/buying)": guides,
    "-> Addressable subtotal": addressable,
    "Service x Area x PropertyType (on-demand)": serviceAreaPropertyType,
    "=> Total reach": addressable + serviceAreaPropertyType,
  });
  console.log(
    `\nAdd more cities/areas or property types to scale linearly toward 500,000+ high-quality URLs.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
