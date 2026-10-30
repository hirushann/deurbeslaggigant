import { Mail, MapPin, MessageCircle } from "lucide-react";
import { site } from "@/lib/format";
import { Breadcrumbs } from "./breadcrumbs";

export function InfoPage({
  eyebrow,
  title,
  crumb = title,
  intro,
  children,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  /** Breadcrumb label; required when the title isn't plain text. */
  crumb?: React.ReactNode;
  intro: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="container-page pt-8">
      <Breadcrumbs items={[{ name: String(crumb) }]} />
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-4 max-w-[14ch] text-5xl sm:text-6xl lg:text-7xl">{title}</h1>
          <div className="mt-8 max-w-xl space-y-4 text-[1.05rem] leading-relaxed text-muted">{intro}</div>
          {children && <div className="mt-12">{children}</div>}
        </div>
        <div className="flex flex-col gap-4 lg:pt-10">{aside ?? <ContactCard />}</div>
      </div>
    </div>
  );
}

export function ContactCard() {
  const rows = [
    { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
    { icon: MessageCircle, label: "Telefoon & WhatsApp", value: site.phone, href: site.whatsappHref },
    {
      icon: MapPin,
      label: "Postadres, geen bezoekadres",
      value: `${site.street}, ${site.postcode} ${site.city}`,
      href: `https://maps.google.com/?q=${encodeURIComponent(`${site.street} ${site.postcode} ${site.city}`)}`,
    },
  ];
  return (
    <div className="rounded-2xl bg-ink p-8 text-paper sm:p-10">
      <p className="eyebrow text-paper/45!">Contact</p>
      <ul className="mt-8 space-y-6">
        {rows.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-paper/15 text-amber">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-xs text-paper/50">{label}</p>
              <a href={href} className="mt-0.5 block hover:text-amber">
                {value}
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-10 border-t border-paper/10 pt-6 text-xs leading-relaxed text-paper/45">
        Telegram: {site.telegram}
        <br />
        KvK {site.kvk} · btw {site.btw}
      </p>
    </div>
  );
}
