import { ArrowRight, ArrowUpRight, Building2, Check, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { formatPrice, site } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";
import { getBrands, getCategory, getProducts, NAV } from "@/lib/woo";

const U = "https://deurbeslaggigant.nl/wp-content/uploads";

/** Shortcuts the current homepage promotes, plus a few of the busiest subcategories. */
const QUICK_LINKS = [
  { slug: "deurklinken", label: "Deurklinken" },
  { slug: "zwart-deurbeslag", label: "Zwart deurbeslag" },
  { slug: "voordeurknop", label: "Voordeurknoppen" },
  { slug: "veiligheidsrozetten-skg", label: "SKG*** rozetten" },
  { slug: "raamuitzetter", label: "Raamuitzetters" },
  { slug: "deurstopper", label: "Deurstoppers" },
  { slug: "huisnummers", label: "Huisnummers" },
  { slug: "kapstokhaken", label: "Kapstokhaken" },
];

const COLLECTIONS = [
  {
    title: "JNF Stout",
    href: "/categorie/jnf-stout-serie",
    image: `${U}/2023/05/main-slider4.png.webp`,
    text: "Voor ieder modern interieur. In RVS, titanium gold, black of copper, met bijpassende deurknoppen, raamkrukken en meubelgreepjes.",
  },
  {
    title: "GPF Entree",
    href: "/zoeken?q=entree",
    image: `${U}/2023/05/slide-image1-gpf-1024x590.png`,
    text: "Toegankelijk geprijsd en standaard met rond rozet. In RVS, zwart, wit en goud.",
  },
  {
    title: "GPF Anastasius",
    href: "/zoeken?q=anastasius",
    image: `${U}/2023/05/slide-image3-gpf.webp`,
    text: "Hoogwaardig gecoat in vier trendkleuren: dark, bronze, mocca en champagne blend.",
  },
];

/** Hand-picked tile photos (from the current homepage) where the top product isn't representative. */
const TILE_IMAGES: Record<string, string> = {
  "deurbeslag-binnendeur": `${U}/2025/03/gpf610vzr-deurkruk-op-rozet-zwart-rechtswijzend3.webp`,
  "deurbeslag-buitendeur": `${U}/2025/03/voordeurknop.webp`,
};

const withImage = (products: ProductSummary[]) => products.filter((p) => p.image);

async function categoryTile(slug: string) {
  const category = await getCategory(slug);
  if (!category) return null;
  const image = TILE_IMAGES[slug] ?? category.image ?? (await getProducts({ category: category.id, perPage: 1 })).products[0]?.image ?? null;
  return { category, image };
}

export default async function Home() {
  // Sequential groups on purpose: the WordPress host throttles bursts (see lib/woo.ts).
  const tiles = await Promise.all(NAV.map(async (n) => ({ ...n, tile: await categoryTile(n.slug) })));
  const handles = await getCategory("deurklinken");
  const [popular, newest, brands, total] = await Promise.all([
    getProducts({ category: handles?.id, perPage: 12, sort: "populair" }),
    getProducts({ perPage: 12, sort: "nieuw" }),
    getBrands(),
    getProducts({ perPage: 1 }).then((r) => r.total),
  ]);
  const roundedTotal = Math.floor(total / 500) * 500;
  const brandList = brands.filter((b) => b.count > 0).sort((a, b) => b.count - a.count);

  return (
    <>
      {/* Hero */}
      <section className="container-page pt-6 lg:pt-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-between rounded-3xl bg-ink p-7 text-paper sm:p-10 lg:p-12">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-paper/10 px-3 py-1.5 text-xs font-medium text-paper/80 animate-fade-up">
                <span className="size-1.5 rounded-full bg-amber" /> Online deurbeslagspecialist sinds 2014
              </p>
              <h1 className="display mt-7 text-[2.9rem] animate-fade-up [animation-delay:80ms] sm:text-7xl lg:text-[4.75rem]">
                Premium deurbeslag, <span className="text-amber">morgen in huis.</span>
              </h1>
              <p className="mt-6 max-w-md leading-relaxed text-paper/65 animate-fade-up [animation-delay:160ms]">
                Deurklinken, raambeslag, schuifdeurbeslag en meer van topmerken als GPF, JNF en Mi Satori. Bij elk product
                ziet u direct de voorraad en levertijd.
              </p>
            </div>
            <div className="mt-10 animate-fade-up [animation-delay:240ms]">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/categorie/deurbeslag-binnendeur"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-ink transition hover:bg-paper"
                >
                  Shop deurbeslag <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/merken"
                  className="inline-flex h-12 items-center rounded-full border border-paper/20 px-6 text-sm font-medium transition hover:border-paper"
                >
                  Bekijk merken
                </Link>
              </div>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-paper/10 pt-6">
                {[
                  { value: `${roundedTotal.toLocaleString("nl-NL")}+`, label: "producten" },
                  { value: "2000+", label: "uit voorraad" },
                  { value: `${brandList.length}`, label: "topmerken" },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="display text-3xl sm:text-4xl">{s.value}</dd>
                    <dd className="mt-1 text-xs text-paper/50">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[1.35fr_1fr]">
            <Link
              href="/zoeken?q=entree"
              className="group relative flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl bg-surface p-7 sm:col-span-2 lg:col-span-1"
            >
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-amber-deep!">Uitgelicht</p>
                  <p className="display mt-2 text-3xl sm:text-4xl">GPF Entree collectie</p>
                  <p className="mt-2 max-w-xs text-sm text-muted">Standaard met rozet, in vier afwerkingen.</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper transition group-hover:bg-amber">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
              <Image
                src={`${U}/2023/05/slide-image1-gpf-1024x590.png`}
                alt="GPF Entree deurkrukken in RVS, wit, goud en zwart"
                width={1024}
                height={590}
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="ml-auto w-[85%] max-w-lg transition duration-700 group-hover:scale-[1.03]"
              />
            </Link>
            <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-1">
              <Link
                href="/categorie/veiligheidsbeslag"
                className="group flex flex-col justify-between rounded-3xl bg-amber p-6 text-ink transition hover:brightness-105"
              >
                <ShieldCheck className="size-7" />
                <div>
                  <p className="display mt-6 text-2xl sm:text-3xl">Veiligheids&shy;beslag</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium">
                    SKG*** gekeurd <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
              <Link
                href="/offerte-aanvragen"
                className="group flex flex-col justify-between rounded-3xl bg-sand p-6 transition hover:bg-stone"
              >
                <Building2 className="size-7 text-amber-deep" />
                <div>
                  <p className="display mt-6 text-2xl sm:text-3xl">Zakelijk bestellen</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-ink-soft">
                    Offerte op maat <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Populaire categorieën" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.slug}
              href={`/categorie/${l.slug}`}
              className="h-10 shrink-0 rounded-full border border-line bg-surface px-4 text-sm leading-10 font-medium whitespace-nowrap text-ink-soft transition hover:border-ink hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </section>

      {/* Categories */}
      <section className="container-page mt-24">
        <SectionHeading eyebrow="Assortiment" title="Shop per categorie" href="/merken" linkLabel="Shop per merk" />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {tiles.map((t, i) =>
            t.tile ? (
              <li key={t.slug} className={i === 0 ? "col-span-2 sm:col-span-1 lg:col-span-2 lg:row-span-2" : ""}>
                <Link
                  href={`/categorie/${t.slug}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 transition hover:border-line-strong hover:shadow-[var(--shadow-card)] ${
                    i === 0 ? "aspect-[4/3] sm:aspect-square lg:aspect-auto" : "aspect-square"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <p className={`display ${i === 0 ? "text-3xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-2xl"}`}>{t.label}</p>
                      <p className="mt-1 text-xs text-muted tabular-nums">
                        {t.tile.category.count.toLocaleString("nl-NL")} producten
                      </p>
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper transition group-hover:bg-amber">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  {t.tile.image && (
                    <div className="relative mt-3 flex-1">
                      <Image
                        src={t.tile.image}
                        alt=""
                        fill
                        sizes={i === 0 ? "(min-width: 1024px) 45vw, 90vw" : "(min-width: 1024px) 22vw, 45vw"}
                        className="rounded-lg object-contain mix-blend-multiply transition duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                </Link>
              </li>
            ) : null,
          )}
          <li>
            <Link
              href="/merken"
              className="group flex aspect-square h-full flex-col justify-between rounded-2xl bg-ink p-5 text-paper"
            >
              <p className="display text-xl sm:text-2xl">Alle {brandList.length} merken</p>
              <ul className="space-y-1 text-sm text-paper/60">
                {brandList.slice(0, 4).map((b) => (
                  <li key={b.slug}>{b.name}</li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber">
                Bekijk merken <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* Popular */}
      <ProductRail
        eyebrow="Meest verkocht"
        title="Populaire deurklinken"
        products={withImage(popular.products).slice(0, 8)}
        href="/categorie/deurklinken"
      />

      {/* Collections */}
      <section className="container-page mt-24">
        <SectionHeading eyebrow="Collecties" title="Eén stijl, door het hele huis" />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <li key={c.title}>
              <Link
                href={c.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line-strong hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/10] bg-surface">
                  <Image
                    src={c.image}
                    alt={`${c.title} collectie`}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-contain p-6 transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col border-t border-line p-6">
                  <p className="display text-2xl">{c.title}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
                    Bekijk collectie <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Security */}
      <section className="container-page mt-24">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl bg-ink text-paper lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="eyebrow text-amber!">Veiligheid</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">Extra inbraakwerend met een veiligheidsrozet</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-paper/65">
              Een veiligheidsrozet met kerntrekbeveiliging beschermt de cilinder van uw buitendeur. Door de dikte van het
              schild kan een inbreker de cilinder minder makkelijk uitboren, en hoe langer een poging duurt, hoe eerder hij
              opgeeft.
            </p>
            <ul className="mt-8 grid gap-3 text-sm text-paper/80">
              {[
                "Beoordeeld door SKG (Stichting Kwaliteit Gevelbouw)",
                "Keurmerk met 1, 2 of 3 sterren voor de mate van inbraakwerendheid",
                "Rozetten en schilden met anti-kerntrek",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-amber" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/categorie/veiligheidsrozetten-skg"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-ink transition hover:bg-paper"
              >
                SKG*** rozetten <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/categorie/veiligheidsbeslag"
                className="inline-flex h-12 items-center rounded-full border border-paper/20 px-6 text-sm font-medium transition hover:border-paper"
              >
                Al het veiligheidsbeslag
              </Link>
            </div>
          </div>
          <div className="relative grid min-h-72 place-items-center bg-[radial-gradient(circle_at_50%_45%,rgb(244_165_28/0.25),transparent_60%)]">
            <ShieldCheck className="size-40 text-amber/80 sm:size-56" strokeWidth={1} />
            <p className="absolute bottom-8 display text-6xl text-amber sm:text-7xl">SKG***</p>
          </div>
        </div>
      </section>

      {/* Newest */}
      <ProductRail
        eyebrow="Net binnen"
        title="Nieuwste artikelen"
        products={withImage(newest.products).slice(0, 8)}
      />

      {/* Brands */}
      <section className="mt-24 overflow-hidden border-y border-line bg-surface py-9">
        <div className="flex w-max animate-marquee gap-14 pr-14 hover:[animation-play-state:paused]">
          {[...brandList, ...brandList].map((b, i) => (
            <Link
              key={`${b.slug}-${i}`}
              href={`/merken/${b.slug}`}
              aria-hidden={i >= brandList.length}
              tabIndex={i >= brandList.length ? -1 : undefined}
              className="display text-3xl whitespace-nowrap text-ink/25 transition hover:text-ink sm:text-4xl"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Service promise + B2B */}
      <section className="container-page mt-24 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
          <p className="eyebrow">Snel bestellen, snel leveren</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">
            Voor {site.orderCutoff} besteld, <em>morgen in huis</em>
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Bestellingen die voor {site.orderCutoff} uur geplaatst zijn, worden de dag erna geleverd, mits voorradig. Per
            product tonen we de voorraadstatus en levertijd. Wijken we daarvan af, dan laten we het u zo snel mogelijk
            weten.
          </p>
          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            <div className="flex justify-between py-3.5">
              <dt className="text-muted">Verzending onder {formatPrice(site.freeShippingFrom)}</dt>
              <dd className="font-medium tabular-nums">{formatPrice(site.shippingCost)}</dd>
            </div>
            <div className="flex justify-between py-3.5">
              <dt className="text-muted">Verzending vanaf {formatPrice(site.freeShippingFrom)}</dt>
              <dd className="font-medium text-ok">Gratis</dd>
            </div>
            <div className="flex justify-between py-3.5">
              <dt className="text-muted">Retourrecht particulieren</dt>
              <dd className="font-medium">30 dagen</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col justify-between rounded-3xl bg-sand p-8 sm:p-12">
          <div>
            <p className="eyebrow text-amber-deep!">Zakelijk</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">Voor aannemers, architecten en interieurdesigners</h2>
            <p className="mt-6 leading-relaxed text-ink-soft">
              We helpen niet alleen particulieren aan een deurkrukset, maar werken ook samen met professionals. Vraag een
              offerte aan voor uw project, of meld u aan voor een B2B-account bij onze groothandel{" "}
              <a href="https://www.bouwbeslag.nl" className="font-medium underline underline-offset-4 hover:text-amber-deep">
                bouwbeslag.nl
              </a>
              .
            </p>
          </div>
          <Link
            href="/offerte-aanvragen"
            className="mt-10 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition hover:bg-ink-soft"
          >
            Offerte aanvragen <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="container-page mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow">Over DeurbeslagGigant</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">Eerlijk advies, transparant over voorraad</h2>
        </div>
        <div className="space-y-5 leading-relaxed text-muted lg:pt-3">
          <p>
            Onze winkel is in 2014 opgericht door iemand die in een groothandel in deurkrukken werkte en bestaat uitsluitend
            online. Het team is klein en gedreven: we verkopen u precies wat u nodig heeft.
          </p>
          <p>
            We zijn altijd eerlijk en zo transparant mogelijk over levertijden, voorraad en advies. Elk product heeft
            duidelijke afbeeldingen en een vermelding van het aantal voorradige stuks.
          </p>
          <Link href="/over-ons" className="inline-flex items-center gap-2 font-semibold text-ink hover:text-amber-deep">
            Maak kennis met het team <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "Bekijk alles",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 text-4xl sm:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium transition hover:border-ink sm:inline-flex"
        >
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

function ProductRail({
  eyebrow,
  title,
  products,
  href,
}: {
  eyebrow: string;
  title: string;
  products: ProductSummary[];
  href?: string;
}) {
  if (!products.length) return null;
  return (
    <section className="container-page mt-24">
      <SectionHeading eyebrow={eyebrow} title={title} href={href} />
      <ul className="no-scrollbar -mx-4 mt-10 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id} className="flex w-[64vw] shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
