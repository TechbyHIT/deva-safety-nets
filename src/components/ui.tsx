import Link from "next/link";

import type { ReactNode } from "react";

import { Check } from "lucide-react";

import { SiteImage } from "./SiteImage";



export function Section({

  children,

  className = "",

  muted = false,

  id,

  dark = false,

}: {

  children: ReactNode;

  className?: string;

  muted?: boolean;

  id?: string;

  dark?: boolean;

}) {

  return (

    <section

      id={id}

      className={`py-16 md:py-24 ${muted ? "surface-subtle" : ""} ${dark ? "section-navy" : ""} ${className}`}

    >

      <div className="container-page">{children}</div>

    </section>

  );

}



export function SectionHeading({

  eyebrow,

  title,

  subtitle,

  center = true,

  light = false,

}: {

  eyebrow?: string;

  title: string;

  subtitle?: string;

  center?: boolean;

  light?: boolean;

}) {

  return (

    <div className={`mb-10 md:mb-12 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>

      {eyebrow && <span className="eyebrow mb-2">{eyebrow}</span>}

      {center && <div className="gold-accent-line mx-auto mb-4" />}

      {!center && <div className="gold-accent-line mb-4" />}

      <h2 className={`text-2xl font-extrabold tracking-tight md:text-4xl ${light ? "text-white" : ""}`}>

        {title}

      </h2>

      {subtitle && (

        <p className={`mt-3 text-base leading-relaxed md:text-lg ${light ? "text-white/80" : "text-muted"}`}>

          {subtitle}

        </p>

      )}

    </div>

  );

}



export function CheckList({ items }: { items: string[] }) {

  return (

    <ul className="space-y-3">

      {items.map((item, i) => (

        <li key={i} className="flex items-start gap-3">

          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15">

            <Check size={14} className="text-[var(--accent)]" aria-hidden />

          </span>

          <span className="text-muted">{item}</span>

        </li>

      ))}

    </ul>

  );

}



export function CTABand({

  title = "Ready to make your Kerala home safer?",

  subtitle = "Book a free site inspection in Kochi, Ernakulam or your locality — our team responds within 24 hours.",

  imageSrc,

}: {

  title?: string;

  subtitle?: string;

  imageSrc?: string;

}) {

  return (

    <section className="py-14 md:py-16">

      <div className="container-page">

        <div className="relative overflow-hidden rounded-2xl premium-shadow">

          <div className="cta-band grid items-center gap-8 px-6 py-12 md:grid-cols-[1fr_auto] md:px-12 md:py-14">

            <div className="relative z-10 text-white">

              <div className="gold-accent-line mb-4" />

              <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>

              <p className="mt-3 max-w-xl text-base text-white/85 md:text-lg">{subtitle}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                <Link href="/contact" className="btn btn-accent w-full sm:w-auto">

                  Get Free Inspection

                </Link>

                <Link href="/services" className="btn btn-ghost-light w-full sm:w-auto">

                  Explore Services

                </Link>

              </div>

            </div>

            {imageSrc && (

              <div className="relative hidden h-40 w-40 shrink-0 overflow-hidden rounded-xl md:block lg:h-48 lg:w-48">

                <SiteImage src={imageSrc} alt="" fill preset="card" className="rounded-xl" aria-hidden />

              </div>

            )}

            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full cta-glow"
              aria-hidden
            />

          </div>

        </div>

      </div>

    </section>

  );

}



export function StatBand({

  stats,

}: {

  stats: { value: string; label: string }[];

}) {

  return (

    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">

      {stats.map((s) => (

        <div key={s.label} className="stat-card card-hover p-5 text-center md:p-6">

          <div className="text-2xl font-extrabold text-[var(--primary)] md:text-3xl">{s.value}</div>

          <div className="mt-1 text-xs font-medium text-muted md:text-sm">{s.label}</div>

        </div>

      ))}

    </div>

  );

}



export function Stars({ rating }: { rating: number }) {

  return (

    <span className="text-[var(--accent)]" aria-label={`${rating} out of 5 stars`}>

      {"★".repeat(rating)}

      <span className="text-muted/40">{"★".repeat(5 - rating)}</span>

    </span>

  );

}



export function PageHero({

  eyebrow,

  title,

  description,

  children,

  imageSrc,

  imageAlt,

}: {

  eyebrow?: string;

  title: string;

  description?: string;

  children?: ReactNode;

  imageSrc?: string;

  imageAlt?: string;

}) {

  return (

    <div className="hero-mesh border-b">

      <div className="container-page grid items-center gap-8 py-12 md:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">

        <div>

          {eyebrow && <span className="eyebrow mb-2">{eyebrow}</span>}

          <div className="gold-accent-line mb-4" />

          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">

            {title}

          </h1>

          {description && (

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{description}</p>

          )}

          {children}

        </div>

        {imageSrc && (

          <div className="card premium-shadow relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl">

            <SiteImage
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              priority
              preset="heroSide"
            />

          </div>

        )}

      </div>

    </div>

  );

}



export function InlineCTA({

  title,

  subtitle,

  href = "/contact",

  label = "Get Free Inspection",

}: {

  title: string;

  subtitle?: string;

  href?: string;

  label?: string;

}) {

  return (

    <div className="inline-cta rounded-2xl border p-6 md:p-8">

      <h3 className="text-xl font-bold">{title}</h3>

      {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>}

      <Link href={href} className="btn btn-primary mt-5">

        {label}

      </Link>

    </div>

  );

}



export function ProcessTimeline({

  steps,

}: {

  steps: { title: string; detail: string; imageSrc?: string; imageAlt?: string }[];

}) {

  return (

    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

      {steps.map((step, i) => (

        <li key={i} className="card-hover overflow-hidden">

          {step.imageSrc && (

            <div className="relative aspect-[16/10] bg-[var(--bg-subtle)]">

              <SiteImage
                src={step.imageSrc}
                alt={step.imageAlt ?? step.title}
                fill
                preset="card"
              />

            </div>

          )}

          <div className="p-5">

            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">

              Step {i + 1}

            </span>

            <p className="mt-1 font-bold">{step.title}</p>

            <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.detail}</p>

          </div>

        </li>

      ))}

    </ol>

  );

}



export function MaterialCard({

  name,

  grade,

  summary,

  imageSrc,

}: {

  name: string;

  grade?: string | null;

  summary: string;

  imageSrc?: string;

}) {

  return (

    <div className="card-hover overflow-hidden">

      {imageSrc && (

        <div className="relative aspect-[16/9] bg-[var(--bg-subtle)]">

          <SiteImage src={imageSrc} alt={name} fill preset="galleryWide" />

        </div>

      )}

      <div className="p-5">

        <h3 className="font-bold">{name}</h3>

        {grade && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{grade}</p>}

        <p className="mt-2 text-sm text-muted">{summary}</p>

      </div>

    </div>

  );

}


