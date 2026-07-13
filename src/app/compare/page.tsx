import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getComparisons } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "Compare Invisible Grills vs Safety Nets — Deva Safety Nets Kerala",
  description:
    "Honest side-by-side comparisons of invisible grills, safety nets, bird spikes and more. Understand cost, appearance, installation time and best use cases for Kerala homes and businesses.",
  path: "/compare",
});

export default async function ComparePage() {
  const comparisons = await getComparisons();
  return (
    <>
      <Breadcrumbs items={[{ name: "Compare", path: "/compare" }]} />
      <PageHero
        eyebrow="Comparisons"
        title="Compare your options"
        description="Honest, side-by-side comparisons from Deva Safety Nets — invisible grills vs safety nets, SS304 vs SS316, nylon vs HDPE and more. Choose the right solution for your Kerala property, budget and society requirements."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="card flex items-center justify-between gap-4 p-6 transition-colors hover:border-[var(--primary)]"
            >
              <span className="font-bold">
                {c.serviceA.name} <span className="text-muted">vs</span> {c.serviceB.name}
              </span>
              <ArrowRight size={18} className="text-[var(--primary)]" />
            </Link>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>How to use our comparison guides</h2>
          <p>
            Choosing between invisible grills and safety nets, SS304 and SS316, or nylon and HDPE
            mesh is easier when you compare criteria that actually matter: lifespan, visibility,
            installation time, maintenance, society approval and best use cases for Kerala homes.
            Our comparison pages are written from field experience — not generic internet copy.
          </p>
          <h3>When comparisons help most</h3>
          <p>
            Apartment owners deciding between premium cable systems and fast-install nets benefit
            from side-by-side tables. Coastal homeowners weighing SS316 against SS304 see how salt
            air affects long-term cost. Facility managers comparing bird spikes and exclusion nets
            learn which strategy suits ledges versus open balconies.
          </p>
          <h3>Still unsure after reading?</h3>
          <p>
            Comparisons inform — but your building is unique. A free site inspection confirms span
            length, wind exposure, fixing surfaces and society guidelines.{" "}
            <Link href="/contact" className="text-[var(--primary)]">
              Contact Deva Safety Nets
            </Link>{" "}
            for honest guidance, or read service-specific detail on our{" "}
            <Link href="/services" className="text-[var(--primary)]">
              services pages
            </Link>
            .
          </p>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
