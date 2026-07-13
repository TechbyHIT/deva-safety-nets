/** Shared image quality and responsive `sizes` presets — tuned for fast load + sharp display. */
export const IMAGE_QUALITY = {
  /** Hero backgrounds and full-bleed sections */
  hero: 85,
  /** Gallery, bento grids, service cards */
  gallery: 80,
  /** Lightbox / zoom view */
  full: 90,
  /** Small thumbnails in strips */
  thumb: 75,
  /** Header/footer brand mark */
  logo: 90,
} as const;

export const IMAGE_SIZES = {
  hero: "100vw",
  heroSide: "(max-width: 1024px) 100vw, 50vw",
  gallery: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 960px",
  galleryWide: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 840px",
  card: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 480px",
  bento: "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 560px",
  strip: "320px",
  stripSm: "240px",
  logo: "(max-width: 640px) 280px, (max-width: 1024px) 360px, 512px",
  lightbox: "100vw",
} as const;

export type ImagePreset = "hero" | "heroSide" | "gallery" | "galleryWide" | "card" | "bento" | "strip" | "stripSm" | "logo" | "lightbox" | "full";

const PRESET_QUALITY: Record<ImagePreset, number> = {
  hero: IMAGE_QUALITY.hero,
  heroSide: IMAGE_QUALITY.hero,
  gallery: IMAGE_QUALITY.gallery,
  galleryWide: IMAGE_QUALITY.gallery,
  card: IMAGE_QUALITY.full,
  bento: IMAGE_QUALITY.gallery,
  strip: IMAGE_QUALITY.thumb,
  stripSm: IMAGE_QUALITY.gallery,
  logo: IMAGE_QUALITY.logo,
  lightbox: IMAGE_QUALITY.full,
  full: IMAGE_QUALITY.full,
};

const PRESET_SIZES: Record<ImagePreset, string> = {
  hero: IMAGE_SIZES.hero,
  heroSide: IMAGE_SIZES.heroSide,
  gallery: IMAGE_SIZES.gallery,
  galleryWide: IMAGE_SIZES.galleryWide,
  card: IMAGE_SIZES.card,
  bento: IMAGE_SIZES.bento,
  strip: IMAGE_SIZES.strip,
  stripSm: IMAGE_SIZES.stripSm,
  logo: IMAGE_SIZES.logo,
  lightbox: IMAGE_SIZES.lightbox,
  full: IMAGE_SIZES.lightbox,
};

export function resolveImagePreset(preset?: ImagePreset) {
  if (!preset) return null;
  return {
    quality: PRESET_QUALITY[preset],
    sizes: PRESET_SIZES[preset],
  };
}
