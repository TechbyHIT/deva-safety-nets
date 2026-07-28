import { resolveImagePreset, type ImagePreset } from "@/lib/image-settings";

export type OptimizedImageOptions = {
  src: string;
  alt: string;
  title?: string;
  priority?: boolean;
  preset?: ImagePreset;
  sizes?: string;
  objectFit?: "cover" | "contain";
};

/** Always serve the original /public file — no srcSet (avoids missing WebP variants in Docker). */
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

  return {
    src,
    alt,
    title: title ?? alt,
    decoding: priority || isHero ? ("sync" as const) : ("async" as const),
    fetchPriority: priority || isHero ? ("high" as const) : ("auto" as const),
    loading: "eager" as const,
    sizes: sizes ?? presetOpts?.sizes,
  };
}
