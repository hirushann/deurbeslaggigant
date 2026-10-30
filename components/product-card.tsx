import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/lib/types";
import { AddToCartButton } from "./cart/add-to-cart-button";
import { FavoriteButton } from "./favorites/favorite-button";
import { Price } from "./price";
import { StockLabel } from "./stock-label";

export function ProductCard({ product, priority = false }: { product: ProductSummary; priority?: boolean }) {
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition duration-300 hover:border-line-strong hover:shadow-[var(--shadow-card)]">
      <div className="relative aspect-square overflow-hidden bg-surface">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
            className="object-contain p-5 transition duration-500 ease-out group-hover:scale-[1.04] sm:p-7"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">Geen afbeelding</div>
        )}
        {product.regularPrice && (
          <span className="absolute top-3 left-3 rounded-full bg-amber px-2.5 py-1 text-[0.68rem] font-semibold text-ink">
            Aanbieding
          </span>
        )}
        <div className="absolute top-2.5 right-2.5">
          <FavoriteButton product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-line p-4">
        {product.brand && <p className="eyebrow text-[0.62rem]!">{product.brand}</p>}
        <h3 className="line-clamp-2 text-[0.9rem] leading-snug font-medium text-ink">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <StockLabel product={product} />
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <Price price={product.price} regularPrice={product.regularPrice} />
          <div className="relative z-10">
            <AddToCartButton product={product} compact />
          </div>
        </div>
      </div>
    </article>
  );
}
