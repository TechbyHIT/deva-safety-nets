import fs from "fs";

const src = fs.readFileSync("prisma/seed.ts", "utf8");
const start = src.indexOf("type ServiceSeed");
const end = src.indexOf("// ---------------------------------------------------------------------------\n// General FAQ");
const block = src.slice(start, end);

const header = `import { GENERAL_FAQS } from "../seed-content/general-faqs";

export const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type FaqScope = "GENERAL" | "SERVICE" | "INSTALLATION" | "MAINTENANCE" | "SAFETY" | "PRICING";

`;

fs.mkdirSync("src/lib/static-data", { recursive: true });
fs.writeFileSync("src/lib/static-data/seed-data.ts", header + block);
console.log("Wrote src/lib/static-data/seed-data.ts");
