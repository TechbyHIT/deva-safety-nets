import Link from "next/link";
import { serviceLocationHref } from "@/lib/service-location-url";
import { LOCATION_PAGE_INTENTS } from "@/lib/seo-intents";

type Service = { slug: string; name: string };

/** Intent-rich service links: in, near me, best, premium, for — for local SEO hubs. */
export function LocationSeoServiceLinks({
  services,
  citySlug,
  placeName,
  areaSlug,
  max = 12,
}: {
  services: Service[];
  citySlug: string;
  placeName: string;
  areaSlug?: string;
  max?: number;
}) {
  const list = services.slice(0, max);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="mb-3 text-sm font-semibold text-[var(--text)]">
        Popular searches in {placeName}
      </p>
      <ul className="columns-1 gap-x-6 sm:columns-2 lg:columns-3">
        {list.flatMap((s) =>
          LOCATION_PAGE_INTENTS.map((intent) => {
            const label = intent.format(s.name, placeName);
            return (
              <li key={`${s.slug}-${intent.key}`} className="mb-1.5 break-inside-avoid">
                <Link
                  href={serviceLocationHref(s.slug, citySlug, areaSlug)}
                  prefetch={true}
                  className="text-sm text-muted transition hover:text-[var(--primary)]"
                  title={label}
                >
                  {label}
                </Link>
              </li>
            );
          }),
        )}
      </ul>
    </div>
  );
}
