import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { ServiceCard } from "@/components/ServiceCard";
import { RichContent } from "@/components/RichContent";
import { PageHero, Section, SectionHeading, Stars, CTABand } from "@/components/ui";
import {
  getCityBySlug,
  getAllCities,
  getCategoriesWithServices,
  getDistrictAreasGrouped,
  getPopularKeywordLinks,
} from "@/lib/queries";
import { buildMetadata, buildLocationSeoKeywords } from "@/lib/seo";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/schema";
import { generateContent } from "@/lib/content";
import { getHeroImage } from "@/lib/images";
import { ServiceLocationDirectory } from "@/components/ServiceLocationDirectory";
import { DistrictAreaDirectory } from "@/components/DistrictAreaDirectory";
import { LocationSeoServiceLinks } from "@/components/LocationSeoServiceLinks";
import { KeywordServiceLinks } from "@/components/KeywordServiceLinks";
import { serviceLocationHref } from "@/lib/service-location-url";
import { site } from "@/lib/site";

export const dynamicParams = false;
export async function generateStaticParams() {
  const cities = await getAllCities();
  return cities.map((c) => ({ city: c.slug }));
}

type Props = { params: Promise<{ city: string }> };

export const dynamic = "force-static";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return {};
  return buildMetadata({
    title: `Best Invisible Grills & Safety Nets in ${city.name} — Near Me`,
    description: `Premium invisible grills and safety nets in ${city.name}, ${city.state}. Best local installers near you — free site survey, transparent pricing and warranty. All Kochi–Ernakulam areas served.`,
    path: `/locations/${slug}`,
    keywords: buildLocationSeoKeywords(city.name),
  });
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
  const [city, categories, districtAreas, keywordLinks] = await Promise.all([
    getCityBySlug(slug),
    getCategoriesWithServices(),
    getDistrictAreasGrouped(),
    getPopularKeywordLinks(36),
  ]);
  if (!city) notFound();

  const path = `/locations/${slug}`;
  const hero = getHeroImage(`locations/${slug}`, `${site.name} in ${city.name}`);
  const content = generateContent("Invisible Grills & Safety Nets", `locations/${slug}`, {
    cityName: city.name,
    state: city.state,
    region: city.region,
  });
  const topServices = categories.flatMap((c) => c.services.filter((s) => s.featured)).slice(0, 8);
  const seoServices = categories.flatMap((c) => c.services.slice(0, 2)).slice(0, 12);

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema({
            cityName: city.name,
            state: city.state,
            latitude: city.latitude,
            longitude: city.longitude,
            path,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: city.name, path },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Locations", path: "/locations" },
          { name: city.name, path },
        ]}
      />
      <PageHero
        eyebrow={`${city.state} · Kerala`}
        title={`Invisible Grills & Safety Nets in ${city.name}`}
        description={city.intro ?? content.intro}
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <p className="prose-content">{content.localInfo}</p>
            {content.introParagraphs.slice(1).map((p, i) => (
              <p key={i} className="prose-content">{p}</p>
            ))}

            <div>
              <SectionHeading center={false} title={`All services in ${city.name}`} />
              <p className="mb-6 text-sm text-muted">
                Doorstep installation across every major locality — select a service for pricing, photos and free survey in {city.name}.
              </p>
              <ServiceLocationDirectory categories={categories} citySlug={slug} cityName={city.name} maxCategories={8} />
            </div>

            <div>
              <SectionHeading center={false} title={`Featured services in ${city.name}`} />
              <div className="grid gap-4 sm:grid-cols-2">
                {topServices.map((s) => (
                  <ServiceCard
                    key={s.slug}
                    slug={s.slug}
                    name={s.name}
                    tagline={s.tagline}
                    href={serviceLocationHref(s.slug, slug)}
                  />
                ))}
              </div>
            </div>

            {districtAreas.length > 0 && (
              <div>
                <SectionHeading
                  center={false}
                  title={`All Kochi & Ernakulam areas we serve`}
                />
                <p className="mb-6 text-sm text-muted">
                  Full Kerala district coverage — {districtAreas.reduce((n, g) => n + g.areas.length, 0)} localities
                  across tiers 2–7. Tap any area for services, guides and free site inspection near you.
                </p>
                <DistrictAreaDirectory groups={districtAreas} currentCitySlug={slug} />
              </div>
            )}

            <LocationSeoServiceLinks
              services={seoServices}
              citySlug={slug}
              placeName={city.name}
            />

            <KeywordServiceLinks
              links={keywordLinks}
              title={`Best near me · Top Kerala · ${city.name}`}
              subtitle="Best near me, top Kerala, high quality #1 and premium safety net & invisible grill searches."
              max={36}
            />

            {city.reviews.length > 0 && (
              <div>
                <SectionHeading center={false} title={`Reviews from ${city.name}`} />
                <div className="grid gap-4 sm:grid-cols-2">
                  {city.reviews.map((r) => (
                    <div key={r.id} className="card p-5">
                      <Stars rating={r.rating} />
                      <p className="mt-2 text-sm text-muted">“{r.body}”</p>
                      <p className="mt-3 text-sm font-semibold">{r.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <RichContent
              content={content}
              serviceLabel={`invisible grills & safety nets in ${city.name}`}
              routeKey={`locations/${slug}`}
            />
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <QuoteForm city={city.name} source={path} />
          </aside>
        </div>
      </Section>
      <CTABand
        title={`Serving all of ${city.name}`}
        subtitle="Book a free local site survey and get a transparent quote within 24 hours."
      />
    </>
  );
}
