"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/components/favorites/favorites-context";
import { ProductCard } from "@/components/product-card";

export function FavoritesView() {
  const { items } = useFavorites();

  if (!items.length) {
    return (
      <div className="mt-12 flex flex-col items-center rounded-2xl bg-surface px-6 py-24 text-center">
        <Heart className="size-8 text-amber" />
        <p className="display mt-6 text-3xl">Nog niets bewaard</p>
        <p className="mt-3 max-w-sm text-muted">
          Tik op het hartje bij een product om het hier te bewaren, handig om later te vergelijken.
        </p>
        <Link
          href="/categorie/deurbeslag-binnendeur"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 font-medium text-paper hover:bg-ink-soft"
        >
          Ontdek deurbeslag
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-4 text-muted">
        {items.length} {items.length === 1 ? "product" : "producten"} bewaard op dit apparaat.
      </p>
      <ul className="mt-12 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <li key={p.id} className="flex">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
