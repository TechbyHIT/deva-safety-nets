import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FooterServiceDirectory } from "@/components/FooterServiceDirectory";
import { KeywordServiceDirectory } from "@/components/KeywordServiceDirectory";
import { BrandLogo } from "@/components/BrandLogo";
import { STATIC_NAV_CATEGORIES, STATIC_CITIES } from "@/lib/static-nav";
import { site, telHref } from "@/lib/site";

export function ArchFooter() {
  const categories = STATIC_NAV_CATEGORIES;
  const cities = STATIC_CITIES;
  const year = new Date().getFullYear();

  return (
    <footer className="arch-footer">
      <div className="arch-footer__statement">
        <div className="container-page">
          <p className="arch-footer__headline">
            Engineered protection for Kerala homes — measured, installed, warranted.
          </p>
          <p className="arch-footer__lede">
            Invisible grills and safety nets across Kochi, Ernakulam and 160+ localities — free site
            inspection, certified materials, local technicians.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-accent">
              Get Free Inspection
            </Link>
            <a href={telHref()} className="btn btn-ghost-light">
              <Phone size={16} /> {site.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page">
        <div className="arch-footer__grid">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-14 w-40 overflow-hidden rounded-lg bg-white">
                <BrandLogo alt={site.name} variant="footer" />
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/65">{site.description}</p>
            <div className="mt-5 space-y-2 text-sm">
              <a href={telHref()} className="flex items-center gap-2">
                <Phone size={14} /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2">
                <Mail size={14} /> {site.email}
              </a>
              <p className="flex items-start gap-2 text-white/55">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                {site.serviceArea}
              </p>
            </div>
          </div>

          <div>
            <h3 className="arch-footer__col-title">Services</h3>
            <ul className="arch-footer__list">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/services#${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="arch-footer__col-title">Locations</h3>
            <ul className="arch-footer__list">
              {cities.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/locations/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/locations">All Kerala areas →</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="arch-footer__col-title">Company</h3>
            <ul className="arch-footer__list">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/gallery">Gallery</Link>
              </li>
              <li>
                <Link href="/reviews">Reviews</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <FooterServiceDirectory />
      <KeywordServiceDirectory />

      <div className="arch-footer__bottom">
        <div className="container-page flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Kochi · Ernakulam · Kerala</p>
        </div>
      </div>
    </footer>
  );
}
