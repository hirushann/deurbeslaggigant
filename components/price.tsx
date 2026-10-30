import { formatPrice } from "@/lib/format";

export function Price({
  price,
  regularPrice,
  priceFrom,
  size = "md",
}: {
  price?: number;
  regularPrice?: number;
  priceFrom?: boolean;
  size?: "md" | "lg";
}) {
  if (price === undefined) {
    return <span className="text-sm text-muted">Prijs op aanvraag</span>;
  }
  return (
    <span className="inline-flex items-baseline gap-2">
      {priceFrom && <span className="text-xs text-muted">vanaf</span>}
      <span
        className={`font-semibold tabular-nums tracking-tight ${
          size === "lg" ? "text-3xl" : "text-[1.05rem]"
        }`}
      >
        {formatPrice(price)}
      </span>
      {regularPrice && regularPrice > price && (
        <span className="text-sm text-muted line-through tabular-nums">
          {formatPrice(regularPrice)}
        </span>
      )}
    </span>
  );
}
