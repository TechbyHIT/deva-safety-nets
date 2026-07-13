import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { TrustBadges } from "@/components/TrustBadges";
import { PageHero, Section, Stars, CTABand, InlineCTA } from "@/components/ui";
import { getReviews } from "@/lib/queries";
import { getHeroImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { reviewAggregateSchema } from "@/lib/schema";

export const dynamic = "force-static";
export const metadata: Metadata = buildMetadata({
  title: "Customer Reviews — Invisible Grills & Safety Nets Kerala",
  description:
    "Read verified customer reviews for invisible grills and safety nets in Kerala. Rated 4.9/5 by homeowners and businesses in Kochi, Ernakulam and across the state.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const hero = getHeroImage("reviews", `${site.name} customer reviews`);
  return (
    <>
      <JsonLd
        data={reviewAggregateSchema({
          itemName: "Invisible Grills & Safety Nets Kerala",
          path: "/reviews",
          reviews: reviews.map((r) => ({ author: r.author, rating: r.rating, body: r.body })),
        })}
      />
      <Breadcrumbs items={[{ name: "Reviews", path: "/reviews" }]} />
      <PageHero
        eyebrow="Kerala Testimonials"
        title="What Kerala families say about us"
        description="Verified reviews from homeowners and businesses across Kochi, Ernakulam and Kerala who trust Deva Safety Nets for invisible grills, balcony safety nets, bird control and professional installation with warranty support."
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="card-hover p-6">
              <Stars rating={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-muted">"{r.body}"</p>
              <p className="mt-4 text-sm font-semibold">
                {r.author}
                {r.city && <span className="font-normal text-muted"> · {r.city.name}</span>}
                {r.verified && <span className="ml-2 text-xs" style={{ color: "var(--success)" }}>✓ Verified</span>}
              </p>
              {r.service && <p className="text-xs text-muted">{r.service.name}</p>}
            </div>
          ))}
        </div>
        <div className="mt-10">
          <TrustBadges compact />
        </div>
        <div className="mt-8">
          <InlineCTA
            title="Join thousands of satisfied Kerala customers"
            subtitle="Book your free site inspection today."
          />
        </div>
      </Section>

      <Section muted>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>Verified reviews from Kerala customers</h2>
          <p>
            Deva Safety Nets maintains a 4.9-star rating from homeowners and businesses across Kochi,
            Ernakulam and Kerala. Reviews below reflect real experiences with invisible grills,
            balcony safety nets, bird control, sports nets and after-sales support — including
            survey punctuality, installation cleanliness, material quality and warranty response.
          </p>
          <h3>What customers mention most often</h3>
          <p>
            Families praise honest recommendations when safety nets suit a balcony better than grills,
            and society-friendly finishes that pass RWA approval the first time. Commercial clients
            note phased installation that minimises disruption. Many reviews highlight our own
            installation teams — not unknown subcontractors — and quick re-tensioning when monsoon
            weather affects cables.
          </p>
          <h3>Service areas represented</h3>
          <p>
            Testimonials come from Edapally, Kakkanad, Aluva, Tripunithura, Fort Kochi and other
            localities we serve daily. Location tags on each review show the geographic spread of
            our Kerala operations and the building types we handle — apartments, villas and
            commercial sites.
          </p>
          <p>
            Join thousands of satisfied customers. Book your free site inspection through our{" "}
            <Link href="/contact" className="text-[var(--primary)]">
              contact page
            </Link>{" "}
            or read detailed answers on our{" "}
            <Link href="/faq" className="text-[var(--primary)]">
              FAQ
            </Link>
            .
          </p>
        </div>
      </Section>

      <CTABand title={`Book a free inspection with ${site.name}`} />
    </>
  );
}
