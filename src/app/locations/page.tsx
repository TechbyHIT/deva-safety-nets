import type { Metadata } from "next";

import Link from "next/link";

import { MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";

import { PageHero, Section, CTABand } from "@/components/ui";

import { getAllCities } from "@/lib/queries";

import { buildMetadata } from "@/lib/seo";

import { site } from "@/lib/site";



export const revalidate = 86400;



export const metadata: Metadata = buildMetadata({

  title: "Service Areas — Invisible Grills & Safety Nets Kerala",

  description:

    `${site.name} installs invisible grills and safety nets across Kochi, Ernakulam and 160+ Kerala localities. Find your area for local services, FAQs and free site inspection.`,

  path: "/locations",

});



export default async function LocationsPage() {

  const cities = await getAllCities();

  const byState = cities.reduce<Record<string, typeof cities>>((acc, c) => {

    (acc[c.state] ??= []).push(c);

    return acc;

  }, {});



  return (

    <>

      <Breadcrumbs items={[{ name: "Locations", path: "/locations" }]} />

      <PageHero

        eyebrow="Service Areas"

        title="Kerala cities & localities we serve"

        description="Local Deva Safety Nets teams across Kochi and Ernakulam — 160+ named localities. Select your city to see areas served, property types, related services and book a free site inspection."

      />

      <Section>

        <p className="mx-auto mb-10 max-w-2xl text-center text-muted">

          Every city page includes local service information, nearby areas, property-type solutions and FAQs —

          written uniquely for your Kerala locality.

        </p>

        {Object.entries(byState).map(([state, list]) => (

          <div key={state} className="mb-12">

            <h2 className="section-title mb-5 text-xl md:text-2xl">{state}</h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {list.map((c) => (

                <Link key={c.slug} href={`/locations/${c.slug}`} className="location-card group">

                  <span className="logo-badge flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                    <MapPin size={18} className="text-[var(--gold)]" />

                  </span>

                  <div>

                    <p className="font-semibold group-hover:text-[var(--primary)]">{c.name}</p>

                    <p className="text-sm text-muted">{c.state} · Free inspection</p>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        ))}

      </Section>

      <Section muted>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>Local invisible grill and safety net installation across Kerala</h2>
          <p>
            Deva Safety Nets operates local survey and installation teams in Kochi and Ernakulam
            district — with 160+ named localities for programmatic service
            coverage. Each city and area page includes unique local introduction, building types
            served, apartment and villa solutions, commercial and industrial capabilities, nearby
            coverage links and location-specific FAQs generated for your neighbourhood.
          </p>
          <h3>Why local pages matter</h3>
          <p>
            Fall-prevention and bird-control requirements differ by building age, floor height,
            coastal exposure and society guidelines. A Kakkanad high-rise faces different wind load
            than a Fort Kochi heritage home or an Aluva villa. Our location pages explain what
            customers in your area typically need and which Deva Safety Nets services apply — with
            internal links to relevant service and property-type resources.
          </p>
          <p>
            Select your city above to explore area-level pages, or{" "}
            <Link href="/contact" className="text-[var(--primary)]">
              contact us
            </Link>{" "}
            to confirm availability in your locality.
          </p>
        </div>
      </Section>

      <CTABand title={`Book a free inspection with ${site.name}`} />

    </>

  );

}


