"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { SiteImageMeta } from "@/lib/images";
import { optimizedImageProps } from "@/lib/optimized-image-props";

type GalleryImage = SiteImageMeta;

function GalleryImg({
  src,
  alt,
  title,
  priority,
  preset,
  className = "",
}: {
  src: string;
  alt: string;
  title?: string;
  priority?: boolean;
  preset?: "gallery" | "lightbox";
  className?: string;
}) {
  return (
    <img
      {...optimizedImageProps({ src, alt, title, priority, preset })}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

export function LightboxGallery({
  images,
  columns = 3,
  className = "",
  variant = "masonry",
}: {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
  variant?: "masonry" | "grid";
}) {
  const [active, setActive] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const close = useCallback(() => {
    setActive(null);
    setZoomed(false);
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (active === null) return;
      setActive((active + dir + images.length) % images.length);
      setZoomed(false);
    },
    [active, images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, go]);

  const colClass =
    variant === "grid"
      ? columns === 4
        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        : columns === 2
          ? "grid grid-cols-1 sm:grid-cols-2"
          : "grid grid-cols-2 md:grid-cols-3"
      : columns === 4
        ? "columns-2 md:columns-3 lg:columns-4"
        : columns === 2
          ? "columns-1 sm:columns-2"
          : "columns-2 md:columns-3";

  return (
    <>
      <div className={`lazy-section ${colClass} gap-4 ${className}`}>
        {images.map((img, i) => (
          <figure
            key={`${img.src}-${i}`}
            className={`card-hover group mb-4 overflow-hidden ${variant === "masonry" ? "break-inside-avoid" : ""}`}
          >
            <button
              type="button"
              className="relative block w-full overflow-hidden bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              style={{ aspectRatio: variant === "masonry" && i % 3 === 0 ? "3/4" : "4/3" }}
              onClick={() => setActive(i)}
              aria-label={`View ${img.alt}`}
            >
              <GalleryImg
                src={img.src}
                alt={img.alt}
                title={img.title}
                preset="gallery"
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn size={16} />
              </span>
            </button>
            {img.caption && (
              <figcaption className="border-t px-3 py-2 text-sm text-muted">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      {active !== null && images[active] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={close}
            aria-label="Close preview"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:left-4"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:right-4"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          <div
            className={`relative max-h-[90vh] w-full max-w-6xl ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
            onTouchStart={(e) => setTouchStart(e.touches[0]?.clientX ?? null)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const end = e.changedTouches[0]?.clientX ?? touchStart;
              const diff = end - touchStart;
              if (Math.abs(diff) > 50) go(diff > 0 ? -1 : 1);
              setTouchStart(null);
            }}
          >
            <div
              className={`relative mx-auto transition-transform duration-300 ${zoomed ? "scale-150" : "scale-100"}`}
              style={{ aspectRatio: "4/3", maxHeight: "90vh" }}
            >
              <GalleryImg
                src={images[active].src}
                alt={images[active].alt}
                title={images[active].title}
                priority
                preset="lightbox"
                className="p-4"
              />
            </div>
            {images[active].caption && (
              <p className="mt-3 text-center text-sm text-white/80">{images[active].caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** @deprecated Use LightboxGallery directly */
export function ImageGallery(props: Parameters<typeof LightboxGallery>[0]) {
  return <LightboxGallery {...props} />;
}
