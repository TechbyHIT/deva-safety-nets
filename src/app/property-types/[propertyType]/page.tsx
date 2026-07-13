import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { ServiceCard } from "@/components/ServiceCard";
import { RichContent } from "@/components/RichContent";
import { PageHero, Section, SectionHeading, CheckList, CTABand } from "@/components/ui";
import { generateContent } from "@/lib/content";
import {
  getPropertyTypeBySlug,
  getPropertyTypes,
  getCategoriesWithServices,
  getAllCities,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const dynamicParams = false;
export async function generateStaticParams() {
  const propertyTypes = await getPropertyTypes();
  return propertyTypes.map((p) => ({ propertyType: p.slug }));
}

type Props = { params: Promise<{ propertyType: string }> };

export const dynamic = "force-static";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyType: slug } = await params;
  const pt = await getPropertyTypeBySlug(slug);
  if (!pt) return {};
  return buildMetadata({
    title: `Invisible Grills & Safety Nets for ${pt.plural}`,
    description: `Safety solutions designed for ${pt.plural.toLowerCase()}. ${pt.summary}`,
    path: `/property-types/${slug}`,
  });
}

export default async function PropertyTypePage({ params }: Props) {
  const { propertyType: slug } = await params;
  const [pt, categories, cities] = await Promise.all([
    getPropertyTypeBySlug(slug),
    getCategoriesWithServices(),
    getAllCities(),
  ]);
  if (!pt) notFound();

  const path = `/property-types/${slug}`;
  const featured = categories.flatMap((c) => c.services.filter((s) => s.featured)).slice(0, 8);
  const content = generateContent("Invisible Grills & Safety Nets", `property-types/${slug}`, {
    propertyType: pt.name,
    propertyTypePlural: pt.plural,
  });

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Property Types", path: "/property-types" },
          { name: pt.plural, path },
        ])}
      />
      <Breadcrumbs
        items={[
          { name: "Property Types", path: "/property-types" },
          { name: pt.plural, path },
        ]}
      />
      <PageHero
        eyebrow="Property Type"
        title={`Invisible Grills & Safety Nets for ${pt.plural}`}
        description={pt.summary}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {pt.concerns.length > 0 && (
              <div>
                <SectionHeading center={false} title={`Key safety concerns for ${pt.plural.toLowerCase()}`} />
                <CheckList items={pt.concerns} />
              </div>
            )}

            <div>
              <SectionHeading center={false} title={`Recommended services for ${pt.plural.toLowerCase()}`} />
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((s) => (
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
            </div>

            <div>
              <SectionHeading center={false} title={`${pt.plural} we protect across cities`} />
              <div className="flex flex-wrap gap-2">
                {cities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/property-types/${slug}/${c.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm text-muted hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <MapPin size={13} /> {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <RichContent content={content} serviceLabel={`safety solutions for ${pt.plural.toLowerCase()}`} />
          </div>
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <QuoteForm source={path} />
          </aside>
        </div>
      </Section>
      <CTABand
        title={`Protect your ${pt.name.toLowerCase()}`}
        subtitle="Book a free site survey and get a transparent quote within 24 hours."
      />
    </>
  );
}
