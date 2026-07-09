process.env.SKIP_CATALOG_HYDRATE = "1";

const { staticCatalog } = await import("../src/lib/static-data/build-catalog.ts");
const { serializeCatalog } = await import("../src/lib/static-data/catalog-snapshot.ts");
const { writeFileSync } = await import("node:fs");
const { dirname, join } = await import("node:path");
const { fileURLToPath } = await import("node:url");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "src/lib/static-data/catalog.snapshot.json");

const t0 = Date.now();
const snapshot = serializeCatalog(staticCatalog);
const json = JSON.stringify(snapshot);
writeFileSync(out, json);
writeFileSync(
  join(root, "src/lib/static-data/priority-intent-links.json"),
  JSON.stringify(snapshot.priorityIntentLinks),
);
const ms = Date.now() - t0;
const kb = Math.round(Buffer.byteLength(json) / 1024);
console.log(`Wrote ${out}`);
console.log(`services=${staticCatalog.services.length} size=${kb}KB buildMs=${ms}`);
