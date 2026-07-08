"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiteImage } from "./SiteImage";
import { TrustBadges } from "./TrustBadges";
import { GALLERY_IMAGES, IMAGE_FOLDERS, PAGE_IMAGES, buildAltText, getBestFolderImage, type SiteImageMeta } from "@/lib/images";
import { site, telHref } from "@/lib/site";

const SLIDES: {
  title: string;
  subtitle: string;
  tag: string;
  serviceSlug?: string;
  imageKey?: string;
}[] = [
  {
    title: "Premium Invisible Grills in Kerala",
    subtitle:
      "Near-invisible SS304 & SS316 cable systems for balconies and windows in Kochi, Ernakulam and across Kerala — free site inspection included.",
    tag: "Invisible Grills Kerala",
    serviceSlug: "invisible-grills",
  },
  {
    title: "Trusted Safety Nets for Children, Pets & Birds",
    subtitle:
      "Professional balcony safety net installation in Kochi and Ernakulam — child-safe, bird-proof and installed within days.",
    tag: "Safety Nets Kochi",
    serviceSlug: "balcony-safety-nets",
  },
  {
    title: "Sports Nets, Cloth Hangers & Bird Control",
    subtitle:
      `${site.name} delivers cricket nets, cloth hangers and bird spikes with certified materials and up to 10-year warranty.`,
    tag: "Deva Safety Nets Kerala",
    serviceSlug: "cricket-nets",
  },
  {
    title: "Free Site Inspection · Own Installation Teams",
    subtitle:
      "No subcontractors. Transparent quotes within 24 hours. Serving 160+ Kerala localities with premium finishes society committees approve.",
    tag: "Invisible Grills Near Me",
    imageKey: "home",
  },
];

const HERO_SLIDE_SRC: Record<string, string> = {
  "invisible-grills": getBestFolderImage("invisible-grill-balcony"),
  "balcony-safety-nets": getBestFolderImage("safety-nets-balcony"),
  "cricket-nets": getBestFolderImage("cricket-nets"),
  home: PAGE_IMAGES.hero,
};

function slideImage(slide: (typeof SLIDES)[0]): SiteImageMeta {
  if (slide.serviceSlug) {
    const src = HERO_SLIDE_SRC[slide.serviceSlug] ?? PAGE_IMAGES.hero;
    const name = slide.serviceSlug.replace(/-/g, " ");
    return {
      src,
      alt: buildAltText(name, src),
      title: `${name} | ${site.name}`,
    };
  }
  const key = slide.imageKey ?? "home";
  const src = HERO_SLIDE_SRC[key] ?? PAGE_IMAGES.hero;
  const context = `${site.name} hero`;
  return { src, alt: buildAltText(context, src), title: `${context} | ${site.name}` };
}

const SCROLL_STRIP = GALLERY_IMAGES.slice(0, 28);

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[active];
  const img = slideImage(slide);

  const prev = () => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setActive((a) => (a + 1) % SLIDES.length);

  return (
    <section
      className="home-hero relative overflow-hidden border-b"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-bleed background image with overlay */}
      <div className="home-hero__bg absolute inset-0">
        <SiteImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          priority
          preset="hero"
          className="animate-fade-in object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="container-page relative z-10 grid min-h-[min(88vh,720px)] items-center gap-8 py-16 md:min-h-[min(85vh,780px)] md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div key={active} className="animate-fade-up text-white">
          <span className="eyebrow mb-3">
            <ShieldCheck size={14} /> {slide.tag}
          </span>
          <div className="gold-accent-line mb-5" />
          <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {slide.subtitle}
          </p>

          <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[var(--gold-light,#e5c766)]">
            <MapPin size={15} />
            {site.serviceArea}
          </p>

          <div className="hero-cta">
            <Link href="/contact" className="btn btn-accent w-full sm:w-auto">
              Get Free Site Inspection
            </Link>
            <a href={telHref()} className="btn-hero-call w-full sm:w-auto">
              <Phone size={16} /> Call Now
            </a>
          </div>

          <div className="mt-8">
            <TrustBadges compact light />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 32 : 10,
                    backgroundColor: i === active ? "var(--gold)" : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="card premium-shadow overflow-hidden rounded-2xl border-white/10">
            <div className="relative aspect-[4/3] w-full">
              <SiteImage
                src={img.src}
                alt={img.alt}
                fill
                priority
                preset="heroSide"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="glass-dark absolute -bottom-5 -left-5 rounded-xl px-5 py-4 premium-shadow">
            <p className="text-2xl font-extrabold text-[var(--gold-light,#e5c766)]">10-Yr</p>
            <p className="text-xs text-white/85">Warranty</p>
          </div>
          <div className="glass-dark absolute -right-4 -top-4 rounded-xl px-5 py-3 premium-shadow">
            <p className="text-lg font-extrabold text-white">4.9★</p>
            <p className="text-xs text-white/85">Google Rating</p>
          </div>
        </div>
      </div>

      {/* Auto-scrolling image strip */}
      {SCROLL_STRIP.length > 0 && (
        <div className="relative z-10 hero-strip py-4">
          <div className="overflow-hidden">
            <div className="animate-hero-scroll flex w-max gap-3 px-4">
              {[...SCROLL_STRIP, ...SCROLL_STRIP].map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg md:h-28 md:w-48"
                >
                  <SiteImage src={src} alt="" fill preset="strip" className="object-cover object-center" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
