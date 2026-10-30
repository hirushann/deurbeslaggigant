import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FavoritesProvider } from "@/components/favorites/favorites-context";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header/header";
import { site } from "@/lib/format";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "DeurbeslagGigant · Premium deurbeslag uit voorraad",
    template: "%s · DeurbeslagGigant",
  },
  description:
    "Online webshop in deurbeslag: deurklinken, raambeslag, schuifdeurbeslag, scharnieren en meubelbeslag van premium merken. Voor 13:00 besteld, morgen in huis als het op voorraad is.",
  openGraph: {
    siteName: site.name,
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <FavoritesProvider>
            <a
              href="#inhoud"
              className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              Ga naar de inhoud
            </a>
            <Header />
            <main id="inhoud" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
