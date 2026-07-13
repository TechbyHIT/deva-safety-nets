import fs from "node:fs";
import path from "node:path";

const RUNTIME = new Set([
  "src/app/services/[service]/page.tsx",
  "src/app/services/[service]/[city]/page.tsx",
  "src/app/services/[service]/[city]/[area]/page.tsx",
  "src/app/services/[service]/for/[propertyType]/page.tsx",
  "src/app/property-types/[propertyType]/[city]/page.tsx",
]);

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name === "page.tsx") acc.push(p.split(path.sep).join("/"));
  }
  return acc;
}

function insertExport(src, exportLine) {
  const anchor = src.search(/^export (const metadata|async function generateMetadata|default )/m);
  if (anchor >= 0) return src.slice(0, anchor) + exportLine + "\n" + src.slice(anchor);
  return src + "\n" + exportLine + "\n";
}

for (const file of walk("src/app")) {
  let src = fs.readFileSync(file, "utf8");
  const isRuntime = RUNTIME.has(file);

  src = src.replace(/^import \{ (STATIC_PAGE|RUNTIME_PAGE) \} from "@\/lib\/page-runtime";\n/gm, "");
  src = src.replace(/^export const revalidate = \d+;\s*\n/gm, "");
  src = src.replace(/^export const dynamic = (STATIC_PAGE|RUNTIME_PAGE)\.dynamic;\s*\n/gm, "");

  const dynamicLine = isRuntime
    ? 'export const dynamic = "force-dynamic";'
    : 'export const dynamic = "force-static";';

  if (!src.includes('export const dynamic = "force-')) {
    src = insertExport(src, dynamicLine);
  } else {
    src = src.replace(/^export const dynamic = "[^"]+";/m, dynamicLine);
  }

  if (isRuntime) {
    src = src.replace(/^export const dynamicParams = true;\s*\n/gm, "");
    src = src.replace(/^export async function generateStaticParams\(\)[\s\S]*?^}\s*\n/gm, "");
    src = src.replace(/^export function generateStaticParams\(\)[\s\S]*?^}\s*\n/gm, "");
  } else if (/generateStaticParams/.test(src)) {
    if (/dynamicParams/.test(src)) {
      src = src.replace(/^export const dynamicParams = true;\s*\n/gm, 'export const dynamicParams = false;\n');
    } else {
      const gsp = src.search(/^export (async )?function generateStaticParams/m);
      if (gsp >= 0) src = src.slice(0, gsp) + 'export const dynamicParams = false;\n\n' + src.slice(gsp);
    }
  }

  fs.writeFileSync(file, src);
  console.log(file, isRuntime ? "runtime" : "static");
}

console.log("done");
