"use client";

import dynamic from "next/dynamic";

const NavigationProgress = dynamic(
  () => import("./NavigationProgress").then((m) => m.NavigationProgress),
  { ssr: false },
);
const InstantPrefetch = dynamic(
  () => import("./InstantPrefetch").then((m) => m.InstantPrefetch),
  { ssr: false },
);
const PrefetchRoutes = dynamic(
  () => import("./PrefetchRoutes").then((m) => m.PrefetchRoutes),
  { ssr: false },
);
const FloatingCTAs = dynamic(
  () => import("./FloatingCTAs").then((m) => m.FloatingCTAs),
  { ssr: false },
);

/** Non-critical client features — loaded after first paint. */
export function ClientEnhancements() {
  return (
    <>
      <NavigationProgress />
      <InstantPrefetch />
      <PrefetchRoutes />
      <FloatingCTAs />
    </>
  );
}
