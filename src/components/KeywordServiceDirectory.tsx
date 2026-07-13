import Link from "next/link";
import { STATIC_KEYWORD_LINKS_BY_CATEGORY } from "@/lib/static-footer";

const KEYWORDS_PER_CATEGORY = 10;

/** Footer grid linking to long-tail keyword service pages by category. */
export function KeywordServiceDirectory() {
  const withLinks = STATIC_KEYWORD_LINKS_BY_CATEGORY.filter((c) => c.links.length > 0);
  if (withLinks.length === 0) return null;

  return (
    <section className="footer-keywords lazy-section" aria-labelledby="footer-keywords-heading">
      <div className="container-page">
        <div className="footer-directory__header">
          <p className="eyebrow mb-2">Popular searches</p>
          <h2 id="footer-keywords-heading" className="footer-directory__title">
            Keyword service pages
          </h2>
          <p className="footer-directory__desc">
            Browse detailed pages for installation, pricing, repair and local search terms across Kerala.
          </p>
        </div>
        <div className="footer-directory__grid">
          {withLinks.map((cat) => (
            <div key={cat.slug} className="footer-directory__category">
              <Link href={`/services#${cat.slug}`} className="footer-directory__category-title">
                {cat.name}
              </Link>
              <ul className="footer-directory__links">
                {cat.links.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`}>
                      {s.name}
                    </Link>
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
