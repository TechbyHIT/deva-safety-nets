import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceArticle } from "@/components/ServiceArticle";
import { JsonLd } from "@/components/JsonLd";
import { CTABand } from "@/components/ui";
import {
  getServiceBySlug,
  getRelatedServices,
  getPropertyTypeBySlug,
  getPropertyTypes,
  getAllCities,
  getContentOverride,
  getDistrictAreasGrouped,
} from "@/lib/queries";
import { isKeywordSeoService } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema, faqSchema } from "@/lib/schema";

// Service x PropertyType pages render on demand from the in-memory catalog (force-dynamic).
type Props = { params: Promise<{ service: string; propertyType: string }> };

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug, propertyType: ptSlug } = await params;
  const [service, pt] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getPropertyTypeBySlug(ptSlug),
  ]);
  if (!service || !pt) return {};
  const override = await getContentOverride(`services/${serviceSlug}/for/${ptSlug}`);
  return buildMetadata({
    title: override?.metaTitle ?? `${service.name} for ${pt.plural} in Kerala`,
    description:
      override?.metaDesc ??
      `${service.name} for ${pt.plural.toLowerCase()} in Kochi & Ernakulam. ${pt.summary} Free survey, expert install, warranty.`,
    path: `/services/${serviceSlug}/for/${ptSlug}`,
    keywords: [...service.keywords, pt.name, `${service.name} for ${pt.name}`],
    noindex: isKeywordSeoService(service),
  });
}

export default async function ServicePropertyTypePage({ params }: Props) {
  const { service: serviceSlug, propertyType: ptSlug } = await params;
  const [service, pt] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getPropertyTypeBySlug(ptSlug),
  ]);
  if (!service || !pt) notFound();

  const [related, propertyTypes, cities, districtAreas] = await Promise.all([
    getRelatedServices(service.categoryId, service.id),
    getPropertyTypes(),
    getAllCities(),
    getDistrictAreasGrouped(),
  ]);

  const path = `/services/${serviceSlug}/for/${ptSlug}`;
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
          serviceSchema({
            name: `${service.name} for ${pt.plural}`,
            description: service.tagline,
            path,
            priceMin: service.priceMin,
            priceMax: service.priceMax,
            priceUnit: service.priceUnit,
          }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${serviceSlug}` },
          { name: `For ${pt.plural}`, path },
        ]}
      />
      <ServiceArticle
        service={service}
        routeKey={`services/${serviceSlug}/for/${ptSlug}`}
        path={path}
        location={{ propertyType: pt.name, propertyTypePlural: pt.plural }}
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
        alsoForHeading="Also available for"
        alsoFor={propertyTypes
          .filter((p) => p.slug !== ptSlug)
          .map((p) => ({ slug: p.slug, name: p.plural, href: `/services/${serviceSlug}/for/${p.slug}` }))}
        otherCities={cities.slice(0, 12).map((c) => ({
          slug: c.slug,
          name: c.name,
          href: `/services/${serviceSlug}/${c.slug}`,
        }))}
      />
      <CTABand
        title={`${service.name} for your ${pt.name.toLowerCase()}`}
        subtitle="Book a free site survey and get a transparent, itemised quote within 24 hours."
      />
    </>
  );
}
