import Link from "next/link";

type City = { slug: string; name: string; featured: boolean };

export function ServiceAreas({ cities, areaCount }: { cities: City[]; areaCount: number }) {
  return (
    <section className="container-page py-16 md:py-24" id="locations">
      <p className="eyebrow">Service areas</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        Kochi &amp; Ernakulam directory
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Free site inspections across {areaCount}+ Kerala localities — select your city or browse the full map.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {cities.map((c) => (
          <Link
            key={c.slug}
            href={`/locations/${c.slug}`}
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--sage)] hover:text-[var(--forest)]"
          >
            {c.name}
          </Link>
        ))}
        <Link
          href="/locations"
          className="rounded-md bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-[var(--ivory)]"
        >
          All locations →
        </Link>
      </div>
    </section>
  );
}
