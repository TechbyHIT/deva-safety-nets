import Link from "next/link";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { site, telHref, whatsappHref } from "@/lib/site";
import { SiteImage } from "@/components/SiteImage";
import { PAGE_IMAGES } from "@/lib/images";
import { MobileNav } from "@/components/nav/MobileNav";
import { NavLink } from "@/components/nav/NavLink";
import { AreasMegaMenu } from "@/components/nav/AreasMegaMenu";
import { SERVICE_MENU } from "@/lib/service-menu";

function ServicesMegaMenu() {
  return (
    <div className="nav-mega group relative">
      <button type="button" className="nav-link" aria-haspopup="true">
        Services
        <ChevronDown size={18} className="transition-transform group-hover:rotate-180" />
      </button>
      <div className="nav-mega-panel absolute left-1/2 top-full w-[min(96vw,72rem)] -translate-x-1/2 pt-3">
        <div className="mega-menu max-h-[min(70vh,32rem)] overflow-y-auto p-6">
          <div className="mb-4">
            <Link href="/services" prefetch={true} className="mega-menu__title text-base">
              View all services →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {SERVICE_MENU.map((cat) => (
              <div key={cat.slug}>
                <Link href={`/services#${cat.slug}`} prefetch={true} className="mega-menu__title mb-2 block">
                  {cat.name}
                </Link>
                <ul className="space-y-1">
                  {cat.services.map((s) => (
                    <li key={`${cat.slug}-${s.slug}`}>
                      <Link href={`/services/${s.slug}`} prefetch={true} className="mega-menu__link block text-sm">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteNav({
  cities,
  phone,
}: {
  cities: { slug: string; name: string; featured: boolean }[];
  phone: string;
}) {
  const featuredServices = SERVICE_MENU.flatMap((c) =>
    c.services.slice(0, 2).map((s) => ({ slug: s.slug, name: s.name, tagline: "" })),
  ).slice(0, 6);

  return (
    <header className="sticky top-0 z-[1000] bg-[var(--header-bg)] shadow-md">
      <div className="hidden bg-[var(--brand-navy)] xl:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-sm text-white/90 md:px-8">
          <p className="truncate font-medium text-white/95">
            Premium Invisible Grills &amp; Safety Nets across Kochi &amp; Ernakulam
          </p>
          <div className="flex shrink-0 items-center gap-5">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-1.5 transition hover:text-[var(--gold-200)]"
            >
              <Mail size={13} />
              {site.email}
            </a>
            <a
              href={telHref()}
              className="inline-flex items-center gap-1.5 font-semibold transition hover:text-[var(--gold-200)]"
            >
              <Phone size={13} />
              {phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto box-border flex h-[68px] w-full max-w-7xl items-center justify-between gap-3 border-t-[3px] border-t-[var(--gold)] px-4 md:px-8 xl:h-24">
        <Link href="/" className="site-logo flex shrink-0 items-center" prefetch={true}>
          <SiteImage
            src={PAGE_IMAGES.logo}
            alt={`${site.name} — Invisible Grills & Safety Nets Kerala`}
            width={512}
            height={128}
            preset="logo"
            objectFit="contain"
            className="h-11 w-auto max-w-[11rem] object-contain xl:h-[4.5rem] xl:max-w-[18rem]"
          />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-0.5 md:flex" aria-label="Primary">
          <NavLink href="/" exact>
            Home
          </NavLink>
          <NavLink href="/about">About</NavLink>
          <ServicesMegaMenu />
          <AreasMegaMenu cities={cities} featuredServices={featuredServices} />
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/faq">FAQ</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="header-whatsapp-btn"
            aria-label="WhatsApp"
          >
            <MessageCircle size={22} />
          </a>
          <a href={telHref()} className="header-call-btn">
            <Phone size={18} />
            Call Now
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg"
            aria-label="WhatsApp"
          >
            <MessageCircle size={21} strokeWidth={2.25} />
          </a>
          <a
            href={telHref()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-b from-[#e5c766] to-[#d4af37] px-3 text-sm font-bold text-[#0b1d33] shadow-lg"
            aria-label={`Call ${phone}`}
          >
            <Phone size={16} strokeWidth={2.25} />
            Call
          </a>
          <MobileNav cities={cities} />
        </div>
      </div>
    </header>
  );
}
