"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const prefetched = new Set<string>();

function queuePrefetch(router: ReturnType<typeof useRouter>, path: string) {
  if (!path || path === "#" || prefetched.has(path)) return;
  prefetched.add(path);
  router.prefetch(path);
}

function pathFromAnchor(anchor: HTMLAnchorElement): string | null {
  try {
    const url = new URL(anchor.href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname + url.search;
  } catch {
    return null;
  }
}

/** Prefetch internal links on hover and when they enter the viewport. */
export function InstantPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const observed = new WeakSet<HTMLAnchorElement>();
    let scanScheduled = false;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const path = pathFromAnchor(entry.target as HTMLAnchorElement);
          if (path) queuePrefetch(router, path);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "200px" },
    );

    const scanLinks = () => {
      scanScheduled = false;
      document.querySelectorAll<HTMLAnchorElement>("a[href^='/']").forEach((anchor) => {
        if (observed.has(anchor)) return;
        observed.add(anchor);
        observer.observe(anchor);
      });
    };

    const scheduleScan = () => {
      if (scanScheduled) return;
      scanScheduled = true;
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(scanLinks, { timeout: 1200 });
      } else {
        globalThis.setTimeout(scanLinks, 16);
      }
    };

    const onPointerDown = (e: Event) => {
      const anchor = (e.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const path = pathFromAnchor(anchor);
      if (path) queuePrefetch(router, path);
    };

    const onPointerOver = (e: Event) => {
      const anchor = (e.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const path = pathFromAnchor(anchor);
      if (path) queuePrefetch(router, path);
    };

    const start = () => {
      if (started) return;
      started = true;
      document.addEventListener("pointerdown", onPointerDown, { passive: true });
      document.addEventListener("mouseover", onPointerOver, { passive: true });
      mo.observe(document.body, { childList: true, subtree: true });
    };

    const mo = new MutationObserver(scheduleScan);

    const idleStart = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(start, { timeout: 4000 });
      } else {
        globalThis.setTimeout(start, 3000);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(idleStart);
    });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("mouseover", onPointerOver);
      mo.disconnect();
      observer.disconnect();
    };
  }, [router]);

  return null;
}
