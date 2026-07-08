import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getIndustries } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description:
    "Tailored invisible grill and safety net solutions for residential, commercial, industrial, education, healthcare and hospitality sectors.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <Breadcrumbs items={[{ name: "Industries", path: "/industries" }]} />
      <PageHero
        eyebrow="Industries"
        title="Solutions for every sector"
        description="From high-rise apartments to factories and hospitals, we tailor safety solutions to each industry's unique challenges."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="card p-6 transition-colors hover:border-[var(--primary)]"
            >
              <h2 className="text-lg font-bold">{ind.name}</h2>
              <p className="mt-2 text-sm text-muted">{ind.summary}</p>
            </Link>
          ))}
        </div>
      </Section>
      <CTABand />
    </>
  );
}
