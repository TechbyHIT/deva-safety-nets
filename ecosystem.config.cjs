/**
 * PM2 process definition for running the Next.js app on a VPS.
 *
 * Deploy flow (see README "Deployment" section):
 *   npm ci
 *   npm run build
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 save && pm2 startup   # persist across reboots
 *
 * Notes:
 * - Uses `next start` (works with output: "standalone"); Nginx (deploy/nginx.conf)
 *   terminates TLS and reverse-proxies to PORT below. Keep the app bound to
 *   127.0.0.1 so it is only reachable through Nginx/Cloudflare.
 * - `fork` mode with a single instance is the safe default: ISR writes to the
 *   on-disk `.next/cache`, and a single writer avoids cache races. To use more
 *   cores, put multiple instances behind Nginx `upstream` (they share the
 *   filesystem cache) rather than PM2 cluster mode.
 */
const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "deva-safety-nets",
      cwd: __dirname,
      script: path.join("node_modules", "next", "dist", "bin", "next"),
      args: "start",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      kill_timeout: 5000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      env_production: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
};
