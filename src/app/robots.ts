import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /privacy and /terms are intentionally NOT disallowed here: they carry a
        // `noindex, follow` meta directive (see their page metadata). Blocking them
        // in robots would stop crawlers reading that directive and leak link equity.
        disallow: ["/api/", "/*?*"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
