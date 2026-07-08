import type { MetadataRoute } from "next";
import { getAllSitemapEntries } from "@/lib/sitemap-urls";

export const revalidate = 43200;

/** Single sitemap at /sitemap.xml — 46k+ URLs, under the 50k spec limit. */
export default function sitemap(): MetadataRoute.Sitemap {
  return getAllSitemapEntries().map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
