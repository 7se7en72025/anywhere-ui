import type { MetadataRoute } from "next";
import { components } from "@/lib/registry";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, priority: 1 },
    { url: `${siteUrl}/components`, lastModified, priority: 0.9 },
    ...components.map((item) => ({
      url: `${siteUrl}/components/${item.name}`,
      lastModified,
      priority: 0.7,
    })),
  ];
}
