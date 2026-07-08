import { notFound } from "next/navigation";
import {
  getSitemapShard,
  getSitemapShardCount,
  renderUrlsetXml,
} from "@/lib/sitemap-urls";

// Segmented sitemaps served at /sitemaps/[id].xml (e.g. /sitemaps/0.xml).
// Referenced by the sitemap index at /sitemap.xml.
export const revalidate = 43200;
export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return Array.from({ length: getSitemapShardCount() }, (_, id) => ({ id: `${id}.xml` }));
}

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const shardId = Number(id.replace(/\.xml$/, ""));
  if (!Number.isInteger(shardId) || shardId < 0 || shardId >= getSitemapShardCount()) {
    notFound();
  }

  const entries = getSitemapShard(shardId);
  return new Response(renderUrlsetXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
