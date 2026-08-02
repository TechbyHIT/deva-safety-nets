import { resolveImagePreset, type ImagePreset } from "@/lib/image-settings";
import { RESPONSIVE_IMAGE_MANIFEST } from "@/lib/responsive-image-manifest";

export type OptimizedImageOptions = {
  src: string;
  alt: string;
  title?: string;
  priority?: boolean;
  preset?: ImagePreset;
  sizes?: string;
  objectFit?: "cover" | "contain";
};

function variantPath(src: string, width: number): string {
  return src.replace(/\.[^.]+$/i, `.w${width}.webp`);
}

/**
 * Prefer build-time WebP variants (srcSet). Fall back to the original /public file
 * when variants are missing so images never break.
 */
export function optimizedImageProps({
  src,
  alt,
  title,
  priority,
  preset,
  sizes,
}: OptimizedImageOptions) {
  const presetOpts = resolveImagePreset(preset);
  const isHero = preset === "hero" || preset === "heroSide";
  const widths = RESPONSIVE_IMAGE_MANIFEST[src];

  const base = {
    alt,
    title: title ?? alt,
    decoding: priority || isHero ? ("sync" as const) : ("async" as const),
    fetchPriority: priority || isHero ? ("high" as const) : ("auto" as const),
    loading: "eager" as const,
    sizes: sizes ?? presetOpts?.sizes ?? "100vw",
  };

  if (widths && widths.length > 0) {
    const sorted = [...widths].sort((a, b) => a - b);
    const srcSet = sorted.map((w) => `${variantPath(src, w)} ${w}w`).join(", ");
    // Default to mid size so mobile/desktop don't pull multi‑MB originals
    const defaultWidth = sorted.includes(1280) ? 1280 : sorted[sorted.length - 1]!;
    return {
      ...base,
      src: variantPath(src, defaultWidth),
      srcSet,
    };
  }

  return { ...base, src };
}
