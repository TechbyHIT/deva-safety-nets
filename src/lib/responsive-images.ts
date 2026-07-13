/** Build-time WebP variants: photo.jpg → photo.w640.webp, photo.w1280.webp */

import { RESPONSIVE_IMAGE_MANIFEST } from "./responsive-image-manifest";

export function responsiveVariantSrc(src: string, width: number) {
  const stem = src.replace(/\.[^.]+$/, "");
  return `${stem}.w${width}.webp`;
}

export function resolveResponsiveImage(src: string) {
  if (!src.startsWith("/images/")) return null;

  const widths = RESPONSIVE_IMAGE_MANIFEST[src];
  if (!widths?.length) return null;

  const srcSet = widths
    .map((w) => `${responsiveVariantSrc(src, w)} ${w}w`)
    .concat(`${src} 1920w`)
    .join(", ");

  return { srcSet };
}
