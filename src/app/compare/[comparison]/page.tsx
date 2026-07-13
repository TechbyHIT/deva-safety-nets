import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getComparisonBySlug, getComparisons } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export async function generateStaticParams() {
  const comparisons = await getComparisons();
  return comparisons.map((c) => ({ comparison: c.slug }));
}

type Props = { params: Promise<{ comparison: string }> };

export const dynamic = "force-static";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { comparison: slug } = await params;
  const c = await getComparisonBySlug(slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.serviceA.name} vs ${c.serviceB.name} — Which Is Better?`,
    description: c.intro,
    path: `/compare/${slug}`,
    type: "article",
  });
}

export default async function ComparisonPage({ params }: Props) {
  const { comparison: slug } = await params;
  const c = await getComparisonBySlug(slug);
  if (!c) notFound();

  const criteria = (c.criteria ?? []) as { label: string; a: string; b: string }[];

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Compare", path: "/compare" },
          { name: `${c.serviceA.name} vs ${c.serviceB.name}`, path: `/compare/${slug}` },
        ]}
      />
      <PageHero
        eyebrow="Comparison"
        title={`${c.serviceA.name} vs ${c.serviceB.name}`}
        description={c.intro}
      />
      <Section>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse overflow-hidden rounded-xl border text-sm">
            <thead>
              <tr className="surface-subtle text-left">
                <th className="px-4 py-3 font-semibold">Criteria</th>
                <th className="px-4 py-3 font-semibold">{c.serviceA.name}</th>
                <th className="px-4 py-3 font-semibold">{c.serviceB.name}</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3 font-medium">{row.label}</td>
                  <td className="px-4 py-3 text-muted">{row.a}</td>
                  <td className="px-4 py-3 text-muted">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 card p-6">
          <h2 className="text-xl font-bold">Our verdict</h2>
          <p className="prose-content mt-2">{c.verdict}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/services/${c.serviceA.slug}`} className="btn btn-outline">
              {c.serviceA.name}
            </Link>
            <Link href={`/services/${c.serviceB.slug}`} className="btn btn-outline">
              {c.serviceB.name}
            </Link>
          </div>
        </div>
      </Section>
      <CTABand />
    </>
  );
}
