"use client";

import { ArrowRight, ChevronDown, Heart, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { useFavorites } from "@/components/favorites/favorites-context";
import { Logo } from "@/components/logo";
import { SearchBox } from "./search-box";

export type NavItem = {
  slug: string;
  label: string;
  count: number;
  children: { name: string; slug: string }[];
};

const extraLinks = [
  { href: "/merken", label: "Merken" },
  { href: "/offerte-aanvragen", label: "Zakelijk & offerte" },
  { href: "/contact", label: "Klantenservice" },
];

function Badge({ value }: { value: number }) {
  if (!value) return null;
  return (
    <span className="absolute top-1 right-0.5 grid min-w-[18px] place-items-center rounded-full bg-amber px-1 text-[10px] leading-[18px] font-semibold text-ink tabular-nums">
      {value}
    </span>
  );
}

export function HeaderBar({ nav }: { nav: NavItem[] }) {
  const { count, open } = useCart();
  const favorites = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Close menus whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setActiveMenu(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const active = nav.find((n) => n.slug === activeMenu);

  return (
    <div className="relative border-b border-line bg-surface/95 backdrop-blur-md" onMouseLeave={() => setActiveMenu(null)}>
      <div className="container-page flex h-16 items-center gap-3 lg:h-[4.5rem] lg:gap-10">
        <button
          type="button"
          className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-paper lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Menu openen"
        >
          <Menu className="size-5" />
        </button>

        <Logo />

        <div className="hidden flex-1 lg:flex">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href="/favorieten"
            className="relative grid size-11 place-items-center rounded-full hover:bg-paper"
            aria-label={`Favorieten, ${favorites.items.length} bewaard`}
          >
            <Heart className="size-5" />
            <Badge value={favorites.items.length} />
          </Link>
          <button
            type="button"
            onClick={open}
            className="relative grid size-11 place-items-center rounded-full hover:bg-paper lg:hidden"
            aria-label={`Winkelwagen, ${count} artikelen`}
          >
            <ShoppingBag className="size-5" />
            <Badge value={count} />
          </button>
          <button
            type="button"
            onClick={open}
            className="ml-2 hidden h-11 items-center gap-2.5 rounded-full bg-ink pr-2 pl-5 text-sm font-medium text-paper transition hover:bg-ink-soft lg:inline-flex"
          >
            Winkelwagen
            <span className="grid h-7 min-w-7 place-items-center rounded-full bg-amber px-2 text-xs font-semibold text-ink tabular-nums">
              {count}
            </span>
          </button>
        </div>
      </div>

      <div className="container-page pb-3 lg:hidden">
        <SearchBox />
      </div>

      {/* Desktop navigation */}
      <nav className="hidden border-t border-line lg:block" aria-label="Hoofdmenu">
        <div className="container-page flex h-12 items-center gap-0.5 text-sm font-medium xl:gap-1">
          {nav.map((item) => {
            const isActive = activeMenu === item.slug || pathname === `/categorie/${item.slug}`;
            return (
              <Link
                key={item.slug}
                href={`/categorie/${item.slug}`}
                onMouseEnter={() => setActiveMenu(item.children.length ? item.slug : null)}
                onFocus={() => setActiveMenu(item.children.length ? item.slug : null)}
                aria-expanded={item.children.length ? activeMenu === item.slug : undefined}
                className={`flex h-9 items-center gap-1 rounded-full px-3.5 whitespace-nowrap transition ${
                  isActive ? "bg-sand text-ink" : "text-ink-soft hover:bg-paper hover:text-ink"
                }`}
              >
                {item.label}
                {item.children.length > 0 && (
                  <ChevronDown className={`size-3.5 opacity-50 transition ${activeMenu === item.slug ? "rotate-180" : ""}`} />
                )}
              </Link>
            );
          })}
          <span className="mx-3 hidden h-5 w-px bg-line xl:block" />
          {extraLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => setActiveMenu(null)}
              className={`hidden h-9 items-center rounded-full px-3.5 whitespace-nowrap transition hover:bg-paper hover:text-ink xl:flex ${
                pathname === l.href ? "text-ink" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mega menu */}
      {active && (
        <div className="absolute inset-x-0 top-full hidden border-b border-line bg-surface shadow-[var(--shadow-lift)] lg:block">
          <div className="container-page grid grid-cols-[1fr_3fr] gap-12 py-10 animate-fade-up [animation-duration:.3s]">
            <div className="rounded-xl bg-sand p-7">
              <p className="eyebrow text-amber-deep!">{active.count.toLocaleString("nl-NL")} producten</p>
              <p className="display mt-3 text-4xl">{active.label}</p>
              <Link
                href={`/categorie/${active.slug}`}
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper transition hover:bg-ink-soft"
              >
                Alles bekijken <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-3 gap-x-8 gap-y-1 self-start">
              {active.children.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={`/categorie/${child.slug}`}
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink-soft transition hover:bg-paper hover:text-ink"
                  >
                    {child.name}
                    <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(24rem,90vw)] flex-col bg-surface shadow-[var(--shadow-lift)] animate-fade-up [animation-duration:.25s]">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid size-10 place-items-center rounded-full hover:bg-paper"
                aria-label="Menu sluiten"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="eyebrow pb-2">Assortiment</p>
              {nav.map((item) => (
                <details key={item.slug} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                    <span className="display text-2xl">{item.label}</span>
                    <ChevronDown className="size-5 text-muted transition group-open:rotate-180" />
                  </summary>
                  <ul className="pb-4">
                    <li>
                      <Link href={`/categorie/${item.slug}`} className="block py-2 text-sm font-semibold text-amber-deep">
                        Alles in {item.label.toLowerCase()}
                      </Link>
                    </li>
                    {item.children.map((child) => (
                      <li key={child.slug}>
                        <Link href={`/categorie/${child.slug}`} className="block py-2 text-sm text-ink-soft">
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              <p className="eyebrow pt-8 pb-2">Service</p>
              {[...extraLinks, { href: "/favorieten", label: "Favorieten" }, { href: "/retourneren", label: "Retourneren" }].map((l) => (
                <Link key={l.href} href={l.href} className="block border-b border-line py-3.5 font-medium">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
