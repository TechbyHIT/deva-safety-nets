import type { FaqScope } from "@/lib/static-data/seed-data";

export type GeneralFaqSeed = { scope: FaqScope; order: number; question: string; answer: string };

/** 100+ unique general FAQs for /faq and homepage accordion. */
export const GENERAL_FAQS: GeneralFaqSeed[] = [
  // ── General & booking ──
  { scope: "GENERAL", order: 0, question: "Do you offer free site inspection?", answer: "Yes. Deva Safety Nets provides a free on-site inspection and measurement before every quote across Kerala, including Kochi, Ernakulam and 160+ localities." },
  { scope: "GENERAL", order: 1, question: "What warranty do you provide?", answer: "We offer up to 10 years warranty on invisible grills and up to 5 years on safety nets, depending on material grade. All terms are confirmed in your written quote." },
  { scope: "GENERAL", order: 2, question: "Do you serve my city or area in Kerala?", answer: "We serve Kochi, Ernakulam district and major Kerala towns. Check your city or area page, or contact us to confirm availability in your locality." },
  { scope: "INSTALLATION", order: 3, question: "How do I book installation with Deva Safety Nets?", answer: "Call us, WhatsApp your requirement or submit the quote form on our website. We schedule a free inspection and send an itemised quote within 24 hours." },
  { scope: "GENERAL", order: 4, question: "How quickly can you schedule a site survey?", answer: "Most Kerala localities receive a survey slot within two to five business days. Urgent child-safety or bird-control projects in Kochi and Ernakulam are often scheduled the same week." },
  { scope: "GENERAL", order: 5, question: "What happens during a free site inspection?", answer: "Our technician measures openings, checks fixing surfaces, assesses wind exposure and floor height, discusses your safety priorities and explains material options. You receive a written quote — never pressure to decide on the spot." },
  { scope: "GENERAL", order: 6, question: "Do you provide written quotes?", answer: "Yes. Every quote is itemised with measured area, material grade, hardware, labour and warranty terms. There are no hidden charges for standard installations." },
  { scope: "GENERAL", order: 7, question: "What payment options do you accept?", answer: "We accept bank transfer and UPI. Payment milestones are listed clearly in your quote before work begins." },
  { scope: "GENERAL", order: 8, question: "Why choose Deva Safety Nets?", answer: "Free site inspection, transparent pricing, own trained technicians, certified materials, warranty in writing and responsive after-sales support — backed by thousands of Kerala installations." },

  // ── Invisible grills ──
  { scope: "GENERAL", order: 10, question: "What are invisible grills?", answer: "Invisible grills are near-invisible stainless steel cable systems installed on balconies and windows. They prevent falls while keeping your view and ventilation open — a popular choice for apartments and villas in Kerala." },
  { scope: "GENERAL", order: 11, question: "Are invisible grills safe for children?", answer: "Yes. Child-safe invisible grills use engineered cable spacing that prevents climb-throughs and falls. Deva Safety Nets installs with rounded fittings and tested tension for homes with children." },
  { scope: "GENERAL", order: 12, question: "Do invisible grills block the view?", answer: "No. From normal viewing distance, quality invisible grills are barely noticeable. They preserve skyline and garden views while providing fall protection." },
  { scope: "INSTALLATION", order: 13, question: "How long does invisible grill installation take?", answer: "Most invisible grill installations are completed within one to two days after the free survey. Whole-building projects may take longer; we agree timelines in your quote." },
  { scope: "MAINTENANCE", order: 14, question: "What maintenance do invisible grills need?", answer: "Occasional wiping with water, periodic tension checks and post-monsoon inspection of anchors. We offer AMC plans for hassle-free upkeep." },
  { scope: "MAINTENANCE", order: 15, question: "Do you offer invisible grill repair?", answer: "Yes. We re-tension cables, replace corroded sections, fix anchors and upgrade material grades on existing invisible grills across Kerala." },
  { scope: "PRICING", order: 16, question: "How much do invisible grills cost in Kerala?", answer: "Invisible grills typically range from ₹85–₹210 per sq ft depending on area, SS304 vs SS316 grade and site complexity. Request a free survey for an exact itemised quote." },
  { scope: "GENERAL", order: 17, question: "Balcony invisible grills vs window invisible grills — what is the difference?", answer: "Balcony systems cover larger horizontal spans with higher wind-load requirements. Window grills fit smaller vertical openings with slimmer frames. Both use the same cable technology but differ in anchoring and tension specifications." },
  { scope: "GENERAL", order: 18, question: "Can invisible grills be installed on French windows?", answer: "Yes. We custom-fit invisible grills to floor-to-ceiling French windows and sliding tracks, preserving the architectural look while securing the opening." },
  { scope: "GENERAL", order: 19, question: "Are invisible grills suitable for high-rise apartments?", answer: "Yes. We engineer cable tension and anchoring for floor height and wind exposure — essential for towers in Kakkanad, Edapally and other high-rise zones across Kochi." },

  // ── Safety nets & balcony nets ──
  { scope: "GENERAL", order: 20, question: "What are balcony safety nets?", answer: "Balcony safety nets are UV-stabilised nylon or HDPE mesh barriers that childproof balconies, deter pigeons and protect pets. They install quickly and are economical for many Kochi apartments." },
  { scope: "GENERAL", order: 21, question: "Invisible grills vs safety nets — which is better?", answer: "Invisible grills offer a premium, near-invisible look ideal for long-term balcony and window protection. Safety nets are faster to install and often better for bird control and budget projects. We recommend the right option during your free survey." },
  { scope: "INSTALLATION", order: 22, question: "How long does safety net installation take?", answer: "Safety nets often install within a few hours to one day per balcony, depending on size and access. Same-week scheduling is available in most Kerala localities." },
  { scope: "MAINTENANCE", order: 23, question: "Do you offer safety net repair?", answer: "Yes. We patch tears, re-tie perimeter ropes and replace degraded nets. Annual maintenance contracts are available for apartments and commercial sites." },
  { scope: "PRICING", order: 24, question: "How much do safety nets cost in Kochi?", answer: "Balcony safety nets typically range from ₹5–₹16 per sq ft based on mesh type, area and floor height. We measure on site before quoting." },
  { scope: "GENERAL", order: 25, question: "What is the difference between balcony nets and balcony safety nets?", answer: "Both terms describe mesh barriers for balcony protection. We specify mesh size, breaking strength and UV rating based on whether your priority is child safety, pet safety or bird exclusion." },
  { scope: "GENERAL", order: 26, question: "Can balcony nets stop monkeys?", answer: "Heavy-duty nylon nets with appropriate mesh size can deter monkeys in hill and temple-adjacent areas. We assess local wildlife pressure during your site inspection." },
  { scope: "GENERAL", order: 27, question: "Do balcony nets affect airflow?", answer: "Quality safety nets allow full ventilation while blocking falls and birds. Mesh size is chosen to balance airflow with the protection level you need." },

  // ── Child safety ──
  { scope: "SAFETY", order: 30, question: "Are safety nets safe for children?", answer: "Yes. Child safety nets use appropriate mesh spacing and high breaking strength. We never use oversized mesh where small children are present." },
  { scope: "SAFETY", order: 31, question: "At what age should I install balcony protection?", answer: "As soon as children can reach balcony rails or window sills — often from toddler age. Prevention before an incident is always safer and cheaper than reacting after one." },
  { scope: "SAFETY", order: 32, question: "Can children climb invisible grills?", answer: "Professional invisible grills use anti-climb spacing that prevents footholds. Cheap installations with wide spacing can be climbable — which is why certified spacing and tension matter." },
  { scope: "SAFETY", order: 33, question: "Are invisible grills safer than traditional welded grills?", answer: "Both can be safe when engineered correctly. Invisible grills offer better aesthetics and view; traditional grills may feel more solid but block light. The critical factor is spacing, anchoring and professional installation." },
  { scope: "SAFETY", order: 34, question: "Do you install child safety solutions in schools?", answer: "Yes. We install fall-prevention netting for atriums, corridors and open shafts in schools across Kerala, with documentation for safety audits on request." },

  // ── Pet safety ──
  { scope: "SAFETY", order: 40, question: "Are safety nets safe for pets?", answer: "Yes. Pet safety nets use appropriate mesh size and high breaking strength to keep cats and dogs secure on balconies. We assess your pet's size and behaviour during the site inspection." },
  { scope: "SAFETY", order: 41, question: "Can cats escape through safety nets?", answer: "Not when mesh size and perimeter fixing are specified correctly for cats. We use finer mesh and secure edge anchoring for cat-heavy households." },
  { scope: "SAFETY", order: 42, question: "Are invisible grills safe for large dogs?", answer: "Yes, with correct cable spacing and tension rated for impact. We assess dog size and jumping behaviour during the survey." },
  { scope: "SAFETY", order: 43, question: "Pet safety nets vs invisible grills for balconies?", answer: "Nets are often faster and more economical for pet-only protection. Invisible grills suit owners who want premium aesthetics plus pet safety. We recommend based on your balcony use and budget." },

  // ── Pigeon & bird ──
  { scope: "SAFETY", order: 50, question: "Do safety nets stop pigeons?", answer: "Pigeon safety nets and bird exclusion nets are highly effective at keeping pigeons off balconies, ducts and utility areas while allowing airflow. They are widely used across Kerala apartments." },
  { scope: "GENERAL", order: 51, question: "What are pigeon nets?", answer: "Pigeon nets are fine-mesh exclusion systems that prevent pigeons from roosting and nesting on balconies, windows and duct areas. They are humane and widely used in Kochi apartments." },
  { scope: "GENERAL", order: 52, question: "Pigeon nets vs bird spikes — which do I need?", answer: "Nets block access to open areas like balconies. Spikes deter roosting on ledges and parapets. Many buildings use both. We assess your bird problem on site and recommend the right combination." },
  { scope: "GENERAL", order: 53, question: "What are bird spikes?", answer: "Bird spikes are stainless steel or polycarbonate deterrents installed on ledges and parapets to stop birds from roosting. They are humane, durable and commonly used on commercial façades and residential ledges." },
  { scope: "GENERAL", order: 54, question: "Are bird spikes humane?", answer: "Yes. Spikes prevent landing without harming birds. They are a standard, approved bird-deterrent method used worldwide on residential and commercial buildings." },
  { scope: "GENERAL", order: 55, question: "Do bird nets work for duct areas?", answer: "Yes. Duct and service-shaft netting is one of the most common bird-control jobs in Kerala apartments, where pigeons nest in unused shafts." },
  { scope: "GENERAL", order: 56, question: "How do I clean pigeon mess before installation?", answer: "We advise basic cleaning before netting. Our team can guide you on preparation during the survey. Severe infestation cases may need cleaning before mesh is fitted." },

  // ── Sports nets & cloth hangers ──
  { scope: "GENERAL", order: 60, question: "Do you install sports nets?", answer: "Yes. Deva Safety Nets installs cricket nets, football nets, badminton nets and multi-sport enclosures for homes, schools and clubs across Kerala." },
  { scope: "GENERAL", order: 61, question: "Can cricket nets be installed in a home backyard?", answer: "Yes. We build practice cages and boundary nets to fit available space, with galvanised poles and high-impact mesh rated for cricket balls." },
  { scope: "GENERAL", order: 62, question: "Do you install cloth hangers?", answer: "Yes. We install ceiling cloth hangers, balcony cloth hangers and foldable drying systems for apartments and villas in Kochi and Ernakulam." },
  { scope: "GENERAL", order: 63, question: "Ceiling cloth hangers vs balcony cloth hangers?", answer: "Ceiling systems save floor space indoors or on covered balconies. Balcony-mounted racks suit open drying with weatherproof hardware. We recommend based on your layout during inspection." },
  { scope: "GENERAL", order: 64, question: "Are motorized cloth hangers worth it?", answer: "Motorized systems suit premium homes where convenience matters. Pulley and ceiling systems offer excellent value for most Kerala apartments. We explain options and pricing on site." },

  // ── Materials ──
  { scope: "GENERAL", order: 70, question: "SS304 vs SS316 — which should I choose?", answer: "SS304 suits most inland Kerala homes. SS316 marine-grade stainless is recommended for coastal areas like Fort Kochi, Vypin and other salt-air zones." },
  { scope: "GENERAL", order: 71, question: "Nylon vs HDPE safety nets — what is the difference?", answer: "Nylon offers higher breaking strength and a softer finish — ideal for child and pet safety. HDPE is UV-treated, rot-proof and cost-effective for bird exclusion and large spans." },
  { scope: "SAFETY", order: 72, question: "Do you use IS-compliant materials?", answer: "Yes. Deva Safety Nets uses certified, IS-compliant materials on every project. Documentation is available on request for societies and commercial clients." },
  { scope: "GENERAL", order: 73, question: "How long do invisible grill cables last?", answer: "With SS304 in inland Kerala, 8–12 years is typical with basic care. SS316 near the coast often exceeds that. Poor-grade wire may fail in 2–3 years — which is why material grade matters." },
  { scope: "GENERAL", order: 74, question: "Do safety nets fade in Kerala sun?", answer: "UV-stabilised nylon and HDPE resist fading and brittleness for years. Non-UV mesh degrades quickly — we only use treated grades suited to Kerala exposure." },
  { scope: "GENERAL", order: 75, question: "What cable spacing is used for child safety?", answer: "Spacing is engineered to prevent head and body passage based on opening type and floor height. Exact spacing is confirmed during professional survey — never guessed from photos." },

  // ── Installation ──
  { scope: "INSTALLATION", order: 80, question: "Do you subcontract installation?", answer: "No. Deva Safety Nets installs with our own trained technicians across Kerala. We do not forward jobs to unknown subcontractors." },
  { scope: "INSTALLATION", order: 81, question: "Will installation damage my walls?", answer: "We use structurally sound, minimally invasive fixings. Our survey confirms the best anchor method for concrete, brick or aluminium frames." },
  { scope: "INSTALLATION", order: 82, question: "Can I install safety solutions in a rented apartment?", answer: "Often yes. Many nets and some grill systems can be removed cleanly when you move. We explain rental-friendly options during your inspection." },
  { scope: "INSTALLATION", order: 83, question: "Do you need society approval before installation?", answer: "Most Kerala societies approve safety installations when finishes are uniform. We provide documentation and standardised looks to simplify committee approval." },
  { scope: "INSTALLATION", order: 84, question: "Can you install during monsoon?", answer: "Light rain rarely stops net installation. Heavy monsoon days may delay grill work on exposed high floors. We reschedule safely rather than compromise quality." },
  { scope: "INSTALLATION", order: 85, question: "Do you work on weekends?", answer: "Yes, by appointment. Many apartment residents prefer Saturday surveys and installs to avoid weekday disruption." },

  // ── Maintenance & product care ──
  { scope: "MAINTENANCE", order: 90, question: "Do you provide annual maintenance contracts?", answer: "Yes. AMC plans include scheduled inspections, tension checks and priority support for invisible grills and safety nets across Kerala." },
  { scope: "MAINTENANCE", order: 91, question: "How often should I clean invisible grills?", answer: "Wiping cables with plain water every three to six months removes dust and salt residue. Avoid harsh chemicals that damage coatings." },
  { scope: "MAINTENANCE", order: 92, question: "How do I clean safety nets?", answer: "Gentle hosing or wiping removes dust and bird droppings. Do not use sharp tools on mesh. Report tears promptly for repair." },
  { scope: "MAINTENANCE", order: 93, question: "What should I do after monsoon season?", answer: "Schedule a quick inspection of anchors and tension. Humidity and wind can loosen fittings over time — early correction prevents bigger problems." },
  { scope: "MAINTENANCE", order: 94, question: "Can sagging cables be re-tensioned?", answer: "Yes. Re-tensioning is a standard maintenance service. Cables that have corroded or frayed may need partial replacement instead." },

  // ── Service areas ──
  { scope: "GENERAL", order: 100, question: "What areas do you cover?", answer: "We serve Kochi, Ernakulam district and 160+ named localities across both cities — from Fort Kochi and Kakkanad to Aluva, Angamaly and Tripunithura. Contact us to confirm availability in your area." },
  { scope: "GENERAL", order: 101, question: "Are you a local installer near me in Kochi?", answer: "Deva Safety Nets is a Kerala-based team with local technicians in Kochi, Ernakulam and surrounding areas — not outsourced crews from other states." },
  { scope: "GENERAL", order: 102, question: "Are you a local installer near me in Ernakulam?", answer: "Yes. We serve Aluva, Angamaly, Tripunithura, Perumbavoor, Kalamassery and the wider Ernakulam district with doorstep surveys and local installation teams." },
  { scope: "GENERAL", order: 103, question: "Do you install in apartments and gated communities?", answer: "Yes. We work with residents and RWAs across Kochi and Ernakulam, using society-approved finishes and phased schedules for multi-unit buildings." },
  { scope: "GENERAL", order: 104, question: "Do you install in villas and independent homes?", answer: "Yes. We customise invisible grills and safety nets for villas, row houses and independent homes with bespoke spans and premium finishes." },
  { scope: "GENERAL", order: 105, question: "Do you serve commercial and industrial clients?", answer: "Yes. We install for offices, warehouses, factories, schools and hospitals — with specifications suited to each environment." },

  // ── Pricing ──
  { scope: "PRICING", order: 110, question: "How is pricing calculated?", answer: "Pricing is based on measured area, material grade (SS304, SS316, nylon, HDPE), height and access, and any customisation. You receive a transparent, itemised quote with no hidden charges." },
  { scope: "PRICING", order: 111, question: "Why do quotes vary between vendors?", answer: "Material grade, anchor quality, labour skill and warranty terms differ. The lowest quote often uses thinner mesh or unbranded wire. Compare itemised specifications, not headline price alone." },
  { scope: "PRICING", order: 112, question: "Do you offer bulk pricing for entire buildings?", answer: "Yes. Multi-unit and whole-tower projects receive phased scheduling and bulk rates. Contact us with your society or facility details." },

  // ── Safety standards ──
  { scope: "SAFETY", order: 120, question: "What safety standards do you follow?", answer: "We use IS-compliant materials, engineered spacing, load-tested anchoring and post-installation quality checks. Documentation is available for societies and commercial audits." },
  { scope: "SAFETY", order: 121, question: "Are your installers trained and verified?", answer: "Yes. Installation teams are trained in fall protection, tensioning and anchor selection. We do not send untrained casual labour to customer sites." },
  { scope: "SAFETY", order: 122, question: "Do you provide safety certification documents?", answer: "On request, we provide material specifications and installation documentation useful for society committees and commercial compliance." },

  // ── Additional invisible grills & windows ──
  { scope: "GENERAL", order: 130, question: "Can invisible grills be removed later?", answer: "Yes. Professional removal is possible when anchors are installed correctly. We discuss removal-friendly options during the survey if you expect to relocate." },
  { scope: "GENERAL", order: 131, question: "Do invisible grills rust in Kerala humidity?", answer: "Quality SS304 and SS316 resist rust when maintained. Cheap ungraded wire corrodes quickly in humid coastal air — which is why we specify certified grades only." },
  { scope: "GENERAL", order: 132, question: "What colours are available for invisible grill frames?", answer: "Most systems use powder-coated or anodised frames in white, black or bronze to match aluminium windows and society aesthetics." },
  { scope: "GENERAL", order: 133, question: "Can invisible grills be installed on curved balconies?", answer: "Yes. We custom-bend cable runs and frames to follow curved or angled balcony profiles common in premium Kochi apartments." },
  { scope: "INSTALLATION", order: 134, question: "Do you install on aluminium window frames?", answer: "Yes. We use appropriate anchors and backing plates for aluminium, uPVC and concrete substrates without damaging profiles." },

  // ── Additional safety nets & terraces ──
  { scope: "GENERAL", order: 140, question: "Can safety nets be installed on terraces?", answer: "Yes. Terrace perimeter nets and fall-protection netting are common for child safety and bird control on Kerala rooftops and open terraces." },
  { scope: "GENERAL", order: 141, question: "How strong are child safety nets?", answer: "Professional child safety nets use high breaking-strength nylon with UV treatment. Load capacity exceeds normal residential use when perimeter ropes and anchors are installed correctly." },
  { scope: "GENERAL", order: 142, question: "Can I see through safety nets?", answer: "Yes. Mesh is visually light from inside the balcony. Finer mesh for birds is slightly more visible but still allows airflow and daylight." },
  { scope: "GENERAL", order: 143, question: "Do safety nets make balconies look ugly?", answer: "Black or green UV-treated mesh blends with railings. Proper tension and neat perimeter fixing keep the finish tidy — important for society approval." },
  { scope: "MAINTENANCE", order: 144, question: "How long do safety nets last?", answer: "UV-treated nylon and HDPE nets typically last three to seven years depending on exposure and care. We offer replacement and AMC plans when mesh ages." },

  // ── Additional bird control ──
  { scope: "GENERAL", order: 150, question: "Why are pigeons a problem in Kochi apartments?", answer: "Coastal humidity, food availability and nesting spots in ducts and parapets make Kochi buildings ideal for pigeons. Droppings create hygiene and corrosion issues without exclusion." },
  { scope: "GENERAL", order: 151, question: "Can bird nets stop crows and mynas?", answer: "Appropriate mesh size blocks most urban birds from roosting areas. We assess species and opening size during inspection." },
  { scope: "GENERAL", order: 152, question: "How long do bird spikes last?", answer: "Stainless steel spikes last many years outdoors. Plastic bases may degrade faster in full sun — we specify grade suited to your exposure." },
  { scope: "GENERAL", order: 153, question: "Do bird spikes work on AC ledges?", answer: "Yes. Spikes and netting combinations are commonly used on AC platforms, window sills and parapets where birds roost." },

  // ── Additional sports & cloth hangers ──
  { scope: "GENERAL", order: 160, question: "What height should a home cricket net be?", answer: "Practice nets typically need eight to twelve feet clear height depending on bowling style. We measure your space and recommend pole height and mesh rating." },
  { scope: "GENERAL", order: 161, question: "Can sports nets be installed on terraces?", answer: "Yes where structure and clearance allow. We assess wind load, ball impact and neighbour boundaries before quoting terrace sports enclosures." },
  { scope: "GENERAL", order: 162, question: "How much weight can ceiling cloth hangers hold?", answer: "Quality pulley and ceiling systems support a full household wash load when anchored into structural slabs — never hollow tiles alone." },
  { scope: "GENERAL", order: 163, question: "Are cloth hangers suitable for monsoon drying?", answer: "Covered balcony and indoor ceiling systems allow drying during rain. We recommend layouts that suit Kerala's humid, rainy seasons." },

  // ── Additional booking & service ──
  { scope: "GENERAL", order: 170, question: "Can I get a quote from photos on WhatsApp?", answer: "Photos help us understand your requirement, but final pricing requires on-site measurement of spans, heights and fixing surfaces." },
  { scope: "GENERAL", order: 171, question: "Do you install for interior designers and builders?", answer: "Yes. We coordinate with architects, interior firms and builders across Kerala for new projects and renovations." },
  { scope: "GENERAL", order: 172, question: "What if I am not home during installation?", answer: "A responsible adult or authorised representative must be present for access and handover. We schedule convenient slots including weekends." },
  { scope: "GENERAL", order: 173, question: "Do you provide invoices for society reimbursement?", answer: "Yes. We provide proper tax invoices suitable for society records and corporate accounts." },
  { scope: "INSTALLATION", order: 174, question: "How noisy is invisible grill installation?", answer: "Drilling is brief and localised. Most neighbours notice minimal disruption compared to major renovation work." },

  // ── Additional safety & compliance ──
  { scope: "SAFETY", order: 180, question: "Are glass balcony railings safe for children?", answer: "Glass railings alone often lack climb-proof protection. Invisible grills or safety nets add engineered fall prevention without replacing the glass." },
  { scope: "SAFETY", order: 181, question: "Do you install fall protection for construction sites?", answer: "Yes. We supply personnel safety nets and perimeter netting for construction and industrial sites across Kerala." },
  { scope: "SAFETY", order: 182, question: "What load can invisible grill cables bear?", answer: "Professional systems are engineered for residential impact loads when spacing and tension meet specification. We never use decorative wire marketed as safety cable." },
  { scope: "PRICING", order: 183, question: "Is there a minimum order value?", answer: "Small single-window jobs may have a minimum visit charge due to travel and setup. Your quote states this clearly before booking." },
  { scope: "MAINTENANCE", order: 184, question: "What is included in an annual maintenance contract?", answer: "AMC typically covers scheduled inspection, tension checks, minor adjustments and priority call-out for repairs — terms are listed in your contract." },
];
