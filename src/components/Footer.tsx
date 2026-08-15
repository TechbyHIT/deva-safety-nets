import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { FooterServiceDirectory } from "@/components/FooterServiceDirectory";
import { KeywordServiceDirectory } from "@/components/KeywordServiceDirectory";
import { BrandLogo } from "@/components/BrandLogo";
import { STATIC_NAV_CATEGORIES, STATIC_CITIES } from "@/lib/static-nav";
import { site, telHref, whatsappHref } from "@/lib/site";

export function Footer() {
  const categories = STATIC_NAV_CATEGORIES;
  const cities = STATIC_CITIES;

  return (    <footer className="site-footer">
      <div className="footer-cta">
        <div className="container-page footer-cta__inner">
          <div>
            <p className="footer-cta__title">Ready for a free site inspection?</p>
            <p className="footer-cta__subtitle">Kochi, Ernakulam and 160+ Kerala localities</p>
          </div>
          <div className="footer-cta__actions">
            <Link href="/contact" className="btn btn-accent">
              Get Free Inspection
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container-page footer-main__grid">
          <div className="footer-main__brand">
            <div className="footer-brand">
              <div className="footer-brand__logo">
                <BrandLogo alt={site.name} variant="footer" />
              </div>
              <div>
                <p className="footer-brand__name">{site.name}</p>
                <p className="footer-brand__tagline">Invisible Grills & Safety Nets Kerala</p>
              </div>
            </div>
            <p className="footer-brand__desc">{site.description}</p>
            <div className="footer-contact">
              <a href={telHref()}>
                <Phone size={15} /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`}>
                <Mail size={15} /> {site.email}
              </a>
              <p className="footer-contact__address">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                {site.serviceArea}
              </p>
            </div>
          </div>

          <div>
            <h3 className="footer-col__title">Services</h3>
            <ul className="footer-nav">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/services#${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-col__title">Kerala Locations</h3>
            <ul className="footer-nav">
              {cities.slice(0, 10).map((c) => (
                <li key={c.slug}>
                  <Link href={`/locations/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/locations" className="footer-nav__more">
                  All locations →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col__title">Company</h3>
            <ul className="footer-nav">
              {[
                ["/about", "About Us"],
                ["/projects", "Projects"],
                ["/gallery", "Gallery"],
                ["/reviews", "Reviews"],
                ["/faq", "FAQ"],
                ["/blog", "Blog"],
                ["/compare", "Compare Services"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <FooterServiceDirectory />
      <KeywordServiceDirectory />

      <div className="footer-bottom">
        <div className="container-page footer-bottom__inner">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="footer-bottom__links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
