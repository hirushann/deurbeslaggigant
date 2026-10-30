import { ProductListingSkeleton } from "@/components/listing/product-listing";

export default function Loading() {
  return (
    <div className="container-page pt-8" aria-busy="true" aria-label="Laden">
      <div className="h-4 w-40 animate-pulse rounded-full bg-stone" />
      <div className="mt-10 mb-12 h-24 w-2/3 animate-pulse rounded-md bg-stone" />
      <ProductListingSkeleton />
    </div>
  );
}
