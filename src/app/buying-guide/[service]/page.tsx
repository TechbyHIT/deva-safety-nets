import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideView } from "@/components/GuideView";
import { getGuideBySlug, getGuideServiceSlugs } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getGuideServiceSlugs("BUYING");
  return slugs.map((service) => ({ service }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const guide = await getGuideBySlug(`buying-${service}`);
  if (!guide) return {};
  return buildMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/buying-guide/${service}`,
    type: "article",
  });
}

export default async function BuyingGuidePage({ params }: Props) {
  const { service } = await params;
  const guide = await getGuideBySlug(`buying-${service}`);
  if (!guide) notFound();
  return <GuideView guide={guide} label="Buying Guide" basePath="/buying-guide" />;
}
