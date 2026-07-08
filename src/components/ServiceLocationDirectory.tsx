import Link from "next/link";
import { serviceLocationHref, serviceLocationLabel } from "@/lib/service-location-url";
type Category = {
  slug: string;
  name: string;
  services: { slug: string; name: string }[];
};

/** Grid of "{Service} in {Place}" links for city or area SEO hubs. */
export function ServiceLocationDirectory({
  categories,
  citySlug,
  cityName,
  areaSlug,
  areaName,
  maxCategories,
}: {
  categories: Category[];
  citySlug: string;
  cityName: string;
  areaSlug?: string;
  areaName?: string;
  maxCategories?: number;
}) {
  const place = areaName ?? cityName;
  const list = maxCategories ? categories.slice(0, maxCategories) : categories;

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((cat) => (
        <div key={cat.slug}>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--accent)]">{cat.name}</h3>
          <ul className="space-y-1.5">
            {cat.services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={serviceLocationHref(s.slug, citySlug, areaSlug)}
                  prefetch={true}
                  className="text-sm text-muted transition hover:text-[var(--primary)]"
                  title={`Best ${s.name} in ${place} · near me · premium`}
                >
                  {serviceLocationLabel(s.name, place)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
