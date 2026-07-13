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

  return {
    src,
    alt,
    title: title ?? alt,
    decoding: "async" as const,
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
    loading: priority ? ("eager" as const) : ("lazy" as const),
    sizes: sizes ?? presetOpts?.sizes,
  };
}
