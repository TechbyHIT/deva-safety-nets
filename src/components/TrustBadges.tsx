import { Award, BadgeCheck, ShieldCheck, Star, Users, Wrench } from "lucide-react";
import { site } from "@/lib/site";

const BADGES = [
  { icon: ShieldCheck, label: "IS-Compliant Materials", detail: "Certified SS304, SS316 & HDPE" },
  { icon: Award, label: "Up to 10-Year Warranty", detail: "Written warranty on every project" },
  { icon: Star, label: "4.9★ Google Rating", detail: `Trusted Kerala families · ${site.name}` },
  { icon: Users, label: "10,000+ Installations", detail: "Homes, apartments & commercial" },
  { icon: BadgeCheck, label: "Free Site Inspection", detail: "No-obligation survey & quote" },
  { icon: Wrench, label: "Own Trained Teams", detail: "Never subcontracted installs" },
];

export function TrustBadges({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {BADGES.slice(0, 4).map((b) => (
          <span
            key={b.label}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              light ? "trust-badge-light" : "glass"
            }`}
          >
            <b.icon size={14} className={light ? "trust-icon-light" : "trust-icon"} />
            {b.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {BADGES.map((b) => (
        <div key={b.label} className="glass flex items-start gap-3 rounded-xl p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
            <b.icon size={20} className="text-[var(--primary)]" />
          </span>
          <div>
            <p className="font-semibold leading-tight">{b.label}</p>
            <p className="mt-0.5 text-xs text-muted">{b.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
