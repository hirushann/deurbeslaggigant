import { getProducts } from "@/lib/woo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 80);
  const limit = Math.min(Number(searchParams.get("limit")) || 24, 48);
  if (q.length < 2) return Response.json([]);
  const { products } = await getProducts({ search: q.toLowerCase(), perPage: limit });
  return Response.json(products);
}
