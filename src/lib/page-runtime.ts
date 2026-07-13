/**
 * Route runtime policy — prevents ISR / on-disk cache growth on VPS.
 *
 * Next.js requires literal strings in route files. Use:
 *   export const dynamic = "force-static";   // pre-built pages
 *   export const dynamic = "force-dynamic";    // combo / keyword pages
 */

/** Pre-built at deploy; never revalidated to disk. */
export const STATIC_DYNAMIC = "force-static" as const;

/** Render from in-memory catalog; no ISR cache files. */
export const RUNTIME_DYNAMIC = "force-dynamic" as const;
