import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductListing, ProductListingSkeleton } from "@/components/listing/product-listing";

export const metadata: Metadata = {
  title: "Zoeken",
  robots: { index: false },
};

const suggestions = ["deurkruk zwart", "GPF", "JNF", "Mi Satori", "raamuitzetter", "schuifdeurkom"];

export default function SearchPage({ searchParams }: PageProps<"/zoeken">) {
  return (
    <div className="container-page pt-12">
      <Suspense fallback={<ProductListingSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/zoeken">["searchParams"] }) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").trim().slice(0, 80);

  return (
    <>
      <p className="eyebrow">Zoeken</p>
      <h1 className="display mt-4 mb-12 text-5xl sm:text-6xl">{q ? <>“{q}”</> : "Waar bent u naar op zoek?"}</h1>
      {q ? (
        <ProductListing basePath="/zoeken" searchParams={searchParams} search={q.toLowerCase()} />
      ) : (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Link
              key={s}
              href={`/zoeken?q=${encodeURIComponent(s)}`}
              className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink hover:bg-surface"
            >
              {s}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
