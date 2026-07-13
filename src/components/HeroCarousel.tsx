"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone, ShieldCheck } from "lucide-react";
import { TrustBadges } from "./TrustBadges";
import { HERO_SCROLL_STRIP, HERO_SLIDES, heroSlideImage } from "@/lib/hero-slides";
import type { SiteImageMeta } from "@/lib/images";
import { optimizedImageProps } from "@/lib/optimized-image-props";
import { site, telHref } from "@/lib/site";

export function HeroCarousel({ initialImage }: { initialImage: SiteImageMeta }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showStrip, setShowStrip] = useState(false);

  useEffect(() => {
    const run = () => setShowStrip(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = globalThis.setTimeout(run, 2000);
    return () => globalThis.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(id);
  }, [paused]);

  const slide = HERO_SLIDES[active];
  const img = active === 0 ? initialImage : heroSlideImage(slide);
  const showOverlay = active !== 0;

  const prev = () => setActive((a) => (a - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setActive((a) => (a + 1) % HERO_SLIDES.length);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {showOverlay && (
        <div className="home-hero__bg absolute inset-0 z-[1]">
          <img
            {...optimizedImageProps({ src: img.src, alt: img.alt, preset: "hero" })}
            className="animate-fade-in object-cover object-center"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      )}

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
              {HERO_SLIDES.map((_, i) => (
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
              <img
                {...optimizedImageProps({ src: img.src, alt: img.alt, preset: "heroSide" })}
                className="object-cover object-center"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
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

      {showStrip && HERO_SCROLL_STRIP.length > 0 && (
        <div className="relative z-10 hero-strip py-4">
          <div className="overflow-hidden">
            <div className="animate-hero-scroll flex w-max gap-3 px-4">
              {[...HERO_SCROLL_STRIP, ...HERO_SCROLL_STRIP].map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-subtle)] md:h-28 md:w-48"
                >
                  <img
                    {...optimizedImageProps({ src, alt: "", preset: "strip" })}
                    aria-hidden
                    className="object-cover object-center"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
