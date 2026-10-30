import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Over ons",
  description: "Wie er achter DeurbeslagGigant zitten en waar we voor staan: eerlijk advies en transparantie over voorraad en levertijd.",
};

const team = [
  {
    name: "Arthur",
    role: "Productspecialist",
    text: "Zit al zijn hele leven in het deurbeslag. Helpt met offertes en vragen over producten.",
  },
  {
    name: "Florentino",
    role: "Accountmanager",
    text: "Vooral bezig met zakelijke klanten. Belt u ons, dan krijgt u hem waarschijnlijk te spreken.",
  },
  {
    name: "Pieter",
    role: "Administratie & website",
    text: "Werkt vooral op de achtergrond, en beantwoordt af en toe een mailtje.",
  },
];

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="Over ons"
      title="Wij zijn DeurbeslagGigant"
      crumb="Over ons"
      intro={
        <>
          <p>
            Arthur startte rond 2010 met Deurkrukwinkel. In 2016 nam Florentino de zaak over en gaf de online verkoop en
            de betrouwbaarheid van de webshop een nieuwe impuls. In 2019 kwam Pieter erbij, eerst als websitemaker. In
            2020 besloten Pieter en Florentino een nieuwe naam te starten om alles op een gestroomlijnde manier te doen.
          </p>
          <p>
            Onze kernwaarden in het kort: we zijn altijd eerlijk en zo transparant mogelijk over levertijden, voorraad en
            advies. We helpen u liever goed zonder er iets aan te verdienen, dan dat we u met een lokkertje binnenhalen.
          </p>
        </>
      }
    >
      <h2 className="eyebrow">Wie doet wat?</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {team.map((m) => (
          <li key={m.name} className="rounded-2xl border border-line bg-surface p-6">
            <span className="display grid size-12 place-items-center rounded-full bg-amber text-xl">{m.name[0]}</span>
            <p className="display mt-5 text-2xl">{m.name}</p>
            <p className="text-sm font-medium text-amber-deep">{m.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{m.text}</p>
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}
