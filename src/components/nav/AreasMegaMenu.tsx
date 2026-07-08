import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { PRIMARY_CITY_SLUG, serviceLocationHref } from "@/lib/service-location-url";

type City = { slug: string; name: string; featured?: boolean };
type Service = { slug: string; name: string };

export function AreasMegaMenu({
  cities,
  featuredServices,
}: {
  cities: City[];
  featuredServices: Service[];
}) {
  const featured = cities.filter((c) => c.featured);
  const rest = cities.filter((c) => !c.featured).slice(0, 8);

  return (
    <div className="nav-mega group relative">
      <button type="button" className="nav-link" aria-haspopup="true">
        Areas
        <ChevronDown size={15} className="transition-transform group-hover:rotate-180" />
      </button>
      <div className="nav-mega-panel absolute left-1/2 top-full w-[min(92vw,48rem)] -translate-x-1/2 pt-3">
        <div className="mega-menu p-6">
          <div className="mb-4">
            <Link href="/locations" className="mega-menu__title text-base">
              All Kerala locations →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)]">
                Featured cities
              </p>
              <ul className="space-y-1.5">
                {featured.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/locations/${c.slug}`} className="mega-menu__link flex items-center gap-1.5">
                      <MapPin size={13} className="shrink-0 opacity-60" />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)]">
                More areas
              </p>
              <ul className="space-y-1.5">
                {rest.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/locations/${c.slug}`} className="mega-menu__link block">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {featuredServices.length > 0 && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)]">
                Popular in Kochi
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredServices.slice(0, 6).map((s) => (
                  <Link
                    key={s.slug}
                    href={serviceLocationHref(s.slug, PRIMARY_CITY_SLUG)}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
