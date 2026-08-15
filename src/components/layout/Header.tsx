"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { ThemeToggle } from "@/components/layout/ThemeProvider";
import { site, telHref } from "@/lib/site";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/property-types", label: "Solutions" },
  { href: "/projects", label: "Projects" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ArchHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`arch-header ${scrolled ? "arch-header--scrolled" : ""}`}>
        <div className="arch-header__inner">
          <Link href="/" className="arch-header__brand" prefetch={true} aria-label={site.name}>
            <span className="arch-header__brand-mark">
              <BrandLogo
                alt={`${site.name} — Invisible Grills & Safety Nets Kerala`}
                priority
              />
            </span>
          </Link>

          <nav className="arch-nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`arch-nav__link ${isActive(pathname, item.href) ? "arch-nav__link--active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="arch-header__actions">
            <ThemeToggle className="hidden sm:inline-flex" />
            <a href={telHref()} className="header-call-btn hidden md:inline-flex">
              <Phone size={15} /> Call
            </a>
            <Link href="/contact" className="btn btn-primary hidden lg:inline-flex">
              Get Quote
            </Link>
            <button
              type="button"
              className="arch-header__menu-btn"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
