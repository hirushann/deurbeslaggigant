import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBrands } from "@/lib/woo";

export const metadata: Metadata = {
  title: "Merken",
  description:
    "Deurbeslag van GPF, JNF, Mandelli1953, Mi Satori, Wallebroek, Kirkpatrick, Artitec, Samuel Heath en meer topmerken.",
};

export default async function BrandsPage() {
  const brands = (await getBrands())
    .filter((b) => b.count >= 5)
    .sort((a, b) => a.name.localeCompare(b.name, "nl"));

  const groups = new Map<string, typeof brands>();
  for (const b of brands) {
    const letter = b.name[0].toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), b]);
  }

  return (
    <div className="container-page pt-8">
      <Breadcrumbs items={[{ name: "Merken" }]} />
      <header className="mt-10 mb-16 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{brands.length} merken</p>
          <h1 className="display mt-4 text-5xl sm:text-6xl lg:text-7xl">
            De meest prestigieuze <em>merken</em>
          </h1>
        </div>
        <p className="max-w-lg leading-relaxed text-muted">
          Van handgemaakte, exclusieve deurkrukken tot betaalbaar design: we selecteren onze merken op
          vormgeving, materiaal en vakmanschap.
        </p>
      </header>

      <div className="divide-y divide-line border-y border-line">
        {[...groups].map(([letter, list]) => (
          <section key={letter} className="grid gap-4 py-8 sm:grid-cols-[6rem_1fr]">
            <h2 className="display text-5xl text-amber">{letter}</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/merken/${b.slug}`}
                    className="group flex items-baseline justify-between gap-4 border-b border-transparent py-2.5 transition hover:border-line"
                  >
                    <span className="display text-2xl transition group-hover:translate-x-1">{b.name}</span>
                    <span className="text-xs text-muted tabular-nums">{b.count.toLocaleString("nl-NL")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
