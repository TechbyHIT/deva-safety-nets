import { Award, MapPin, ShieldCheck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: "Certified materials" },
  { icon: Award, label: "Up to 10-year warranty" },
  { icon: Wrench, label: "Own installation teams" },
  { icon: MapPin, label: "Kochi & Ernakulam coverage" },
];

export function TrustStrip() {
  return (
    <div className="trust-strip" role="list">
      {ITEMS.map(({ icon: Icon, label }) => (
        <span key={label} role="listitem">
          <Icon size={16} aria-hidden />
          {label}
        </span>
      ))}
    </div>
  );
}
