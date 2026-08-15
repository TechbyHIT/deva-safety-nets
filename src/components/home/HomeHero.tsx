import Link from "next/link";
import { SiteImage } from "@/components/SiteImage";
import { site, telHref, whatsappHref } from "@/lib/site";

export function HomeHero({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <section className="home-hero">
      <div className="home-hero__content reveal-up">
        <p className="eyebrow !bg-white/10 !text-[var(--sage)]">Kochi · Ernakulam · Kerala</p>
        <h1 className="home-hero__brand mt-6">{site.name}</h1>
        <p className="home-hero__headline">Modern safety architecture for balconies, windows and open edges.</p>
        <p className="home-hero__lede">
          Certified invisible grills and safety nets — free site inspection, discreet finishes, warranty-backed
          installation by local technicians.
        </p>
        <div className="home-hero__actions">
          <Link href="/contact" className="btn btn-accent">
            Get Free Inspection
          </Link>
          <a href={telHref()} className="btn btn-ghost-light">
            Call {site.phone}
          </a>
          <a
            href={whatsappHref("Hi, I'd like a free site inspection in Kerala.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-light"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <div className="home-hero__media">
        <SiteImage
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          preset="hero"
          className="animate-kenburns"
        />
        <div className="home-hero__media-veil" aria-hidden />
      </div>
    </section>
  );
}
