import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getMaterials } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "Materials — SS304, SS316, Nylon & HDPE Kerala",
  description:
    "SS304, marine SS316, nylon and HDPE for invisible grills and safety nets in Kerala — what we use and why for Kochi & coastal homes.",
  path: "/materials",
});

export default async function MaterialsPage() {
  const materials = await getMaterials();
  return (
    <>
      <Breadcrumbs items={[{ name: "Materials", path: "/materials" }]} />
      <PageHero
        eyebrow="Materials"
        title="The materials behind lasting safety"
        description="We only use certified, industry-grade materials. Learn how each one performs and where it's the right choice."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {materials.map((m) => (
            <Link
              key={m.slug}
              href={`/materials/${m.slug}`}
              className="card p-6 transition-colors hover:border-[var(--primary)]"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{m.name}</h2>
                {m.grade && (
                  <span className="rounded bg-[var(--bg-subtle)] px-2 py-0.5 text-xs">{m.grade}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted">{m.summary}</p>
            </Link>
          ))}
        </div>
      </Section>
      <CTABand />
    </>
  );
}
