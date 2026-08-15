import type { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CTABand } from "@/components/ui";
import { STATIC_CATEGORIES_WITH_SERVICES } from "@/lib/static-home";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "All Services — Invisible Grills & Safety Nets Kerala",
  description:
    "Invisible grills, balcony safety nets, bird spikes, sports nets and more in Kochi, Ernakulam & Kerala. Free survey, certified materials, expert install.",
  path: "/services",
});

export default function ServicesPage() {
  const categories = STATIC_CATEGORIES_WITH_SERVICES;

  return (
    <>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
      <PageHero
        eyebrow="Our Services"
        title="Invisible grills & safety net solutions"
        description="Browse Deva Safety Nets services by category — invisible grills, safety nets, bird control, sports nets and maintenance. Free survey across Kochi, Ernakulam and Kerala."
      />
      {categories.map((cat) => (
        <Section key={cat.slug} muted={cat.order % 2 === 1}>
          <div id={cat.slug} className="mb-8 scroll-mt-28 border-b border-[var(--border)] pb-4">
            <p className="eyebrow mb-2">{cat.name}</p>
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
        </Section>
      ))}
      <CTABand />
    </>
  );
}
