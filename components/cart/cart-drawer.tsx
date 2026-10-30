"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQuantity, remove } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Winkelwagen">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={close} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-[var(--shadow-lift)] animate-slide-in">
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <p className="font-semibold">Winkelwagen</p>
          <button
            type="button"
            onClick={close}
            className="grid size-10 place-items-center rounded-full hover:bg-stone"
            aria-label="Winkelwagen sluiten"
          >
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-stone">
              <ShoppingBag className="size-6 text-muted" />
            </span>
            <p className="font-medium">Uw winkelwagen is nog leeg</p>
            <p className="text-sm text-muted">
              Zoek een product of blader door de collecties.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-medium hover:border-ink"
            >
              Verder winkelen
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-4">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={close}
                    className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-line bg-white"
                  >
                    {product.image && (
                      <Image src={product.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={close}
                      className="line-clamp-2 text-sm leading-snug font-medium"
                    >
                      {product.name}
                    </Link>
                    {product.sku && (
                      <span className="mt-0.5 font-mono text-[11px] text-muted">{product.sku}</span>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line bg-surface">
                        <button
                          type="button"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                          className="grid size-8 place-items-center"
                          aria-label="Eén minder"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                          className="grid size-8 place-items-center"
                          aria-label="Eén meer"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums">
                          {formatPrice((product.price ?? 0) * quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(product.id)}
                          className="grid size-8 place-items-center rounded-full text-muted hover:bg-stone hover:text-ink"
                          aria-label={`${product.name} verwijderen`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-surface px-5 pt-4 pb-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Subtotaal (incl. btw)</span>
                <span className="text-xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Verzendkosten worden berekend bij het afrekenen.</p>
              <Link
                href="/winkelwagen"
                onClick={close}
                className="mt-4 flex h-12 items-center justify-center rounded-full bg-amber font-semibold text-ink transition hover:bg-ink hover:text-paper"
              >
                Naar afrekenen
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
