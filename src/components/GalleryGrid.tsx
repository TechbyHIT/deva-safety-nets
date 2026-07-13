import { SiteImage } from "@/components/SiteImage";
import type { SiteImageMeta } from "@/lib/images";

/** Server-rendered gallery grid — works without client JS (production-safe fallback). */
export function GalleryGrid({
  images,
  columns = 3,
  className = "",
  variant = "masonry",
}: {
  images: SiteImageMeta[];
  columns?: 2 | 3 | 4;
  className?: string;
  variant?: "masonry" | "grid";
}) {
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
    <div className={`lazy-section ${colClass} gap-4 ${className}`}>
      {images.map((img, i) => (
        <figure
          key={`${img.src}-${i}`}
          className={`card-hover group mb-4 overflow-hidden ${variant === "masonry" ? "break-inside-avoid" : ""}`}
        >
          <div
            className="relative block w-full overflow-hidden bg-[var(--bg-subtle)]"
            style={{ aspectRatio: variant === "masonry" && i % 3 === 0 ? "3/4" : "4/3" }}
          >
            <SiteImage
              src={img.src}
              alt={img.alt}
              title={img.title}
              fill
              preset="gallery"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {img.caption && (
            <figcaption className="border-t px-3 py-2 text-sm text-muted">{img.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
