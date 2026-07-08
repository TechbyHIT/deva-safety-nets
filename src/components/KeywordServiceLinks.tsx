import Link from "next/link";

type LinkItem = { slug: string; name: string; label?: string };

/** Internal links to long-tail keyword service pages (/services/[slug]). */
export function KeywordServiceLinks({
  links,
  title = "Related service searches",
  subtitle,
  columns = 3,
  max = 30,
}: {
  links: LinkItem[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  max?: number;
}) {
  const items = links.slice(0, max);
  if (items.length === 0) return null;

  const colClass =
    columns === 4 ? "lg:columns-4" : columns === 2 ? "sm:columns-2" : "sm:columns-2 lg:columns-3";

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      <ul className={`mt-3 columns-1 gap-x-6 ${colClass}`}>
        {items.map((l) => (
          <li key={l.slug} className="mb-1.5 break-inside-avoid">
            <Link
              href={`/services/${l.slug}`}
              prefetch={true}
              className="text-sm text-muted transition hover:text-[var(--primary)]"
            >
              {l.label ?? l.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
