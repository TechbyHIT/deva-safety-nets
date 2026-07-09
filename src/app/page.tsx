import Link from "next/link";
import nextDynamic from "next/dynamic";
import { Award, Clock, MapPin, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Hero } from "@/components/Hero";
import { HomeSeoProse } from "@/components/home/HomeSeoProse";
import { ServiceCard } from "@/components/ServiceCard";
import { JsonLd } from "@/components/JsonLd";
import { TrustBadges } from "@/components/TrustBadges";
import { HomePhotoBento, HomePhotoStrip } from "@/components/HomePhotoBento";
import { SiteImage } from "@/components/SiteImage";
import {
  Section,
  SectionHeading,
  StatBand,
  CTABand,
  Stars,
  ProcessTimeline,
  InlineCTA,
} from "@/components/ui";
import {
  STATIC_CATEGORIES_WITH_SERVICES,
  STATIC_FEATURED_SERVICES,
  STATIC_GENERAL_FAQS,
  STATIC_CITIES,
  STATIC_REVIEWS,
  STATIC_CATALOG_COUNTS,
} from "@/lib/static-home";
import { faqSchema } from "@/lib/schema";
import { getGallerySet, getCategoryImage, getProcessImages, getBestFolderImage, CLIENT_LOGOS, PAGE_IMAGES, GALLERY_IMAGES, pickUniquePageImages, type ImageFolderKey } from "@/lib/images";
import { BeforeAfterSection } from "@/components/ImageGallery";
import { MaterialCard } from "@/components/ui";
import { site } from "@/lib/site";

const QuoteForm = nextDynamic(() => import("@/components/QuoteForm").then((m) => m.QuoteForm));
const FaqAccordion = nextDynamic(() => import("@/components/FaqAccordion").then((m) => m.FaqAccordion));
const ImageGallery = nextDynamic(() => import("@/components/ImageGallery").then((m) => m.ImageGallery));

export const revalidate = 86400;
export const dynamic = "force-static";

const WHY_US: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
  folder: ImageFolderKey;
  imageOffset?: number;
}[] = [
  {
    icon: ShieldCheck,
    title: "Certified Kerala Safety",
    text: "IS-compliant SS304, SS316 and HDPE materials engineered for Kerala's humidity and monsoon conditions.",
    folder: "child-safety-nets",
  },
  {
    icon: Award,
    title: "Up to 10-Year Warranty",
    text: "Written warranty on materials and workmanship — trusted by families across Kochi and Ernakulam.",
    folder: "invisible-grill-balcony",
    imageOffset: 1,
  },
  {
    icon: Clock,
    title: "Fast Local Installation",
    text: "Most projects completed within 1–2 days after your free site inspection in Kerala.",
    folder: "safety-nets-balcony",
  },
  {
    icon: MapPin,
    title: "160+ Kerala Localities",
    text: "Doorstep service in Edapally, Kakkanad, Vyttila, Aluva, Tripunithura and every major area.",
    folder: "duct-area-nets",
  },
  {
    icon: Sparkles,
    title: "Premium Near-Invisible Finish",
    text: "Clean, discreet installations that pass society approval and preserve your view.",
    folder: "invisible-grill-window",
  },
  {
    icon: Wrench,
    title: "Complete After-Sales Care",
    text: "Repair, re-tensioning and annual maintenance contracts for long-term peace of mind.",
    folder: "cricket-nets",
  },
];

export default function HomePage() {
  const categories = STATIC_CATEGORIES_WITH_SERVICES;
  const featured = STATIC_FEATURED_SERVICES;
  const faqs = STATIC_GENERAL_FAQS;
  const cities = STATIC_CITIES;
  const reviews = STATIC_REVIEWS;
  const counts = STATIC_CATALOG_COUNTS;

  const homePhotos = pickUniquePageImages("homepage-photos", 16, GALLERY_IMAGES, `${site.name} Kerala installation`);
  const galleryImages = homePhotos.slice(0, 8);
  const bentoImages = homePhotos.slice(8, 14);
  const stripImages = homePhotos.slice(14, 16);
  const beforeAfter = {
    before: { src: getBestFolderImage("safety-nets-balcony"), alt: "Before safety net installation Kerala" },
    after: { src: getBestFolderImage("safety-nets-balcony", 1), alt: "After safety net installation Kerala" },
  };
  const beforeAfterGrills = {
    before: { src: getBestFolderImage("invisible-grill-balcony", 2), alt: "Before invisible grill installation Kerala" },
    after: { src: getBestFolderImage("invisible-grill-balcony", 3), alt: "After invisible grill installation Kerala" },
  };

  const materials = [
    {
      name: "SS304 Stainless Steel",
      grade: "Invisible Grills",
      summary: "High-tensile cable for most Kerala homes — corrosion resistant and society-approved.",
      imageSrc: getBestFolderImage("invisible-grill-balcony"),
    },
    {
      name: "SS316 Marine Grade",
      grade: "Coastal Kerala",
      summary: "Recommended for Fort Kochi, Vypin and salt-air zones where humidity accelerates corrosion.",
      imageSrc: getBestFolderImage("invisible-grill-window"),
    },
    {
      name: "Nylon Safety Nets",
      grade: "Child & Pet Safety",
      summary: "High breaking strength, UV-stabilised mesh for balconies — ideal for child and pet protection.",
      imageSrc: getBestFolderImage("child-safety-nets"),
    },
    {
      name: "HDPE Bird Nets",
      grade: "Pigeon Control",
      summary: "Rot-proof, UV-treated mesh for bird exclusion on balconies, ducts and terraces across Kerala.",
      imageSrc: getBestFolderImage("safety-nets-balcony", 1),
    },
  ];

  const processSteps = getProcessImages().map((p) => ({
    title: p.label,
    detail:
      p.label === "Site Survey"
        ? "Free measurement at your Kerala home or site"
        : p.label === "Materials"
          ? "Certified SS304, SS316 & HDPE selected for your location"
          : p.label === "Installation"
            ? "Trained local technicians — 1–2 day completion"
            : "Quality check, tension test and warranty handover",
    imageSrc: p.src,
    imageAlt: p.alt,
  }));

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <Hero />

      <Section>
        <StatBand
          stats={[
            { value: `${counts.services}+`, label: "Services in Kerala" },
            { value: `${counts.areas}+`, label: "Localities covered" },
            { value: "10,000+", label: "Installations" },
            { value: "4.9★", label: "Google rating" },
          ]}
        />
      </Section>

      {/* Photo showcase — bento grid */}
      <Section muted className="lazy-section">
        <SectionHeading
          eyebrow="Installation gallery"
          title="Premium finishes across Kerala homes"
          subtitle="Real project photos from balconies, windows, terraces and commercial sites — invisible grills, safety nets, sports nets and more."
        />
        <HomePhotoBento images={bentoImages} />
      </Section>

      {/* Category showcase — unique bento-style layout */}
      <Section muted>
        <SectionHeading
          eyebrow="Kerala's complete safety partner"
          title="Invisible Grills, Safety Nets & More"
          subtitle="Seven specialist categories — one trusted local team for every balcony, window, terrace and commercial space across Kerala."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.slug} className="card-hover group overflow-hidden" id={cat.slug}>
              <div className="relative aspect-[2/1] bg-[var(--bg-subtle)]">
                <SiteImage
                  src={getCategoryImage(cat.slug)}
                  alt={`${cat.name} services in Kerala`}
                  fill
                  preset="galleryWide"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">{cat.name}</h3>
                <p className="mt-1 text-sm text-muted">{cat.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {cat.services.slice(0, 4).map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="text-sm text-muted hover:text-[var(--primary)]"
                      >
                        → {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--primary)]"
                >
                  All {cat.name.toLowerCase()} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Most requested in Kochi" title="Popular services near you" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              name={s.name}
              tagline={s.tagline}
              categoryName={s.category.name}
            />
          ))}
        </div>
      </Section>

      {/* Installation process — unique timeline with images */}
      <Section muted>
        <SectionHeading
          eyebrow="How it works"
          title="From free inspection to warranty handover"
          subtitle="Our Kerala installation process is designed for speed, safety and zero surprises."
        />
        <ProcessTimeline steps={processSteps} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Certified materials"
          title="Engineered for Kerala's climate"
          subtitle="We specify the right material grade for your exposure — inland humidity, coastal salt air, or high-traffic commercial use."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((m) => (
            <MaterialCard key={m.name} {...m} />
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="Safety solutions"
          title="Protection for every property type"
          subtitle="Apartments, villas, commercial offices, schools and industrial sites — one local team for every safety need."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Invisible Grills", slug: "invisible-grills", desc: "Near-invisible balcony and window protection across Kochi and Ernakulam." },
            { title: "Balcony Safety Nets", slug: "balcony-safety-nets", desc: "Child-safe, bird-proof nets installed within hours for Kerala apartments." },
            { title: "Bird Spikes & Control", slug: "bird-spikes", desc: "Humane bird deterrents for ledges, parapets and commercial façades." },
          ].map((item) => (
            <Link key={item.slug} href={`/services/${item.slug}`} className="card-hover group overflow-hidden">
              <div className="relative aspect-[16/10] bg-[var(--bg-subtle)]">
                <SiteImage
                  src={getCategoryImage(item.slug.includes("bird") ? "bird-control" : item.slug.includes("safety") ? "safety-nets" : "invisible-grills")}
                  alt={item.title}
                  fill
                  preset="galleryWide"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold group-hover:text-[var(--primary)]">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Why Kerala trusts us" title="Premium standards, local expertise" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((w) => (
            <div key={w.title} className="card-hover overflow-hidden">
              <div className="relative aspect-[16/9] bg-[var(--bg-subtle)]">
                <SiteImage
                  src={getBestFolderImage(w.folder, w.imageOffset ?? 0)}
                  alt={w.title}
                  fill
                  preset="galleryWide"
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                  <w.icon size={26} className="text-[var(--primary)]" />
                </span>
                <h3 className="mt-4 font-bold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Scrolling photo strip */}
      <Section muted>
        <SectionHeading
          eyebrow="Our installations"
          title="Every project, photographed on site"
          subtitle="Scroll through recent invisible grill, safety net and bird control work across Kochi and Ernakulam."
        />
        <HomePhotoStrip images={stripImages} />
      </Section>

      {/* Project gallery */}
      <Section muted className="lazy-section">
        <SectionHeading
          eyebrow="Our work"
          title="Real installations across Kerala"
          subtitle="Every project is measured, engineered and installed by our own trained teams."
        />
        <ImageGallery images={galleryImages} columns={4} variant="masonry" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <BeforeAfterSection
            before={beforeAfter.before}
            after={beforeAfter.after}
            title="Safety nets — before & after"
          />
          <BeforeAfterSection
            before={beforeAfterGrills.before}
            after={beforeAfterGrills.after}
            title="Invisible grills — before & after"
          />
        </div>
        <div className="mt-8 text-center">
          <Link href="/gallery" className="btn btn-outline">
            View full gallery →
          </Link>
        </div>
      </Section>

      <Section>
        <TrustBadges />
      </Section>

      <Section muted>
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Free site inspection"
              title="Book your Kerala home survey today"
              subtitle="Tell us about your balcony, window or terrace — our Kochi team responds within 24 hours with a transparent, itemised quote."
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {cities.slice(0, 10).map((c) => (
                <Link
                  key={c.slug}
                  href={`/locations/${c.slug}`}
                  className="chip"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/locations" className="chip chip-active">
                All Kerala locations →
              </Link>
            </div>
          </div>
          <QuoteForm source="home" />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Google reviews" title="Trusted by Kerala families" />
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <div key={r.id} className="card-hover p-6">
              <Stars rating={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-muted">"{r.body}"</p>
              <p className="mt-4 text-sm font-semibold">
                {r.author}
                {r.city && <span className="font-normal text-muted"> · {r.city.name}</span>}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/reviews" className="text-sm font-semibold text-[var(--primary)]">
            Read all reviews →
          </Link>
        </div>
      </Section>

      {/* Client logos */}
      <Section muted>
        <SectionHeading eyebrow="Trusted by" title="Homes, apartments & businesses" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:gap-4">
          {CLIENT_LOGOS.map((src, i) => (
            <div key={src} className="card-hover relative aspect-square overflow-hidden rounded-xl">
              <SiteImage src={src} alt={`Trusted installation ${i + 1} in Kerala`} fill preset="logo" />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Common questions about our Kerala services" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
        <div className="mt-8">
          <InlineCTA
            title="Still have questions?"
            subtitle="Call or WhatsApp our Kerala team — we respond within hours."
            label="Contact us"
          />
        </div>
      </Section>

      <HomeSeoProse />

      <CTABand imageSrc={PAGE_IMAGES.cta} />
    </>
  );
}
