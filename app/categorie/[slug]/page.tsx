import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductListing, ProductListingSkeleton } from "@/components/listing/product-listing";
import { stripTags } from "@/lib/format";
import { getAncestors, getCategory, getChildren, NAV } from "@/lib/woo";

export function generateStaticParams() {
  return NAV.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categorie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description:
      stripTags(category.description).slice(0, 160) ||
      `${category.name} van premium merken, snel geleverd door DeurbeslagGigant.`,
    alternates: { canonical: `/categorie/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/categorie/[slug]">) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const [ancestors, children] = await Promise.all([getAncestors(category), getChildren(category.id)]);
  const intro = stripTags(category.description);

  return (
    <div className="container-page pt-8">
      <Breadcrumbs
        items={[...ancestors.map((a) => ({ name: a.name, href: `/categorie/${a.slug}` })), { name: category.name }]}
      />

      <header className="mt-10 mb-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{ancestors.at(-1)?.name ?? "Collectie"}</p>
          <h1 className="display mt-4 text-5xl sm:text-6xl lg:text-7xl">{category.name}</h1>
        </div>
        {intro && <p className="max-w-lg leading-relaxed text-muted line-clamp-5">{intro}</p>}
      </header>

      {children.length > 0 && (
        <ul className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {children.map((child) => (
            <li key={child.slug} className="shrink-0">
              <Link
                href={`/categorie/${child.slug}`}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm whitespace-nowrap transition hover:border-ink hover:bg-surface"
              >
                {child.name}
                <span className="text-[11px] text-muted tabular-nums">{child.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListing basePath={`/categorie/${slug}`} searchParams={searchParams} category={category.id} />
      </Suspense>
    </div>
  );
}
