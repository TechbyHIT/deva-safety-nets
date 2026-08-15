import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";

type Featured = {
  slug: string;
  name: string;
  tagline: string;
  category: { name: string };
};

export function FeaturedBand({ services }: { services: Featured[] }) {
  if (!services.length) return null;

  return (
    <section className="featured-band">
      <div className="container-page">
        <p className="eyebrow">Most requested</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--ivory)] md:text-4xl">
          Featured installations in Kochi &amp; Ernakulam
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Popular invisible grill and safety net solutions — transparent pricing after free site inspection.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              name={s.name}
              tagline={s.tagline}
              categoryName={s.category.name}
            />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/services" className="btn btn-ghost-light">
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}
