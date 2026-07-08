import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CheckList, CTABand } from "@/components/ui";
import { getMaterialBySlug, getMaterials } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const materials = await getMaterials();
  return materials.map((m) => ({ material: m.slug }));
}

type Props = { params: Promise<{ material: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { material: slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) return {};
  return buildMetadata({
    title: `${material.name} — Properties, Advantages & Uses`,
    description: material.summary,
    path: `/materials/${slug}`,
  });
}

export default async function MaterialPage({ params }: Props) {
  const { material: slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) notFound();

  const props = (material.properties ?? {}) as Record<string, string>;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Materials", path: "/materials" },
          { name: material.name, path: `/materials/${slug}` },
        ]}
      />
      <PageHero eyebrow={material.grade ?? "Material"} title={material.name} description={material.summary} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Advantages</h2>
            <div className="mt-3">
              <CheckList items={material.advantages} />
            </div>
            <h2 className="mt-8 text-xl font-bold">Best for</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {material.bestFor.map((b) => (
                <span key={b} className="rounded-full border px-3 py-1 text-sm text-muted">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Properties</h2>
            <dl className="mt-3 divide-y overflow-hidden rounded-xl border">
              {Object.entries(props).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="capitalize text-muted">{k}</dt>
                  <dd className="font-medium">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {material.services.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold">Services using {material.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {material.services.map((sm) => (
                <Link
                  key={sm.service.slug}
                  href={`/services/${sm.service.slug}`}
                  className="rounded-full border px-3 py-1 text-sm text-muted hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  {sm.service.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>
      <CTABand />
    </>
  );
}
