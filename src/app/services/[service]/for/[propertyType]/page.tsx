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
  getKeywordLinksForService,
  getIntentLinksForService,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema, faqSchema } from "@/lib/schema";

// Service x PropertyType pages generated on demand (ISR). The `for` segment is
// a static sibling of the dynamic [city] segment, so there is no route clash.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ service: string; propertyType: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug, propertyType: ptSlug } = await params;
  const [service, pt] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getPropertyTypeBySlug(ptSlug),
  ]);
  if (!service || !pt) return {};
  const override = await getContentOverride(`services/${serviceSlug}/for/${ptSlug}`);
  return buildMetadata({
    title: override?.metaTitle ?? `${service.name} for ${pt.plural} — Expert Solutions`,
    description:
      override?.metaDesc ??
      `${service.name} designed for ${pt.plural.toLowerCase()}. ${pt.summary} Free site survey, expert installation and warranty.`,
    path: `/services/${serviceSlug}/for/${ptSlug}`,
    keywords: [...service.keywords, pt.name, `${service.name} for ${pt.name}`],
  });
}

export default async function ServicePropertyTypePage({ params }: Props) {
  const { service: serviceSlug, propertyType: ptSlug } = await params;
  const [service, pt] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getPropertyTypeBySlug(ptSlug),
  ]);
  if (!service || !pt) notFound();

  const [related, propertyTypes, cities, districtAreas, keywordLinks, intentLinks] = await Promise.all([
    getRelatedServices(service.categoryId, service.id),
    getPropertyTypes(),
    getAllCities(),
    getDistrictAreasGrouped(),
    getKeywordLinksForService(serviceSlug),
    getIntentLinksForService(serviceSlug),
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
        keywordLinks={keywordLinks}
        intentLinks={intentLinks}
      />
      <CTABand
        title={`${service.name} for your ${pt.name.toLowerCase()}`}
        subtitle="Book a free site survey and get a transparent, itemised quote within 24 hours."
      />
    </>
  );
}
