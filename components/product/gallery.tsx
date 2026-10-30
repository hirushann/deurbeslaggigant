"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function Gallery({ images, alt }: { images: ProductImage[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="grid aspect-square place-items-center rounded-2xl bg-surface text-muted">
        Geen afbeelding beschikbaar
      </div>
    );
  }

  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row lg:sticky lg:top-44 lg:self-start">
      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-3 overflow-x-auto sm:max-h-[36rem] sm:flex-col sm:overflow-y-auto">
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Afbeelding ${i + 1} tonen`}
                aria-current={i === active}
                className={`relative block size-20 overflow-hidden rounded-md bg-surface transition ${
                  i === active ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-contain p-2 mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-surface">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-8 mix-blend-multiply animate-fade-up [animation-duration:.4s] sm:p-14"
        />
      </div>
    </div>
  );
}
