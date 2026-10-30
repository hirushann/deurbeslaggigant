import type { Metadata } from "next";
import { CartPageView } from "./cart-page-view";

export const metadata: Metadata = {
  title: "Winkelwagen",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page pt-10">
      <p className="eyebrow">Bestellen</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Winkelwagen</h1>
      <CartPageView />
    </div>
  );
}
