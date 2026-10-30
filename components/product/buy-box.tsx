"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import type { ProductSummary } from "@/lib/types";

export function BuyBox({ product }: { product: ProductSummary }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const disabled = !product.inStock || product.price === undefined;

  return (
    <div className="flex gap-3">
      <div className="flex h-14 items-center rounded-full border border-line-strong bg-surface">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="grid size-12 place-items-center rounded-full hover:bg-paper"
          aria-label="Aantal verlagen"
        >
          <Minus className="size-4" />
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          className="w-10 bg-transparent text-center font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          aria-label="Aantal"
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="grid size-12 place-items-center rounded-full hover:bg-paper"
          aria-label="Aantal verhogen"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => add(product, quantity)}
        className="h-14 flex-1 rounded-full bg-amber px-8 font-semibold text-ink transition hover:bg-ink hover:text-paper active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-line-strong"
      >
        {disabled ? "Niet leverbaar" : "In winkelwagen"}
      </button>
    </div>
  );
}
