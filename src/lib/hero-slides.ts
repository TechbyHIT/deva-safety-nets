import { PAGE_IMAGES, buildAltText, getBestFolderImage, type SiteImageMeta } from "@/lib/images";
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
    title: "Sports Nets & Bird Control",
    subtitle:
      `${site.name} delivers cricket nets and bird spikes with certified materials and up to 10-year warranty.`,
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

/** Unique HD photo for each slide's full-bleed background. */
const HERO_SLIDE_SRC: Record<string, string> = {
  "invisible-grills": getBestFolderImage("invisible-grill-balcony", 0),
  "balcony-safety-nets": getBestFolderImage("safety-nets-balcony", 0),
  "cricket-nets": getBestFolderImage("cricket-nets", 0),
  home: getBestFolderImage("invisible-grill-window", 0),
};

/** A different unique HD photo for each slide's side card (never the same as the background). */
const HERO_SLIDE_SIDE_SRC: Record<string, string> = {
  "invisible-grills": getBestFolderImage("invisible-grill-balcony", 3),
  "balcony-safety-nets": getBestFolderImage("child-safety-nets", 0),
  "cricket-nets": getBestFolderImage("bird-spikes", 0),
  home: getBestFolderImage("invisible-grill-window", 2),
};

function slideKey(slide: (typeof HERO_SLIDES)[0]): string {
  return slide.serviceSlug ?? slide.imageKey ?? "home";
}

export function heroSlideImage(slide: (typeof HERO_SLIDES)[0]): SiteImageMeta {
  const key = slideKey(slide);
  const src = HERO_SLIDE_SRC[key] ?? PAGE_IMAGES.hero;
  const name = slide.serviceSlug ? slide.serviceSlug.replace(/-/g, " ") : `${site.name} hero`;
  return { src, alt: buildAltText(name, src), title: `${name} | ${site.name}` };
}

export function heroSlideSideImage(slide: (typeof HERO_SLIDES)[0]): SiteImageMeta {
  const key = slideKey(slide);
  const src = HERO_SLIDE_SIDE_SRC[key] ?? getBestFolderImage("invisible-grill-balcony", 1);
  const name = slide.serviceSlug ? slide.serviceSlug.replace(/-/g, " ") : `${site.name} installation`;
  return { src, alt: buildAltText(name, src), title: `${name} | ${site.name}` };
}

/** Thumbnails for the auto-scrolling hero strip — HD invisible-grill photos. */
const HERO_STRIP_SOURCES = [
  ...Array.from({ length: 5 }, (_, i) => getBestFolderImage("invisible-grill-balcony", i)),
  ...Array.from({ length: 4 }, (_, i) => getBestFolderImage("invisible-grill-window", i)),
];
export const HERO_SCROLL_STRIP = Array.from(new Set(HERO_STRIP_SOURCES));
