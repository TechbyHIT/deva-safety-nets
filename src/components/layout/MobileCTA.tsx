"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/site";

export function MobileCTA() {
  const waMsg = "Hi, I'd like a free site inspection for invisible grills / safety nets in Kerala.";

  return (
    <div className="mobile-cta-bar md:hidden" aria-label="Quick contact">
      <a href={telHref()} className="btn btn-outline">
        <Phone size={15} /> Call
      </a>
      <a
        href={whatsappHref(waMsg)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp"
      >
        <MessageCircle size={15} /> Chat
      </a>
      <Link href="/contact" className="btn btn-primary">
        Get Quote
      </Link>
    </div>
  );
}
