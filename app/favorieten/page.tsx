import type { Metadata } from "next";
import { FavoritesView } from "./favorites-view";

export const metadata: Metadata = {
  title: "Favorieten",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <div className="container-page pt-12">
      <p className="eyebrow">Bewaard</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">Favorieten</h1>
      <FavoritesView />
    </div>
  );
}
