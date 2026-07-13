import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuoteForm } from "@/components/QuoteForm";
import { TrustBadges } from "@/components/TrustBadges";
import { PageHero, Section, InlineCTA } from "@/components/ui";
import { getHeroImage, PAGE_IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site, telHref, whatsappHref } from "@/lib/site";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "Contact Us — Free Site Inspection in Kerala",
  description:
    "Contact Deva Safety Nets for a free site inspection and transparent quote on invisible grills and safety nets in Kochi, Ernakulam and across Kerala. Call, WhatsApp or submit the form.",
  path: "/contact",
});

export default function ContactPage() {
  const hero = getHeroImage("contact", `${site.name} contact`);
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <PageHero
        eyebrow="Contact · Kerala"
        title="Book your free site inspection today"
        description="Reach out to Deva Safety Nets for a no-obligation quote on invisible grills, safety nets, bird control, sports nets or cloth hangers in Kochi, Ernakulam or your Kerala locality. Call, WhatsApp or submit the form — our team responds within 24 hours with clear next steps for your free site inspection. We serve apartments, villas, commercial buildings and industrial sites across 160+ localities with transparent itemised pricing and warranty-backed installation."
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <a
              href={telHref()}
              className="card-hover flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                <Phone className="text-[var(--primary)]" size={22} />
              </span>
              <div>
                <p className="font-semibold">Call us — Kerala</p>
                <p className="text-sm text-muted">{site.phone}</p>
              </div>
            </a>
            <a
              href={whatsappHref("Hi, I'd like a free site inspection for invisible grills / safety nets in Kerala.")}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10">
                <MessageCircle className="text-[#25D366]" size={22} />
              </span>
              <div>
                <p className="font-semibold">WhatsApp</p>
                <p className="text-sm text-muted">Instant chat with our Kerala team</p>
              </div>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="card-hover flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                <Mail className="text-[var(--primary)]" size={22} />
              </span>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-muted">{site.email}</p>
              </div>
            </a>
            <div className="card-hover flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                <MapPin className="text-[var(--primary)]" size={22} />
              </span>
              <div>
                <p className="font-semibold">Service area</p>
                <p className="text-sm text-muted">{site.serviceArea}</p>
              </div>
            </div>

            <TrustBadges compact />
          </div>
          <QuoteForm source="contact" />
        </div>
      </Section>

      <Section muted>
        <InlineCTA
          title="Emergency safety concern?"
          subtitle="Call us directly — we prioritise urgent child safety and fall-prevention requests across Kerala."
          label="Call now"
          href={telHref()}
        />
      </Section>
    </>
  );
}
