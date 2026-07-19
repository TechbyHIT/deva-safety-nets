/**
 * Copy static assets into .next/standalone for PM2 / direct Node deploy.
 * Docker copies these in the Dockerfile — this script is for non-Docker VPS.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next/standalone");
const serverJs = path.join(standalone, "server.js");

if (!fs.existsSync(serverJs)) {
  console.error("Missing .next/standalone/server.js — run npm run build first.");
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

console.log("Standalone bundle ready for PM2:", standalone);
