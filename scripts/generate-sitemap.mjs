/**
 * Write static sitemap XML files to public/ for Google Search Console submission.
 * Runs during `npm run build` — no runtime catalog work on /sitemap.xml requests.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://devasafetynets.com";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { getSitemapShardCount, getSitemapShard, getAllSitemapEntries, renderSitemapIndexXml, renderUrlsetXml } =
  await import("../src/lib/sitemap-urls.ts");

const publicDir = join(root, "public");
const shardsDir = join(publicDir, "sitemaps");
mkdirSync(shardsDir, { recursive: true });

const entries = getAllSitemapEntries();
const shardCount = getSitemapShardCount();

for (let id = 0; id < shardCount; id++) {
  writeFileSync(join(shardsDir, `${id}.xml`), renderUrlsetXml(getSitemapShard(id)));
}

writeFileSync(join(publicDir, "sitemap.xml"), renderSitemapIndexXml());

console.log(`Wrote public/sitemap.xml (${shardCount} shards, ${entries.length} URLs)`);
