"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Thin top bar — shows immediately on internal link click, completes on route change. */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor?.href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      try {
        const url = new URL(anchor.href);
        if (url.origin !== window.location.origin) return;
        const next = url.pathname + url.search;
        const current = window.location.pathname + window.location.search;
        if (next !== current) {
          setDone(false);
          setActive(true);
        }
      } catch {
        /* ignore malformed href */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      if (active) {
        setDone(true);
        const hide = window.setTimeout(() => {
          setActive(false);
          setDone(false);
        }, 280);
        return () => window.clearTimeout(hide);
      }
    }
  }, [pathname, searchParams, active]);

  if (!active) return null;

  return (
    <div
      className={`nav-progress ${done ? "nav-progress--done" : ""}`}
      role="progressbar"
      aria-hidden
    />
  );
}
