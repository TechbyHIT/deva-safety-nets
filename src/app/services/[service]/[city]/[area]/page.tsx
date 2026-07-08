import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceArticle } from "@/components/ServiceArticle";
import { JsonLd } from "@/components/JsonLd";
import { CTABand } from "@/components/ui";
import {
  getServiceBySlug,
  getRelatedServices,
  getAreaBySlug,
  getContentOverride,
  getDistrictAreasGrouped,
  getKeywordLinksForService,
  getIntentLinksForService,
} from "@/lib/queries";
import { buildMetadata, buildServiceLocationMetadata } from "@/lib/seo";
import { serviceSchema, faqSchema, localBusinessSchema } from "@/lib/schema";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ service: string; city: string; area: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug, area: areaSlug } = await params;
  const [service, loc] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getAreaBySlug(citySlug, areaSlug),
  ]);
  if (!service || !loc) return {};
  const override = await getContentOverride(`services/${serviceSlug}/${citySlug}/${areaSlug}`);
  if (override?.metaTitle || override?.metaDesc) {
    return buildMetadata({
      title: override.metaTitle ?? `${service.name} in ${loc.area.name}, ${loc.city.name}`,
      description:
        override.metaDesc ??
        `Doorstep ${service.name.toLowerCase()} in ${loc.area.name}, ${loc.city.name}. Local technicians, free measurement, fast installation and warranty.`,
      path: `/services/${serviceSlug}/${citySlug}/${areaSlug}`,
      keywords: [...service.keywords, loc.area.name, loc.city.name],
    });
  }
  return buildServiceLocationMetadata({
    serviceName: service.name,
    serviceKeywords: service.keywords,
    cityName: loc.city.name,
    state: loc.city.state,
    areaName: loc.area.name,
    path: `/services/${serviceSlug}/${citySlug}/${areaSlug}`,
  });
}

export default async function ServiceAreaPage({ params }: Props) {
  const { service: serviceSlug, city: citySlug, area: areaSlug } = await params;
  const [service, loc, districtAreas] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getAreaBySlug(citySlug, areaSlug),
    getDistrictAreasGrouped(),
  ]);
  if (!service || !loc) notFound();

  const [related, keywordLinks, intentLinks] = await Promise.all([
    getRelatedServices(service.categoryId, service.id),
    getKeywordLinksForService(serviceSlug),
    getIntentLinksForService(serviceSlug),
  ]);
  const path = `/services/${serviceSlug}/${citySlug}/${areaSlug}`;
  const routeKey = path.slice(1);
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
            cityName: loc.city.name,
            state: loc.city.state,
            areaName: loc.area.name,
            latitude: loc.city.latitude,
            longitude: loc.city.longitude,
            path,
          }),
          serviceSchema({
            name: `${service.name} in ${loc.area.name}, ${loc.city.name}`,
            description: service.tagline,
            path,
            priceMin: service.priceMin,
            priceMax: service.priceMax,
            priceUnit: service.priceUnit,
            areaServed: `${loc.area.name}, ${loc.city.name}`,
          }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${serviceSlug}` },
          { name: loc.city.name, path: `/services/${serviceSlug}/${citySlug}` },
          { name: loc.area.name, path },
        ]}
      />
      <ServiceArticle
        service={service}
        routeKey={routeKey}
        path={path}
        location={{
          cityName: loc.city.name,
          state: loc.city.state,
          region: loc.city.region,
          areaName: loc.area.name,
        }}
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
        currentAreaSlug={areaSlug}
        keywordLinks={keywordLinks}
        intentLinks={intentLinks}
      />
      <CTABand
        title={`${service.name} in ${loc.area.name}`}
        subtitle={`Serving ${loc.area.name} and nearby ${loc.city.name} localities with free surveys and fast installation.`}
      />
    </>
  );
}
