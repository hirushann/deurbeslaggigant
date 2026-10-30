import type { ProductSummary } from "@/lib/types";

export function StockLabel({
  product,
  text,
}: {
  product: Pick<ProductSummary, "inStock" | "backorder">;
  /** Override, e.g. "8 op voorraad" on the product page. */
  text?: string;
}) {
  const state = !product.inStock ? "out" : product.backorder ? "backorder" : "in";
  const styles = {
    in: { dot: "bg-ok", text: "text-ok", label: "Op voorraad" },
    backorder: { dot: "bg-amber", text: "text-amber-deep", label: "Nabestelbaar" },
    out: { dot: "bg-warn", text: "text-warn", label: "Niet leverbaar" },
  }[state];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${styles.text}`}>
      <span className={`size-1.5 rounded-full ${styles.dot}`} />
      {text ?? styles.label}
    </span>
  );
}
