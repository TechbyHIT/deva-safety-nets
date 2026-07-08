import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceArticle } from "@/components/ServiceArticle";
import { JsonLd } from "@/components/JsonLd";
import { CTABand } from "@/components/ui";
import {
  getServiceBySlug,
  getRelatedServices,
  getCoreServiceSlugs,
  getKeywordLinksForService,
  getIntentLinksForService,
  getAllCities,
  getPropertyTypes,
  getContentOverride,
  getDistrictAreasGrouped,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema, faqSchema, reviewAggregateSchema } from "@/lib/schema";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getCoreServiceSlugs();
  return slugs.map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  const override = await getContentOverride(`services/${slug}`);
  return buildMetadata({
    title: override?.metaTitle ?? `${service.name} — Materials, Installation & Kerala Service`,
    description:
      override?.metaDesc ??
      `${service.tagline} Free site inspection, expert Kerala installation and long-term warranty.`,
    path: `/services/${slug}`,
    keywords: service.keywords,
  });
}

export default async function ServicePage({ params }: Props) {
  const { service: slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [related, cities, propertyTypes, districtAreas, keywordLinks, intentLinks] = await Promise.all([
    getRelatedServices(service.categoryId, service.id),
    getAllCities(),
    getPropertyTypes(),
    getDistrictAreasGrouped(),
    getKeywordLinksForService(slug),
    getIntentLinksForService(slug),
  ]);

  const path = `/services/${slug}`;
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
            name: service.name,
            description: service.tagline,
            path,
            priceMin: service.priceMin,
            priceMax: service.priceMax,
            priceUnit: service.priceUnit,
          }),
          faqSchema(faqs),
          reviewAggregateSchema({ itemName: service.name, path, reviews }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path },
        ]}
      />
      <ServiceArticle
        service={service}
        routeKey={`services/${slug}`}
        path={path}
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
        alsoForHeading={`${service.name} by property type`}
        alsoFor={propertyTypes.map((p) => ({
          slug: p.slug,
          name: p.plural,
          href: `/services/${slug}/for/${p.slug}`,
        }))}
        otherCities={cities.slice(0, 12).map((c) => ({
          slug: c.slug,
          name: c.name,
          href: `/services/${slug}/${c.slug}`,
        }))}
        keywordLinks={keywordLinks}
        intentLinks={intentLinks}
      />
      <CTABand />
    </>
  );
}
