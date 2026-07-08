import { KeywordServiceLinks } from "@/components/KeywordServiceLinks";
import { STATIC_PRIORITY_INTENT_LINKS } from "@/lib/static-intent-links";

/** Site-wide intent links — sync static data, zero server fetch. */
export function GlobalSeoIntentLinks() {
  return (
    <section className="global-seo-intents border-t border-[var(--border)] bg-[var(--bg-subtle)] py-10">
      <div className="container-page">
        <KeywordServiceLinks
          links={STATIC_PRIORITY_INTENT_LINKS}
          title="Best near me · Top Kerala · High quality #1"
          subtitle="Priority searches — best near me, top Kerala, high quality #1 and premium installation across Kochi, Ernakulam and all Kerala."
          max={56}
          columns={4}
        />
      </div>
    </section>
  );
}
