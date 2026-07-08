import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrustBadges } from "@/components/TrustBadges";
import { SiteImage } from "@/components/SiteImage";
import {
  PageHero,
  Section,
  SectionHeading,
  CheckList,
  CTABand,
  StatBand,
  ProcessTimeline,
  InlineCTA,
} from "@/components/ui";
import { CLIENT_LOGOS, getHeroImage, getProcessImages } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "About Us — Kerala's Trusted Invisible Grills & Safety Nets Experts",
  description:
    "Deva Safety Nets is Kerala's premium invisible grills and safety net specialist — certified materials, local expert teams in Kochi and Ernakulam, and warranty-backed installations.",
  path: "/about",
});

export default function AboutPage() {
  const hero = getHeroImage("about", `${site.name} about us`);
  const processSteps = getProcessImages().map((p) => ({
    title: p.label,
    detail:
      p.label === "Site Survey"
        ? "Free inspection anywhere in Kerala"
        : p.label === "Materials"
          ? "SS304, SS316 & HDPE for Kerala conditions"
          : p.label === "Installation"
            ? "Own trained teams — never subcontracted"
            : "Quality check and written warranty",
    imageSrc: p.src,
    imageAlt: p.alt,
  }));

  return (
    <>
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <PageHero
        eyebrow="About Deva Safety Nets"
        title="Kerala's safety specialists — premium protection, local care"
        description="Deva Safety Nets combines enterprise-grade invisible grills and safety nets with deep local expertise across Kochi, Ernakulam and every major Kerala locality. Free site inspections, certified materials, own installation teams and warranty-backed workmanship on every project."
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="prose-content">
            <h2>Our mission in Kerala</h2>
            <p>
              Every year, preventable falls injure children, pets and workers across Kerala's
              high-rise apartments and villas. Our mission is to make premium, near-invisible safety
              accessible to every home — engineered correctly, installed professionally and backed
              for the long term in Kerala's humidity and monsoon conditions.
            </p>
            <h2>How we work</h2>
            <p>
              From the free site inspection in your Kochi or Ernakulam locality to the final quality
              check, every installation is handled by our own trained technicians using IS-compliant
              materials. We stand behind our work with warranties of up to 10 years and responsive
              maintenance support across Kerala.
            </p>
            <h2>Our vision</h2>
            <p>
              We envision a Kerala where every balcony, window and open edge is safely protected
              without sacrificing the views and ventilation that make coastal living enjoyable. Deva
              Safety Nets exists to make that standard accessible — with professional installation,
              honest pricing and long-term support.
            </p>
            <h2>Our values</h2>
            <p>
              Safety first, always — we never recommend a product that is wrong for your situation
              just to close a sale. Transparency in every quote, accountability through our own
              installation teams, and respect for your home, time and society guidelines guide every
              project we take on.
            </p>
            <h2>Quality and safety commitment</h2>
            <p>
              Every installation is measured on site, specified with the correct material grade for
              your exposure, tension-tested before handover and covered by written warranty terms.
              We use IS-compliant SS304, SS316, nylon and HDPE — not unbranded wire or thin mesh that
              fails within seasons.
            </p>
            <h2>Company overview</h2>
            <p>
              Deva Safety Nets is a Kerala-focused specialist in invisible grills, safety nets, bird
              control, sports nets and cloth hangers. Since our founding, we have completed thousands
              of installations across Kochi, Ernakulam and the wider state — from single-balcony
              apartment jobs to full-tower society projects and commercial bird-proofing contracts.
            </p>
            <h2>Our history in Kerala</h2>
            <p>
              Deva Safety Nets grew from a simple observation: Kerala families were installing
              safety solutions that looked industrial, blocked views or failed within seasons because
              materials were wrong for coastal humidity. We built a local team focused on certified
              SS304 and SS316 cable systems, UV-treated nets and installation standards that pass
              society approval — not lowest-bid shortcuts. Today we serve 160+ localities with the
              same survey-first, warranty-backed approach that defined our earliest Kochi projects.
            </p>
            <h2>Service commitment</h2>
            <p>
              We commit to free site inspections, honest recommendations, transparent itemised
              quotes and installation by our own trained teams — never outsourced crews. Every
              project includes quality verification, written warranty terms and responsive
              after-sales support for repair, re-tensioning and annual maintenance.
            </p>
            <h2>Customer satisfaction approach</h2>
            <p>
              We listen first: your building type, society guidelines, budget and how you use the
              space. That shapes whether we recommend invisible grills, safety nets or a
              combination. We explain trade-offs clearly, arrive on schedule, protect your home during
              work and leave every site clean. That approach has earned us a 4.9-star rating from
              Kerala homeowners and businesses.
            </p>
            <h2>Installation standards</h2>
            <p>
              Our technicians follow documented installation standards for anchor selection, cable
              tension, mesh sizing and perimeter fixing. We measure on site — never guess from
              photos alone — and test every installation before handover. Societies and commercial
              clients receive documentation on materials and compliance on request.
            </p>
            <h2>Quality process</h2>
            <p>
              Material grade is matched to exposure: SS304 for most inland homes, SS316 for coastal
              zones, appropriate mesh size for child, pet or bird control. Post-monsoon inspections
              and AMC plans help your installation stay safe for years. If something loosens or
              corrodes, our repair team responds across Kerala.
            </p>
            <h2>Future goals</h2>
            <p>
              We are expanding documentation, maintenance programs and society partnership models so
              every Kerala building can adopt safety standards as routine as fire exits — without
              sacrificing the open, light-filled living that makes this coast attractive.
            </p>
            <h2>Professional expertise you can verify</h2>
            <p>
              Our technicians are trained in tensioning, anchor selection and fall-prevention
              standards — not general labourers assigned to safety work. Supervisors review every
              handover. Materials arrive with traceable grades. That discipline is why societies,
              facility managers and repeat residential customers across Kochi and Ernakulam choose
              Deva Safety Nets for invisible grills, safety nets and bird control.
            </p>
            <h2>Customer-first approach in practice</h2>
            <p>
              Customer-first means recommending safety nets when they suit your balcony better than
              grills, explaining when SS316 is worth the upgrade, and arriving on time with
              protected floors and clean sites. It means written quotes, written warranties and a
              phone number that reaches a team who knows your project — not a generic helpline.
            </p>
          </div>
          <div>
            <SectionHeading center={false} title="What sets us apart in Kerala" />
            <CheckList
              items={[
                "Certified SS304, SS316 and HDPE materials for Kerala's coastal humidity",
                "Own trained installation teams in Kochi, Ernakulam and 160+ localities",
                "Transparent, itemised pricing with no hidden costs",
                "Up to 10-year written warranty and annual maintenance contracts",
                "Free site inspection and 24-hour quote turnaround",
                "Solutions for apartments, villas, commercial and industrial spaces",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="Our process"
          title="Four steps to a safer Kerala home"
        />
        <ProcessTimeline steps={processSteps} />
      </Section>

      <Section>
        <TrustBadges />
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Trusted by" title="Homes & businesses across Kerala" />
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
          {CLIENT_LOGOS.map((src, i) => (
            <div key={src} className="relative h-14 w-28">
              <SiteImage src={src} alt={`Trusted Kerala client ${i + 1}`} fill className="object-contain" />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <StatBand
          stats={[
            { value: "10,000+", label: "Kerala installations" },
            { value: "160+", label: "Localities served" },
            { value: "4.9★", label: "Google rating" },
            { value: "10-Yr", label: "Max warranty" },
          ]}
        />
        <div className="mt-10">
          <InlineCTA
            title="Ready to work with Kerala's safety experts?"
            subtitle={`Free site inspection across ${site.primaryCities.slice(0, 3).join(", ")} and beyond.`}
          />
        </div>
      </Section>

      <CTABand
        title={`Book your free Kerala site inspection with ${site.name}`}
      />
    </>
  );
}
