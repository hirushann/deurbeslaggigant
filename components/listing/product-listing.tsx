import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getProducts, isSortKey, type SortKey } from "@/lib/woo";
import { SortSelect } from "./sort-select";

const PER_PAGE = 24;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Server-rendered, paginated product grid. Reads `?pagina=` and `?sorteer=`
 * so every page of results has its own crawlable URL.
 */
export async function ProductListing({
  basePath,
  searchParams,
  category,
  brand,
  search,
}: {
  basePath: string;
  searchParams: SearchParams;
  category?: number;
  brand?: number;
  search?: string;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.pagina) || 1);
  const sort: SortKey = isSortKey(params.sorteer) ? params.sorteer : "populair";
  const { products, total, pages } = await getProducts({
    category,
    brand,
    search,
    sort,
    page,
    perPage: PER_PAGE,
  });

  const href = (p: number) => {
    const qs = new URLSearchParams();
    if (search) qs.set("q", search);
    if (sort !== "populair") qs.set("sorteer", sort);
    if (p > 1) qs.set("pagina", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-4">
        <p className="text-sm text-muted">
          <span className="font-medium text-ink tabular-nums">{total.toLocaleString("nl-NL")}</span>{" "}
          {total === 1 ? "product" : "producten"}
        </p>
        <SortSelect value={sort} />
      </div>

      {products.length === 0 ? (
        <p className="py-24 text-center text-muted">Geen producten gevonden.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.id} className="flex">
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Paginering">
          {page > 1 && (
            <Link href={href(page - 1)} className="h-11 rounded-full border border-line-strong px-5 leading-[2.6rem] text-sm hover:border-ink">
              Vorige
            </Link>
          )}
          {pageWindow(page, pages).map((p, i) =>
            p === null ? (
              <span key={`gap-${i}`} className="px-1 text-muted">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                className={`grid size-11 place-items-center rounded-full text-sm tabular-nums transition ${
                  p === page ? "bg-ink text-paper" : "hover:bg-stone"
                }`}
              >
                {p}
              </Link>
            ),
          )}
          {page < pages && (
            <Link href={href(page + 1)} className="h-11 rounded-full border border-line-strong px-5 leading-[2.6rem] text-sm hover:border-ink">
              Volgende
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

/** 1 … 4 5 6 … 20 */
function pageWindow(current: number, total: number): (number | null)[] {
  const wanted = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...wanted].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

export function ProductListingSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Producten laden">
      <div className="h-[4.25rem] border-y border-line" />
      <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <div className="aspect-[4/5] rounded-md bg-surface" />
            <div className="mt-4 h-3 w-1/3 rounded bg-stone" />
            <div className="mt-2 h-4 w-4/5 rounded bg-stone" />
          </li>
        ))}
      </ul>
    </div>
  );
}
