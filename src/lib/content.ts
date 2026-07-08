/**
 * Deterministic content engine.
 *
 * The platform scales to hundreds of thousands of URLs by generating pages from
 * combinations of a few base entities (service x city x area x property type).
 * To keep every page UNIQUE and USEFUL — and to avoid thin/duplicate/doorway
 * content — this module deterministically composes rich, long-form copy from
 * structured template pools using a stable hash of the route. The same URL
 * always renders the same content, but different combinations produce
 * meaningfully different, locally-relevant copy.
 *
 * Each page receives: multiple intro paragraphs, a "why it matters here"
 * section, local challenges, safety standards, a pricing-factor breakdown,
 * buying considerations, maintenance tips, a multi-section long-form guide,
 * generated location/property-aware FAQs, and key takeaways.
 */

// Stable string hash (FNV-1a) -> deterministic seed per route.
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// Deterministic PRNG (mulberry32) for stable per-route variety.
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  const rand = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Pick n distinct items deterministically.
function pickN<T>(arr: T[], n: number, seed: number): T[] {
  return shuffle(arr, seed).slice(0, Math.min(n, arr.length));
}

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

// ---------------------------------------------------------------------------
// Template pools
// ---------------------------------------------------------------------------

const INTRO_TEMPLATES = [
  (s: string, l: string) =>
    `Looking for dependable ${s} in ${l}? We combine premium materials, precision installation and a genuine safety-first approach to protect what matters most to you — without ever compromising your view.`,
  (s: string, l: string) =>
    `Our ${s} in ${l} are engineered for lasting safety and near-invisible looks. From the free site survey to the final quality check, every step is handled by trained specialists who take pride in a clean, discreet finish.`,
  (s: string, l: string) =>
    `Protect your home or workplace in ${l} with professionally installed ${s}. We tailor every installation to your building type, budget and exact safety requirements, and back it with a long-term warranty.`,
  (s: string, l: string) =>
    `Trusted by families and businesses across ${l}, our ${s} deliver certified protection, a spotless finish and warranty-backed peace of mind — installed fast, with minimal disruption.`,
  (s: string, l: string) =>
    `When it comes to ${s} in ${l}, experience matters. Our specialists have completed thousands of installations, and every project starts with a free, no-obligation assessment of your space.`,
];

const INTRO_PARA2 = [
  (s: string, l: string) =>
    `Every ${s.toLowerCase()} project we take on in ${l} is measured precisely on site, quoted transparently with no hidden charges, and installed by our own trained technicians — never subcontracted. That is how we guarantee consistent quality on every job.`,
  (s: string, l: string) =>
    `We understand that safety in ${l} cannot be left to chance. That is why our ${s.toLowerCase()} use only certified, IS-compliant materials, engineered spacing and tested anchoring so your family, pets and property stay protected for years.`,
  (s: string, l: string) =>
    `Choosing the right partner for ${s.toLowerCase()} in ${l} means choosing durability, aesthetics and service that lasts. We combine all three, and stay available long after installation with responsive maintenance and support.`,
  (s: string, l: string) =>
    `Whether you need a single balcony secured or a whole building covered, our ${s.toLowerCase()} in ${l} scale to any requirement. We handle projects of every size with the same attention to detail and safety.`,
  (s: string, l: string) =>
    `Deva Safety Nets has completed thousands of ${s.toLowerCase()} installations across Kerala. Residents in ${l} choose us for honest advice, certified materials and installations that pass society approval the first time.`,
  (s: string, l: string) =>
    `Looking for professional ${s.toLowerCase()} near you in ${l}? Our local team offers doorstep surveys, transparent itemised quotes and warranty-backed workmanship — without subcontracting any part of the job.`,
];

const INTRO_PARA3 = [
  (s: string, l: string) =>
    `Before we quote, we inspect your site in person. That means every ${s.toLowerCase()} price you receive from us reflects real measurements, the correct material grade for ${l}, and the actual fixing method your building needs — not a guess over the phone.`,
  (s: string, l: string) =>
    `Many customers in ${l} compare invisible grills and safety nets online before calling us. We welcome that — and we are happy to walk you through SS304 versus SS316, mesh spacing for children and pets, and what your apartment society typically approves.`,
  (s: string, l: string) =>
    `From the first WhatsApp enquiry to final handover, you deal with one accountable team. That continuity is why families, facility managers and builders across ${l} trust Deva Safety Nets for ${s.toLowerCase()} year after year.`,
];

const INTRO_PARA4 = [
  (s: string, l: string) =>
    `If you are searching for trusted ${s.toLowerCase()} installation in Kerala, start with a free site inspection. We serve ${l} and surrounding localities with same-week scheduling on most projects.`,
  (s: string, l: string) =>
    `Our ${s.toLowerCase()} are suitable for apartments, villas, commercial offices and industrial sites in ${l}. We tailor cable spacing, mesh size and anchoring to how your property is actually used — not a one-size-fits-all kit.`,
  (s: string, l: string) =>
    `Customers in ${l} often contact us after comparing online photos of invisible grills and safety nets. We bring samples, explain SS304 versus SS316 in plain language, and show how professional tensioning differs from cheap installations that sag within a year.`,
  (s: string, l: string) =>
    `Whether you manage one balcony or an entire gated community in ${l}, Deva Safety Nets assigns a single point of contact from survey through handover. That accountability is why facility managers and RWAs across Kerala work with us repeatedly.`,
  (s: string, l: string) =>
    `Searching for trusted ${s.toLowerCase()} near you in ${l}? Our technicians live and work across Kerala — they know local society norms, coastal corrosion risks and the fixing methods that survive monsoon season after season.`,
];

const WHY_MATTERS = [
  (s: string, l: string) =>
    `Falls from balconies, windows and open edges are among the most common — and most preventable — household accidents. In ${l}, rapid vertical growth means more high-rise living, making reliable ${s.toLowerCase()} essential rather than optional. A properly installed system removes that daily risk while keeping your view completely open.`,
  (s: string, l: string) =>
    `For residents of ${l}, safety and aesthetics no longer have to be a trade-off. Traditional welded grills block light, air and views; our ${s.toLowerCase()} protect just as effectively while staying almost invisible. The result is a home that feels open yet is genuinely secure.`,
  (s: string, l: string) =>
    `Modern buildings in ${l} feature large openings, glass railings and expansive balconies that look stunning but can pose real risks for children, elders and pets. Our ${s.toLowerCase()} are designed precisely for these situations, adding a discreet, engineered layer of protection.`,
];

const LOCAL_CHALLENGES = [
  (s: string, l: string) =>
    `Local conditions in ${l} — humidity, dust, monsoon exposure and coastal salt in some pockets — can degrade low-grade hardware quickly. We select material grades to suit these conditions, so your ${s.toLowerCase()} keep performing season after season.`,
  (s: string, l: string) =>
    `Buildings across ${l} vary widely, from independent homes to tall gated towers, each with different mounting surfaces and approval norms. Our team assesses every site individually and recommends the right ${s.toLowerCase()} configuration for your specific structure.`,
  (s: string, l: string) =>
    `Getting society or association approval in ${l} can be a hassle with the wrong vendor. We provide documentation, standardised finishes and clean installs that keep building façades uniform, making approvals for your ${s.toLowerCase()} straightforward.`,
];

const AREA_TEMPLATES = [
  (s: string, area: string, city: string) =>
    `Homeowners and businesses in ${area}, ${city} choose us for ${s.toLowerCase()} because we offer doorstep surveys, fast turnaround and installations tuned to local building styles. Our team knows the neighbourhood and reaches you quickly.`,
  (s: string, area: string, city: string) =>
    `We regularly install ${s.toLowerCase()} across ${area} and nearby ${city} localities, giving residents quick access to expert advice, honest pricing and reliable, warranty-backed service right at their doorstep.`,
  (s: string, area: string, city: string) =>
    `${area} is one of the areas in ${city} where we see strong demand for ${s.toLowerCase()}. That means we keep the right materials in stock and can schedule your installation faster, often within the same week as your survey.`,
  (s: string, area: string, city: string) =>
    `Residents of ${area} often ask about invisible grills versus safety nets for balconies. Our ${area} survey team explains both options on site so you can choose the right balance of view, budget and protection for your ${city} home.`,
  (s: string, area: string, city: string) =>
    `Property managers and homeowners in ${area}, ${city} rely on Deva Safety Nets for society-compliant finishes, documented safety standards and responsive after-sales support on every ${s.toLowerCase()} project.`,
];

const LOCAL_TEMPLATES = [
  (s: string, city: string, state: string) =>
    `As a local ${city} team, we understand the building types, weather and society requirements across ${state}. That means faster surveys, correct material choices and installations that pass approval the first time.`,
  (s: string, city: string, state: string) =>
    `We serve neighbourhoods throughout ${city} and the wider ${state} region with same-week site visits, transparent pricing and technicians who know local high-rise and independent-home conditions inside out.`,
  (s: string, city: string, state: string) =>
    `Our ${city} operations are built around local demand for ${s.toLowerCase()}, so we stock the right materials and schedule installs quickly — no long waits, no surprises, just dependable safety.`,
];

const CTA_LINES = [
  "Book a free site survey today and get a transparent, itemised quote within 24 hours.",
  "Call now or send a WhatsApp message for a fast, no-obligation quotation.",
  "Get expert advice and a free measurement visit — request your quote in under a minute.",
  "Secure your space this week — free survey, fast install, long-term warranty.",
];

const WHY_LOCAL = [
  "local technicians",
  "same-week installation",
  "free on-site measurement",
  "warranty-backed workmanship",
  "transparent pricing",
  "premium certified materials",
];

const SAFETY_STANDARDS_POOL = [
  "IS-compliant, certified materials on every installation",
  "Engineered cable/mesh spacing to prevent falls and climb-throughs",
  "Load-tested anchoring rated for wind and impact",
  "Corrosion-resistant, weatherproof hardware",
  "Child- and pet-safe design with no sharp edges",
  "Non-invasive fixing that protects your walls and structure",
  "Trained, background-verified installation technicians",
  "Post-installation quality inspection before handover",
  "Documented safety certification available on request",
];

const PRICING_FACTORS_POOL: PricingFactor[] = [
  { factor: "Measured area", detail: "Pricing is calculated on the exact measured area or running length, so you only pay for what you need." },
  { factor: "Material grade", detail: "SS304, marine-grade SS316, nylon or HDPE — higher grades cost more but last longer, especially in humid or coastal zones." },
  { factor: "Height & access", detail: "Higher floors and difficult access require extra safety equipment and time, which can affect the final price." },
  { factor: "Design complexity", detail: "Curved balconies, irregular spans and custom layouts need more labour and precision than standard rectangular openings." },
  { factor: "Frame & fittings", detail: "Powder-coated frames, premium turnbuckles and concealed fixings add to material cost but improve durability and looks." },
  { factor: "Quantity", detail: "Whole-building or multi-balcony projects benefit from bulk pricing compared to a single opening." },
  { factor: "Finish & colour", detail: "Standard finishes are most economical; custom colours and premium coatings carry a small premium." },
  { factor: "Warranty tier", detail: "Extended warranty and annual maintenance coverage can be bundled for long-term value." },
];

const BUYING_POOL = [
  "Insist on certified, branded materials — cheap wire and low-GSM mesh fail fast and compromise safety.",
  "Check the wire or mesh spacing; tighter spacing is essential where children or pets are present.",
  "Ask for marine-grade SS316 if you live in a coastal or high-humidity area.",
  "Confirm the warranty in writing, including what it covers and for how long.",
  "Verify that installation is done by the company's own trained technicians, not subcontractors.",
  "Request a free on-site measurement — accurate quotes are never given over the phone alone.",
  "Compare the fixing method; non-invasive, structurally sound anchoring protects your walls.",
  "Ask about after-sales support and whether annual maintenance is available.",
  "Look at real past projects and verified reviews before you commit.",
  "Ensure the quote is itemised with no hidden charges for hardware or labour.",
];

const MAINTENANCE_POOL = [
  "Wipe down cables or mesh every 3–6 months with plain water to remove dust and grime.",
  "Avoid harsh chemicals or abrasive scrubbers that can damage protective coatings.",
  "Periodically check cable tension and re-tension if any slack appears.",
  "Inspect anchor points and fittings for signs of corrosion, especially after monsoon.",
  "Keep sharp objects and open flames away from netting materials.",
  "Trim overhanging branches that can drop debris and strain the system.",
  "Schedule a professional inspection once a year for peace of mind.",
  "Report any visible damage promptly so small issues are fixed before they grow.",
  "Report any visible damage promptly so small issues are fixed before they grow.",
  "For coastal homes, rinse hardware more frequently to clear salt deposits.",
  "After monsoon, schedule a quick professional check — humidity can loosen fittings over time.",
  "Do not hang heavy objects on cables or nets; they are designed for fall prevention, not load bearing.",
  "Keep balcony drains clear so water does not pool against anchors and mesh edges.",
];

const KEY_TAKEAWAYS: ((s: string, l: string) => string)[] = [
  (s, l) => `Professional ${s.toLowerCase()} in ${l} protect against falls while keeping your view fully open.`,
  () => `Material grade (SS304 vs SS316, nylon vs HDPE) is the single biggest driver of lifespan and price.`,
  () => `Always get a free on-site survey — accurate pricing depends on measured area and site conditions.`,
  () => `Certified materials, tested anchoring and trained installers are non-negotiable for real safety.`,
  (s) => `A good ${s.toLowerCase()} installation lasts years with only minimal, occasional cleaning.`,
  (s, l) => `Deva Safety Nets serves ${l} with local teams, transparent quotes and warranty-backed ${s.toLowerCase()}.`,
  () => `Apartment societies in Kerala typically approve invisible grills and safety nets when finishes are uniform and documented.`,
  () => `Repair and annual maintenance contracts extend the safe life of grills and nets significantly.`,
];

// ---------------------------------------------------------------------------
// Long-form guide section builders
// ---------------------------------------------------------------------------

type Vars = {
  Service: string;
  service: string;
  location: string;
  context: string;
  city: string;
  property: string;
  propertyPlural: string;
};

const GUIDE_BUILDERS: ((v: Vars, r: () => number) => GuideSection)[] = [
  (v) => ({
    heading: `What are ${v.Service}?`,
    paragraphs: [
      `${v.Service} are a modern safety solution that replaces bulky welded bars with a discreet, engineered system. Instead of blocking your outlook, they use high-strength, corrosion-resistant elements spaced precisely to stop falls while remaining almost invisible from a short distance.`,
      `For homes and buildings in ${v.location}, this means you get robust protection for balconies, windows and open edges without sacrificing light, ventilation or the view you paid for. It is safety that blends into your architecture rather than fighting it.`,
    ],
  }),
  (v) => ({
    heading: `Key benefits of ${v.Service} for ${v.context}`,
    paragraphs: [
      `The biggest advantage is protection without compromise: you keep an unobstructed view while eliminating the risk of falls. ${v.Service} are also low-maintenance, weather-resistant and built to last, making them a smart long-term investment for ${v.context.toLowerCase()}.`,
      `Beyond safety, they add a clean, premium look to your space, deter intruders, and — with the right material grade — stand up to humidity, dust and coastal air. That combination is why so many customers in ${v.location} choose them over traditional grills.`,
    ],
  }),
  (v) => ({
    heading: `How ${v.Service} are installed in ${v.location}`,
    paragraphs: [
      `Installation begins with a free site survey where our technicians measure every opening precisely and assess the mounting surfaces. We then prepare the frame and anchor points, fit the cables or mesh under correct tension, and finish with concealed, weatherproof fixings.`,
      `The entire process for ${v.service} is typically completed within one to two days with minimal mess, and every job ends with a quality inspection before handover so you can be confident the system is safe and secure.`,
    ],
  }),
  (v) => ({
    heading: /price|cost|rate|charges|quote|estimate|cheap|affordable|per sq ft/i.test(v.Service)
      ? `${v.Service} — free quote survey in ${v.location}, Kerala`
      : `Getting a quote for ${v.Service} in ${v.location}`,
    paragraphs: [
      /price|cost|rate|charges|quote|estimate|cheap|affordable|per sq ft/i.test(v.Service)
        ? `Searching for ${v.service}? Deva Safety Nets provides a completely free site inspection in ${v.location} and sends an itemised, transparent quote within 24 hours — no hidden hardware or labour charges. We do not publish flat rates online because every balcony, window and terrace is different.`
        : `The scope of ${v.service} depends on measured area, material grade, site height and access. There is no one-size-fits-all figure — which is why we survey on site before quoting.`,
      `We walk you through SS304 vs SS316, nylon vs HDPE and installation options so you can balance budget and durability. For coastal and high-humidity parts of ${v.location}, marine-grade materials often deliver the best long-term value in Kerala's climate.`,
    ],
  }),
  (v) => ({
    heading: `Safety standards and certifications`,
    paragraphs: [
      `Genuine safety comes from more than just cables and mesh — it comes from correct engineering. We use IS-compliant, certified materials, tension every element to tested specifications, and anchor to ratings that account for wind and impact loads.`,
      `Our ${v.service} are designed with child- and pet-safe spacing and rounded, snag-free fittings. On request we can provide documented safety certification, which is especially useful for societies, offices and commercial sites in ${v.location}.`,
    ],
  }),
  (v) => ({
    heading: `Choosing the right ${v.Service} for your ${v.property.toLowerCase()}`,
    paragraphs: [
      `Not every ${v.property.toLowerCase()} needs the same solution. Factors like floor height, exposure to weather, the presence of children or pets, and your aesthetic preferences all influence the ideal specification for ${v.service}.`,
      `Our experts help you weigh these factors and recommend the right material grade, spacing and finish. The goal is a system that fits your ${v.property.toLowerCase()} perfectly — safe, good-looking and built to last in ${v.location}.`,
    ],
  }),
  (v) => ({
    heading: `Maintenance and long-term care`,
    paragraphs: [
      `One of the best things about ${v.service} is how little upkeep they need. A gentle clean with water every few months keeps them looking new, and an occasional tension check ensures continued safety.`,
      `We also offer annual maintenance contracts for customers in ${v.location} who want complete peace of mind, including scheduled inspections and priority support so your system stays in perfect condition for years.`,
    ],
  }),
  (v) => ({
    heading: `Why choose us for ${v.Service} in ${v.location}`,
    paragraphs: [
      `We are a safety-first team with thousands of completed installations, our own trained technicians, and a genuine commitment to quality over shortcuts. Every ${v.service} project gets the same care, whether it is one window or an entire tower.`,
      `From free surveys and transparent pricing to warranty-backed workmanship and responsive after-sales support, we make premium safety simple for homes and businesses across ${v.location}.`,
    ],
  }),
  (v) => ({
    heading: `Common mistakes to avoid`,
    paragraphs: [
      `The most common mistake is choosing the cheapest quote without checking material quality — low-grade wire or thin mesh can fail within a couple of years and defeat the entire purpose. Another is skipping the on-site survey, which leads to inaccurate pricing and poor fit.`,
      `For ${v.service} in ${v.location}, also avoid vendors who subcontract installation or offer no written warranty. Investing a little more in certified materials and professional fitting saves far more in the long run.`,
    ],
  }),
  (v) => ({
    heading: `Residential use — homes and families`,
    paragraphs: [
      `For independent houses and row homes in ${v.location}, ${v.service} protect children, elders and pets at windows, balconies and staircases without making the home feel caged in. We measure each opening individually because residential spans rarely match standard sizes.`,
      `Most residential customers want a solution that lasts through monsoon seasons with minimal cleaning. We recommend the appropriate material grade for your exposure — SS316 near the coast, UV-stabilised nets for sunny terraces — and explain maintenance in plain language before you decide.`,
    ],
  }),
  (v) => ({
    heading: `Apartment and high-rise solutions`,
    paragraphs: [
      `Apartment residents in ${v.location} often need society approval before installing ${v.service}. We use standardised finishes and clean anchor methods that keep façades uniform across floors, which makes committee approvals straightforward.`,
      `High-rise balconies face stronger wind loads than lower floors. Our team factors floor height into cable tension, mesh sizing and anchoring so your ${v.service} remain safe year-round in ${v.city} towers.`,
    ],
  }),
  (v) => ({
    heading: `Villa and premium property applications`,
    paragraphs: [
      `Villas and large independent homes in ${v.location} frequently have irregular spans, French windows and terrace parapets. ${v.Service} can be customised to follow architectural lines while delivering the same certified safety as standard installations.`,
      `Premium finishes — concealed fixings, powder-coated frames and tighter spacing — are popular with villa owners who want protection that guests barely notice. We discuss these options during your free survey.`,
    ],
  }),
  (v) => ({
    heading: `Commercial and office installations`,
    paragraphs: [
      `Offices, showrooms and co-working spaces in ${v.location} need ${v.service} that satisfy safety compliance without blocking daylight. We schedule work outside peak hours where possible and leave sites clean for staff and customers.`,
      `Commercial projects often cover multiple floors or branches. Deva Safety Nets provides itemised quotes per unit, consistent hardware specifications and documentation useful for facility audits.`,
    ],
  }),
  (v) => ({
    heading: `Industrial and warehouse applications`,
    paragraphs: [
      `Factories, warehouses and plants in ${v.location} use ${v.service} for fall arrest, machinery guarding, rack-back protection and bird exclusion. We specify mesh and cable ratings appropriate to the loads and environment — not residential-grade shortcuts.`,
      `Industrial sites may require phased installation around production schedules. Our project coordinators plan access, safety harness use and handover testing so operations resume quickly.`,
    ],
  }),
  (v) => ({
    heading: `Common customer concerns answered`,
    paragraphs: [
      `Customers often ask whether ${v.service} will rust, sag or look ugly within a few years. With certified materials, correct tensioning and periodic checks, a professional installation should stay safe and neat for many years in ${v.location}'s climate.`,
      `Others worry about drilling damage or removal when moving out. We use structurally sound, minimally invasive fixings and can explain removal options for rented ${v.propertyPlural.toLowerCase()} during the survey.`,
    ],
  }),
  (v) => ({
    heading: `Quality assurance and handover`,
    paragraphs: [
      `Every Deva Safety Nets project in ${v.location} ends with a documented quality check: tension verification, spacing confirmation, anchor inspection and a walkthrough with the customer before we consider the job complete.`,
      `You receive warranty terms in writing, care instructions and a direct contact for after-sales support. If anything loosens after monsoon or needs re-tensioning, our maintenance team is one call away.`,
    ],
  }),
  (v) => ({
    heading: `Why customers choose Deva Safety Nets`,
    paragraphs: [
      `Homeowners and businesses in ${v.location} tell us they chose Deva Safety Nets because we show up for the survey on time, quote transparently, install with our own trained technicians and stand behind the work long after installation day.`,
      `We do not push one product for every situation. If safety nets suit your balcony better than invisible grills — or vice versa — we say so. That honest guidance builds trust and leads to safer outcomes.`,
    ],
  }),
  (v) => ({
    heading: `Booking, survey and installation timeline`,
    paragraphs: [
      `Booking starts with a call, WhatsApp message or the quote form on our website. We confirm your address in ${v.location}, schedule a free inspection and usually deliver a written quote within 24 hours of the visit.`,
      `Once you approve the quote, most ${v.service} installations are completed within one to two days. Larger buildings or custom projects may run longer, but we agree timelines upfront so you can plan around minimal disruption.`,
    ],
  }),
  (v) => ({
    heading: `${v.Service} in Kochi, Ernakulam and wider Kerala`,
    paragraphs: [
      `Across Kochi, Ernakulam and Kerala's coastal belt, humidity and salt air punish low-grade hardware. We stock SS316, marine-grade fittings and UV-treated nets so ${v.service} in these conditions last significantly longer than bargain installations.`,
      `Whether you are in an Edapally apartment, a Kakkanad IT corridor tower, a Tripunithura villa or an Aluva independent home, our local teams know the building types and society norms in your neighbourhood.`,
    ],
  }),
  (v) => ({
    heading: `Materials used for ${v.Service}`,
    paragraphs: [
      `${v.Service} quality depends on the grade behind the brand name. We specify SS304 or SS316 stainless for cable systems, high-tenacity nylon or UV-treated HDPE for nets, and corrosion-resistant anchors suited to ${v.location}'s exposure.`,
      `During your survey we explain which material matches your budget and lifespan expectations. Coastal and high-humidity parts of ${v.city} often benefit from marine-grade upgrades that cost slightly more upfront but avoid early replacement.`,
    ],
  }),
  (v) => ({
    heading: `Installation process — step by step`,
    paragraphs: [
      `Step one is your free inspection: we measure, photograph fixing points and note access constraints. Step two is your itemised quote, usually within 24 hours. Step three is material preparation and scheduling — most ${v.service} jobs in ${v.location} install within one to two days.`,
      `Installation day includes surface preparation, anchor fitting, cable or mesh tensioning, and a final walkthrough with you before we sign off. We leave the site clean and provide written care instructions and warranty terms.`,
    ],
  }),
  (v) => ({
    heading: `Cleaning and care tips`,
    paragraphs: [
      `${v.Service} need less maintenance than most homeowners expect. Plain water and a soft cloth remove dust and salt residue from cables and frames. Avoid abrasive scrubbers and strong chemicals that strip protective coatings.`,
      `For nets, gentle hosing clears bird droppings and leaf debris. After Kerala monsoon, a quick visual check of anchors and tension takes minutes and prevents small issues from becoming safety risks in ${v.location}.`,
    ],
  }),
  (v) => ({
    heading: `Product specifications explained`,
    paragraphs: [
      `Specifications for ${v.service} include cable diameter or mesh size, material grade, anchor type, spacing between elements and design load rating. These are not marketing labels — they determine whether the system actually stops a fall or bird entry.`,
      `We document the specification used on your ${v.property.toLowerCase()} in ${v.location} so you know exactly what was installed. If you compare quotes from other vendors, ask for the same detail — not just price per square foot.`,
    ],
  }),
  (v) => ({
    heading: `Nearby areas we serve from ${v.location}`,
    paragraphs: [
      `Deva Safety Nets serves ${v.location} and surrounding Kerala localities with the same survey standards and installation teams. Neighbouring areas often share building styles and society requirements, so our experience transfers directly to your project.`,
      `If you are comparing installers, choose one with proven work in your micro-market — not a distant call centre. Local teams reach you faster for surveys, installs and after-sales support on ${v.service}.`,
    ],
  }),
];

// ---------------------------------------------------------------------------
// Generated FAQ builders (location/property aware)
// ---------------------------------------------------------------------------

const FAQ_BUILDERS: ((v: Vars) => GeneratedQA)[] = [
  (v) => ({ question: `Do you provide free site inspection for ${v.service} in ${v.location}?`, answer: `Yes. We offer a completely free, no-obligation site inspection and measurement anywhere in ${v.location} before providing your quote for ${v.service}.` }),
  (v) => ({ question: `How long does ${v.service} installation take in ${v.location}?`, answer: `Most ${v.service} installations in ${v.location} are completed within one to two days of the survey, with minimal disruption. Same-week scheduling is usually available.` }),
  (v) => ({ question: `Are ${v.service} safe for children and pets?`, answer: `Absolutely. Our ${v.service} use engineered, close spacing and high-strength materials specifically designed to keep children and pets safe from falls.` }),
  (v) => ({ question: `What warranty do you offer on ${v.service}?`, answer: `We provide a long-term warranty on ${v.service}, with the exact duration depending on the material grade selected. Full terms are confirmed in your written quote.` }),
  (v) => ({ question: `Will ${v.service} block my view or ventilation?`, answer: `No. ${v.Service} are designed to be nearly invisible and allow full light and airflow, so you keep your view and ventilation while staying protected.` }),
  (v) => ({ question: `Can ${v.service} be installed in a rented ${v.property.toLowerCase()}?`, answer: `Yes. Our fixing methods are non-invasive and can be removed cleanly if needed, making ${v.service} suitable for rented ${v.propertyPlural.toLowerCase()} as well as owned homes.` }),
  (v) => ({ question: `How much do ${v.service} cost in ${v.location}?`, answer: `The cost of ${v.service} in ${v.location} depends on measured area, material grade and site conditions. Request a free survey for an accurate, itemised quote.` }),
  (v) => ({ question: `Do you need society approval for ${v.service}?`, answer: `Most societies in ${v.location} permit ${v.service} for safety reasons. We provide standardised finishes and documentation to make approval straightforward.` }),
  (v) => ({ question: `What is the difference between invisible grills and safety nets?`, answer: `Invisible grills use stainless steel cables for a near-invisible, premium look ideal for balconies and windows. Safety nets use nylon or HDPE mesh — faster to install and often more economical for bird control and child safety. We recommend the best option during your free survey in ${v.location}.` }),
  (v) => ({ question: `Do you offer ${v.service} repair and maintenance?`, answer: `Yes. Deva Safety Nets provides re-tensioning, patch repairs, cable replacement and annual maintenance contracts for ${v.service} across ${v.location}.` }),
  (v) => ({ question: `Which material grade should I choose — SS304 or SS316?`, answer: `SS304 suits most inland homes in ${v.location}. SS316 marine-grade stainless is recommended for coastal areas, high humidity and properties within a few kilometres of the sea — including much of Kochi and Ernakulam.` }),
  (v) => ({ question: `How do I book a free site inspection for ${v.service}?`, answer: `Call us, send a WhatsApp message or submit the quote form on our website. We schedule a free inspection anywhere in ${v.location} and send an itemised quote within 24 hours.` }),
  (v) => ({ question: `Are you a local ${v.service} installer near me in ${v.location}?`, answer: `Yes. Deva Safety Nets serves ${v.location} with local technicians — not outsourced crews. We offer doorstep surveys and same-week installation on most ${v.service} projects.` }),
  (v) => ({ question: `Will monsoon weather affect ${v.service}?`, answer: `Our ${v.service} use corrosion-resistant materials and weatherproof fixings designed for Kerala's monsoon. We inspect anchor points and tension after heavy seasons as part of our maintenance service.` }),
  (v) => ({ question: `Do ${v.service} work for bird and pigeon problems?`, answer: `Safety nets and bird exclusion systems are highly effective against pigeons and nesting birds in ${v.location}. If birds are your main concern, we may recommend nets or spikes instead of grills — we assess this on site.` }),
  (v) => ({ question: `Can you install ${v.service} on an existing building without renovation?`, answer: `In most cases, yes. Installations attach to existing frames, parapets or walls with minimally invasive fixings. Our survey confirms what is possible for your specific ${v.property.toLowerCase()} in ${v.location}.` }),
  (v) => ({ question: `Is professional ${v.service} installation worth it?`, answer: `Professional installation ensures correct tension, spacing and anchoring — the factors that actually determine safety. DIY or untrained fitting is a common cause of failures; Deva Safety Nets installs with certified technicians and written warranty.` }),
  (v) => ({ question: `Do you provide an annual maintenance contract (AMC)?`, answer: `Yes. AMC plans include scheduled inspections, tension checks and priority support for ${v.service} in ${v.location}. Ask about AMC when you receive your quote.` }),
  (v) => ({ question: `What payment options do you accept?`, answer: `We accept standard bank transfer and UPI for ${v.service} projects in ${v.location}. Payment milestones are clearly listed in your written quote before work begins.` }),
  (v) => ({ question: `How do I clean and maintain ${v.service}?`, answer: `Use plain water and soft cloth on cables or frames; hose nets gently. Avoid harsh chemicals. Schedule a post-monsoon check in ${v.location} — Deva Safety Nets offers AMC plans if you prefer professional upkeep.` }),
  (v) => ({ question: `What materials are used for ${v.service}?`, answer: `We use IS-compliant SS304, SS316, nylon or HDPE as appropriate for ${v.service} in ${v.location}. Material grade is confirmed in your written quote after the free survey.` }),
  (v) => ({ question: `Can you install ${v.service} in commercial buildings in ${v.location}?`, answer: `Yes. We install for offices, retail, warehouses and industrial sites in ${v.location} with specifications and documentation suited to each environment.` }),
  (v) => ({ question: `Do you serve nearby areas around ${v.location}?`, answer: `Yes. Deva Safety Nets covers ${v.location} and surrounding Kerala localities with local survey and installation teams — not outsourced crews.` }),
  (v) => ({ question: `What should I prepare before the site survey for ${v.service}?`, answer: `Ensure access to balconies or windows, and share society guidelines if applicable. No special preparation is needed — our technician handles measurement and assessment in ${v.location}.` }),
  (v) => ({ question: `Are ${v.service} visible from outside the building?`, answer: `Quality ${v.service} are designed to be discreet. Invisible grills are near-invisible from a distance; safety nets use low-visibility mesh. We discuss aesthetic concerns during your survey in ${v.location}.` }),
  (v) => ({ question: `Can I get ${v.service} for just one balcony?`, answer: `Yes. Single-balcony projects are common in ${v.location}. Pricing is based on measured area — you only pay for what you need.` }),
];

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateContent(
  serviceName: string,
  routeKey: string,
  loc: LocationContext = {},
): GeneratedContent {
  const seed = hash(routeKey);
  const r = rng(seed);

  const propertySuffix = loc.propertyType ? ` for ${loc.propertyType}` : "";
  const locationLabel = [loc.areaName, loc.cityName].filter(Boolean).join(", ") || "your area";
  const propertyPlural = loc.propertyTypePlural ?? (loc.propertyType ? `${loc.propertyType}s` : "homes");
  const contextLabel = loc.propertyType
    ? `${propertyPlural}${loc.cityName ? ` in ${locationLabel}` : ""}`
    : locationLabel;

  const heading = loc.areaName
    ? `${serviceName}${propertySuffix} in ${loc.areaName}, ${loc.cityName}`
    : loc.cityName
      ? `${serviceName}${propertySuffix} in ${loc.cityName}`
      : loc.propertyType
        ? `${serviceName} for ${propertyPlural}`
        : serviceName;

  const vars: Vars = {
    Service: serviceName,
    service: serviceName.toLowerCase(),
    location: locationLabel === "your area" ? "your city" : locationLabel,
    context: contextLabel === "your area" ? "your home" : contextLabel,
    city: loc.cityName ?? "your city",
    property: loc.propertyType ?? "home",
    propertyPlural: propertyPlural,
  };

  const intro = pick(INTRO_TEMPLATES, seed)(serviceName, contextLabel);
  const introParagraphs = [
    intro,
    pick(INTRO_PARA2, seed >> 2)(serviceName, vars.location),
    pick(INTRO_PARA3, seed >> 16)(serviceName, vars.location),
    pick(INTRO_PARA4, seed >> 17)(serviceName, vars.location),
    pick(INTRO_PARA4, seed >> 18)(serviceName, vars.location),
    pick(INTRO_PARA2, seed >> 19)(serviceName, vars.location),
    pick(INTRO_PARA3, seed >> 20)(serviceName, vars.location),
    pick(INTRO_PARA4, seed >> 21)(serviceName, vars.location),
  ];

  let localInfo = "";
  if (loc.areaName && loc.cityName) {
    localInfo = pick(AREA_TEMPLATES, seed >> 3)(serviceName, loc.areaName, loc.cityName);
  } else if (loc.cityName) {
    localInfo = pick(LOCAL_TEMPLATES, seed >> 3)(serviceName, loc.cityName, loc.state ?? "Kerala");
  } else {
    localInfo = `We deliver ${serviceName.toLowerCase()} across Kerala — from Kochi and Ernakulam to every major town, municipality and residential locality — with a consistent, safety-first standard and local expert teams.`;
  }
  if (loc.propertyType) {
    localInfo += ` For ${propertyPlural.toLowerCase()}, we tailor the design, materials and fixings to the specific safety needs and aesthetics of your property.`;
  }
  if (loc.landmarks?.length) {
    localInfo += ` We regularly serve customers near ${pickN(loc.landmarks, 2, seed >> 18).join(" and ")}, and our technicians know the access and building styles in that part of ${loc.cityName ?? "the city"}.`;
  }

  const highlights = pickN(WHY_LOCAL, 3, seed >> 5).join(", ");

  // Long-form guide: 12-15 unique sections chosen per route.
  const guideCount = 12 + (seed % 4);
  const guideSections = pickN(GUIDE_BUILDERS, guideCount, seed >> 6).map((b) => b(vars, r));

  // Generated FAQs: 12-16 per route.
  const faqCount = 12 + (seed % 5);
  const generatedFaqs = pickN(FAQ_BUILDERS, faqCount, seed >> 8).map((b) => b(vars));

  const keyTakeaways = pickN(KEY_TAKEAWAYS, 8, seed >> 9).map((b) => b(serviceName, vars.location));

  return {
    heading,
    intro,
    introParagraphs,
    localInfo,
    whyMatters: pick(WHY_MATTERS, seed >> 10)(serviceName, vars.location),
    localChallenges: pick(LOCAL_CHALLENGES, seed >> 11)(serviceName, vars.location),
    benefitsIntro: `Here is why customers with ${contextLabel.toLowerCase()} choose our ${serviceName.toLowerCase()}:`,
    ctaLine: pick(CTA_LINES, seed >> 7),
    whyLocal: `With ${highlights}, we make premium safety simple.`,
    keyTakeaways,
    safetyStandards: pickN(SAFETY_STANDARDS_POOL, 10, seed >> 12),
    pricingFactors: pickN(PRICING_FACTORS_POOL, 8, seed >> 13),
    buyingConsiderations: pickN(BUYING_POOL, 10, seed >> 14),
    maintenanceTips: pickN(MAINTENANCE_POOL, 10, seed >> 15),
    guideSections,
    generatedFaqs,
  };
}

/** Deterministically order benefits/features so pages vary but stay stable. */
export function varyList<T>(list: T[], routeKey: string): T[] {
  return shuffle(list, hash(routeKey));
}
