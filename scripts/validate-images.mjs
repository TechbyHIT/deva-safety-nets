/**
 * Verify every path in image-manifest.ts exists under public/.
 * Run: node scripts/validate-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST = path.join(ROOT, "src", "lib", "image-manifest.ts");
const PUBLIC = path.join(ROOT, "public");

const text = fs.readFileSync(MANIFEST, "utf8");
const paths = [...new Set([...text.matchAll(/"(\/images\/[^"]+)"/g)].map((m) => m[1]))];

const missing = [];
for (const src of paths) {
  const file = path.join(PUBLIC, src.replace(/^\//, ""));
  if (!fs.existsSync(file)) missing.push(src);
}

if (missing.length) {
  console.error(`Missing ${missing.length} of ${paths.length} manifest images:\n`);
  for (const m of missing) console.error(`  ${m}`);
  process.exit(1);
}

console.log(`OK — all ${paths.length} manifest image paths exist on disk.`);
