import { SiteImage } from "./SiteImage";
import type { SiteImageMeta } from "@/lib/images";

function BentoCell({
  img,
  className = "",
  priority,
}: {
  img: SiteImageMeta;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`photo-bento-item group relative w-full overflow-hidden rounded-2xl ${className}`}
    >
      <SiteImage
        src={img.src}
        alt={img.alt}
        title={img.title}
        fill
        preset="bento"
        priority={priority}
        className="transition-transform duration-700 group-hover:scale-110"
      />
      <div className="photo-bento-shine pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}

/** Bento-style photo grid for the homepage showcase. */
export function HomePhotoBento({ images }: { images: SiteImageMeta[] }) {
  const items = images.slice(0, 10);
  const [featured, ...grid] = items;

  if (!featured) return null;

  return (
    <div className="photo-bento-grid lazy-section flex flex-col gap-3 md:gap-4">
      <BentoCell img={featured} className="aspect-[16/10] md:aspect-[21/9]" />

      {grid.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {grid.map((img, i) => (
            <BentoCell key={`${img.src}-${i}`} img={img} className="aspect-[4/3]" />
          ))}
        </div>
      )}
    </div>
  );
}

/** Horizontal scrolling photo strip. */
export function HomePhotoStrip({ images }: { images: SiteImageMeta[] }) {
  const strip = [...images, ...images];
  return (
    <div className="photo-strip lazy-section overflow-hidden rounded-2xl border">
      <div className="animate-hero-scroll flex w-max gap-3 p-3">
        {strip.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            className="relative h-40 w-56 shrink-0 overflow-hidden rounded-xl md:h-48 md:w-72"
          >
            <SiteImage src={img.src} alt={img.alt} fill preset="strip" />
          </div>
        ))}
      </div>
    </div>
  );
}
