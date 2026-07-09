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
  const [loaded, setLoaded] = useState(false);
  const isSvg = src.endsWith(".svg");
  const presetOpts = resolveImagePreset(preset);
  const resolvedQuality = quality ?? presetOpts?.quality ?? IMAGE_QUALITY.gallery;
  const resolvedSizes = sizes ?? presetOpts?.sizes ?? "(max-width: 768px) 100vw, 50vw";
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  const imgClass = [
    fitClass,
    className,
    "transition-opacity duration-300",
    loaded ? "opacity-100" : "opacity-0",
  ]
    .filter(Boolean)
    .join(" ");

  const shared = {
    src,
    alt,
    title: title ?? alt,
    className: imgClass,
    priority,
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
    loading: priority ? ("eager" as const) : ("lazy" as const),
    decoding: "async" as const,
    sizes: resolvedSizes,
    quality: resolvedQuality,
    unoptimized: isSvg,
    onLoad: () => setLoaded(true),
  };

  if (fill) {
    return (
      <span className="site-image site-image--fill relative block size-full bg-[var(--bg-subtle)]">
        <Image {...shared} fill />
      </span>
    );
  }

  return (
    <span className="site-image relative inline-block max-w-full bg-[var(--bg-subtle)]">
      <Image {...shared} width={width} height={height} />
    </span>
  );
}
