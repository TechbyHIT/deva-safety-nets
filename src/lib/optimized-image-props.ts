import fs from "node:fs";
import path from "node:path";
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

/** Resolve a /public URL to a file on disk (dev + PM2 standalone). */
function publicFileExists(publicUrl: string): boolean {
  const rel = publicUrl.replace(/^\//, "").replace(/\//g, path.sep);
  const candidates = [
    path.join(process.cwd(), "public", rel),
    path.join(process.cwd(), rel),
    // next build sometimes resolves from project root while cwd is standalone
    path.join(process.cwd(), "..", "..", "public", rel),
  ];
  return candidates.some((p) => fs.existsSync(p));
}

/**
 * Always keep the original file as `src` (never broken).
 * Add WebP srcSet only when those variant files exist on disk.
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
    src,
    alt,
    title: title ?? alt,
    decoding: priority || isHero ? ("sync" as const) : ("async" as const),
    fetchPriority: priority || isHero ? ("high" as const) : ("auto" as const),
    loading: "eager" as const,
    sizes: sizes ?? presetOpts?.sizes ?? "100vw",
  };

  if (!widths?.length) return base;

  const available = [...widths]
    .sort((a, b) => a - b)
    .filter((w) => publicFileExists(variantPath(src, w)));

  if (available.length === 0) return base;

  return {
    ...base,
    srcSet: available.map((w) => `${variantPath(src, w)} ${w}w`).join(", "),
  };
}
