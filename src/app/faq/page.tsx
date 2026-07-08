import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getGeneralFaqs, getCategoriesWithServices } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions — Deva Safety Nets Kerala",
  description:
    "Extensive FAQs on invisible grills, balcony safety nets, child and pet safety, pigeon nets, bird spikes, sports nets, cloth hangers, installation, maintenance, materials, pricing and Kerala service areas.",
  path: "/faq",
});

export default async function FaqPage() {
  const [faqs, categories] = await Promise.all([
    getGeneralFaqs(),
    getCategoriesWithServices(),
  ]);
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} />
      <PageHero
        eyebrow="Help Center"
        title="Frequently asked questions"
        description="Comprehensive answers about invisible grills, safety nets, bird control, sports nets, installation, maintenance, materials and Kerala service areas from Deva Safety Nets. Can't find your answer? Contact us anytime."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          <div className="mt-10">
            <h2 className="mb-3 text-lg font-bold">Service-specific FAQs</h2>
            <p className="mb-4 text-sm text-muted">
              Each service page has detailed FAQs about pricing, installation and safety:
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.flatMap((c) => c.services.slice(0, 3)).map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}#faq`}
                  className="rounded-full border px-3 py-1 text-sm text-muted hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>More answers about Deva Safety Nets in Kerala</h2>
          <p>
            This FAQ centre covers invisible grills, balcony and child safety nets, pet protection,
            pigeon and bird control, bird spikes, sports nets, cloth hangers, installation,
            maintenance, materials, service areas, booking and safety standards. Each answer is
            written for Kerala homeowners, apartment residents, facility managers and commercial
            clients — practical guidance you can use before booking a survey.
          </p>
          <h3>Service-specific questions</h3>
          <p>
            Every core service page includes additional FAQs about pricing factors, installation
            timelines and safety specifications for that product. Use the links below to jump
            directly to detailed service FAQs, or explore our{" "}
            <Link href="/blog" className="text-[var(--primary)]">
              blog
            </Link>{" "}
            for long-form buying and maintenance guides.
          </p>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
