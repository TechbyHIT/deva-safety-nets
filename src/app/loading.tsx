/** Instant skeleton — paints in <100ms while route content streams. */
export default function Loading() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-label="Loading page">
      <div className="page-skeleton__hero" />
      <div className="container-page page-skeleton__body">
        <div className="page-skeleton__line page-skeleton__line--lg" />
        <div className="page-skeleton__line" />
        <div className="page-skeleton__line page-skeleton__line--sm" />
        <div className="page-skeleton__grid">
          <div className="page-skeleton__card" />
          <div className="page-skeleton__card" />
          <div className="page-skeleton__card" />
          <div className="page-skeleton__card" />
        </div>
      </div>
    </div>
  );
}
