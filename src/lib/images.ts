/**

 * Client-safe image catalog for Deva Safety Nets.

 * Production photos live under /public/images (synced from all FINIALIZED PHOTOS folders).

 * Run `npm run images:sync` after adding new photos.

 */



import {

  ALL_IMAGES,

  CLIENT_LOGOS,

  GALLERY_IMAGES,

  IMAGE_FOLDERS,

  PAGE_IMAGES,

  type ImageFolderKey,

} from "./image-manifest";

import { site } from "./site";



export {

  ALL_IMAGES,

  CLIENT_LOGOS,

  GALLERY_IMAGES,

  IMAGE_FOLDERS,

  PAGE_IMAGES,

  type ImageFolderKey,

};



export const BASE = "/images";

export const BRAND = site.name;



export type SiteImageMeta = {

  src: string;

  alt: string;

  title?: string;

  caption?: string;

};



function hash(input: string): number {

  let h = 0x811c9dc5;

  for (let i = 0; i < input.length; i++) {

    h ^= input.charCodeAt(i);

    h = Math.imul(h, 0x01000193);

  }

  return h >>> 0;

}



/** SEO-friendly alt text — uses service/context label only, never raw filenames like n1. */
export function buildAltText(context: string, _src?: string, location?: string): string {
  const place = location ? ` in ${location}, Kerala` : " in Kerala";
  return `${context}${place} by ${BRAND}`;
}

/** Gallery caption — descriptive context only, no filename prefixes. */
export function buildCaption(context: string, _src?: string): string {
  return `${context} · ${BRAND}`;
}

/** UI mockups and template banners — excluded from all page picks. */
const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /academy-sports/i,
  /mockup/i,
  /template/i,
  /glory/i,
  /\bsiri\b/i,
  /banner.?upload/i,
  /home.?hero/i,
  /upload.?area/i,
];

export function isPlaceholderImage(src: string): boolean {
  const file = src.split("/").pop() ?? src;
  const base = file.replace(/\.[^.]+$/, "");
  return PLACEHOLDER_PATTERNS.some((re) => re.test(base) || re.test(file));
}

/** Production photos only — sorted HQ list with mockups removed. */
export function productionImages(folder: ImageFolderKey): readonly string[] {
  const pool = IMAGE_FOLDERS[folder] ?? [];
  const filtered = pool.filter((src) => !isPlaceholderImage(src));
  return filtered.length ? filtered : pool;
}

/** Best real project photo for a category (manifest is sorted highest quality first). */
export function getBestFolderImage(folder: ImageFolderKey, offset = 0): string {
  const pool = productionImages(folder);
  if (!pool.length) return PAGE_IMAGES.hero;
  return pool[offset % pool.length];
}

function pickFromFolder(folder: ImageFolderKey, seed: string): string {
  const pool = productionImages(folder);
  if (!pool.length) return ALL_IMAGES[hash(seed) % ALL_IMAGES.length] ?? PAGE_IMAGES.hero;
  return pool[hash(seed) % pool.length];
}

function folderImages(folder: ImageFolderKey): readonly string[] {
  const pool = productionImages(folder);
  return pool.length ? pool : GALLERY_IMAGES;
}



const SLUG_FOLDER: Record<string, ImageFolderKey> = {

  "invisible-grills": "invisible-grill-balcony",

  "balcony-invisible-grills": "invisible-grill-balcony",

  "window-invisible-grills": "invisible-grill-window",

  "stainless-steel-invisible-grills": "invisible-grill-balcony",

  "ss316-invisible-grills": "invisible-grill-balcony",

  "child-safety-invisible-grills": "invisible-grill-balcony",

  "pet-safety-invisible-grills": "invisible-grill-balcony",

  "balcony-safety-nets": "safety-nets-balcony",

  "pigeon-safety-nets": "safety-nets-balcony",

  "bird-safety-nets": "safety-nets-balcony",

  "anti-bird-nets": "safety-nets-balcony",

  "bird-protection": "bird-spikes",
  "bird-nets": "bird-spikes",
  "pigeon-nets": "bird-spikes",
  "bird-spikes": "bird-spikes",
  "special-safety-solutions": "safety-nets-balcony",
  "service-support": "invisible-grill-balcony",
  "ss-invisible-grills": "invisible-grill-balcony",
  "window-safety-nets": "safety-nets-balcony",
  "children-safety-nets": "child-safety-nets",
  "high-rise-safety-nets": "safety-nets-balcony",
  "home-safety-nets": "safety-nets-balcony",
  "villa-safety-nets": "safety-nets-balcony",
  "flat-safety-nets": "safety-nets-balcony",
  "practice-cricket-nets": "cricket-nets",
  "box-cricket-nets": "cricket-nets",
  "indoor-cricket-nets": "cricket-nets",
  "outdoor-cricket-nets": "cricket-nets",
  "turf-nets": "cricket-nets",
  "ground-nets": "cricket-nets",
  "college-sports-nets": "cricket-nets",
  "sports-net-installation": "cricket-nets",
  "free-site-inspection": "invisible-grill-balcony",
  "net-repair-services": "safety-nets-balcony",
  "net-replacement-services": "safety-nets-balcony",
  "maintenance-services": "invisible-grill-balcony",
  "custom-size-installation": "invisible-grill-balcony",

  "terrace-safety-nets": "safety-nets-balcony",

  "construction-safety-nets": "duct-area-nets",

  "industrial-safety-nets": "duct-area-nets",

  "apartment-safety-nets": "safety-nets-balcony",

  "pet-safety-nets": "pet-safety-nets",

  "sports-nets": "cricket-nets",

  "cricket-nets": "cricket-nets",

  "football-nets": "cricket-nets",

  "badminton-nets": "cricket-nets",

  "cloth-hangers": "cloth-hangers",

  "balcony-cloth-hangers": "cloth-hangers",

  "ceiling-cloth-hangers": "cloth-hangers",

  "foldable-cloth-hangers": "cloth-hangers",

  "mosquito-nets": "mosquito-nets",

  "sliding-mosquito-nets": "mosquito-nets",

  "openable-mosquito-nets": "mosquito-nets",

  "duct-area-safety-nets": "duct-area-nets",

  "monkey-safety-nets": "pet-safety-nets",

};



const KEYWORD_RULES: { test: (slug: string) => boolean; folder: ImageFolderKey }[] = [

  { test: (s) => s.includes("transparent") || s.includes("safety-grill"), folder: "invisible-grill-balcony" },

  { test: (s) => s.includes("spike"), folder: "bird-spikes" },

  { test: (s) => s.includes("cricket") || s.includes("sport"), folder: "cricket-nets" },

  { test: (s) => s.includes("cloth-hanger") || s.includes("cloth-hangers"), folder: "cloth-hangers" },

  { test: (s) => s.includes("mosquito"), folder: "mosquito-nets" },

  { test: (s) => s.includes("duct"), folder: "duct-area-nets" },

  { test: (s) => s.includes("monkey"), folder: "pet-safety-nets" },

  { test: (s) => s.includes("child") && s.includes("net"), folder: "child-safety-nets" },

  { test: (s) => s.includes("pet"), folder: "pet-safety-nets" },

  { test: (s) => s.includes("pigeon") || s.includes("bird"), folder: "safety-nets-balcony" },

  { test: (s) => s.includes("construction") || s.includes("industrial") || s.includes("warehouse"), folder: "duct-area-nets" },

  { test: (s) => s.includes("terrace") || (s.includes("balcony") && s.includes("net")), folder: "safety-nets-balcony" },

  { test: (s) => s.includes("safety-net") || s.includes("safety-nets"), folder: "safety-nets-balcony" },

  { test: (s) => s.includes("window") && s.includes("grill"), folder: "invisible-grill-window" },

  { test: (s) => s.includes("balcony") && s.includes("grill"), folder: "invisible-grill-balcony" },

  { test: (s) => s.includes("child") || s.includes("grill"), folder: "invisible-grill-balcony" },

  { test: (s) => s.includes("invisible-grill"), folder: "invisible-grill-balcony" },

  { test: (s) => s.includes("apartment"), folder: "safety-nets-balcony" },

];



function resolveFolder(slug: string): ImageFolderKey {

  if (SLUG_FOLDER[slug]) return SLUG_FOLDER[slug];

  for (const rule of KEYWORD_RULES) {

    if (rule.test(slug)) return rule.folder;

  }

  return "invisible-grill-balcony";

}



const HERO_POOL = [PAGE_IMAGES.hero, ...GALLERY_IMAGES.slice(0, 12)];



const PAGE_HERO_MAP: Record<string, string> = {

  home: PAGE_IMAGES.hero,

  about: PAGE_IMAGES.about,

  contact: PAGE_IMAGES.contact,

  gallery: PAGE_IMAGES.gallery,

  projects: PAGE_IMAGES.projects,

  reviews: PAGE_IMAGES.testimonials,

  services: IMAGE_FOLDERS["invisible-grill-balcony"]?.[0] ?? PAGE_IMAGES.hero,

  faq: PAGE_IMAGES.why,

  locations: IMAGE_FOLDERS["safety-nets-balcony"]?.[2] ?? PAGE_IMAGES.gallery,

};



export function getHeroImage(pageKey: string, context = "Professional installation"): SiteImageMeta {

  if (PAGE_HERO_MAP[pageKey]) {

    const src = PAGE_HERO_MAP[pageKey];

    return { src, alt: buildAltText(context, src), title: `${context} | ${BRAND}` };

  }

  const src = HERO_POOL[hash(pageKey) % HERO_POOL.length];

  return { src, alt: buildAltText(context, src), title: `${context} | ${BRAND}` };

}



export function getServiceImage(slug: string, serviceName?: string, location?: string): SiteImageMeta {

  const folder = resolveFolder(slug);

  const src = pickFromFolder(folder, slug);

  const name = serviceName ?? slug.replace(/-/g, " ");

  return {

    src,

    alt: buildAltText(name, src, location),

    title: `${name} | ${BRAND}`,

    caption: buildCaption(name, src),

  };

}



function pickFromPool(
  routeKey: string,
  count: number,
  pool: readonly string[],
  exclude: Set<string>,
): SiteImageMeta[] {
  let available = pool.filter((s) => !exclude.has(s));
  if (available.length < count) {
    const extra = GALLERY_IMAGES.filter((s) => !exclude.has(s) && !available.includes(s));
    available = [...available, ...extra];
  }
  if (available.length < count) {
    const extra = ALL_IMAGES.filter((s) => !exclude.has(s) && !available.includes(s));
    available = [...available, ...extra];
  }

  const seed = hash(routeKey);
  const work = [...available];
  const picked: string[] = [];
  for (let i = 0; i < count && work.length > 0; i++) {
    const idx = (seed + i * 7919) % work.length;
    picked.push(work.splice(idx, 1)[0]);
  }

  return picked.map((src, i) => ({
    src,
    alt: buildAltText(`Completed project ${i + 1}`, src),
    title: `Project ${i + 1} | ${BRAND}`,
    caption: buildCaption("Installation project", src),
  }));
}

/** Deterministic rotation — different pages get different existing project photos. */
export function pickImages(routeKey: string, count: number, pool: readonly string[] = GALLERY_IMAGES): SiteImageMeta[] {
  const cleaned = pool.filter((src) => !isPlaceholderImage(src));
  return pickFromPool(routeKey, count, cleaned.length ? cleaned : pool, new Set());
}

/** One pool pick per page — no repeated `src` across slices (homepage bento, strip, gallery, etc.). */
export function pickUniquePageImages(
  routeKey: string,
  count: number,
  pool: readonly string[] = GALLERY_IMAGES,
  context?: string,
): SiteImageMeta[] {
  return pickFromPool(routeKey, count, pool, new Set()).map((img, i) => ({
    ...img,
    alt: buildAltText(context ?? `Installation project ${i + 1}`, img.src),
    caption: buildCaption(context ?? "Project gallery", img.src),
  }));
}



export function getGallerySet(routeKey: string, count = 6, context?: string): SiteImageMeta[] {

  return pickImages(routeKey, count).map((img, i) => ({

    ...img,

    alt: buildAltText(context ?? `Installation project ${i + 1}`, img.src),

    caption: buildCaption(context ?? "Project gallery", img.src),

  }));

}



/** Service page gallery: rotated project photos from the same category (excludes hero). */
export function getServiceGallery(slug: string, routeKey: string, count = 6, location?: string): SiteImageMeta[] {
  return getServicePageImages(slug, routeKey, { galleryCount: count, location }).gallery;
}

export function getBeforeAfterPair(routeKey: string, slug: string, location?: string): { before: SiteImageMeta; after: SiteImageMeta } {
  return getServicePageImages(slug, routeKey, { location }).beforeAfter;
}

/** Hero, gallery, before/after and inline illustration — each uses a unique image on the page. */
export function getServicePageImages(
  slug: string,
  routeKey: string,
  opts?: { galleryCount?: number; serviceName?: string; location?: string },
) {
  const { galleryCount = 6, serviceName, location } = opts ?? {};
  const used = new Set<string>();
  const folder = resolveFolder(slug);
  const pool = folderImages(folder);
  const name = serviceName ?? slug.replace(/-/g, " ");
  const combinedPool = pool.length >= galleryCount + 2 ? pool : [...pool, ...GALLERY_IMAGES];

  const hero = getServiceImage(slug, name, location);
  used.add(hero.src);

  const gallery = pickFromPool(`${routeKey}:gallery`, galleryCount, combinedPool, used).map((img) => ({
    ...img,
    alt: buildAltText(name, img.src, location),
    caption: buildCaption(name, img.src),
  }));
  gallery.forEach((g) => used.add(g.src));

  const baPool = pool.length ? pool : GALLERY_IMAGES;
  const baImgs = pickFromPool(`${routeKey}:ba`, 2, baPool, used);
  baImgs.forEach((b) => used.add(b.src));
  const beforeAfter = {
    before: {
      ...(baImgs[0] ?? { src: GALLERY_IMAGES[0], alt: buildAltText("Before installation", GALLERY_IMAGES[0], location) }),
      alt: buildAltText("Before installation", baImgs[0]?.src ?? GALLERY_IMAGES[0], location),
    },
    after: {
      ...(baImgs[1] ?? hero),
      alt: buildAltText("After installation", baImgs[1]?.src ?? hero.src, location),
    },
  };

  const inlinePick = pickFromPool(`${routeKey}:inline`, 1, GALLERY_IMAGES, used)[0];
  const inline = inlinePick ?? gallery[gallery.length - 1] ?? hero;

  return { hero, gallery, beforeAfter, inline };
}



export function getProcessImages(): { src: string; alt: string; label: string; title: string }[] {

  return [

    { src: PAGE_IMAGES.process, alt: buildAltText("Free site survey", PAGE_IMAGES.process), label: "Site Survey", title: `Site Survey | ${BRAND}` },

    { src: PAGE_IMAGES.safety, alt: buildAltText("Certified materials", PAGE_IMAGES.safety), label: "Materials", title: `Materials | ${BRAND}` },

    { src: IMAGE_FOLDERS["invisible-grill-balcony"]?.[2] ?? PAGE_IMAGES.hero, alt: buildAltText("Expert installation", PAGE_IMAGES.hero), label: "Installation", title: `Installation | ${BRAND}` },

    { src: IMAGE_FOLDERS["invisible-grill-balcony"]?.[6] ?? PAGE_IMAGES.gallery, alt: buildAltText("Quality handover", PAGE_IMAGES.gallery), label: "Handover", title: `Handover | ${BRAND}` },

  ];

}



export function getCategoryImage(categorySlug: string): string {
  const map: Record<string, ImageFolderKey> = {
    "invisible-grills": "invisible-grill-balcony",
    "safety-nets": "safety-nets-balcony",
    "bird-protection": "bird-spikes",
    "cloth-hangers": "cloth-hangers",
    "sports-nets": "cricket-nets",
    "special-safety-solutions": "safety-nets-balcony",
    "service-support": "invisible-grill-balcony",
  };
  const folder = map[categorySlug] ?? "invisible-grill-balcony";
  return getBestFolderImage(folder);
}



export function getAllGalleryImages(): SiteImageMeta[] {

  return GALLERY_IMAGES.map((src, i) => ({

    src,

    alt: buildAltText(`Project photo ${i + 1}`, src),

    title: `Gallery ${i + 1} | ${BRAND}`,

    caption: buildCaption("Completed installation", src),

  }));

}



export const SERVICE_IMAGES = ALL_IMAGES;


