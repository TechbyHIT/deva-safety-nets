/**
 * Copy static assets into .next/standalone for PM2 / direct Node deploy.
 * Docker copies these in the Dockerfile — this script is for non-Docker VPS.
 *
 * Also recovers when Next mis-detects workspace root (parent package-lock.json)
 * and writes standalone to ../.next/standalone instead of ./.next/standalone.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next/standalone");
const serverJs = path.join(standalone, "server.js");
const parentStandalone = path.join(root, "..", ".next", "standalone");
const parentServerJs = path.join(parentStandalone, "server.js");

function recoverMisplacedStandalone() {
  if (fs.existsSync(serverJs)) return;
  if (!fs.existsSync(parentServerJs)) return;

  console.warn(
    "[prepare-standalone] Found standalone under parent .next — moving into project .next/standalone",
  );
  fs.mkdirSync(path.join(root, ".next"), { recursive: true });
  fs.rmSync(standalone, { recursive: true, force: true });
  fs.renameSync(parentStandalone, standalone);
}

recoverMisplacedStandalone();

if (!fs.existsSync(serverJs)) {
  console.error("Missing .next/standalone/server.js — run npm run build first.");
  console.error("If Next warned about multiple lockfiles, remove /root/package-lock.json (or parent lockfile) and rebuild.");
  process.exit(1);
}

const pairs = [
  [path.join(root, ".next/static"), path.join(standalone, ".next/static")],
  [path.join(root, "public"), path.join(standalone, "public")],
];

for (const [src, dest] of pairs) {
  if (!fs.existsSync(src)) {
    console.error(`Missing ${src}`);
    process.exit(1);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${path.relative(root, src)} → ${path.relative(root, dest)}`);
}

// Header logo must exist in standalone public (PM2 serves from here)
const logoFiles = ["logo.png", "logo-256.webp", "logo-384.webp", "logo-512.webp", "logo-640.webp"];
for (const name of logoFiles) {
  const dest = path.join(standalone, "public", name);
  const src = path.join(root, "public", name);
  if (!fs.existsSync(src)) {
    console.warn(`[prepare-standalone] WARN missing ${name} in public/`);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
const logoOk = fs.existsSync(path.join(standalone, "public", "logo.png"));
console.log(logoOk ? "Logo OK in standalone/public/logo.png" : "ERROR: logo.png missing in standalone");
if (!logoOk) process.exit(1);

console.log("Standalone bundle ready for PM2:", standalone);
