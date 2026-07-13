import {
  ALL_IMAGES,
  GALLERY_IMAGES,
  buildAltText,
  buildCaption,
  getAllGalleryImages,
  getServiceImage,
  type SiteImageMeta,
} from "@/lib/images";
import { site } from "@/lib/site";

type GalleryProject = {
  service?: { slug?: string; name?: string } | null;
  title: string;
  city?: { name?: string } | null;
};

const GALLERY_LIMIT = 60;

/** Build gallery images from static manifest only — no runtime filesystem scan. */
export function buildGalleryPageImages(projects: GalleryProject[]): SiteImageMeta[] {
  const projectImages = projects.map((p, i) => {
    const slug = p.service?.slug ?? "invisible-grills";
    const meta = getServiceImage(slug, p.service?.name ?? p.title, p.city?.name);
    const altSrc = GALLERY_IMAGES[i % GALLERY_IMAGES.length] ?? meta.src;
    return {
      src: i % 2 === 0 ? meta.src : altSrc,
      alt: meta.alt,
      title: meta.title,
      caption: `${p.service?.name ?? p.title}${p.city ? ` · ${p.city.name}` : ""} · ${site.name}`,
    };
  });

  const seen = new Set(projectImages.map((p) => p.src));
  const extraFromCatalog = ALL_IMAGES.filter((src) => !seen.has(src)).map((src) => ({
    src,
    alt: buildAltText("Installation project", src),
    title: `Gallery | ${site.name}`,
    caption: buildCaption("Project gallery", src),
  }));

  const merged = [...projectImages, ...getAllGalleryImages(), ...extraFromCatalog];
  const unique: SiteImageMeta[] = [];
  const used = new Set<string>();

  for (const img of merged) {
    if (!img.src || used.has(img.src)) continue;
    used.add(img.src);
    unique.push(img);
    if (unique.length >= GALLERY_LIMIT) break;
  }

  return unique;
}
