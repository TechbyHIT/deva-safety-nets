/**
 * Write a single static sitemap.xml to public/ for Google Search Console.
 * Runs during `npm run build` — no runtime work on /sitemap.xml requests.
 */
import { writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://devasafetynets.com";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const { getAllSitemapEntries, renderUrlsetXml } = await import("../src/lib/sitemap-urls.ts");

const publicDir = join(root, "public");
const entries = getAllSitemapEntries();

writeFileSync(join(publicDir, "sitemap.xml"), renderUrlsetXml(entries));

rmSync(join(publicDir, "sitemaps"), { recursive: true, force: true });

console.log(`Wrote public/sitemap.xml (${entries.length} URLs)`);
