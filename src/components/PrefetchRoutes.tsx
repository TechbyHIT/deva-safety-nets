"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WARM_ROUTES, warmServicePaths } from "@/lib/prefetch-routes";

/** Prefetch main routes + top services after idle so clicks feel instant. */
export function PrefetchRoutes() {
  const router = useRouter();

  useEffect(() => {
    const paths = [...WARM_ROUTES, ...warmServicePaths()];

    const run = () => {
      for (const path of paths) router.prefetch(path);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = globalThis.setTimeout(run, 3500);
    return () => globalThis.clearTimeout(t);
  }, [router]);

  return null;
}
