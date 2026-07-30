import Link from "next/link";
import { serviceLocationHref } from "@/lib/service-location-url";

type Service = { slug: string; name: string };

/** Clean local service links — one real URL per service, no keyword label spam. */
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
  if (list.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="mb-3 text-sm font-semibold text-[var(--text)]">
        Services we install in {placeName}
      </p>
      <ul className="columns-1 gap-x-6 sm:columns-2 lg:columns-3">
        {list.map((s) => (
          <li key={s.slug} className="mb-1.5 break-inside-avoid">
            <Link
              href={serviceLocationHref(s.slug, citySlug, areaSlug)}
              prefetch={true}
              className="text-sm text-muted transition hover:text-[var(--primary)]"
            >
              {s.name} in {placeName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
