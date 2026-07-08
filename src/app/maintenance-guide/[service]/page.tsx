import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideView } from "@/components/GuideView";
import { getGuideBySlug, getGuideServiceSlugs } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getGuideServiceSlugs("MAINTENANCE");
  return slugs.map((service) => ({ service }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const guide = await getGuideBySlug(`maintenance-${service}`);
  if (!guide) return {};
  return buildMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/maintenance-guide/${service}`,
    type: "article",
  });
}

export default async function MaintenanceGuidePage({ params }: Props) {
  const { service } = await params;
  const guide = await getGuideBySlug(`maintenance-${service}`);
  if (!guide) notFound();
  return <GuideView guide={guide} label="Maintenance Guide" basePath="/maintenance-guide" />;
}
