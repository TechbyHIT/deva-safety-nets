import Link from "next/link";
import nextDynamic from "next/dynamic";
import { HomeHero } from "@/components/home/HomeHero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { BrandStatement } from "@/components/home/BrandStatement";
import { EditorialServices } from "@/components/home/EditorialServices";
import { FeaturedBand } from "@/components/home/FeaturedBand";
import { WhyDeva } from "@/components/home/WhyDeva";
import { ServiceAreas } from "@/components/home/ServiceAreas";
import { HomeSeoProse } from "@/components/home/HomeSeoProse";
import { JsonLd } from "@/components/JsonLd";
import {
  Section,
  SectionHeading,
  Stars,
  ProcessTimeline,
  CTABand,
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
import {
  getHeroImage,
  getProcessImages,
  GALLERY_IMAGES,
  pickUniquePageImages,
  PAGE_IMAGES,
} from "@/lib/images";
import { site } from "@/lib/site";

const QuoteForm = nextDynamic(() => import("@/components/QuoteForm").then((m) => m.QuoteForm));
const FaqAccordion = nextDynamic(() => import("@/components/FaqAccordion").then((m) => m.FaqAccordion));
const ImageGallery = nextDynamic(() => import("@/components/ImageGallery").then((m) => m.ImageGallery));

export const dynamic = "force-static";

export default function HomePage() {
  const categories = STATIC_CATEGORIES_WITH_SERVICES;
  const featured = STATIC_FEATURED_SERVICES;
  const faqs = STATIC_GENERAL_FAQS;
  const cities = STATIC_CITIES;
  const reviews = STATIC_REVIEWS;
  const counts = STATIC_CATALOG_COUNTS;

  const hero = getHeroImage("home", `${site.name} invisible grills Kerala`);
  const galleryImages = pickUniquePageImages(
    "homepage-gallery",
    8,
    GALLERY_IMAGES,
    `${site.name} project gallery`,
  );

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
      <HomeHero imageSrc={hero.src} imageAlt={hero.alt} />
      <TrustStrip />
      <BrandStatement serviceCount={counts.services} areaCount={counts.areas} />
      <EditorialServices categories={categories} />
      <FeaturedBand services={featured} />
      <WhyDeva />

      <Section muted>
        <SectionHeading
          eyebrow="How it works"
          title="From free inspection to warranty handover"
          subtitle="A clear process designed for speed, safety and zero surprises across Kochi and Ernakulam."
        />
        <ProcessTimeline steps={processSteps} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Projects"
          title="Real installations across Kerala"
          subtitle="Measured, engineered and installed by our own trained teams."
        />
        <ImageGallery images={galleryImages} columns={4} variant="masonry" />
        <div className="mt-8 text-center">
          <Link href="/gallery" className="btn btn-outline">
            View full gallery →
          </Link>
        </div>
      </Section>

      <ServiceAreas cities={cities} areaCount={counts.areas} />

      <Section muted>
        <SectionHeading eyebrow="Reviews" title="Trusted by Kerala families" />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <blockquote
              key={r.id}
              className="border-t border-[var(--border)] pt-6"
            >
              <Stars rating={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-muted">&ldquo;{r.body}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold">
                {r.author}
                {r.city && <span className="font-normal text-muted"> · {r.city.name}</span>}
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/reviews" className="text-sm font-semibold text-[var(--forest)] dark:text-[var(--sage)]">
            Read all reviews →
          </Link>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
      </Section>

      <Section muted id="quote">
        <div className="quote-split">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Free site inspection"
              title="Book your Kerala home survey"
              subtitle="Tell us about your balcony, window or terrace — our Kochi team responds within 24 hours with a transparent quote."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Contact page
              </Link>
              <Link href="/services" className="btn btn-outline">
                Browse services
              </Link>
            </div>
          </div>
          <QuoteForm source="home" />
        </div>
      </Section>

      <HomeSeoProse />
      <CTABand imageSrc={PAGE_IMAGES.cta} />
    </>
  );
}
