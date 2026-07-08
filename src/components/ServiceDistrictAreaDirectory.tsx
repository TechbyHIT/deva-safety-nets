import Link from "next/link";
import { MapPin } from "lucide-react";
import { KERALA_PRIMARY_CITIES } from "@/lib/kerala-locations";
import { serviceLocationHref } from "@/lib/service-location-url";
import type { DistrictAreaGroup } from "@/lib/queries";

/** Full tier hierarchy with service × area URLs (programmatic SEO). */
export function ServiceDistrictAreaDirectory({
  serviceSlug,
  serviceName,
  groups,
  currentCitySlug,
  currentAreaSlug,
}: {
  serviceSlug: string;
  serviceName: string;
  groups: DistrictAreaGroup[];
  currentCitySlug?: string;
  currentAreaSlug?: string;
}) {
  return (
    <div className="area-tier-directory space-y-5">
      <div className="area-tier-section">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)]">
          Tier 1 · Primary Cities
        </p>
        <div className="flex flex-wrap gap-2">
          {KERALA_PRIMARY_CITIES.map((c) => (
            <Link
              key={c.slug}
              href={serviceLocationHref(serviceSlug, c.slug)}
              prefetch={true}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)] ${
                currentCitySlug === c.slug && !currentAreaSlug
                  ? "border-[var(--primary)] font-semibold text-[var(--primary)]"
                  : "text-muted"
              }`}
              title={`${serviceName} in ${c.name}`}
            >
              <MapPin size={13} /> {c.name}
            </Link>
          ))}
        </div>
      </div>

      {groups.map((group) => (
        <div key={`${group.tier}-${group.label}`} className="area-tier-section">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)]">
            Tier {group.tier} · {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.areas.map((a) => {
              const active = currentCitySlug === a.citySlug && currentAreaSlug === a.slug;
              return (
                <Link
                  key={a.id}
                  href={serviceLocationHref(serviceSlug, a.citySlug, a.slug)}
                  prefetch={true}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)] ${
                    active ? "border-[var(--primary)] font-semibold text-[var(--primary)]" : "text-muted"
                  }`}
                  title={`Best ${serviceName} in ${a.name} · near me · premium`}
                >
                  <MapPin size={13} /> {a.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
