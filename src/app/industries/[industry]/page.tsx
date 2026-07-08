import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CheckList, CTABand } from "@/components/ui";
import { getIndustryBySlug, getIndustries } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const industries = await getIndustries();
  return industries.map((i) => ({ industry: i.slug }));
}

type Props = { params: Promise<{ industry: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return {};
  return buildMetadata({
    title: `${industry.name} — Safety Solutions`,
    description: industry.summary,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryPage({ params }: Props) {
  const { industry: slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${slug}` },
        ]}
      />
      <PageHero eyebrow="Industry" title={industry.name} description={industry.summary} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Common challenges</h2>
            <div className="mt-3">
              <CheckList items={industry.challenges} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">How we solve them</h2>
            <div className="mt-3">
              <CheckList items={industry.solutions} />
            </div>
          </div>
        </div>
      </Section>
      <CTABand />
    </>
  );
}
