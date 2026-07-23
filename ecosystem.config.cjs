/**
 * PM2 — production deploy without Docker (see deploy/PM2-DEPLOY.md).
 * Loads .env from project root. Run after: npm run build:prod
 */
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv(path.join(root, ".env"));

const appName = process.env.PM2_APP_NAME || "deva-safety-nets";
const port = Number(process.env.APP_PORT || 3002);
const heap = Number(process.env.NODE_HEAP_MB || 384);
const standalone = path.join(root, ".next/standalone");

module.exports = {
  apps: [
    {
      name: appName,
      cwd: standalone,
      script: "server.js",
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: `${heap + 128}M`,
      kill_timeout: 5000,
      listen_timeout: 15000,
      node_args: `--max-old-space-size=${heap}`,
      env_production: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: port,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
};
