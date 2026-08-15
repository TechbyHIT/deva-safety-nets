import { Award, Clock, MapPin, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PRINCIPLES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: "Certified Kerala safety",
    text: "IS-compliant SS304, SS316 and HDPE materials specified for humidity and monsoon conditions.",
  },
  {
    icon: Award,
    title: "Written warranty",
    text: "Up to 10-year warranty on materials and workmanship — documented at handover.",
  },
  {
    icon: Clock,
    title: "Fast local install",
    text: "Most projects completed within 1–2 days after free site inspection.",
  },
  {
    icon: MapPin,
    title: "Doorstep coverage",
    text: "Kochi, Ernakulam and 160+ localities — Edapally, Kakkanad, Vyttila, Aluva and beyond.",
  },
  {
    icon: Sparkles,
    title: "Near-invisible finish",
    text: "Discreet cable and mesh systems that preserve views and pass society approval.",
  },
  {
    icon: Wrench,
    title: "After-sales care",
    text: "Repair, re-tensioning and maintenance support from the same local team.",
  },
];

export function WhyDeva() {
  return (
    <section className="container-page py-16 md:py-24">
      <p className="eyebrow">Why Deva</p>
      <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
        Principles behind every installation
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Premium standards with local accountability — no fabricated counts, just the process we stand behind.
      </p>
      <div className="principle-grid mt-10">
        {PRINCIPLES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="principle">
            <Icon size={22} className="text-[var(--sage)]" aria-hidden />
            <h3 className="principle__title mt-3">{title}</h3>
            <p className="principle__text">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
