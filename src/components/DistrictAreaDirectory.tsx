import Link from "next/link";
import { MapPin } from "lucide-react";
import { KERALA_PRIMARY_CITIES } from "@/lib/kerala-locations";
import type { DistrictAreaGroup } from "@/lib/queries";

/** Full Kochi–Ernakulam tier hierarchy — shown on every city and area page. */
export function DistrictAreaDirectory({
  groups,
  currentCitySlug,
  showTierOne = true,
}: {
  groups: DistrictAreaGroup[];
  currentCitySlug?: string;
  showTierOne?: boolean;
}) {
  return (
    <div className="space-y-6">
      {showTierOne && (
        <div className="area-tier-section">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)]">
            Tier 1 · Primary Cities
          </p>
          <div className="flex flex-wrap gap-2">
            {KERALA_PRIMARY_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)] ${
                  currentCitySlug === c.slug ? "border-[var(--primary)] font-semibold text-[var(--primary)]" : "text-muted"
                }`}
              >
                <MapPin size={13} /> {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {groups.map((group) => (
        <div key={`${group.tier}-${group.label}`} className="area-tier-section">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)]">
            Tier {group.tier} · {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.areas.map((a) => (
              <Link
                key={a.id}
                href={`/locations/${a.citySlug}/${a.slug}`}
                prefetch={true}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm text-muted transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                title={`Invisible grills & safety nets in ${a.name} — best near me, premium installation`}
              >
                <MapPin size={13} /> {a.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
