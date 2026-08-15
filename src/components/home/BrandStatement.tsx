export function BrandStatement({
  serviceCount,
  areaCount,
}: {
  serviceCount: number;
  areaCount: number;
}) {
  return (
    <section className="brand-statement container-page">
      <p className="eyebrow mx-auto">The Deva standard</p>
      <h2 className="brand-statement__title mt-4">
        Safety engineered as architecture — not an afterthought.
      </h2>
      <p className="brand-statement__body">
        From SS invisible grills to HDPE balcony nets, every installation is measured for Kerala humidity,
        monsoon load and society aesthetics. {serviceCount}+ service lines across {areaCount}+ localities —
        one local team from survey to warranty handover.
      </p>
    </section>
  );
}
