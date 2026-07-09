import Link from "next/link";
import { Section } from "@/components/ui";
import { site } from "@/lib/site";

/** Long-form homepage SEO copy — loaded after first paint. */
export function HomeSeoProse() {
  return (
    <Section muted>
      <div className="prose-content mx-auto max-w-3xl">
        <h2>Invisible Grills &amp; Safety Nets in Kerala — {site.name}</h2>
        <p>
          {site.name} helps Kerala homes and apartments stay safe without sacrificing light, air or
          beautiful views. Our invisible grills and safety nets deliver near-invisible, engineered
          protection for balconies, windows, staircases, terraces and open edges — installed by
          experienced local teams who understand Kerala building types, society norms and coastal
          weather conditions.
        </p>
        <h3>Invisible Grills in Kochi &amp; Ernakulam</h3>
        <p>
          Invisible grills use high-tensile stainless steel cables — SS304 for most Kerala homes
          and marine-grade SS316 for coastal areas like Fort Kochi and Vypin — spaced to prevent
          falls while staying almost invisible.
        </p>
        <h3>Safety Nets for Balconies, Birds &amp; Children</h3>
        <p>
          Safety nets are the fast, affordable way to secure balconies, ducts and terraces across
          Kerala. UV-stabilised nylon and HDPE nets allow full airflow, deter pigeons and birds,
          and can be installed in hours.
        </p>
        <h3>Professional installation across 160+ localities</h3>
        <p>
          Every project starts with a free on-site inspection and precise measurement. Explore our{" "}
          <Link href="/services" className="text-[var(--primary)]">
            full range of services
          </Link>
          , find your{" "}
          <Link href="/locations" className="text-[var(--primary)]">
            Kerala city and locality
          </Link>
          , or{" "}
          <Link href="/contact" className="text-[var(--primary)]">
            request a free site inspection
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}
