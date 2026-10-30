import { Clock, MessageCircle, RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Price } from "@/components/price";
import { BuyBox } from "@/components/product/buy-box";
import { Gallery } from "@/components/product/gallery";
import { ProductCard } from "@/components/product-card";
import { StockLabel } from "@/components/stock-label";
import { formatPrice, site, stripTags } from "@/lib/format";
import { cleanHtml, getAncestors, getCategory, getProduct, getProducts, toSummary } from "@/lib/woo";

export async function generateStaticParams() {
  // Prerender the newest products; everything else renders on first visit and is then cached.
  const { products } = await getProducts({ perPage: 12 });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: stripTags(product.shortDescriptionHtml || product.descriptionHtml).slice(0, 160),
    alternates: { canonical: `/product/${slug}` },
    openGraph: { images: product.images.slice(0, 1).map((i) => i.src) },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const summary = toSummary(product);
  const primary = product.categories.at(-1);
  const category = primary ? await getCategory(primary.slug) : undefined;
  const trail = category ? [...(await getAncestors(category)), category] : [];
  const brand = product.brands[0];
  const description = cleanHtml(product.descriptionHtml || product.shortDescriptionHtml);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.src),
    sku: product.sku || undefined,
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    description: stripTags(product.shortDescriptionHtml || product.descriptionHtml).slice(0, 300),
    offers:
      product.price !== undefined
        ? {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: product.price.toFixed(2),
            availability: !product.inStock
              ? "https://schema.org/OutOfStock"
              : product.backorder
                ? "https://schema.org/BackOrder"
                : "https://schema.org/InStock",
            url: `${site.url}/product/${product.slug}`,
          }
        : undefined,
  };

  return (
    <div className="container-page pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Breadcrumbs
        items={[...trail.map((c) => ({ name: c.name, href: `/categorie/${c.slug}` })), { name: product.name }]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <Gallery images={product.images} alt={product.name} />

        <div className="flex flex-col">
          {brand && (
            <Link href={`/merken/${brand.slug}`} className="eyebrow hover:text-ink">
              {brand.name}
            </Link>
          )}
          <h1 className="display mt-4 text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
          {product.sku && <p className="mt-4 font-mono text-xs text-muted">Art.nr. {product.sku}</p>}

          <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-8">
            <div>
              <Price price={product.price} regularPrice={product.regularPrice} size="lg" />
              <p className="mt-1 text-xs text-muted">Incl. 21% btw</p>
            </div>
            <StockLabel product={summary} text={product.stockText || undefined} />
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex-1">
              {product.purchasable ? (
                <BuyBox product={summary} />
              ) : (
                // Price-on-request items (often exclusive brands) are sold by quote.
                <Link
                  href="/offerte-aanvragen"
                  className="flex h-14 items-center justify-center rounded-full bg-ink px-8 font-medium text-paper hover:bg-ink-soft"
                >
                  {product.price === undefined ? "Prijs aanvragen" : "Vraag naar de uitvoeringen"}
                </Link>
              )}
            </div>
            <FavoriteButton product={summary} large />
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-ink-soft">
            <li className="flex items-center gap-3">
              <Truck className="size-4 text-amber-deep" />
              {product.backorder
                ? "Wordt voor u besteld bij de leverancier"
                : `Gratis verzending vanaf ${formatPrice(site.freeShippingFrom)}`}
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="size-4 text-amber-deep" />
              30 dagen bedenktijd, ongebruikt retour
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 text-amber-deep" />
              Op voorraad en voor {site.orderCutoff} besteld? Morgen in huis
            </li>
          </ul>

          {description && (
            <section className="mt-12 border-t border-line pt-8">
              <h2 className="eyebrow">Omschrijving</h2>
              <div className="prose-wp mt-4" dangerouslySetInnerHTML={{ __html: description }} />
            </section>
          )}

          {product.specs.length > 0 && (
            <section className="mt-10 border-t border-line pt-8">
              <h2 className="eyebrow">Specificaties</h2>
              <dl className="mt-4 divide-y divide-line text-sm">
                {product.specs.map((s) => (
                  <div key={s.name} className="grid grid-cols-[10rem_1fr] gap-4 py-3">
                    <dt className="text-muted">{s.name}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <aside className="mt-10 flex items-start gap-4 rounded-2xl bg-sand p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface">
              <MessageCircle className="size-4" />
            </span>
            <div className="text-sm">
              <p className="font-medium">Advies nodig over afwerking of combinaties?</p>
              <p className="mt-1 leading-relaxed text-muted">
                App ons op{" "}
                <a href={site.whatsappHref} className="text-ink underline underline-offset-2">
                  {site.phone}
                </a>{" "}
                of mail naar{" "}
                <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-2">
                  {site.email}
                </a>
                . Ook projecten op tekening denken we graag mee.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {category && (
        <Suspense>
          <Related categoryId={category.id} categoryName={category.name} excludeId={product.id} />
        </Suspense>
      )}
    </div>
  );
}

async function Related({
  categoryId,
  categoryName,
  excludeId,
}: {
  categoryId: number;
  categoryName: string;
  excludeId: number;
}) {
  const { products } = await getProducts({ category: categoryId, perPage: 9 });
  const related = products.filter((p) => p.id !== excludeId).slice(0, 8);
  if (!related.length) return null;
  return (
    <section className="mt-32">
      <p className="eyebrow">Uit dezelfde serie</p>
      <h2 className="display mt-3 text-4xl sm:text-5xl">{categoryName}</h2>
      <ul className="no-scrollbar -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
        {related.map((p) => (
          <li key={p.id} className="flex w-[68vw] shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
