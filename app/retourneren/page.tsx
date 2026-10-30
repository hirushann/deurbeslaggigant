import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { formatPrice, site } from "@/lib/format";

export const metadata: Metadata = {
  title: "Retourneren",
  description: "Binnen 30 dagen ongebruikt retourneren. Bekijk de voorwaarden.",
};

const conditions = [
  "U meldt het retour eerst bij ons aan",
  "U heeft de bestelling minder dan 30 dagen geleden ontvangen",
  "Het product is ongebruikt en in originele staat, met verpakking en accessoires",
  "Het product is niet speciaal voor u besteld en geen maatwerk",
  "Na aanmelding is het pakket binnen 14 dagen bij ons",
];

const leniency = [
  { period: "30–40 dagen", refund: "100%" },
  { period: "40–60 dagen", refund: "80%" },
  { period: "60–90 dagen", refund: "65%" },
  { period: "90–180 dagen", refund: "45%" },
];

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Service"
      title="Retourneren"
      intro={
        <>
          <p>
            Wilt u als consument uw bestelling terugsturen? Dat kan binnen 30 dagen. U krijgt het betaalde bedrag terug
            zodra we het retour in goede staat hebben ontvangen.
          </p>
          <p className="text-sm">
            Had u één product besteld, dan vergoeden we ook de verzendkosten. De kosten om het pakket naar ons te
            sturen zijn voor u. Het retouradres ontvangt u na aanmelding; het wijkt af van ons postadres.
          </p>
        </>
      }
    >
      <div className="grid gap-10">
        <section>
          <h2 className="eyebrow">Voorwaarden</h2>
          <ol className="mt-5 divide-y divide-line border-y border-line">
            {conditions.map((c, i) => (
              <li key={c} className="flex gap-5 py-4 text-sm leading-relaxed">
                <span className="display text-xl text-amber">{i + 1}</span>
                {c}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="eyebrow">Toch wat later?</h2>
          <p className="mt-3 text-sm text-muted">Uit coulance accepteren we ook latere aanmeldingen:</p>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {leniency.map((l) => (
              <div key={l.period} className="flex justify-between py-3.5 text-sm">
                <dt>{l.period} na ontvangst</dt>
                <dd className="font-medium tabular-nums">{l.refund} terug</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Kunnen we een retour niet accepteren, bijvoorbeeld omdat het niet meer in originele staat is? Dan crediteren
            we 20% van het betaalde bedrag, of sturen we het voor {formatPrice(site.shippingCost)} verzendkosten naar u
            terug.
          </p>
        </section>
      </div>
    </InfoPage>
  );
}
