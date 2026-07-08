import Link from "next/link";
import type { SeoIntentLink } from "@/lib/seo-intents";

/** Best near me · top Kerala · #1 intent links for a specific service. */
export function IntentServiceLinks({
  links,
  serviceName,
}: {
  links: SeoIntentLink[];
  serviceName: string;
}) {
  if (links.length === 0) return null;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-bold">Best near me · Top Kerala · #1 {serviceName}</h2>
      <p className="mt-1 text-sm text-muted">
        Priority keyword pages — best near me, top Kerala, high quality #1 and best Kerala searches.
      </p>
      <ul className="mt-3 columns-1 gap-x-6 sm:columns-2">
        {links.map((l) => (
          <li key={l.slug} className="mb-1.5 break-inside-avoid">
            <Link
              href={`/services/${l.slug}`}
              prefetch={true}
              className="text-sm text-muted transition hover:text-[var(--primary)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
