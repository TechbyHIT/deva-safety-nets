import { site } from "@/lib/site";
import { SiteNav } from "@/components/SiteNav";
import { STATIC_CITIES } from "@/lib/static-nav";

export function Header() {
  return (
    <SiteNav
      cities={STATIC_CITIES.map((c) => ({ slug: c.slug, name: c.name, featured: c.featured }))}
      phone={site.phone}
    />
  );
}
