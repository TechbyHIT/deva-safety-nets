#!/bin/bash
# After a successful standalone build: keep only runtime files.
# Safe for PM2 apps that run from .next/standalone/server.js
#
# Usage (from project root, after npm run build:prod):
#   bash deploy/lean-post-build.sh
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { echo "[lean-post-build] $*"; }

if [ ! -f .next/standalone/server.js ]; then
  echo "Missing .next/standalone/server.js — run build:prod first" >&2
  exit 1
fi

before=$(du -sm . 2>/dev/null | awk '{print $1}')

# Build caches — not needed at runtime (standalone is self-contained)
log "remove Next build cache / intermediates (keep standalone)"
rm -rf .next/cache \
  .next/types \
  .next/diagnostics \
  .next/trace \
  .next/react-loadable-manifest.json \
  .next/build-manifest.json \
  .next/app-build-manifest.json \
  .next/package.json \
  .next/routes-manifest.json 2>/dev/null || true

# Keep .next/standalone (+ its nested .next/static). Drop other .next trees if present.
# Do NOT delete .next/standalone
if [ -d .next/server ]; then
  log "remove .next/server (copied/traced into standalone)"
  rm -rf .next/server
fi

# node_modules only needed for the next rebuild — runtime uses standalone/node_modules
if [ "${LEAN_KEEP_NODE_MODULES:-0}" != "1" ]; then
  if [ -d node_modules ]; then
    log "remove project node_modules (re-install with npm ci on next deploy)"
    rm -rf node_modules
  fi
fi

# npm / turbo / ts caches
rm -rf .npm _tscbuildinfo *.tsbuildinfo .turbo 2>/dev/null || true
rm -rf /tmp/deva-* 2>/dev/null || true

# Sitemap shards stay in public/sitemaps (needed at runtime). Do not delete.

after=$(du -sm . 2>/dev/null | awk '{print $1}')
log "project size ~${before}MB → ~${after}MB (standalone kept)"
du -sh .next/standalone public 2>/dev/null || true
