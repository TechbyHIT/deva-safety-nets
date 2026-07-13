/**
 * Build-time header logo variants — tiny WebP files for fast LCP/header paint.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "public", "logo.png");
const PUBLIC = path.join(ROOT, "public");
const WIDTHS = [256, 384, 512, 640];

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Logo not found: ${SOURCE}`);
    process.exit(1);
  }

  const meta = await sharp(SOURCE).metadata();
  if (!meta.width || !meta.height) {
    console.error("Could not read logo dimensions");
    process.exit(1);
  }

  for (const width of WIDTHS) {
    const out = path.join(PUBLIC, `logo-${width}.webp`);
    await sharp(SOURCE)
      .resize(width, null, { withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 88, effort: 4 })
      .toFile(out);
    console.log(`Wrote ${path.relative(ROOT, out)} (${width}w, ${fs.statSync(out).size} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
