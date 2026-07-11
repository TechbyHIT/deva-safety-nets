import { GENERAL_FAQS } from "../seed-content/general-faqs";

export const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type FaqScope = "GENERAL" | "SERVICE" | "INSTALLATION" | "MAINTENANCE" | "SAFETY" | "PRICING";

// Materials
// ---------------------------------------------------------------------------

export const MATERIALS = [
  { name: "SS304 Stainless Steel", grade: "SS304", kind: "metal", summary: "The industry-standard grade for invisible grills, offering excellent strength and corrosion resistance for most urban environments.", advantages: ["Great value", "High tensile strength", "Rust resistant"], bestFor: ["Apartments", "Inland cities"], properties: { tensile: "515 MPa", nickel: "8-10%", chromium: "18%" } },
  { name: "SS316 Marine Grade", grade: "SS316", kind: "metal", summary: "Marine-grade stainless steel with added molybdenum for superior corrosion resistance in coastal and high-humidity areas.", advantages: ["Best corrosion resistance", "Longest lifespan", "Salt-air ready"], bestFor: ["Coastal cities", "High humidity"], properties: { tensile: "515 MPa", molybdenum: "2-3%", chromium: "16-18%" } },
  { name: "Nylon Safety Net", grade: "Nylon", kind: "net", summary: "High-tenacity braided nylon with excellent knot strength and a skin-friendly finish, ideal for child and pet safety nets.", advantages: ["High breaking strength", "Soft on skin", "UV stabilised"], bestFor: ["Child safety", "Pet safety"], properties: { mesh: "15-25mm", uv: "Stabilised" } },
  { name: "HDPE Netting", grade: "HDPE", kind: "net", summary: "UV-treated high-density polyethylene, rot-proof and cost-effective for bird protection and industrial use.", advantages: ["Rot proof", "Cost effective", "Weatherproof"], bestFor: ["Bird control", "Industrial"], properties: { mesh: "40mm", uv: "Treated" } },
];

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------

export const INDUSTRIES = [
  { name: "Residential Apartments", summary: "High-rise and gated communities that need consistent, society-approved safety across hundreds of balconies.", challenges: ["Uniform facade", "Bulk timelines", "RWA approvals"], solutions: ["Standardised kits", "Phased rollout", "Approved color palettes"] },
  { name: "Villas & Independent Homes", summary: "Premium homes requiring bespoke, near-invisible protection that respects architecture.", challenges: ["Large spans", "Aesthetics"], solutions: ["Custom tensioning", "Designer frames"] },
  { name: "Commercial & Retail", summary: "Malls, showrooms and hotels needing durable, tamper-resistant systems for high footfall.", challenges: ["Durability", "Brand aesthetics"], solutions: ["Heavy-duty hardware", "Discreet installs"] },
  { name: "Industrial & Warehousing", summary: "Factories and warehouses requiring certified fall arrest and bird exclusion.", challenges: ["Load certification", "Large areas"], solutions: ["IS-code nets", "Rack protection"] },
  { name: "Education & Healthcare", summary: "Schools and hospitals prioritising child safety and hygiene.", challenges: ["Child certification", "Hygiene"], solutions: ["Fall-arrest mesh", "Anti-microbial options"] },
  { name: "Hospitality & Resorts", summary: "Hotels and resorts balancing guest safety with scenic views.", challenges: ["Aesthetics", "Coastal wear"], solutions: ["SS316 grills", "Bird exclusion nets"] },
  { name: "Construction & Infrastructure", summary: "Active build sites requiring debris containment and worker fall protection.", challenges: ["Site safety compliance", "Changing layouts"], solutions: ["Debris & scaffold nets", "Rapid deployment"] },
];

// ---------------------------------------------------------------------------
// Property types (reusable programmatic dimension)
// ---------------------------------------------------------------------------

export const PROPERTY_TYPES = [
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

export const CITIES: CitySeed[] = [
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

export const BLOG_POSTS = [
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

export function buildServiceFaqs(
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

export function buildBlogBody(title: string, excerpt: string, tags: string[]) {
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

export function buildGuideBody(type: "INSTALLATION" | "MAINTENANCE" | "BUYING", serviceName: string) {
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
