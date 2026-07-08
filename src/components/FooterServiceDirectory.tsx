import Link from "next/link";
import {
  PRIMARY_CITY_SLUG,
  serviceLocationHref,
  serviceLocationLabel,
} from "@/lib/service-location-url";
import { STATIC_FOOTER_DIRECTORY } from "@/lib/static-footer";

const FOOTER_CATEGORY_LIMIT = 8;
const FOOTER_SERVICES_PER_CATEGORY = 7;

/** Footer mega-grid: each service links to its Kochi page (e.g. Balcony Invisible Grills in Kochi). */
export function FooterServiceDirectory() {
  const { categories, cityName } = STATIC_FOOTER_DIRECTORY;
  const displayCategories = categories.slice(0, FOOTER_CATEGORY_LIMIT);

  return (
    <section className="footer-directory" aria-labelledby="footer-directory-heading">
      <div className="container-page">
        <div className="footer-directory__header">
          <p className="eyebrow mb-2">All services · All Kerala areas</p>
          <h2 id="footer-directory-heading" className="footer-directory__title">
            Services in {cityName} &amp; nearby areas
          </h2>
          <p className="footer-directory__desc">
            Every service is available across Kochi, Ernakulam and 160+ localities — tap any link for
            local installation details and free site survey.
          </p>
        </div>
        <div className="footer-directory__grid">
          {displayCategories.map((cat) => (
            <div key={cat.slug} className="footer-directory__category">
              <Link href={`/services#${cat.slug}`} className="footer-directory__category-title">
                {cat.name}
              </Link>
              <ul className="footer-directory__links">
                {cat.services.slice(0, FOOTER_SERVICES_PER_CATEGORY).map((s) => (
                  <li key={s.slug}>
                    <Link href={serviceLocationHref(s.slug, PRIMARY_CITY_SLUG)} prefetch={true}>
                      {serviceLocationLabel(s.name, cityName)}
                    </Link>
                  </li>
                ))}
                {cat.services.length > FOOTER_SERVICES_PER_CATEGORY && (
                  <li>
                    <Link
                      href={`/services#${cat.slug}`}
                      className="footer-directory__more"
                      prefetch={true}
                    >
                      +{cat.services.length - FOOTER_SERVICES_PER_CATEGORY} more →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <p className="footer-directory__footer-link">
          <Link href="/locations" prefetch={true}>
            Browse all Kerala locations →
          </Link>
        </p>
      </div>
    </section>
  );
}
