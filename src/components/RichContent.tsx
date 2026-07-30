import {
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { getGallerySet } from "@/lib/images";
import { FaqAccordion } from "./FaqAccordion";
import { CheckList } from "./ui";
import { LightboxGallery } from "./ImageGallery";
import { site } from "@/lib/site";
import type { GeneratedContent } from "@/lib/content";

/**
 * Shared high-intent sections for location and property-type pages.
 * Curated facts only — no long AI “complete guide” filler.
 */
export function RichContent({
  content,
  serviceLabel,
  extraFaqs = [],
}: {
  content: GeneratedContent;
  serviceLabel: string;
  extraFaqs?: { question: string; answer: string }[];
  /** @deprecated unused — kept for call-site compatibility */
  showGuide?: boolean;
  routeKey?: string;
  keywordLinks?: { slug: string; name: string }[];
}) {
  const faqSeen = new Set<string>();
  const faqs = [...extraFaqs, ...content.generatedFaqs]
    .filter((f) => {
      const key = f.question.trim().toLowerCase();
      if (faqSeen.has(key)) return false;
      faqSeen.add(key);
      return true;
    })
    .slice(0, 8);

  const gallery = getGallerySet("rich-content", 4).map((img, i) => ({
    ...img,
    alt: `${site.name} — ${serviceLabel} photo ${i + 1}`,
  }));

  return (
    <div className="space-y-10">
      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Lightbulb size={20} className="text-[var(--accent)]" /> Key takeaways
        </h2>
        <ul className="mt-3 space-y-2">
          {content.keyTakeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Why it matters</h2>
        <p className="prose-content mt-3">{content.whyMatters}</p>
        <p className="prose-content mt-3">{content.localChallenges}</p>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck size={22} className="text-[var(--primary)]" /> Safety standards we follow
        </h2>
        <div className="mt-4">
          <CheckList items={content.safetyStandards} />
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <ClipboardCheck size={22} className="text-[var(--primary)]" /> What affects pricing
        </h2>
        <ul className="mt-4 space-y-3">
          {content.pricingFactors.map((p, i) => (
            <li key={i}>
              <p className="font-semibold">{p.factor}</p>
              <p className="text-sm text-muted">{p.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {gallery.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">Recent work</h2>
          <LightboxGallery images={gallery} />
        </section>
      )}

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles size={22} className="text-[var(--primary)]" /> What to look for before you buy
        </h2>
        <div className="mt-4">
          <CheckList items={content.buyingConsiderations} />
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Wrench size={22} className="text-[var(--primary)]" /> Maintenance &amp; care tips
        </h2>
        <div className="mt-4">
          <CheckList items={content.maintenanceTips} />
        </div>
      </section>

      {faqs.length > 0 && (
        <section id="faq" className="scroll-mt-24">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-4">
            <FaqAccordion items={faqs} />
          </div>
        </section>
      )}
    </div>
  );
}
