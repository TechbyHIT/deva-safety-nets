"use client";

import dynamic from "next/dynamic";

const GlobalSeoIntentLinks = dynamic(
  () => import("./GlobalSeoIntentLinks").then((m) => m.GlobalSeoIntentLinks),
  { ssr: false },
);

/** SEO intent links — load after first paint so every page shell stays fast. */
export function DeferredGlobalSeoIntentLinks() {
  return <GlobalSeoIntentLinks />;
}
