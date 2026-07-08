import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import { MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";

import { JsonLd } from "@/components/JsonLd";

import { QuoteForm } from "@/components/QuoteForm";

import { ServiceCard } from "@/components/ServiceCard";

import { RichContent } from "@/components/RichContent";

import { PageHero, Section, SectionHeading, CTABand } from "@/components/ui";

import {

  getAreaBySlug,

  getCategoriesWithServices,

  getDistrictAreasGrouped,

  getDistrictAreaStaticParams,
  getPopularKeywordLinks,
} from "@/lib/queries";

import { buildMetadata, buildLocationSeoKeywords } from "@/lib/seo";

import { localBusinessSchema } from "@/lib/schema";

import { generateContent } from "@/lib/content";

import { ServiceLocationDirectory } from "@/components/ServiceLocationDirectory";

import { DistrictAreaDirectory } from "@/components/DistrictAreaDirectory";

import { LocationSeoServiceLinks } from "@/components/LocationSeoServiceLinks";
import { KeywordServiceLinks } from "@/components/KeywordServiceLinks";

import { serviceLocationHref } from "@/lib/service-location-url";

import { TIER_LABELS } from "@/lib/kerala-locations";



export const revalidate = 86400;

export const dynamicParams = true;



export async function generateStaticParams() {

  return getDistrictAreaStaticParams();

}



type Props = { params: Promise<{ city: string; area: string }> };



export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { city: citySlug, area: areaSlug } = await params;

  const loc = await getAreaBySlug(citySlug, areaSlug);

  if (!loc) return {};

  const place = `${loc.area.name}, ${loc.city.name}`;

  return buildMetadata({

    title: `Best ${loc.area.name} Invisible Grills & Safety Nets — Near Me`,

    description: `Premium invisible grills and safety nets in ${place}, Kerala. Best installers near you — free site survey, fast installation and warranty. ${loc.area.tierLabel ?? "Local"} service area.`,

    path: `/locations/${citySlug}/${areaSlug}`,

    keywords: buildLocationSeoKeywords(loc.area.name, loc.city.name),

  });

}



export default async function AreaPage({ params }: Props) {

  const { city: citySlug, area: areaSlug } = await params;

  const [loc, categories, districtAreas, keywordLinks] = await Promise.all([

    getAreaBySlug(citySlug, areaSlug),

    getCategoriesWithServices(),

    getDistrictAreasGrouped(),

    getPopularKeywordLinks(32),

  ]);

  if (!loc) notFound();



  const path = `/locations/${citySlug}/${areaSlug}`;

  const tierLabel = loc.area.tierLabel ?? TIER_LABELS[loc.area.tier] ?? "Locality";

  const content = generateContent("Invisible Grills & Safety Nets", path.slice(1), {

    cityName: loc.city.name,

    state: loc.city.state,

    areaName: loc.area.name,

  });

  const topServices = categories.flatMap((c) => c.services.filter((s) => s.featured)).slice(0, 6);

  const seoServices = categories.flatMap((c) => c.services.slice(0, 2)).slice(0, 10);



  return (

    <>

      <JsonLd

        data={localBusinessSchema({

          cityName: loc.city.name,

          state: loc.city.state,

          areaName: loc.area.name,

          latitude: loc.city.latitude,

          longitude: loc.city.longitude,

          path,

        })}

      />

      <Breadcrumbs

        items={[

          { name: "Locations", path: "/locations" },

          { name: loc.city.name, path: `/locations/${citySlug}` },

          { name: loc.area.name, path },

        ]}

      />

      <PageHero

        eyebrow={`Tier ${loc.area.tier} · ${tierLabel}`}

        title={`Best Invisible Grills & Safety Nets in ${loc.area.name}`}

        description={`Premium ${loc.area.name} installation near you — ${content.intro}`}

      />

      <Section>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

          <div className="space-y-10">

            <p className="prose-content">{content.localInfo}</p>

            {content.introParagraphs.slice(1).map((p, i) => (

              <p key={i} className="prose-content">{p}</p>

            ))}

            <div>

              <SectionHeading center={false} title={`All services in ${loc.area.name}`} />

              <p className="mb-6 text-sm text-muted">

                Best {loc.area.name} team near you — every service includes free site survey and premium installation in{" "}

                {loc.city.name}.

              </p>

              <ServiceLocationDirectory

                categories={categories}

                citySlug={citySlug}

                cityName={loc.city.name}

                areaSlug={areaSlug}

                areaName={loc.area.name}

                maxCategories={8}

              />

            </div>

            <div>

              <SectionHeading center={false} title={`Featured in ${loc.area.name}`} />

              <div className="grid gap-4 sm:grid-cols-2">

                {topServices.map((s) => (

                  <ServiceCard

                    key={s.slug}

                    slug={s.slug}

                    name={s.name}

                    tagline={s.tagline}

                    href={serviceLocationHref(s.slug, citySlug, areaSlug)}

                  />

                ))}

              </div>

            </div>



            <LocationSeoServiceLinks

              services={seoServices}

              citySlug={citySlug}

              placeName={loc.area.name}

              areaSlug={areaSlug}

            />



            <KeywordServiceLinks

              links={keywordLinks}

              title={`Best near me · Top Kerala · ${loc.area.name}`}

              subtitle="Best near me, top Kerala, high quality #1 and premium installation keyword pages."

              max={32}

            />



            {loc.nearby.length > 0 && (

              <div>

                <SectionHeading center={false} title={`Nearby areas in ${loc.city.name}`} />

                <div className="flex flex-wrap gap-2">

                  {loc.nearby.map((a) => (

                    <Link

                      key={a.slug}

                      href={`/locations/${citySlug}/${a.slug}`}

                      prefetch={true}

                      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm text-muted hover:border-[var(--primary)] hover:text-[var(--primary)]"

                    >

                      <MapPin size={13} /> {a.name}

                    </Link>

                  ))}

                </div>

              </div>

            )}



            <div>

              <SectionHeading center={false} title="All Kochi & Ernakulam areas" />

              <p className="mb-6 text-sm text-muted">

                Browse every tier 2–7 locality — service × area pages for invisible grills, safety nets, guides and more.

              </p>

              <DistrictAreaDirectory groups={districtAreas} currentCitySlug={citySlug} showTierOne={true} />

            </div>



            <RichContent content={content} serviceLabel={`invisible grills & safety nets in ${loc.area.name}`} routeKey={path.slice(1)} />

          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">

            <QuoteForm city={`${loc.area.name}, ${loc.city.name}`} source={path} />

          </aside>

        </div>

      </Section>

      <CTABand

        title={`${loc.area.name} — free site survey near you`}

        subtitle={`Best premium invisible grills & safety nets across ${loc.area.name} and all Kochi–Ernakulam localities.`}

      />

    </>

  );

}


