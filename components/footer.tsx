import { CreditCard, PackageCheck, RotateCcw, Truck } from "lucide-react";
import Link from "next/link";
import { NAV } from "@/lib/woo";
import { formatPrice, site } from "@/lib/format";
import { Logo } from "./logo";

const service = [
  { href: "/contact", label: "Contact & klantenservice" },
  { href: "/offerte-aanvragen", label: "Zakelijk & offerte" },
  { href: "/retourneren", label: "Retourneren" },
  { href: "/merken", label: "Merken" },
  { href: "/favorieten", label: "Favorieten" },
];

/** Promises the current site makes in its footer. */
export const USPS = [
  { icon: Truck, title: "Gratis verzending", text: `Boven ${formatPrice(site.freeShippingFrom)} incl. btw voor particulieren` },
  { icon: RotateCcw, title: "30 dagen retour", text: "Retourrecht op particuliere bestellingen" },
  { icon: PackageCheck, title: "2000+ artikelen", text: "Uit voorraad leverbaar" },
  { icon: CreditCard, title: "Veilig betalen", text: "Via onze betaalprovider Mollie" },
];

export function Footer() {
  return (
    <footer className="mt-28 bg-ink text-paper/65">
      <div className="border-b border-paper/10">
        <ul className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          {USPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber/15 text-amber">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-paper">{title}</span>
                <span className="mt-0.5 block text-[0.8rem] leading-snug">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo tone="dark" />
          <p className="mt-6 text-sm leading-relaxed">
            Online webshop in deurbeslag sinds 2014. Premium merken, duidelijke voorraadinformatie en snelle levering, voor
            particulieren en zakelijke klanten.
          </p>
        </div>

        <div>
          <p className="eyebrow text-paper/40!">Assortiment</p>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV.map((c) => (
              <li key={c.slug}>
                <Link href={`/categorie/${c.slug}`} className="hover:text-paper">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-paper/40!">Service</p>
          <ul className="mt-5 space-y-3 text-sm">
            {service.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-paper/40!">Contact</p>
          <address className="mt-5 space-y-3 text-sm not-italic">
            <p>
              <a href={site.whatsappHref} className="hover:text-paper">
                WhatsApp {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-paper">
                {site.email}
              </a>
            </p>
            <p>
              {site.street}
              <br />
              {site.postcode} {site.city}
              <br />
              <span className="text-paper/45">Geen bezoekadres</span>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-paper/40 sm:flex-row sm:justify-between">
          <p>
            © {site.name} · KvK {site.kvk} · btw {site.btw}
          </p>
          <p>Alle prijzen incl. 21% btw</p>
        </div>
      </div>
    </footer>
  );
}
