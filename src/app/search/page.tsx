import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBox } from "@/components/SearchBox";
import { PageHero, Section } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { searchSite } from "@/lib/search";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search our services, locations, property types, guides and articles.",
  path: "/search",
  noindex: true,
});

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = q.trim().length >= 2 ? await searchSite(q, 50) : [];

  return (
    <>
      <Breadcrumbs items={[{ name: "Search", path: "/search" }]} />
      <PageHero
        eyebrow="Search"
        title={q ? `Results for “${q}”` : "Search"}
        description="Find services, cities, areas, property types, guides and articles."
      >
        <div className="mt-6 max-w-xl">
          <SearchBox variant="page" />
        </div>
      </PageHero>
      <Section>
        {q.trim().length < 2 ? (
          <p className="text-muted">Type at least two characters to search.</p>
        ) : results.length === 0 ? (
          <p className="text-muted">No results found for “{q}”. Try a different term or browse our services.</p>
        ) : (
          <div className="grid gap-3">
            {results.map((r, i) => (
              <Link
                key={`${r.href}-${i}`}
                href={r.href}
                className="card flex items-center justify-between gap-4 p-4 transition-colors hover:border-[var(--primary)]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.title}</p>
                  <p className="truncate text-sm text-muted">{r.subtitle}</p>
                </div>
                <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                  {r.type}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
