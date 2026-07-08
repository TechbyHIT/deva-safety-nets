import "server-only";
import { unstable_cache } from "next/cache";
import { catalogCityFilter } from "./catalog";
import { staticCatalog } from "./static-data/build-catalog";
import type { SearchDoc, SearchResult } from "./search-types";

export type { SearchDoc, SearchResult } from "./search-types";

export const getSearchIndex = unstable_cache(
  async (): Promise<SearchDoc[]> => {
    const services = staticCatalog.services;
    const cities = staticCatalog.cities.filter((c) => catalogCityFilter.slug.in.includes(c.slug));
    const areas = staticCatalog.areas.filter((a) => {
      const city = staticCatalog.cities.find((c) => c.id === a.cityId);
      return city && catalogCityFilter.slug.in.includes(city.slug);
    });
    const propertyTypes = staticCatalog.propertyTypes;
    const materials = staticCatalog.materials;
    const industries = staticCatalog.industries;
    const guides = staticCatalog.guides.filter((g) => g.published);
    const comparisons = staticCatalog.comparisons;
    const blog = staticCatalog.blogPosts.filter((b) => b.published);

    const docs: SearchDoc[] = [];
    const push = (d: SearchResult, extra = "") =>
      docs.push({ ...d, keywords: `${d.title} ${d.subtitle} ${extra}`.toLowerCase() });

    for (const s of services)
      push(
        { type: "Service", title: s.name, subtitle: s.tagline, href: `/services/${s.slug}` },
        `${s.category?.name ?? ""} ${s.keywords.join(" ")}`,
      );
    for (const c of cities)
      push({ type: "City", title: c.name, subtitle: `Services in ${c.name}, ${c.state}`, href: `/locations/${c.slug}` }, c.state);
    for (const a of areas) {
      const city = staticCatalog.cities.find((c) => c.id === a.cityId)!;
      push({ type: "Area", title: `${a.name}, ${city.name}`, subtitle: `Services in ${a.name}`, href: `/locations/${city.slug}/${a.slug}` });
    }
    for (const p of propertyTypes)
      push({ type: "Property", title: p.plural, subtitle: `Safety solutions for ${p.plural.toLowerCase()}`, href: `/property-types/${p.slug}` });
    for (const m of materials)
      push({ type: "Material", title: m.name, subtitle: m.grade ?? "Material", href: `/materials/${m.slug}` }, m.grade ?? "");
    for (const i of industries)
      push({ type: "Industry", title: i.name, subtitle: `Solutions for ${i.name.toLowerCase()}`, href: `/industries/${i.slug}` });
    for (const g of guides)
      if (g.service)
        push({ type: "Guide", title: g.title, subtitle: `${g.type.toLowerCase()} guide`, href: `/${g.type.toLowerCase()}-guide/${g.service.slug}` });
    for (const c of comparisons)
      push({ type: "Compare", title: `${c.serviceA.name} vs ${c.serviceB.name}`, subtitle: "Comparison", href: `/compare/${c.slug}` });
    for (const b of blog)
      push({ type: "Blog", title: b.title, subtitle: "Article", href: `/blog/${b.slug}` }, b.tags.join(" "));

    return docs;
  },
  ["search-index"],
  { revalidate: 60 * 60 * 12, tags: ["catalog", "locations", "content"] },
);

const TYPE_WEIGHT: Record<string, number> = {
  Service: 5,
  City: 4,
  Property: 4,
  Area: 3,
  Guide: 2,
  Compare: 2,
  Material: 2,
  Industry: 2,
  Blog: 1,
};

export async function searchSite(query: string, limit = 20): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const index = await getSearchIndex();

  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of index) {
    let score = 0;
    let matchedAll = true;
    for (const t of tokens) {
      const idx = doc.keywords.indexOf(t);
      if (idx === -1) {
        matchedAll = false;
        break;
      }
      score += 10;
      if (doc.title.toLowerCase().startsWith(t)) score += 8;
      else if (doc.keywords.startsWith(t)) score += 4;
    }
    if (!matchedAll) continue;
    if (doc.title.toLowerCase() === q) score += 30;
    if (doc.title.toLowerCase().includes(q)) score += 6;
    score += TYPE_WEIGHT[doc.type] ?? 0;
    score -= doc.title.length * 0.02;
    scored.push({ doc, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ doc }) => ({
    type: doc.type,
    title: doc.title,
    subtitle: doc.subtitle,
    href: doc.href,
  }));
}
