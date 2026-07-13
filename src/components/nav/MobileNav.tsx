"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, MessageCircle, Phone, X } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/site";
import { SERVICE_MENU } from "@/lib/service-menu";

type City = { slug: string; name: string };

const MAIN_LINKS_BEFORE = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
] as const;

const MAIN_LINKS_AFTER = [
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

function DrawerLink({
  href,
  label,
  exact,
  onClose,
}: {
  href: string;
  label: string;
  exact?: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClose}
      className={`border-b border-[var(--border)] py-2.5 text-lg font-semibold text-[var(--text)] ${
        active ? "text-[var(--gold-dark)]" : ""
      }`}
    >
      {label}
    </Link>
  );
}

export function MobileNav({
  cities,
}: {
  cities: City[];
}) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => setMounted(true), []);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setAreasOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) close();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function close() {
    setOpen(false);
    setServicesOpen(false);
    setAreasOpen(false);
  }

  function toggle() {
    setOpen((v) => {
      if (v) {
        setServicesOpen(false);
        setAreasOpen(false);
      }
      return !v;
    });
  }

  function toggleServices() {
    setServicesOpen((v) => {
      if (!v) setAreasOpen(false);
      return !v;
    });
  }

  function toggleAreas() {
    setAreasOpen((v) => {
      if (!v) setServicesOpen(false);
      return !v;
    });
  }

  const drawer =
    mounted &&
    createPortal(
      <>
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className={`fixed top-[68px] left-0 z-[999] h-[calc(100dvh-68px)] w-full bg-black/40 md:hidden ${
            open ? "block" : "hidden"
          }`}
        />
        <nav
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          aria-hidden={!open}
          className={`fixed top-[68px] right-0 z-[1000] flex h-[calc(100dvh-68px)] w-[85%] max-w-[340px] flex-col bg-[var(--header-bg)] shadow-2xl transition-transform duration-300 md:hidden ${
            open ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="font-heading text-lg font-bold text-[var(--text)]">Menu</p>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--gold-dark)]">
                Deva Safety Nets Kerala
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)]"
            >
              <X size={20} />
            </button>
          </div>

          <a
            href={telHref()}
            onClick={close}
            className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#e5c766] to-[#d4af37] px-5 py-3.5 text-sm font-bold text-[#0b1d33]"
          >
            <Phone size={18} />
            Call Now — Free Site Inspection
          </a>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col">
              {MAIN_LINKS_BEFORE.map((item) => (
                <DrawerLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  exact={"exact" in item ? item.exact : false}
                  onClose={close}
                />
              ))}

              <div className="border-b border-[var(--border)]">
                <button
                  type="button"
                  onClick={toggleServices}
                  aria-expanded={servicesOpen}
                  className="flex w-full items-center justify-between py-2.5 text-lg font-semibold text-[var(--text)]"
                >
                  Services
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {servicesOpen && (
                  <div className="space-y-1 pb-3 pl-3">
                    <Link
                      href="/services"
                      onClick={close}
                      className="block py-1 text-sm font-bold text-[var(--gold-dark)]"
                    >
                      All services →
                    </Link>
                    {SERVICE_MENU.map((cat) => (
                      <div key={cat.slug}>
                        <Link
                          href={`/services#${cat.slug}`}
                          onClick={close}
                          className="block py-1 text-sm font-semibold text-[var(--text)]"
                        >
                          {cat.name}
                        </Link>
                        <ul className="mb-2 ml-3 space-y-0.5">
                          {cat.services.map((s) => (
                            <li key={`${cat.slug}-${s.slug}`}>
                              <Link
                                href={`/services/${s.slug}`}
                                onClick={close}
                                className="block py-0.5 text-sm text-[var(--text-muted)]"
                              >
                                {s.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-[var(--border)]">
                <button
                  type="button"
                  onClick={toggleAreas}
                  aria-expanded={areasOpen}
                  className="flex w-full items-center justify-between py-2.5 text-lg font-semibold text-[var(--text)]"
                >
                  Areas
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${areasOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {areasOpen && (
                  <div className="space-y-1 pb-3 pl-3">
                    <Link
                      href="/locations"
                      onClick={close}
                      className="block py-1 text-sm font-bold text-[var(--gold-dark)]"
                    >
                      All Kerala locations →
                    </Link>
                    <ul className="space-y-0.5">
                      {cities.slice(0, 12).map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/locations/${c.slug}`}
                            onClick={close}
                            className="block py-0.5 text-sm text-[var(--text-muted)]"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {MAIN_LINKS_AFTER.map((item) => (
                <DrawerLink key={item.href} href={item.href} label={item.label} onClose={close} />
              ))}
            </div>
          </div>

          <div className="flex gap-2 border-t border-[var(--border)] p-4">
            <a
              href={telHref()}
              onClick={close}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#e5c766] to-[#d4af37] py-3 text-sm font-bold text-[#0b1d33]"
            >
              <Phone size={16} />
              Call
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25d366] py-3 text-sm font-bold text-white"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </nav>
      </>,
      document.body,
    );

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="mobile-nav-toggle md:hidden"
        data-open={open ? "true" : "false"}
      >
        <span className="mobile-nav-toggle__bar" />
        <span className="mobile-nav-toggle__bar" />
        <span className="mobile-nav-toggle__bar" />
      </button>
      {drawer}
    </>
  );
}
