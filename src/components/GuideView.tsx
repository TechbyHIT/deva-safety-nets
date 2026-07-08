import Link from "next/link";
import { Clock } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { QuoteForm } from "./QuoteForm";
import { Section, CTABand } from "./ui";
import { JsonLd } from "./JsonLd";

type Step = { title: string; detail: string };

export function GuideView({
  guide,
  label,
  basePath,
}: {
  guide: {
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    readMinutes: number;
    steps: unknown;
    service?: { slug: string; name: string } | null;
  };
  label: string;
  basePath: string;
}) {
  const steps = (guide.steps ?? []) as Step[];
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.excerpt,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.detail,
    })),
  };

  return (
    <>
      <JsonLd data={howToSchema} />
      <Breadcrumbs
        items={[
          { name: label, path: basePath },
          { name: guide.service?.name ?? guide.title, path: `${basePath}/${guide.service?.slug ?? guide.slug}` },
        ]}
      />
      <div className="surface-subtle border-b">
        <div className="container-page py-12">
          <span className="eyebrow mb-2">{label}</span>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Clock size={15} /> {guide.readMinutes} min read
          </p>
        </div>
      </div>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="prose-content min-w-0">
            <p className="text-lg">{guide.excerpt}</p>
            <p>{guide.body}</p>
            {steps.length > 0 && (
              <>
                <h2>Step-by-step</h2>
                <ol className="not-prose space-y-4">
                  {steps.map((s, i) => (
                    <li key={i} className="card flex gap-4 p-5">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--text)]">{s.title}</p>
                        <p className="text-sm">{s.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {guide.service && (
              <p>
                <Link href={`/services/${guide.service.slug}`} className="font-medium text-[var(--primary)]">
                  Explore {guide.service.name} →
                </Link>
              </p>
            )}
          </article>
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <QuoteForm service={guide.service?.name} source={`${basePath}/${guide.service?.slug ?? guide.slug}`} />
          </aside>
        </div>
      </Section>
      <CTABand />
    </>
  );
}
