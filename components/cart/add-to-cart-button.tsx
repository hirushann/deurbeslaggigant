"use client";

import { ArrowRight, Check, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ProductSummary } from "@/lib/types";
import { useCart } from "./cart-context";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: ProductSummary;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = !product.inStock || product.price === undefined;

  function onClick() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  if (compact && product.hasOptions) {
    return (
      <Link
        href={`/product/${product.slug}`}
        aria-label={`Kies uitvoering van ${product.name}`}
        className="relative z-10 grid size-10 place-items-center rounded-full border border-line-strong text-ink transition hover:border-ink"
      >
        <ArrowRight className="size-4" />
      </Link>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={`${product.name} in winkelwagen`}
        className="relative z-10 grid size-10 place-items-center rounded-full bg-amber text-ink transition hover:bg-ink hover:text-paper active:scale-95 disabled:cursor-not-allowed disabled:bg-line-strong"
      >
        {added ? <Check className="size-4" /> : <Plus className="size-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber px-7 font-semibold text-ink transition hover:bg-ink hover:text-paper active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line-strong"
    >
      {added ? <Check className="size-4" /> : <Plus className="size-4" />}
      {added ? "Toegevoegd" : "In winkelwagen"}
    </button>
  );
}
