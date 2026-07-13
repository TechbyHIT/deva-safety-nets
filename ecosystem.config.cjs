/**
 * PM2 process definition — optional non-Docker deploy path.
 * Canonical production path is Docker standalone (see docker-compose.yml).
 */
const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "deva-safety-nets",
      cwd: __dirname,
      script: path.join(".next", "standalone", "server.js"),
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      kill_timeout: 5000,
      listen_timeout: 10000,
      node_args: "--max-old-space-size=256",
      env_production: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
};
