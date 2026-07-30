import Link from "next/link";
import { SERVICE_MENU } from "@/lib/service-menu";

/** Site-wide links to real menu services — not keyword spam pages. */
export function GlobalSeoIntentLinks() {
  const links = SERVICE_MENU.flatMap((cat) =>
    cat.services.slice(0, 6).map((s) => ({ ...s, category: cat.name })),
  );

  return (
    <section className="global-seo-intents border-t border-[var(--border)] bg-[var(--bg-subtle)] py-10">
      <div className="container-page">
        <h2 className="text-lg font-bold">Popular services across Kerala</h2>
        <p className="mt-1 text-sm text-muted">
          Invisible grills, safety nets and bird protection — free survey in Kochi &amp; Ernakulam.
        </p>
        <ul className="mt-4 columns-1 gap-x-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {links.map((l) => (
            <li key={l.slug} className="mb-1.5 break-inside-avoid">
              <Link
                href={`/services/${l.slug}`}
                prefetch={true}
                className="text-sm text-muted transition hover:text-[var(--primary)]"
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
