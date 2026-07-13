import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How we collect, use and protect your personal information.",
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy", path: "/privacy" }]} />
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <p>
            We respect your privacy. We collect only the information you provide through our contact
            and quote forms (name, phone, email and your message) to respond to your enquiry.
          </p>
          <h2>How we use your data</h2>
          <p>
            Your details are used solely to contact you about your enquiry, provide quotes and
            arrange services. We do not sell your data to third parties.
          </p>
          <h2>Data security</h2>
          <p>
            We apply industry-standard security measures including encryption in transit, input
            validation and rate limiting to protect your information.
          </p>
          <h2>Contact</h2>
          <p>For any privacy questions, email {site.email}.</p>
        </div>
      </Section>
    </>
  );
}
