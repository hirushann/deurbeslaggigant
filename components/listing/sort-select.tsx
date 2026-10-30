"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "populair", label: "Populair" },
  { value: "nieuw", label: "Nieuwste" },
  { value: "prijs-oplopend", label: "Prijs: laag naar hoog" },
  { value: "prijs-aflopend", label: "Prijs: hoog naar laag" },
  { value: "naam", label: "Naam A–Z" },
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(next: string) {
    const qs = new URLSearchParams(searchParams);
    qs.delete("pagina");
    if (next === "populair") qs.delete("sorteer");
    else qs.set("sorteer", next);
    const s = qs.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  }

  return (
    <label className="relative">
      <span className="sr-only">Sorteren</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 appearance-none rounded-full border border-line bg-surface pr-10 pl-4 text-sm outline-none hover:border-line-strong"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-muted">▾</span>
    </label>
  );
}
