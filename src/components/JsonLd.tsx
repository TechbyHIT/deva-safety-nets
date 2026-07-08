"use client";

import { useServerInsertedHTML } from "next/navigation";

/**
 * Renders JSON-LD via SSR stream injection (React 19 safe — no script in client tree).
 */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  const json =
    items.length > 0
      ? JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c")
      : null;

  useServerInsertedHTML(() => {
    if (!json) return null;
    return (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
    );
  });

  return null;
}
