"use client";

import Image from "next/image";
import { useState } from "react";
import { IMAGE_QUALITY, resolveImagePreset, type ImagePreset } from "@/lib/image-settings";

type SiteImageProps = {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  /** Applies HD quality + responsive sizes in one shot */
  preset?: ImagePreset;
  objectFit?: "cover" | "contain";
};

/** Optimized wrapper for project photos — tuned for fast load and sharp display. */
export function SiteImage({
  src,
  alt,
  title,
  width = 1200,
  height = 900,
  className = "",
  priority,
  fill,
  sizes,
  quality,
  preset,
  objectFit = "cover",
}: SiteImageProps) {
  const [loaded, setLoaded] = useState(priority ?? false);
  const isSvg = src.endsWith(".svg");
  const presetOpts = resolveImagePreset(preset);
  const resolvedQuality = quality ?? presetOpts?.quality ?? IMAGE_QUALITY.gallery;
  const resolvedSizes = sizes ?? presetOpts?.sizes ?? "(max-width: 768px) 100vw, 50vw";
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  const imgClass = [
    fitClass,
    className,
    loaded ? "opacity-100" : "opacity-0",
    "transition-opacity duration-300",
  ]
    .filter(Boolean)
    .join(" ");

  const finishLoad = () => setLoaded(true);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        title={title ?? alt}
        fill
        className={imgClass}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={resolvedSizes}
        quality={resolvedQuality}
        unoptimized={isSvg}
        onLoad={finishLoad}
        onError={finishLoad}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      title={title ?? alt}
      width={width}
      height={height}
      className={imgClass}
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      sizes={resolvedSizes}
      quality={resolvedQuality}
      unoptimized={isSvg}
      onLoad={finishLoad}
      onError={finishLoad}
    />
  );
}
