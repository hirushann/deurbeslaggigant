import { Clock, MessageCircle, Truck } from "lucide-react";
import { getNavigation } from "@/lib/woo";
import { formatPrice, site } from "@/lib/format";
import { HeaderBar } from "./header-bar";

export async function Header() {
  const nav = await getNavigation();

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-[0.75rem] text-paper/75">
        <div className="container-page flex h-9 items-center justify-center gap-8 md:justify-between">
          <p className="flex items-center gap-2">
            <Truck className="size-3.5 text-amber" />
            Gratis verzending vanaf {formatPrice(site.freeShippingFrom)}
          </p>
          <p className="hidden items-center gap-2 md:flex">
            <Clock className="size-3.5 text-amber" />
            Voor {site.orderCutoff} besteld, morgen in huis (mits op voorraad)
          </p>
          <a href={site.whatsappHref} className="hidden items-center gap-2 hover:text-paper md:flex">
            <MessageCircle className="size-3.5 text-amber" />
            WhatsApp {site.phone}
          </a>
        </div>
      </div>
      <HeaderBar nav={nav} />
    </header>
  );
}
