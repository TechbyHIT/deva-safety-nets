import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Cog,
  Lightbulb,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { CheckList, Stars } from "./ui";
import { SiteImage } from "./SiteImage";
import { BeforeAfterSection } from "./BeforeAfterSection";
import { generateContent, varyList, type LocationContext } from "@/lib/content";
import { getServicePageImages } from "@/lib/images";
import { KeywordServiceLinks } from "./KeywordServiceLinks";
import { IntentServiceLinks } from "./IntentServiceLinks";
import { site } from "@/lib/site";
import { ServiceDistrictAreaDirectory } from "./ServiceDistrictAreaDirectory";
import type { DistrictAreaGroup } from "@/lib/queries";

const QuoteForm = dynamic(() => import("./QuoteForm").then((m) => m.QuoteForm));
const FaqAccordion = dynamic(() => import("./FaqAccordion").then((m) => m.FaqAccordion));
const LightboxGallery = dynamic(() =>
  import("./ImageGallery").then((m) => m.LightboxGallery),
);

type Material = { slug: string; name: string; grade: string | null; summary: string };
type Faq = { question: string; answer: string };
type Review = { id: string; author: string; rating: number; body: string };
type LinkItem = { slug: string; name: string };

const PROCESS = [
  { icon: Ruler, title: "Free Site Survey", detail: "We measure your space and assess the best solution — at no cost." },
  { icon: ClipboardCheck, title: "Transparent Quote", detail: "You receive an itemised quote within 24 hours, with no hidden charges." },
  { icon: Cog, title: "Expert Installation", detail: "Trained technicians install using IS-compliant materials in 1–2 days." },
  { icon: PackageCheck, title: "Quality Check & Warranty", detail: "We test tension and coverage, then hand over with a long-term warranty." },
];

const TRUST_STATS = [
  { icon: Award, value: "10,000+", label: "Installations" },
  { icon: Clock, value: "10+ yrs", label: "Experience" },
  { icon: ShieldCheck, value: "Up to 10-yr", label: "Warranty" },
  { icon: BadgeCheck, value: "4.9★", label: "Rating" },
];

export function ServiceArticle({
  service,
  routeKey,
  path,
  location,
  materials,
  faqs,
  reviews,
  related,
  districtAreaGroups,
  currentCitySlug,
  currentAreaSlug,
  otherCities,
  alsoFor,
  alsoForHeading = "Also available for",
  keywordLinks,
  intentLinks,
}: {
  service: {
    name: string;
    summary: string;
    benefits: string[];
    features: string[];
    useCases: string[];
    priceMin: number | null;
    priceMax: number | null;
    priceUnit: string | null;
    specifications: unknown;
    slug: string;
  };
  routeKey: string;
  path: string;
  location?: LocationContext;
  materials: Material[];
  faqs: Faq[];
  reviews: Review[];
  related: LinkItem[];
  /** Full Kochi–Ernakulam tier 1–7 areas (cached at page level). */
  districtAreaGroups?: DistrictAreaGroup[];
  currentCitySlug?: string;
  currentAreaSlug?: string;
  otherCities?: { slug: string; name: string; href: string }[];
  alsoFor?: { slug: string; name: string; href: string }[];
  alsoForHeading?: string;
  keywordLinks?: LinkItem[];
  intentLinks?: { slug: string; name: string; label: string }[];
}) {
  const content = generateContent(service.name, routeKey, location);
  const specs = (service.specifications ?? {}) as Record<string, string>;
  const benefits = varyList(service.benefits, routeKey);
  const features = varyList(service.features, `${routeKey}:f`);
  const placeLabel = location?.areaName ?? location?.cityName;
  const pageImages = getServicePageImages(service.slug, routeKey, {
    galleryCount: 6,
    serviceName: service.name,
    location: placeLabel,
  });
  const { hero: heroImage, gallery: galleryImages, beforeAfter, inline: inlineImage } = pageImages;

  // Merge editorial (DB) FAQs with generated, location/property-aware FAQs.
  const faqSeen = new Set<string>();
  const allFaqs: Faq[] = [...faqs, ...content.generatedFaqs]
    .filter((f) => {
      const key = f.question.trim().toLowerCase();
      if (faqSeen.has(key)) return false;
      faqSeen.add(key);
      return true;
    })
    .slice(0, 14);

  return (
    <>
      {/* Hero */}
      <div className="hero-mesh border-b">
        <div className="container-page grid items-center gap-8 py-10 md:py-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow mb-2">
              <ShieldCheck size={14} /> {placeLabel ? `Serving ${placeLabel}, Kerala` : "Trusted across Kerala"}
            </span>
            <div className="gold-accent-line mb-4" />
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              {content.heading}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{content.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#quote" className="btn btn-primary premium-shadow">Get Free Quote</a>
              <Link href="/contact" className="btn btn-outline">Talk to an Expert</Link>
            </div>
          </div>
          <div className="space-y-4 lg:pl-4">
            <div className="card premium-shadow relative aspect-[4/3] overflow-hidden rounded-2xl">
              <SiteImage
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                preset="heroSide"
              />
            </div>
            <div id="quote">
              <QuoteForm service={service.name} city={location?.cityName} source={path} compact />
            </div>
          </div>
        </div>
      </div>

      {/* Trust band */}
      <div className="trust-band">
        <div className="container-page grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon className="shrink-0 text-[var(--primary)]" size={22} />
              <div>
                <div className="font-extrabold leading-tight">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0 space-y-12">
          {/* Intro / overview */}
          <section>
            <h2 className="text-2xl font-bold">
              {placeLabel ? `${service.name} in ${placeLabel}` : `About our ${service.name.toLowerCase()}`}
            </h2>
            <p className="prose-content mt-3">{service.summary}</p>
            {content.introParagraphs.slice(1).map((p, i) => (
              <p key={i} className="prose-content mt-3">{p}</p>
            ))}
            <p className="prose-content mt-3">{content.localInfo}</p>
          </section>

          {/* Key takeaways */}
          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Lightbulb size={20} className="text-[var(--accent)]" /> Key takeaways
            </h2>
            <ul className="mt-3 space-y-2">
              {content.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Why it matters */}
          <section>
            <h2 className="text-2xl font-bold">
              Why {service.name.toLowerCase()} matter{placeLabel ? ` in ${placeLabel}` : ""}
            </h2>
            <p className="prose-content mt-3">{content.whyMatters}</p>
            <p className="prose-content mt-3">{content.localChallenges}</p>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-2xl font-bold">Benefits</h2>
            <p className="mt-1 text-muted">{content.benefitsIntro}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <div key={i} className="card flex items-start gap-3 p-4">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Features + specs */}
          <section className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Features</h2>
              <div className="mt-4">
                <CheckList items={features} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Specifications</h2>
              <dl className="mt-4 divide-y overflow-hidden rounded-xl border">
                {Object.entries(specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="capitalize text-muted">{k}</dt>
                    <dd className="text-right font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Materials */}
          {materials.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Materials we use</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {materials.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/materials/${m.slug}`}
                    className="card p-5 transition-colors hover:border-[var(--primary)]"
                  >
                    <p className="font-bold">
                      {m.name}
                      {m.grade && (
                        <span className="ml-2 rounded bg-[var(--bg-subtle)] px-2 py-0.5 text-xs">{m.grade}</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted">{m.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Safety standards */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <ShieldCheck size={22} className="text-[var(--primary)]" /> Safety standards we follow
            </h2>
            <div className="mt-4">
              <CheckList items={content.safetyStandards} />
            </div>
          </section>

          {/* Process */}
          <section>
            <h2 className="text-2xl font-bold">Our installation process</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2">
              {PROCESS.map((step, i) => (
                <li key={i} className="card flex gap-4 p-5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <step.icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold">{i + 1}. {step.title}</p>
                    <p className="text-sm text-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Survey factors */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <ClipboardCheck size={22} className="text-[var(--primary)]" /> What we assess during your free survey
            </h2>
            <div className="mt-4 space-y-3">
              {content.pricingFactors.map((f, i) => (
                <div key={i} className="card p-4">
                  <p className="font-semibold">{f.factor}</p>
                  <p className="text-sm text-muted">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Complete guide (long-form, unique per route) */}
          <section className="space-y-8">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <BookOpen size={22} className="text-[var(--primary)]" /> Complete guide to {service.name.toLowerCase()}
            </h2>
            {content.guideSections.map((g, i) => (
              <div key={i}>
                <h3 className="text-xl font-bold">{g.heading}</h3>
                {g.paragraphs.map((p, j) => (
                  <p key={j} className="prose-content mt-2">{p}</p>
                ))}
              </div>
            ))}
          </section>

          {/* Buying considerations */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles size={22} className="text-[var(--primary)]" /> What to look for before you buy
            </h2>
            <div className="mt-4">
              <CheckList items={content.buyingConsiderations} />
            </div>
          </section>

          {/* Maintenance tips */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Wrench size={22} className="text-[var(--primary)]" /> Maintenance &amp; care tips
            </h2>
            <div className="mt-4">
              <CheckList items={content.maintenanceTips} />
            </div>
          </section>

          {/* Use cases */}
          {service.useCases.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Ideal for</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {service.useCases.map((u) => (
                  <span key={u} className="rounded-full border px-3 py-1 text-sm text-muted">{u}</span>
                ))}
              </div>
            </section>
          )}

          {/* Project gallery */}
          <section>
            <h2 className="text-2xl font-bold">Project gallery</h2>
            <p className="mt-1 text-muted">
              Recent {service.name.toLowerCase()} installations{placeLabel ? ` in and around ${placeLabel}` : " across Kerala"}.
            </p>
            <div className="mt-4">
              <LightboxGallery images={galleryImages} columns={2} variant="grid" />
            </div>
          </section>

          <section>
            <BeforeAfterSection before={beforeAfter.before} after={beforeAfter.after} title={`Before & after — ${service.name}`} />
          </section>

          {/* Inline service illustration */}
          <section className="card overflow-hidden">
            <div className="relative aspect-[21/9] bg-[var(--bg-subtle)]">
              <SiteImage
                src={inlineImage.src}
                alt={inlineImage.alt}
                title={inlineImage.title}
                fill
                preset="gallery"
                className="p-6"
              />
            </div>
            <p className="border-t px-4 py-3 text-sm text-muted">
              {inlineImage.caption} — installed by {site.name} with certified materials and written warranty.
            </p>
          </section>

          {/* Reviews */}
          {reviews.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Customer reviews</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {reviews.slice(0, 4).map((r) => (
                  <div key={r.id} className="card p-5">
                    <Stars rating={r.rating} />
                    <p className="mt-2 text-sm text-muted">“{r.body}”</p>
                    <p className="mt-3 text-sm font-semibold">{r.author}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Kochi & Ernakulam areas — tier 1–7 */}
          {districtAreaGroups && districtAreaGroups.length > 0 && (
            <section className="scroll-mt-24">
              <h2 className="text-2xl font-bold">
                {service.name} across Kochi &amp; Ernakulam
              </h2>
              <p className="mt-2 text-sm text-muted">
                {districtAreaGroups.reduce((n, g) => n + g.areas.length, 0)} localities — best near you,
                premium installation in every tier.
              </p>
              <div className="mt-4">
                <ServiceDistrictAreaDirectory
                  serviceSlug={service.slug}
                  serviceName={service.name}
                  groups={districtAreaGroups}
                  currentCitySlug={currentCitySlug}
                  currentAreaSlug={currentAreaSlug}
                />
              </div>
            </section>
          )}

          {/* Also available for (property types / variants) */}
          {alsoFor && alsoFor.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">{alsoForHeading}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {alsoFor.map((a) => (
                  <Link
                    key={a.slug}
                    href={a.href}
                    className="rounded-full border px-3 py-1 text-sm text-muted hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    {a.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Available cities */}
          {otherCities && otherCities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">{service.name} in other cities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {otherCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={c.href}
                    className="rounded-full border px-3 py-1 text-sm text-muted hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Keyword service links */}
          {intentLinks && intentLinks.length > 0 && (
            <IntentServiceLinks links={intentLinks} serviceName={service.name} />
          )}

          {keywordLinks && keywordLinks.length > 0 && (
            <KeywordServiceLinks
              links={keywordLinks}
              title={`Best near me · Top Kerala · ${service.name}`}
              subtitle="Keyword pages for best near me, top Kerala, high quality #1, pricing, installation and repair across Kerala."
              max={28}
            />
          )}

          {/* FAQs */}
          {allFaqs.length > 0 && (
            <section id="faq" className="scroll-mt-24">
              <h2 className="text-2xl font-bold">Frequently asked questions</h2>
              <div className="mt-4">
                <FaqAccordion items={allFaqs} />
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <QuoteForm service={service.name} city={location?.cityName} source={path} />
          {related.length > 0 && (
            <div className="card p-5">
              <h3 className="mb-3 font-bold">Related services</h3>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/services/${r.slug}`} className="text-sm text-muted hover:text-[var(--primary)]">
                      → {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="card p-5">
            <h3 className="mb-2 font-bold">Get a fast quote</h3>
            <p className="text-sm text-muted">{content.ctaLine}</p>
            <a href="#quote" className="btn btn-primary mt-3 w-full">Request Free Quote</a>
          </div>
        </aside>
      </div>
    </>
  );
}
