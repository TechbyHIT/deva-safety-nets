"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ClientEnhancements = dynamic(
  () => import("./ClientEnhancements").then((m) => m.ClientEnhancements),
  { ssr: false },
);

/** Non-critical UI — mounts after idle so LCP is not blocked. */
export function DeferredClientEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 6000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = globalThis.setTimeout(run, 3000);
    return () => globalThis.clearTimeout(t);
  }, []);

  return ready ? <ClientEnhancements /> : null;
}
