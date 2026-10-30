import type { MetadataRoute } from "next";
import { site } from "@/lib/format";
import { getAllCategories, getBrands } from "@/lib/woo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/merken", "/contact", "/offerte-aanvragen", "/retourneren"];
  const [categories, brands] = await Promise.all([getAllCategories(), getBrands()]);
  // Product URLs (11k+) belong in a generated product sitemap; see README.
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...categories.filter((c) => c.count > 0).map((c) => ({ url: `${site.url}/categorie/${c.slug}` })),
    ...brands.filter((b) => b.count > 0).map((b) => ({ url: `${site.url}/merken/${b.slug}` })),
  ];
}
