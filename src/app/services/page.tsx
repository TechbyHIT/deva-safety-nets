import type { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { KeywordServiceLinks } from "@/components/KeywordServiceLinks";
import { PageHero, Section, CTABand } from "@/components/ui";
import { STATIC_CATEGORIES_WITH_SERVICES } from "@/lib/static-home";
import { STATIC_KEYWORD_LINKS_BY_CATEGORY } from "@/lib/static-footer";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "All Services — Invisible Grills, Safety Nets & More | Deva Safety Nets Kerala",
  description:
    "Explore Deva Safety Nets' full range: invisible grills, balcony safety nets, child and pet safety, pigeon nets, bird spikes, sports nets, cloth hangers and maintenance. Free site survey, certified materials and expert installation across Kerala.",
  path: "/services",
});

export default function ServicesPage() {
  const categories = STATIC_CATEGORIES_WITH_SERVICES;
  const keywordMap = new Map(
    STATIC_KEYWORD_LINKS_BY_CATEGORY.map((c) => [c.slug, c.links]),
  );

  return (
    <>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
      <PageHero
        eyebrow="Our Services"
        title="Complete invisible grills & safety net solutions"
        description="Browse every Deva Safety Nets service by category — invisible grills, safety nets, bird control, sports nets, cloth hangers and maintenance. Each service page includes materials, installation process, pricing factors, extensive FAQs and local availability in Kochi, Ernakulam and Kerala."
      />
      {categories.map((cat) => (
        <Section key={cat.slug} muted={cat.order % 2 === 1}>
          <div id={cat.slug} className="mb-6 scroll-mt-24">
            <h2 className="section-title">{cat.name}</h2>
            <p className="mt-2 max-w-2xl text-muted">{cat.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.services.map((s) => (
              <ServiceCard
                key={s.slug}
                slug={s.slug}
                name={s.name}
                tagline={s.tagline}
                priceMin={s.priceMin}
                priceMax={s.priceMax}
                priceUnit={s.priceUnit}
              />
            ))}
          </div>
          {keywordMap.get(cat.slug)?.length ? (
            <div className="mt-8">
              <KeywordServiceLinks
                links={keywordMap.get(cat.slug)!}
                title={`Popular ${cat.name.toLowerCase()} searches`}
                max={16}
                columns={3}
              />
            </div>
          ) : null}
        </Section>
      ))}
      <CTABand />
    </>
  );
}
