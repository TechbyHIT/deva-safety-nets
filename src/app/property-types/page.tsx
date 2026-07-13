import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getPropertyTypes } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "Solutions by Property Type",
  description:
    "Invisible grills and safety nets tailored to your property — apartments, villas, independent houses, commercial buildings, industrial facilities and more.",
  path: "/property-types",
});

export default async function PropertyTypesPage() {
  const propertyTypes = await getPropertyTypes();
  return (
    <>
      <Breadcrumbs items={[{ name: "Property Types", path: "/property-types" }]} />
      <PageHero
        eyebrow="By Property Type"
        title="Safety solutions tailored to your property"
        description="Every property type has different safety needs and aesthetics. Explore solutions designed specifically for yours."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propertyTypes.map((p) => (
            <Link
              key={p.slug}
              href={`/property-types/${p.slug}`}
              className="card p-6 transition-colors hover:border-[var(--primary)]"
            >
              <Building2 className="text-[var(--primary)]" />
              <h2 className="mt-3 text-lg font-bold">{p.plural}</h2>
              <p className="mt-1 text-sm text-muted">{p.summary}</p>
            </Link>
          ))}
        </div>
      </Section>
      <CTABand />
    </>
  );
}
