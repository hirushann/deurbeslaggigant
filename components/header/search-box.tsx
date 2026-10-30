"use client";

import { ArrowRight, Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";

export function SearchBox({ tone = "light" }: { tone?: "light" | "dark" }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing stale results
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, {
          signal: controller.signal,
        });
        setResults(await res.json());
        setHighlight(-1);
      } catch {
        // aborted or offline; keep previous results
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const target = results[highlight];
    setOpen(false);
    if (target) router.push(`/product/${target.slug}`);
    else if (query.trim()) router.push(`/zoeken?q=${encodeURIComponent(query.trim())}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && query.trim().length >= 2;
  const field =
    tone === "dark"
      ? "border-paper/15 bg-paper/[0.06] text-paper focus-within:border-paper/40 focus-within:bg-paper/10"
      : "border-transparent bg-paper text-ink focus-within:border-ink focus-within:bg-surface";

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl text-ink">
      <form onSubmit={submit} role="search">
        <label className={`flex h-11 items-center gap-3 rounded-full border px-4 transition ${field}`}>
          {loading ? (
            <Loader2 className="size-4 shrink-0 animate-spin opacity-60" />
          ) : (
            <Search className="size-4 shrink-0 opacity-60" />
          )}
          <span className="sr-only">Zoek een product</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Zoek product, merk of artikelnummer"
            className="w-full bg-transparent text-sm outline-none placeholder:text-inherit placeholder:opacity-55 [&::-webkit-search-cancel-button]:hidden"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
          />
        </label>
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-lift)]">
          {results.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">
              {loading ? "Zoeken…" : `Geen producten gevonden voor “${query.trim()}”.`}
            </p>
          ) : (
            <ul id={listId} role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === highlight}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md p-2 transition ${
                      i === highlight ? "bg-paper" : "hover:bg-paper"
                    }`}
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-paper">
                      {p.image && (
                        <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      {p.brand && <span className="eyebrow block text-[0.6rem]!">{p.brand}</span>}
                      <span className="line-clamp-1 text-sm">{p.name}</span>
                    </span>
                    {p.price !== undefined && (
                      <span className="text-sm font-medium tabular-nums">{formatPrice(p.price)}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/zoeken?q=${encodeURIComponent(query.trim())}`}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-t border-line px-5 py-3 text-sm font-medium hover:bg-paper"
          >
            Alle resultaten voor “{query.trim()}”
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
