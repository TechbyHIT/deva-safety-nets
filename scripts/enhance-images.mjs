/**
 * Multi-pass image enhancement for production photos:
 * auto-orient → Lanczos upscale (small files) → contrast normalize → edge sharpen.
 * Run after `npm run images:sync`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const LOGO_FILES = new Set(["deva-logo.jpg", "deva-logo.jpeg", "deva-logo.png"]);

const MIN_OUTPUT_WIDTH = 1200;
const MAX_OUTPUT_WIDTH = 1920;
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

async function enhanceFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const tmp = `${filePath}.enhancing`;

  const input = sharp(filePath, { failOn: "none" });
  const meta = await input.metadata();
  if (!meta.width || !meta.height) return false;

  let pipeline = sharp(filePath, { failOn: "none" }).rotate();

  if (meta.width < MIN_OUTPUT_WIDTH) {
    const target = Math.min(MAX_OUTPUT_WIDTH, Math.max(MIN_OUTPUT_WIDTH, Math.round(meta.width * 1.25)));
    pipeline = pipeline.resize({
      width: target,
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    });
  } else if (meta.width > MAX_OUTPUT_WIDTH) {
    pipeline = pipeline.resize({
      width: MAX_OUTPUT_WIDTH,
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    });
  }

  pipeline = pipeline
    .normalise({ lower: 2, upper: 98 })
    .sharpen({ sigma: 1.15, m1: 1.35, m2: 0.65, x1: 2, y2: 10, y3: 20 });

  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 6, quality: 95 }).toFile(tmp);
  } else if (ext === ".webp") {
    await pipeline.webp({ quality: 94, effort: 5 }).toFile(tmp);
  } else {
    await pipeline.jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:2:0" }).toFile(tmp);
  }

  fs.renameSync(tmp, filePath);
  return true;
}

async function walk(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await walk(full);
      continue;
    }
    if (!IMAGE_EXT.test(entry.name) || LOGO_FILES.has(entry.name)) continue;
    try {
      if (await enhanceFile(full)) {
        count++;
        console.log(`Enhanced: ${path.relative(IMAGES_DIR, full)}`);
      }
    } catch (err) {
      console.warn(`Skip ${full}: ${err.message}`);
    }
  }
  return count;
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("No public/images — run npm run images:sync first");
    process.exit(1);
  }
  const total = await walk(IMAGES_DIR);
  console.log(`\nEnhanced ${total} production photos`);
}

main();
