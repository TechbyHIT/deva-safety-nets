import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms and conditions governing the use of our website and services.",
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Terms", path: "/terms" }]} />
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <p>
            By using this website you agree to these terms. All content is provided for information
            purposes; specifications and pricing are indicative and confirmed at the time of quotation.
          </p>
          <h2>Services & warranty</h2>
          <p>
            Warranties apply as stated in your individual service agreement. Workmanship and material
            warranties vary by product grade selected.
          </p>
          <h2>Quotes & pricing</h2>
          <p>
            Prices shown are indicative ranges. Final pricing is confirmed after a free on-site survey
            and depends on measured area, material grade and site conditions.
          </p>
        </div>
      </Section>
    </>
  );
}
