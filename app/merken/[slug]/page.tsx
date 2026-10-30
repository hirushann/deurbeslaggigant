import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductListing, ProductListingSkeleton } from "@/components/listing/product-listing";
import { stripTags } from "@/lib/format";
import { getBrand, getBrands } from "@/lib/woo";

export async function generateStaticParams() {
  return (await getBrands())
    .filter((b) => b.count >= 100)
    .map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/merken/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} deurbeslag`,
    description: `Ontdek ${brand.count} producten van ${brand.name} bij DeurbeslagGigant.`,
    alternates: { canonical: `/merken/${slug}` },
  };
}

export default async function BrandPage({ params, searchParams }: PageProps<"/merken/[slug]">) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();
  const intro = stripTags(brand.description);

  return (
    <div className="container-page pt-8">
      <Breadcrumbs items={[{ name: "Merken", href: "/merken" }, { name: brand.name }]} />
      <header className="mt-10 mb-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">Merk</p>
          <h1 className="display mt-4 text-5xl sm:text-6xl lg:text-7xl">{brand.name}</h1>
        </div>
        {intro && <p className="max-w-lg leading-relaxed text-muted line-clamp-5">{intro}</p>}
      </header>
      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListing basePath={`/merken/${slug}`} searchParams={searchParams} brand={brand.id} />
      </Suspense>
    </div>
  );
}
