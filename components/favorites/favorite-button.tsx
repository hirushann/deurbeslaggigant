"use client";

import { Heart } from "lucide-react";
import type { ProductSummary } from "@/lib/types";
import { useFavorites } from "./favorites-context";

export function FavoriteButton({ product, large = false }: { product: ProductSummary; large?: boolean }) {
  const { has, toggle } = useFavorites();
  const active = has(product.id);
  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={active}
      aria-label={active ? `${product.name} uit favorieten` : `${product.name} bewaren als favoriet`}
      className={`relative z-10 grid place-items-center rounded-full transition ${
        large
          ? "size-14 border border-line-strong bg-surface hover:border-ink"
          : "size-9 bg-surface/90 backdrop-blur hover:bg-surface"
      }`}
    >
      <Heart
        className={`${large ? "size-5" : "size-4"} transition ${active ? "fill-amber text-amber" : "text-ink"}`}
      />
    </button>
  );
}
