/** Minimal footer placeholder while catalog data streams in. */
export function FooterShell() {
  return (
    <footer className="site-footer" aria-hidden>
      <div className="footer-cta">
        <div className="container-page footer-cta__inner">
          <div className="h-12 w-full max-w-md animate-pulse rounded-lg bg-white/10" />
          <div className="h-11 w-full max-w-xs animate-pulse rounded-full bg-white/10 sm:w-48" />
        </div>
      </div>
      <div className="footer-main">
        <div className="container-page footer-main__grid">
          <div className="footer-main__brand space-y-3">
            <div className="h-14 w-48 animate-pulse rounded-lg surface-subtle" />
            <div className="h-16 w-full max-w-sm animate-pulse rounded-lg surface-subtle" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded surface-subtle" />
              <div className="h-24 animate-pulse rounded-lg surface-subtle" />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
