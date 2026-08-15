import Link from "next/link";
import { SiteImage } from "@/components/SiteImage";
import { getCategoryImage } from "@/lib/images";

type ServiceItem = { slug: string; name: string };
type Category = {
  slug: string;
  name: string;
  description: string;
  services: ServiceItem[];
};

export function EditorialServices({ categories }: { categories: Category[] }) {
  return (
    <section className="container-page" id="services-directory" aria-labelledby="services-dir-heading">
      <div className="mb-4 md:mb-6">
        <p className="eyebrow">Service directory</p>
        <h2 id="services-dir-heading" className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Protection for every edge of the home
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Browse our Kerala catalog — invisible grills, safety nets, bird control, sports nets and more.
        </p>
      </div>

      {categories.map((cat, i) => (
        <article
          key={cat.slug}
          id={cat.slug}
          className={`editorial-service ${i % 2 === 1 ? "editorial-service--flip" : ""}`}
        >
          <div className="editorial-service__media">
            <SiteImage
              src={getCategoryImage(cat.slug)}
              alt={`${cat.name} in Kerala`}
              fill
              preset="galleryWide"
              priority={i < 2}
            />
          </div>
          <div>
            <h3 className="editorial-service__title">{cat.name}</h3>
            <p className="editorial-service__desc">{cat.description}</p>
            <div className="editorial-service__links">
              {cat.services.slice(0, 6).map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`}>
                  {s.name}
                </Link>
              ))}
            </div>
            <Link
              href={`/services#${cat.slug}`}
              className="mt-6 inline-flex text-sm font-semibold text-[var(--forest)] dark:text-[var(--sage)]"
            >
              All {cat.name.toLowerCase()} →
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
