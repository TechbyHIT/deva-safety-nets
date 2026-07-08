import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LightboxGallery } from "@/components/ImageGallery";
import { PageHero, Section, CTABand, SectionHeading } from "@/components/ui";
import { getProjects, getCategoriesWithServices } from "@/lib/queries";
import { getAllGalleryImages, getHeroImage, getServiceImage, buildAltText, buildCaption } from "@/lib/images";
import { getServerImageCatalog } from "@/lib/image-catalog.server";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Gallery — Deva Safety Nets Installation Photos Kerala",
  description:
    "Browse completed invisible grill and safety net installations by Deva Safety Nets across Kerala — balconies, windows, terraces and commercial projects in Kochi and Ernakulam.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [projects, categories, catalog] = await Promise.all([
    getProjects(),
    getCategoriesWithServices(),
    Promise.resolve(getServerImageCatalog()),
  ]);

  const projectImages = projects.map((p, i) => {
    const slug = p.service?.slug ?? "invisible-grills";
    const meta = getServiceImage(slug, p.service?.name ?? p.title, p.city?.name);
    const altSrc = catalog.gallery[i % Math.max(catalog.gallery.length, 1)] ?? meta.src;
    return {
      src: i % 2 === 0 ? meta.src : altSrc,
      alt: meta.alt,
      title: meta.title,
      caption: `${p.service?.name ?? p.title}${p.city ? ` · ${p.city.name}` : ""} · ${site.name}`,
    };
  });

  const seen = new Set(projectImages.map((p) => p.src));
  const extraFromCatalog = catalog.all
    .filter((src) => !seen.has(src))
    .map((src) => ({
      src,
      alt: buildAltText("Installation project", src),
      title: `Gallery | ${site.name}`,
      caption: buildCaption("Project gallery", src),
    }));

  const allGallery = [...projectImages, ...getAllGalleryImages(), ...extraFromCatalog];

  const hero = getHeroImage("gallery", `${site.name} installation gallery`);

  return (
    <>
      <Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} />
      <PageHero
        eyebrow={`${site.name} · Project Gallery`}
        title="Our work across Kerala"
        description="Every image is from a real Deva Safety Nets installation across Kerala — invisible grills on balconies and windows, safety nets for child and bird protection, sports enclosures and commercial projects in Kochi and Ernakulam."
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />

      <Section>
        <SectionHeading
          eyebrow="Installations"
          title="Balconies, windows, terraces & commercial projects"
          subtitle={`${allGallery.length} real installation photos from Deva Safety Nets projects across Kerala — invisible grills, safety nets, sports nets, cloth hangers and bird control.`}
        />
        <LightboxGallery images={allGallery} columns={3} variant="masonry" />

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.flatMap((c) => c.services.slice(0, 2)).map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="rounded-full border px-3 py-1.5 text-sm text-muted transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>What our Kerala installation gallery shows</h2>
          <p>
            Every photo in this gallery documents a completed Deva Safety Nets project — not stock
            images. You will see invisible grills on Kochi and Ernakulam balconies, window cable
            systems that preserve views, child-safe safety nets, pigeon exclusion on ducts and
            terraces, sports net enclosures and commercial bird-control work. Browsing real
            installations helps you judge finish quality, spacing and how discreet protection looks
            from inside a home.
          </p>
          <h3>Invisible grills in apartments and villas</h3>
          <p>
            Apartment towers in Edapally, Kakkanad and Vyttila favour near-invisible SS304 and SS316
            cable layouts that satisfy society committees. Villas across Tripunithura and Aluva often
            combine balcony grills with French-window systems. Our gallery shows how cable spacing,
            frame colour and corner detailing vary by building type while maintaining the same safety
            standard.
          </p>
          <h3>Safety nets for children, pets and birds</h3>
          <p>
            Safety net projects appear throughout the gallery — UV-treated nylon for child and pet
            protection, finer mesh for pigeon control on ducts and parapets. These installs
            typically complete within hours and demonstrate how airflow and daylight remain intact
            while openings are secured.
          </p>
          <h3>Sports nets and cloth hangers</h3>
          <p>
            Backyard cricket cages, terrace practice nets and ceiling cloth hanger systems also
            feature in our portfolio. These solutions share the same survey-first approach: measure
            on site, specify materials for Kerala exposure, install with our own technicians and
            hand over with care instructions.
          </p>
          <p>
            Ready for results like these at your property?{" "}
            <Link href="/contact" className="text-[var(--primary)]">
              Book a free site inspection
            </Link>{" "}
            or explore our{" "}
            <Link href="/services" className="text-[var(--primary)]">
              full service range
            </Link>
            .
          </p>
        </div>
      </Section>

      <CTABand
        title={`Want results like these at your Kerala home?`}
        subtitle={`Book a free site inspection with ${site.name} — transparent quote within 24 hours.`}
      />
    </>
  );
}
