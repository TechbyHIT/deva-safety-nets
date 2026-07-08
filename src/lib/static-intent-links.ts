import { KEYWORD_SERVICE_ORDER_FLOOR } from "./catalog";
import { scoreIntentKeyword } from "./seo-intents";
import { staticCatalog } from "./static-data/build-catalog";

/** Precomputed intent links — no async query on layout render. */
export const STATIC_PRIORITY_INTENT_LINKS = staticCatalog.services
  .filter((s) => s.order >= KEYWORD_SERVICE_ORDER_FLOOR)
  .map((s) => ({ s, score: scoreIntentKeyword(s.slug, s.name) }))
  .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
  .slice(0, 56)
  .map(({ s }) => ({ slug: s.slug, name: s.name, label: s.name }));
