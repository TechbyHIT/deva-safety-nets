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
import {
  getPropertyTypeBySlug,
  getCityBySlug,
  getCategoriesWithServices,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { localBusinessSchema } from "@/lib/schema";
import { generateContent } from "@/lib/content";

// PropertyType x City pages generated on demand (ISR).
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ propertyType: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyType: ptSlug, city: citySlug } = await params;
  const [pt, city] = await Promise.all([
    getPropertyTypeBySlug(ptSlug),
    getCityBySlug(citySlug),
  ]);
  if (!pt || !city) return {};
  return buildMetadata({
    title: `Invisible Grills & Safety Nets for ${pt.plural} in ${city.name}`,
    description: `Safety solutions for ${pt.plural.toLowerCase()} in ${city.name}, ${city.state}. Local team, free site survey, transparent pricing and warranty.`,
    path: `/property-types/${ptSlug}/${citySlug}`,
    keywords: [pt.name, city.name, `${pt.name} safety ${city.name}`],
  });
}

export default async function PropertyTypeCityPage({ params }: Props) {
  const { propertyType: ptSlug, city: citySlug } = await params;
  const [pt, city, categories] = await Promise.all([
    getPropertyTypeBySlug(ptSlug),
    getCityBySlug(citySlug),
    getCategoriesWithServices(),
  ]);
  if (!pt || !city) notFound();

  const path = `/property-types/${ptSlug}/${citySlug}`;
  const content = generateContent("Invisible Grills & Safety Nets", path.slice(1), {
    cityName: city.name,
    state: city.state,
    region: city.region,
    propertyType: pt.name,
    propertyTypePlural: pt.plural,
  });
  const featured = categories.flatMap((c) => c.services.filter((s) => s.featured)).slice(0, 8);

  return (
    <>
      <JsonLd
        data={localBusinessSchema({
          cityName: city.name,
          state: city.state,
          latitude: city.latitude,
          longitude: city.longitude,
          path,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Property Types", path: "/property-types" },
          { name: pt.plural, path: `/property-types/${ptSlug}` },
          { name: city.name, path },
        ]}
      />
      <PageHero
        eyebrow={`${pt.plural} · ${city.name}`}
        title={`Invisible Grills & Safety Nets for ${pt.plural} in ${city.name}`}
        description={content.intro}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <p className="prose-content">{content.localInfo}</p>
            {pt.concerns.length > 0 && (
              <div>
                <SectionHeading center={false} title={`Safety priorities for ${pt.plural.toLowerCase()} in ${city.name}`} />
                <CheckList items={pt.concerns} />
              </div>
            )}
            <div>
              <SectionHeading center={false} title={`Recommended services`} />
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
            {city.areas.length > 0 && (
              <div>
                <SectionHeading center={false} title={`${pt.plural} we serve across ${city.name}`} />
                <div className="flex flex-wrap gap-2">
                  {city.areas.slice(0, 24).map((a) => (
                    <Link
                      key={a.id}
                      href={`/locations/${citySlug}/${a.slug}`}
                      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm text-muted hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <MapPin size={13} /> {a.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <RichContent
              content={content}
              serviceLabel={`safety solutions for ${pt.plural.toLowerCase()} in ${city.name}`}
            />
          </div>
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <QuoteForm city={city.name} source={path} />
          </aside>
        </div>
      </Section>
      <CTABand
        title={`Protect your ${pt.name.toLowerCase()} in ${city.name}`}
        subtitle="Book a free local site survey and get a transparent quote within 24 hours."
      />
    </>
  );
}
