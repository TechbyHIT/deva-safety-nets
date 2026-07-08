import { renderSitemapIndexXml } from "@/lib/sitemap-urls";

// Sitemap INDEX served at /sitemap.xml. It references the segmented sitemaps
// (/sitemaps/[id].xml), keeping every file well under the 50,000-URL / 50MB
// spec limit and letting the site scale from ~46k to 100k+ URLs unchanged.
export const revalidate = 43200;
export const dynamic = "force-static";

export function GET() {
  return new Response(renderSitemapIndexXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
