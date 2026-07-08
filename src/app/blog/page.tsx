import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getBlogPosts } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Blog — Invisible Grills & Safety Nets Guides | Deva Safety Nets Kerala",
  description:
    "Expert guides on invisible grills, balcony safety nets, child and pet safety, pigeon control, materials, installation, maintenance and Kerala-specific buying advice from Deva Safety Nets.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;
  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      <PageHero
        eyebrow="Resource Center"
        title="Safety guides & insights"
        description="Practical, experience-based articles from Deva Safety Nets field teams — invisible grills vs safety nets, SS304 vs SS316 for Kerala, society approval tips, installation timelines and maintenance advice."
      />
      <Section>
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="card mb-8 grid overflow-hidden md:grid-cols-2"
          >
            <div className="card-thumb min-h-48" />
            <div className="p-8">
              <span className="eyebrow mb-2">Featured</span>
              <h2 className="text-2xl font-extrabold">{featured.title}</h2>
              <p className="mt-2 text-muted">{featured.excerpt}</p>
              <p className="mt-4 text-sm text-muted">
                {featured.author} · {featured.readMinutes} min read
              </p>
            </div>
          </Link>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card-hover overflow-hidden">
              <div className="card-thumb-sm aspect-video" />
              <div className="p-5">
                <div className="mb-2 flex flex-wrap gap-1">
                  {p.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.excerpt}</p>
                <p className="mt-3 text-xs text-muted">{p.readMinutes} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>Expert guides for Kerala homeowners and facility managers</h2>
          <p>
            Our blog covers buying guides, installation walkthroughs, maintenance checklists,
            safety tips, material comparisons and society approval advice — all written from
            Deva Safety Nets field experience across Kochi, Ernakulam and Kerala. Articles
            explain real trade-offs: invisible grills versus safety nets, SS304 versus SS316 near
            the coast, pigeon nets versus bird spikes, and how monsoon weather affects anchors and
            tension.
          </p>
          <h3>Topics we publish regularly</h3>
          <p>
            Child and pet balcony safety, apartment RWA requirements, sports net planning, cloth
            hanger selection for humid climates, industrial fall protection and bird exclusion at
            scale. Each article links to relevant services and guides so you can move from research
            to a free site inspection when you are ready.
          </p>
          <p>
            Need personalised advice?{" "}
            <Link href="/contact" className="text-[var(--primary)]">
              Contact us
            </Link>{" "}
            for a free survey or browse our{" "}
            <Link href="/installation-guide/invisible-grills" className="text-[var(--primary)]">
              installation guides
            </Link>
            .
          </p>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
