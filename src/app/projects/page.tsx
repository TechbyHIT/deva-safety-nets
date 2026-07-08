import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteImage } from "@/components/SiteImage";
import { PageHero, Section, CTABand } from "@/components/ui";
import { getProjects } from "@/lib/queries";
import { getHeroImage, getServiceImage, pickImages } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Projects & Case Studies — Deva Safety Nets Kerala",
  description:
    "Explore completed invisible grill and safety net projects by Deva Safety Nets across Kerala — real installations with challenge, solution and outcome.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  const hero = getHeroImage("projects", `${site.name} portfolio`);

  return (
    <>
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }]} />
      <PageHero
        eyebrow={`${site.name} Portfolio`}
        title="Projects & case studies"
        description="Completed invisible grill and safety net projects across Kerala — apartments in Kochi, villas in Ernakulam, commercial bird control and sports net installations. Every case study includes challenge, solution and outcome with warranty-backed workmanship."
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const slug = p.service?.slug ?? "invisible-grills";
            const img = getServiceImage(slug, p.service?.name ?? p.title, p.city?.name);
            const extras = pickImages(`project-${p.id}`, 1);
            const src = i % 3 === 0 && extras[0] ? extras[0].src : img.src;
            return (
              <article key={p.id} className="card-hover overflow-hidden">
                <div className="relative aspect-video w-full bg-[var(--bg-subtle)]">
                  <SiteImage
                    src={src}
                    alt={img.alt}
                    title={img.title}
                    fill
                    preset="galleryWide"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-1 flex flex-wrap gap-2 text-xs text-muted">
                    {p.service && <span className="rounded-full border px-2 py-0.5">{p.service.name}</span>}
                    {p.city && <span className="rounded-full border px-2 py-0.5">{p.city.name}</span>}
                  </div>
                  <h2 className="font-bold">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted">{p.summary}</p>
                  {p.service && (
                    <Link
                      href={`/services/${p.service.slug}`}
                      className="mt-3 inline-block text-sm font-medium text-[var(--primary)]"
                    >
                      View service →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section muted>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>Case studies from real Kerala installations</h2>
          <p>
            Each project below documents a completed Deva Safety Nets installation — the challenge
            the customer faced, the solution we specified and the outcome after handover. Case
            studies span invisible grills on high-rise balconies, pigeon netting in duct shafts,
            child-safe mesh for families, sports enclosures and commercial bird control across Kochi,
            Ernakulam and wider Kerala.
          </p>
          <h3>How we document every project</h3>
          <p>
            We record building type, service category, locality and safety priority so future
            customers in similar situations can see a relevant reference. Every project includes
            warranty-backed workmanship, materials matched to exposure and installation by our own
            trained technicians.
          </p>
          <h3>From single balconies to multi-unit buildings</h3>
          <p>
            Portfolio entries range from one-window invisible grills to society-wide tower
            programmes and warehouse bird exclusion. Scale changes logistics — phased access,
            uniform finishes and committee documentation — but the survey, quote and quality-check
            process stays the same.
          </p>
          <p>
            Start your project with a free inspection. Visit our{" "}
            <Link href="/gallery" className="text-[var(--primary)]">
              gallery
            </Link>{" "}
            for installation photos or browse{" "}
            <Link href="/services" className="text-[var(--primary)]">
              services
            </Link>{" "}
            to find the right solution.
          </p>
        </div>
      </Section>

      <CTABand
        title={`Start your project with ${site.name}`}
        subtitle="Free site inspection across Kochi, Ernakulam and 160+ Kerala localities — transparent quote within 24 hours."
      />
    </>
  );
}
