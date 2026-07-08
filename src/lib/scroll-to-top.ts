/** Instant scroll to page top — used on every internal navigation. */
export function scrollPageToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Repeat scroll so Next.js / browser scroll restoration cannot win. */
export function forceScrollPageToTop() {
  scrollPageToTop();
  requestAnimationFrame(() => {
    scrollPageToTop();
    requestAnimationFrame(scrollPageToTop);
  });
  window.setTimeout(scrollPageToTop, 0);
  window.setTimeout(scrollPageToTop, 50);
}

export function isFullPageInternalLink(anchor: HTMLAnchorElement): boolean {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  try {
    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin) return false;
    const next = url.pathname + url.search;
    const current = window.location.pathname + window.location.search;
    return next !== current;
  } catch {
    return false;
  }
}
