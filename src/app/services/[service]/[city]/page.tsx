import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceArticle } from "@/components/ServiceArticle";
import { JsonLd } from "@/components/JsonLd";
import { CTABand } from "@/components/ui";
import {
  getServiceBySlug,
  getRelatedServices,
  getCityBySlug,
  getContentOverride,
  getDistrictAreasGrouped,
  getKeywordLinksForService,
  getIntentLinksForService,
} from "@/lib/queries";
import { buildMetadata, buildServiceLocationMetadata } from "@/lib/seo";
import {
  serviceSchema,
  faqSchema,
  localBusinessSchema,
  reviewAggregateSchema,
} from "@/lib/schema";

// City-level combination pages are generated on demand (ISR) rather than all
// pre-built, keeping the build fast while scaling to millions of URLs.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ service: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params;
  const [service, city] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getCityBySlug(citySlug),
  ]);
  if (!service || !city) return {};
  const override = await getContentOverride(`services/${serviceSlug}/${citySlug}`);
  if (override?.metaTitle || override?.metaDesc) {
    return buildMetadata({
      title: override.metaTitle ?? `${service.name} in ${city.name}`,
      description:
        override.metaDesc ??
        `Professional ${service.name.toLowerCase()} in ${city.name}, ${city.state}. Local team, free site survey and warranty.`,
      path: `/services/${serviceSlug}/${citySlug}`,
      keywords: [...service.keywords, city.name, `${service.name} ${city.name}`],
    });
  }
  return buildServiceLocationMetadata({
    serviceName: service.name,
    serviceKeywords: service.keywords,
    cityName: city.name,
    state: city.state,
    path: `/services/${serviceSlug}/${citySlug}`,
  });
}

export default async function ServiceCityPage({ params }: Props) {
  const { service: serviceSlug, city: citySlug } = await params;
  const [service, city, districtAreas] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getCityBySlug(citySlug),
    getDistrictAreasGrouped(),
  ]);
  if (!service || !city) notFound();

  const [related, keywordLinks, intentLinks] = await Promise.all([
    getRelatedServices(service.categoryId, service.id),
    getKeywordLinksForService(serviceSlug),
    getIntentLinksForService(serviceSlug),
  ]);
  const path = `/services/${serviceSlug}/${citySlug}`;
  const routeKey = `services/${serviceSlug}/${citySlug}`;
  const faqs = service.faqs.map((f) => ({ question: f.question, answer: f.answer }));
  const reviews = service.reviews.map((r) => ({
    id: r.id,
    author: r.author,
    rating: r.rating,
    body: r.body,
  }));

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
          serviceSchema({
            name: `${service.name} in ${city.name}`,
            description: service.tagline,
            path,
            priceMin: service.priceMin,
            priceMax: service.priceMax,
            priceUnit: service.priceUnit,
            areaServed: `${city.name}, ${city.state}`,
          }),
          faqSchema(faqs),
          reviewAggregateSchema({ itemName: `${service.name} in ${city.name}`, path, reviews }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${serviceSlug}` },
          { name: city.name, path },
        ]}
      />
      <ServiceArticle
        service={service}
        routeKey={routeKey}
        path={path}
        location={{ cityName: city.name, state: city.state, region: city.region }}
        materials={service.materials.map((m) => ({
          slug: m.material.slug,
          name: m.material.name,
          grade: m.material.grade,
          summary: m.material.summary,
        }))}
        faqs={faqs}
        reviews={reviews}
        related={related}
        districtAreaGroups={districtAreas}
        currentCitySlug={citySlug}
        keywordLinks={keywordLinks}
        intentLinks={intentLinks}
      />
      <CTABand
        title={`Get ${service.name.toLowerCase()} in ${city.name}`}
        subtitle="Book a free local site survey and receive a transparent quote within 24 hours."
      />
    </>
  );
}
