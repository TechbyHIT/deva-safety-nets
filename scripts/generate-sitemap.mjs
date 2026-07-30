/**
 * Write sitemap index + sharded urlsets under public/.
 * Runs during `npm run build` — shards are gitignored; regenerate on deploy.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://devasafetynets.com";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const {
  getAllSitemapEntries,
  renderUrlsetXml,
  renderSitemapIndexXml,
  shardSitemapEntries,
} = await import("../src/lib/sitemap-urls.ts");
const { absoluteUrl } = await import("../src/lib/site.ts");

const publicDir = join(root, "public");
const shardsDir = join(publicDir, "sitemaps");

rmSync(shardsDir, { recursive: true, force: true });
mkdirSync(shardsDir, { recursive: true });

const entries = getAllSitemapEntries();
const shards = shardSitemapEntries(entries);
const shardLocs = [];

for (let i = 0; i < shards.length; i++) {
  const n = i + 1;
  const file = `sitemap-${n}.xml`;
  writeFileSync(join(shardsDir, file), renderUrlsetXml(shards[i]));
  shardLocs.push(absoluteUrl(`/sitemaps/${file}`));
}

writeFileSync(join(publicDir, "sitemap.xml"), renderSitemapIndexXml(shardLocs));

console.log(
  `Wrote public/sitemap.xml index → ${shards.length} shard(s), ${entries.length} URLs`,
);
