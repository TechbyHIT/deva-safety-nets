import { resolveImagePreset, type ImagePreset } from "@/lib/image-settings";
import { resolveResponsiveImage } from "@/lib/responsive-images";

export type OptimizedImageOptions = {
  src: string;
  alt: string;
  title?: string;
  priority?: boolean;
  preset?: ImagePreset;
  sizes?: string;
  objectFit?: "cover" | "contain";
};

export function optimizedImageProps({
  src,
  alt,
  title,
  priority,
  preset,
  sizes,
}: OptimizedImageOptions) {
  const presetOpts = resolveImagePreset(preset);
  const responsive = resolveResponsiveImage(src);

  return {
    src,
    srcSet: responsive?.srcSet,
    alt,
    title: title ?? alt,
    decoding: "async" as const,
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
    loading: priority ? ("eager" as const) : ("lazy" as const),
    sizes: sizes ?? presetOpts?.sizes,
  };
}
