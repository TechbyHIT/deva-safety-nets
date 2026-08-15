"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { site, telHref, whatsappHref } from "@/lib/site";
import { ThemeToggle } from "@/components/layout/ThemeProvider";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/property-types", label: "Solutions" },
  { href: "/projects", label: "Projects" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const waMsg = "Hi, I'd like a free site inspection for invisible grills / safety nets in Kerala.";

  return (
    <div
      className={`mobile-panel ${open ? "mobile-panel--open" : ""}`}
      aria-hidden={!open}
        inert={!open || undefined}
    >
      <div className="mobile-panel__head">
        <p className="font-heading text-lg font-bold text-[var(--forest)] dark:text-[var(--ivory)]">
          {site.shortName}
        </p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)]"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="mobile-panel__nav" aria-label="Mobile">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="mobile-panel__link" onClick={onClose}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mobile-panel__footer">
        <a href={telHref()} className="btn btn-outline" onClick={onClose}>
          <Phone size={16} /> Call
        </a>
        <a
          href={whatsappHref(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp"
          onClick={onClose}
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <Link href="/contact" className="btn btn-primary" onClick={onClose}>
          Get Quote
        </Link>
      </div>
    </div>
  );
}
