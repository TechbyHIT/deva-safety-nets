import { GALLERY_IMAGES, PAGE_IMAGES, buildAltText, getBestFolderImage, type SiteImageMeta } from "@/lib/images";
import { site } from "@/lib/site";

export const HERO_SLIDES: {
  title: string;
  subtitle: string;
  tag: string;
  serviceSlug?: string;
  imageKey?: string;
}[] = [
  {
    title: "Premium Invisible Grills in Kerala",
    subtitle:
      "Near-invisible SS304 & SS316 cable systems for balconies and windows in Kochi, Ernakulam and across Kerala — free site inspection included.",
    tag: "Invisible Grills Kerala",
    serviceSlug: "invisible-grills",
  },
  {
    title: "Trusted Safety Nets for Children, Pets & Birds",
    subtitle:
      "Professional balcony safety net installation in Kochi and Ernakulam — child-safe, bird-proof and installed within days.",
    tag: "Safety Nets Kochi",
    serviceSlug: "balcony-safety-nets",
  },
  {
    title: "Sports Nets, Cloth Hangers & Bird Control",
    subtitle:
      `${site.name} delivers cricket nets, cloth hangers and bird spikes with certified materials and up to 10-year warranty.`,
    tag: "Deva Safety Nets Kerala",
    serviceSlug: "cricket-nets",
  },
  {
    title: "Free Site Inspection · Own Installation Teams",
    subtitle:
      "No subcontractors. Transparent quotes within 24 hours. Serving 160+ Kerala localities with premium finishes society committees approve.",
    tag: "Invisible Grills Near Me",
    imageKey: "home",
  },
];

const HERO_SLIDE_SRC: Record<string, string> = {
  "invisible-grills": getBestFolderImage("invisible-grill-balcony"),
  "balcony-safety-nets": getBestFolderImage("safety-nets-balcony"),
  "cricket-nets": getBestFolderImage("cricket-nets"),
  home: PAGE_IMAGES.hero,
};

export function heroSlideImage(slide: (typeof HERO_SLIDES)[0]): SiteImageMeta {
  if (slide.serviceSlug) {
    const src = HERO_SLIDE_SRC[slide.serviceSlug] ?? PAGE_IMAGES.hero;
    const name = slide.serviceSlug.replace(/-/g, " ");
    return {
      src,
      alt: buildAltText(name, src),
      title: `${name} | ${site.name}`,
    };
  }
  const key = slide.imageKey ?? "home";
  const src = HERO_SLIDE_SRC[key] ?? PAGE_IMAGES.hero;
  const context = `${site.name} hero`;
  return { src, alt: buildAltText(context, src), title: `${context} | ${site.name}` };
}

/** Thumbnails for the auto-scrolling hero strip — kept small for fast paint. */
export const HERO_SCROLL_STRIP = GALLERY_IMAGES.slice(0, 12);
