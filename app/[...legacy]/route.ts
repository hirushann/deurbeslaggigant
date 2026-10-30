import { NextResponse, type NextRequest } from "next/server";
import { getCategory, getProduct } from "@/lib/woo";

/**
 * URLs from the old WordPress site. Products lived at `/{product}/` and categories at
 * `/{parent}/{child}/`, so anything no other route matches is looked up here and
 * permanently redirected to its new address. Unknown paths go to search.
 */
export async function GET(request: NextRequest, { params }: RouteContext<"/[...legacy]">) {
  const segments = (await params).legacy.filter(Boolean);
  const slug = decodeURIComponent(segments.at(-1) ?? "").toLowerCase();
  const to = (path: string, status = 308) => NextResponse.redirect(new URL(path, request.url), status);

  if (segments.length === 1 && (await getProduct(slug))) return to(`/product/${slug}`);
  if (await getCategory(slug)) return to(`/categorie/${slug}`);
  return to(`/zoeken?q=${encodeURIComponent(slug.replace(/-/g, " "))}`, 307);
}
