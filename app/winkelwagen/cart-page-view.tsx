"use client";

import { Info, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/format";

export function CartPageView() {
  const { lines, subtotal, setQuantity, remove } = useCart();
  const [notice, setNotice] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-line bg-surface px-6 py-20 text-center">
        <p className="text-lg font-medium">Uw winkelwagen is leeg</p>
        <p className="mt-2 text-muted">Ontdek deurkrukken, grepen en beslag van topmerken.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 font-medium text-paper hover:bg-ink-soft"
        >
          Verder winkelen
        </Link>
      </div>
    );
  }

  const vat = subtotal - subtotal / 1.21;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface px-5 sm:px-8">
        {lines.map(({ product, quantity }) => (
          <li key={product.id} className="flex gap-4 py-6 sm:gap-6">
            <Link
              href={`/product/${product.slug}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-line bg-white sm:size-28"
            >
              {product.image && (
                <Image src={product.image} alt="" fill sizes="112px" className="object-contain p-2" />
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link href={`/product/${product.slug}`} className="line-clamp-2 font-medium hover:underline">
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-muted tabular-nums">
                  {formatPrice(product.price ?? 0)} per stuk
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, quantity - 1)}
                    className="grid size-9 place-items-center"
                    aria-label="Eén minder"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                    className="grid size-9 place-items-center"
                    aria-label="Eén meer"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="w-24 text-right font-semibold tabular-nums">
                  {formatPrice((product.price ?? 0) * quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="grid size-9 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink"
                  aria-label={`${product.name} verwijderen`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-40">
        <h2 className="text-lg font-semibold">Overzicht</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotaal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Verzending</dt>
            <dd className="text-muted">Bij afrekenen</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Waarvan btw (21%)</dt>
            <dd className="tabular-nums">{formatPrice(vat)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-4 text-base font-semibold">
            <dt>Totaal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setNotice(true)}
          className="mt-6 h-14 w-full rounded-full bg-amber font-semibold text-ink transition hover:bg-ink hover:text-paper"
        >
          Afrekenen
        </button>
        {notice && (
          <p className="mt-4 flex gap-2 rounded-lg bg-sand p-4 text-sm text-ink-soft">
            <Info className="mt-0.5 size-4 shrink-0" />
            De betaalstap wordt gekoppeld aan de bestaande WooCommerce-kassa of
            Mollie. Dit is nog niet aangesloten in deze preview.
          </p>
        )}
        <p className="mt-5 text-center text-xs text-muted">iDEAL · PayPal · Creditcard</p>
        {subtotal >= 500 && (
          <Link
            href="/offerte-aanvragen"
            className="mt-5 block rounded-lg border border-line p-4 text-sm hover:border-ink"
          >
            <span className="font-medium">Bestelling boven €500?</span>
            <span className="mt-1 block text-muted">Vraag een offerte aan, vaak kunnen we korting geven.</span>
          </Link>
        )}
      </aside>
    </div>
  );
}
