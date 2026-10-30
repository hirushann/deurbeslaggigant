/**
 * Read-only access to the live WooCommerce catalogue on deurbeslaggigant.nl
 * through the public Store API. Every call is cached by Next.js, so pages
 * stay fast while prices and stock keep up with WordPress.
 */
import { cacheLife, cacheTag } from "next/cache";
import { decodeEntities } from "./format";
import type { Brand, Category, Product, ProductSummary } from "./types";

const API = "https://deurbeslaggigant.nl/wp-json/wc/store/v1";
/** WooCommerce's catch-all category; hidden from navigation. */
const HIDDEN_CATEGORIES = new Set(["uncategorized"]);

type ApiImage = { src: string; alt: string };
type ApiTerm = { id: number; name: string; slug: string };
type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  type: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: {
    price: string;
    regular_price: string;
    currency_minor_unit: number;
    price_range: { min_amount: string; max_amount: string } | null;
  };
  images: ApiImage[];
  categories: ApiTerm[];
  brands?: ApiTerm[];
  attributes: { name: string; has_variations: boolean; terms: { name: string }[] }[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  stock_availability: { text: string; class: string };
};
type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: { src: string } | null;
};

/*
 * The WordPress host is shared hosting and answers bursts with 508 "resource
 * limit reached". Keep a few requests in flight per process and retry with backoff.
 */
const MAX_IN_FLIGHT = 3;
let inFlight = 0;
const waiting: (() => void)[] = [];

async function withSlot<T>(task: () => Promise<T>) {
  if (inFlight >= MAX_IN_FLIGHT) await new Promise<void>((resolve) => waiting.push(resolve));
  inFlight++;
  try {
    return await task();
  } finally {
    inFlight--;
    waiting.shift()?.();
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(path: string, params: Record<string, string | number | undefined> = {}) {
  const url = new URL(`${API}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  let res: Response | undefined;
  let networkError: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await sleep(1500 * 2 ** attempt);
    try {
      res = await withSlot(() => fetch(url, { headers: { Accept: "application/json" } }));
      networkError = undefined;
    } catch (error) {
      // The host sometimes drops connections under load; retry like a 5xx.
      networkError = error;
      continue;
    }
    if (res.ok || (res.status < 500 && res.status !== 429)) break;
  }
  if (networkError) throw new Error(`WooCommerce unreachable for ${url.pathname}${url.search}`, { cause: networkError });
  if (!res?.ok) throw new Error(`WooCommerce ${res?.status} for ${url.pathname}${url.search}`);
  return {
    data: (await res.json()) as T,
    total: Number(res.headers.get("x-wp-total") ?? 0),
    pages: Number(res.headers.get("x-wp-totalpages") ?? 1),
  };
}

const money = (minor: string | undefined, unit: number) =>
  minor ? Number(minor) / 10 ** unit : undefined;

function mapProduct(p: ApiProduct): Product {
  const unit = p.prices.currency_minor_unit;
  const price = money(p.prices.price_range?.min_amount ?? p.prices.price, unit);
  const regular = money(p.prices.regular_price, unit);
  return {
    id: p.id,
    slug: p.slug,
    name: decodeEntities(p.name),
    sku: /^\S{1,40}$/.test(p.sku) ? p.sku : "",
    type: p.type,
    price: price || undefined,
    regularPrice: p.on_sale && regular && price && regular > price ? regular : undefined,
    onSale: p.on_sale,
    images: p.images
      .filter((i) => !i.src.includes("woocommerce-placeholder"))
      .map((i) => ({ src: i.src, alt: decodeEntities(i.alt || p.name) })),
    shortDescriptionHtml: p.short_description,
    descriptionHtml: p.description,
    categories: p.categories.map((c) => ({ ...c, name: decodeEntities(c.name) })),
    // Products often carry a distributor brand too; list the one named in the title first.
    brands: (p.brands ?? [])
      .map((b) => ({ ...b, name: decodeEntities(b.name) }))
      .sort((a, b) => Number(p.name.toLowerCase().includes(b.name.toLowerCase())) - Number(p.name.toLowerCase().includes(a.name.toLowerCase()))),
    specs: p.attributes
      .filter((a) => !a.has_variations && a.terms.length)
      .map((a) => ({ name: decodeEntities(a.name), value: a.terms.map((t) => decodeEntities(t.name)).join(", ") })),
    inStock: p.is_in_stock,
    backorder: p.is_on_backorder,
    stockText: decodeEntities(p.stock_availability?.text ?? ""),
    purchasable: p.is_purchasable && p.type === "simple",
  };
}

export function toSummary(p: Product): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    image: p.images[0]?.src ?? null,
    brand: p.brands[0]?.name,
    price: p.price,
    regularPrice: p.regularPrice,
    inStock: p.inStock,
    backorder: p.backorder,
    sku: p.sku || undefined,
    hasOptions: !p.purchasable,
  };
}

/* ---------- Categories ---------- */

export async function getAllCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");
  const first = await request<ApiCategory[]>("/products/categories", { per_page: 100, page: 1 });
  const all = [...first.data];
  // Sequential on purpose: the host throttles bursts (see `request`).
  for (let page = 2; page <= first.pages; page++) {
    all.push(...(await request<ApiCategory[]>("/products/categories", { per_page: 100, page })).data);
  }
  return all
    .filter((c) => !HIDDEN_CATEGORIES.has(c.slug))
    .map((c) => ({
      id: c.id,
      name: decodeEntities(c.name),
      slug: c.slug,
      parent: c.parent,
      count: c.count,
      description: c.description,
      image: c.image?.src ?? null,
    }));
}

export async function getCategory(slug: string) {
  return (await getAllCategories()).find((c) => c.slug === slug);
}

export async function getChildren(id: number) {
  return (await getAllCategories())
    .filter((c) => c.parent === id && c.count > 0)
    .sort((a, b) => b.count - a.count);
}

export async function getAncestors(category: Category) {
  const all = await getAllCategories();
  const trail: Category[] = [];
  let current = all.find((c) => c.id === category.parent);
  while (current) {
    trail.unshift(current);
    const parent = current.parent;
    current = all.find((c) => c.id === parent);
  }
  return trail;
}

/** Main navigation, in the order of the current site. */
export const NAV = [
  { slug: "deurbeslag-binnendeur", label: "Binnendeur" },
  { slug: "deurbeslag-buitendeur", label: "Buitendeur" },
  { slug: "raambeslag", label: "Raambeslag" },
  { slug: "schuifdeurbeslag", label: "Schuifdeur" },
  { slug: "meubelbeslag", label: "Meubelbeslag" },
  { slug: "scharnieren", label: "Scharnieren" },
  { slug: "badkamer", label: "Badkamer" },
] as const;

export async function getNavigation() {
  return Promise.all(
    NAV.map(async (item) => {
      const category = await getCategory(item.slug);
      const children = category ? await getChildren(category.id) : [];
      return {
        ...item,
        count: category?.count ?? 0,
        children: children.slice(0, 12).map((c) => ({ name: c.name, slug: c.slug })),
      };
    }),
  );
}

/* ---------- Brands ---------- */

export async function getBrands(): Promise<Brand[]> {
  "use cache";
  cacheLife("days");
  cacheTag("brands");
  const { data } = await request<(ApiTerm & { count: number; description: string; image: { src: string } | null })[]>(
    "/products/brands",
    { per_page: 100 },
  );
  return data.map((b) => ({
    id: b.id,
    name: decodeEntities(b.name),
    slug: b.slug,
    count: b.count,
    description: b.description,
    image: b.image?.src ?? null,
  }));
}

export async function getBrand(slug: string) {
  return (await getBrands()).find((b) => b.slug === slug);
}

/* ---------- Products ---------- */

export type SortKey = "populair" | "nieuw" | "prijs-oplopend" | "prijs-aflopend" | "naam";

const SORTS: Record<SortKey, { orderby: string; order: "asc" | "desc" }> = {
  populair: { orderby: "popularity", order: "desc" },
  nieuw: { orderby: "date", order: "desc" },
  "prijs-oplopend": { orderby: "price", order: "asc" },
  "prijs-aflopend": { orderby: "price", order: "desc" },
  naam: { orderby: "title", order: "asc" },
};

export function isSortKey(value: unknown): value is SortKey {
  return typeof value === "string" && value in SORTS;
}

export async function getProducts(options: {
  category?: number;
  brand?: number;
  search?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  const sort = SORTS[options.sort ?? "populair"];
  const { data, total, pages } = await request<ApiProduct[]>("/products", {
    category: options.category,
    brand: options.brand,
    search: options.search,
    orderby: sort.orderby,
    order: sort.order,
    page: options.page ?? 1,
    per_page: options.perPage ?? 24,
  });
  return { products: data.map(mapProduct).map(toSummary), total, pages };
}

export async function getProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`product:${slug}`);
  const { data } = await request<ApiProduct[]>("/products", { slug });
  return data[0] ? mapProduct(data[0]) : null;
}

/** Strip page-builder clutter and outside links from WordPress HTML. */
export function cleanHtml(html: string) {
  return html
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\s(style|class|id)="[^"]*"/gi, "")
    .replace(/<a\s[^>]*href="(?!https?:\/\/(www\.)?deurbeslaggigant\.nl)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$2")
    .replace(/https?:\/\/(www\.)?deurbeslaggigant\.nl\/product\//gi, "/product/")
    .replace(/<p>(&nbsp;|\s)*<\/p>/gi, "")
    .trim();
}
