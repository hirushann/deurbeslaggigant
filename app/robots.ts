import type { MetadataRoute } from "next";
import { site } from "@/lib/format";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/winkelwagen", "/favorieten", "/zoeken", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
