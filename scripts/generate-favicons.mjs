/**
 * Generate favicon + PWA icons from public/images/deva-logo.jpg.
 * Crops the left emblem (square) for small icon sizes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOGO = path.join(ROOT, "public", "images", "deva-logo.jpg");
const APP_DIR = path.join(ROOT, "src", "app");
const PUBLIC_DIR = path.join(ROOT, "public");

const OUTPUTS = [
  { path: path.join(APP_DIR, "icon.png"), size: 32 },
  { path: path.join(APP_DIR, "apple-icon.png"), size: 180 },
  { path: path.join(PUBLIC_DIR, "icon-192.png"), size: 192 },
  { path: path.join(PUBLIC_DIR, "icon-512.png"), size: 512 },
  { path: path.join(PUBLIC_DIR, "favicon.ico"), size: 32 },
];

async function main() {
  if (!fs.existsSync(LOGO)) {
    console.error(`Logo not found: ${LOGO}`);
    process.exit(1);
  }

  const meta = await sharp(LOGO).metadata();
  if (!meta.width || !meta.height) {
    console.error("Could not read logo dimensions");
    process.exit(1);
  }

  const side = Math.min(meta.width, meta.height);
  const emblem = sharp(LOGO).extract({
    left: 0,
    top: Math.max(0, Math.floor((meta.height - side) / 2)),
    width: side,
    height: side,
  });

  for (const { path: out, size } of OUTPUTS) {
    await emblem
      .clone()
      .resize(size, size, { fit: "cover", kernel: sharp.kernel.lanczos3 })
      .toFormat(out.endsWith(".ico") ? "png" : "png", { compressionLevel: 9 })
      .toFile(out);
    console.log(`Wrote ${path.relative(ROOT, out)} (${size}x${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
