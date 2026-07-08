import {
  BookOpen,
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
import { KeywordServiceLinks } from "./KeywordServiceLinks";
import { site } from "@/lib/site";
import type { GeneratedContent } from "@/lib/content";

/**
 * Renders the long-form, deterministically-generated content sections shared by
 * location and property-type pages so every combination page carries rich,
 * unique copy (why-it-matters, safety standards, pricing factors, complete
 * guide, buying tips, maintenance and generated FAQs).
 */
export function RichContent({
  content,
  serviceLabel,
  extraFaqs = [],
  showGuide = true,
  routeKey = "default",
  keywordLinks,
}: {
  content: GeneratedContent;
  serviceLabel: string;
  extraFaqs?: { question: string; answer: string }[];
  showGuide?: boolean;
  routeKey?: string;
  keywordLinks?: { slug: string; name: string }[];
}) {
  const faqSeen = new Set<string>();
  const faqs = [...extraFaqs, ...content.generatedFaqs].filter((f) => {
    const key = f.question.trim().toLowerCase();
    if (faqSeen.has(key)) return false;
    faqSeen.add(key);
    return true;
  });

  const galleryImages = getGallerySet(routeKey, 6, `${site.name} local installation`);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold">Why {serviceLabel.toLowerCase()} matter here</h2>
        <p className="prose-content mt-3">{content.whyMatters}</p>
        <p className="prose-content mt-3">{content.localChallenges}</p>
      </section>

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
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck size={22} className="text-[var(--primary)]" /> Safety standards we follow
        </h2>
        <div className="mt-4">
          <CheckList items={content.safetyStandards} />
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <ClipboardCheck size={22} className="text-[var(--primary)]" /> What we assess during your free survey
        </h2>
        <div className="mt-4 space-y-3">
          {content.pricingFactors.map((f, i) => (
            <div key={i} className="card p-4">
              <p className="font-semibold">{f.factor}</p>
              <p className="text-sm text-muted">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Recent installations nearby</h2>
        <p className="mt-1 text-muted">Professional {serviceLabel.toLowerCase()} completed by our Kerala teams.</p>
        <div className="mt-4">
          <LightboxGallery images={galleryImages} columns={2} variant="grid" />
        </div>
      </section>

      {showGuide && (
        <section className="space-y-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <BookOpen size={22} className="text-[var(--primary)]" /> Complete guide
          </h2>
          {content.guideSections.map((g, i) => (
            <div key={i}>
              <h3 className="text-xl font-bold">{g.heading}</h3>
              {g.paragraphs.map((p, j) => (
                <p key={j} className="prose-content mt-2">{p}</p>
              ))}
            </div>
          ))}
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

      {keywordLinks && keywordLinks.length > 0 && (
        <KeywordServiceLinks
          links={keywordLinks}
          title="Related service searches"
          subtitle="Browse keyword pages for best near me, top Kerala, high quality #1, installation and local terms across Kerala."
          max={32}
        />
      )}

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
