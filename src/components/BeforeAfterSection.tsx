import { SiteImage } from "./SiteImage";
import type { SiteImageMeta } from "@/lib/images";

export function BeforeAfterSection({
  before,
  after,
  title = "Before & After",
}: {
  before: SiteImageMeta;
  after: SiteImageMeta;
  title?: string;
}) {
  return (
    <div className="lazy-section">
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { ...before, label: "Before" },
          { ...after, label: "After" },
        ].map((item) => (
          <figure key={item.label} className="card-hover overflow-hidden">
            <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
              <SiteImage src={item.src} alt={item.alt} title={item.title} fill preset="gallery" />
            </div>
            <figcaption className="border-t px-4 py-2 text-center text-sm font-semibold text-[var(--primary)]">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
