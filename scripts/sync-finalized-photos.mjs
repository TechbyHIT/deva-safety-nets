/**
 * Copy production photos from all FINIALIZED PHOTOS folders into public/images,
 * keep only high-quality unique images, and generate image-manifest.ts.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEST = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "lib", "image-manifest.ts");

const SOURCE_ROOTS = [
  "FINIALIZED PHOTOS",
  "FINIALIZED PHOTOS - 1",
  "FINIALIZED PHOTOS - 2",
  "FINIALIZED PHOTOS - 3",
  "FINIALIZED PHOTOS - 4",
];

const FOLDER_MAP = {
  "invisible grill balcony": "invisible-grill-balcony",
  "invisible grill window": "invisible-grill-window",
  "safety nets balcony": "safety-nets-balcony",
  "children safety nets": "child-safety-nets",
  "pet safety nets": "pet-safety-nets",
  "duct area nets": "duct-area-nets",
  "mosquito nets": "mosquito-nets",
  "cricket nets": "cricket-nets",
  "cloth hangers": "cloth-hangers",
  spikes: "bird-spikes",
};

const LOGO_FILES = ["deva-logo.jpg", "deva-logo.jpeg", "deva-logo.png"];

/** UI mockups, template banners and competitor placeholders — never publish these. */
const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /academy-sports/i,
  /mockup/i,
  /template/i,
  /glory/i,
  /\bsiri\b/i,
  /banner.?upload/i,
  /home.?hero/i,
  /upload.?area/i,
];

function isPlaceholderFile(fileName) {
  const base = fileName.replace(/\.[^.]+$/, "");
  return PLACEHOLDER_PATTERNS.some((re) => re.test(base) || re.test(fileName));
}

/** High-quality thresholds — skips thumbnails and low-resolution phone snaps. */
const HQ = {
  minWidth: 800,
  minHeight: 500,
  minPixels: 500_000,
  minBytes: 80 * 1024,
  autoPassBytes: 400 * 1024,
};

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

function slugify(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeCategoryFolder(folderName) {
  return folderName.replace(/\s*-\s*\d+\s*$/i, "").trim().toLowerCase();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readImageDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 24) return null;

  if (buf[0] === 0x89 && buf[1] === 0x50) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      if (marker === 0xc0 || marker === 0xc2 || marker === 0xc1) {
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7),
        };
      }
      const len = buf.readUInt16BE(offset + 2);
      if (len < 2) break;
      offset += 2 + len;
    }
  }

  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X" && buf.length >= 30) {
      return {
        width: 1 + buf.readUIntLE(24, 3),
        height: 1 + buf.readUIntLE(27, 3),
      };
    }
    if (chunk === "VP8L" && buf.length >= 25) {
      const bits = buf.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }
  }

  return null;
}

function qualityScore(filePath, stats) {
  const dims = readImageDimensions(filePath);
  const pixels = dims ? dims.width * dims.height : 0;
  return stats.size + pixels * 0.25;
}

function isHighQuality(filePath, stats) {
  if (stats.size >= HQ.autoPassBytes) return true;

  const dims = readImageDimensions(filePath);
  if (dims) {
    const pixels = dims.width * dims.height;
    return (
      dims.width >= HQ.minWidth &&
      dims.height >= HQ.minHeight &&
      pixels >= HQ.minPixels
    );
  }

  return stats.size >= HQ.minBytes;
}

function fileHash(filePath) {
  return crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("hex");
}

function backupLogos() {
  const saved = [];
  for (const name of LOGO_FILES) {
    const src = path.join(DEST, name);
    if (fs.existsSync(src)) saved.push({ name, buffer: fs.readFileSync(src) });
  }
  return saved;
}

function clearDestination() {
  const logos = backupLogos();
  if (!fs.existsSync(DEST)) {
    ensureDir(DEST);
    return logos;
  }
  for (const entry of fs.readdirSync(DEST, { withFileTypes: true })) {
    const full = path.join(DEST, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    } else if (!LOGO_FILES.includes(entry.name)) {
      fs.unlinkSync(full);
    }
  }
  return logos;
}

function restoreLogos(logos) {
  ensureDir(DEST);
  for (const { name, buffer } of logos) {
    fs.writeFileSync(path.join(DEST, name), buffer);
  }
}

function collectCandidates() {
  /** @type {Map<string, Map<string, { filePath: string, score: number, ext: string, base: string }>>} */
  const byCategory = new Map();

  for (const sourceRoot of SOURCE_ROOTS) {
    const rootPath = path.join(ROOT, sourceRoot);
    if (!fs.existsSync(rootPath)) {
      console.warn(`Skip missing source root: ${sourceRoot}`);
      continue;
    }

    for (const entry of fs.readdirSync(rootPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const normalized = normalizeCategoryFolder(entry.name);
      const destKey = FOLDER_MAP[normalized];
      if (!destKey) {
        console.warn(`Unknown folder "${entry.name}" in ${sourceRoot}`);
        continue;
      }

      const srcDir = path.join(rootPath, entry.name);
      if (!byCategory.has(destKey)) byCategory.set(destKey, new Map());

      const bucket = byCategory.get(destKey);

      for (const file of fs.readdirSync(srcDir)) {
        if (!IMAGE_EXT.test(file)) continue;
        if (isPlaceholderFile(file)) {
          console.warn(`  skip placeholder: ${file}`);
          continue;
        }

        const filePath = path.join(srcDir, file);
        const stats = fs.statSync(filePath);
        if (!isHighQuality(filePath, stats)) continue;

        const hash = fileHash(filePath);
        const score = qualityScore(filePath, stats);
        const ext = path.extname(file).toLowerCase();
        const base = slugify(file) || "photo";

        const existing = bucket.get(hash);
        if (!existing || score > existing.score) {
          bucket.set(hash, { filePath, score, ext, base });
        }
      }
    }
  }

  return byCategory;
}

function copyCategory(destKey, entries) {
  const destDir = path.join(DEST, destKey);
  ensureDir(destDir);
  const usedNames = new Set();
  const webPaths = [];

  const sorted = [...entries.values()].sort((a, b) => b.score - a.score);

  for (const item of sorted) {
    let finalName = `${item.base}${item.ext}`;
    let n = 2;
    while (usedNames.has(finalName)) {
      finalName = `${item.base}-${n}${item.ext}`;
      n++;
    }
    usedNames.add(finalName);
    fs.copyFileSync(item.filePath, path.join(destDir, finalName));
    webPaths.push(`/images/${destKey}/${finalName}`);
  }

  return webPaths;
}

function pickLogoPath(logos) {
  const preferred = logos.find((l) => l.name === "deva-logo.jpg") ?? logos[0];
  return preferred ? `/images/${preferred.name}` : "/images/deva-logo.jpg";
}

function pickPageImage(folders, key, index = 0, fallback) {
  return folders[key]?.[index] ?? folders[key]?.[0] ?? fallback;
}

function main() {
  const logos = clearDestination();
  ensureDir(DEST);

  const byCategory = collectCandidates();
  /** @type {Record<string, string[]>} */
  const folders = {};
  /** @type {string[]} */
  const all = [];

  let skippedLowQuality = 0;

  for (const [destKey, bucket] of byCategory.entries()) {
    const paths = copyCategory(destKey, bucket);
    folders[destKey] = paths;
    all.push(...paths);
    console.log(`${destKey}: ${paths.length} HQ photos`);
  }

  all.sort();
  restoreLogos(logos);
  const logoPath = pickLogoPath(logos);

  const galleryOrder = [
    "safety-nets-balcony",
    "invisible-grill-balcony",
    "invisible-grill-window",
    "child-safety-nets",
    "pet-safety-nets",
    "cricket-nets",
    "duct-area-nets",
    "cloth-hangers",
    "bird-spikes",
    "mosquito-nets",
  ];

  const galleryImages = galleryOrder.flatMap((key) => folders[key] ?? []).sort();
  const fallback = all[0] ?? logoPath;

  const manifestBody = `/** Auto-generated by scripts/sync-finalized-photos.mjs — do not edit manually. */
export const IMAGE_FOLDERS = ${JSON.stringify(folders, null, 2)} as const;

export type ImageFolderKey = keyof typeof IMAGE_FOLDERS;

export const ALL_IMAGES: readonly string[] = ${JSON.stringify(all, null, 2)} as const;

export const PAGE_IMAGES = {
  logo: "${logoPath}",
  hero: "${pickPageImage(folders, "invisible-grill-balcony", 0, fallback)}",
  about: "${pickPageImage(folders, "invisible-grill-balcony", 1, fallback)}",
  contact: "${pickPageImage(folders, "cloth-hangers", 0, fallback)}",
  process: "${pickPageImage(folders, "invisible-grill-balcony", 2, fallback)}",
  testimonials: "${pickPageImage(folders, "child-safety-nets", 0, fallback)}",
  cta: "${pickPageImage(folders, "invisible-grill-balcony", 3, fallback)}",
  safety: "${pickPageImage(folders, "child-safety-nets", 1, fallback)}",
  why: "${pickPageImage(folders, "invisible-grill-balcony", 4, fallback)}",
  gallery: "${pickPageImage(folders, "safety-nets-balcony", 0, fallback)}",
  projects: "${pickPageImage(folders, "safety-nets-balcony", 1, fallback)}",
} as const;

export const GALLERY_IMAGES: readonly string[] = ${JSON.stringify(galleryImages, null, 2)} as const;

export const CLIENT_LOGOS: readonly string[] = ${JSON.stringify(
    [
      folders["invisible-grill-balcony"]?.[0],
      folders["safety-nets-balcony"]?.[0],
      folders["child-safety-nets"]?.[0],
      folders["cricket-nets"]?.[0],
      folders["cloth-hangers"]?.[0],
      folders["bird-spikes"]?.[0],
    ].filter(Boolean),
    null,
    2,
  )} as const;
`;

  fs.writeFileSync(MANIFEST, manifestBody, "utf8");

  console.log(`\nSources: ${SOURCE_ROOTS.join(", ")}`);
  console.log(`Total HQ unique photos: ${all.length}`);
  console.log(`Logo: ${logoPath}`);
  console.log(`Manifest: ${path.relative(ROOT, MANIFEST)}`);
  if (skippedLowQuality) console.log(`Skipped low-quality: ${skippedLowQuality}`);
}

main();
