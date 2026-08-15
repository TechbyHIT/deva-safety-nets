"use client";

import dynamic from "next/dynamic";
import { MobileCTA } from "@/components/layout/MobileCTA";

const NavigationProgress = dynamic(
  () => import("./NavigationProgress").then((m) => m.NavigationProgress),
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

/** Non-critical client features — loaded after idle deferral in layout. */
export function ClientEnhancements() {
  return (
    <>
      <NavigationProgress />
      <PrefetchRoutes />
      <MobileCTA />
      <FloatingCTAs />
    </>
  );
}
