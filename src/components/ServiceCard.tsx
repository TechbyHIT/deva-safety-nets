import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteImage } from "./SiteImage";
import { getServiceImage } from "@/lib/images";

export function ServiceCard({
  slug,
  name,
  tagline,
  categoryName,
  href,
}: {
  slug: string;
  name: string;
  tagline: string;
  categoryName?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  priceUnit?: string | null;
  href?: string;
}) {
  const { src, alt, title } = getServiceImage(slug, name);
  const linkHref = href ?? `/services/${slug}`;

  return (
    <Link href={linkHref} prefetch={true} className="card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-subtle)]">
        <SiteImage
          src={src}
          alt={alt}
          title={title}
          fill
          preset="card"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        <div className="service-card-overlay absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {categoryName && <span className="eyebrow mb-2">{categoryName}</span>}
        <h3 className="text-lg font-bold transition group-hover:text-[var(--primary)]">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{tagline}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="text-sm font-medium text-[var(--accent)]">Free site inspection</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
            View <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
