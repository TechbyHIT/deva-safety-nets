import Link from "next/link";
import { STATIC_FOOTER_DIRECTORY } from "@/lib/static-footer";

const SERVICES_PER_CATEGORY = 10;

/** Footer grid linking to real menu services by category. */
export function KeywordServiceDirectory() {
  const categories = STATIC_FOOTER_DIRECTORY.categories.filter((c) => c.services.length > 0);
  if (categories.length === 0) return null;

  return (
    <section className="footer-keywords" aria-labelledby="footer-services-heading">
      <div className="container-page">
        <div className="footer-directory__header">
          <p className="eyebrow mb-2">Our services</p>
          <h2 id="footer-services-heading" className="footer-directory__title">
            Invisible grills &amp; safety nets
          </h2>
          <p className="footer-directory__desc">
            Browse installation services for homes and businesses across Kochi, Ernakulam and Kerala.
          </p>
        </div>
        <div className="footer-directory__grid">
          {categories.map((cat) => (
            <div key={cat.slug} className="footer-directory__category">
              <Link href={`/services#${cat.slug}`} className="footer-directory__category-title">
                {cat.name}
              </Link>
              <ul className="footer-directory__links">
                {cat.services.slice(0, SERVICES_PER_CATEGORY).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`}>{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
