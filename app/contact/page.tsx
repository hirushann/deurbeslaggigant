import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met DeurbeslagGigant via e-mail of WhatsApp.",
};

const shortcuts = [
  { href: "/over-ons", label: "Over ons", text: "Wie we zijn en hoe we werken" },
  { href: "/retourneren", label: "Order retourneren", text: "Voorwaarden en aanmelden" },
  { href: "/offerte-aanvragen", label: "Offerte aanvragen", text: "Voor projecten en grotere orders" },
];

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Wij staan voor u klaar"
      crumb="Contact"
      intro={
        <p>
          Laat gerust uw vraag achter, dan nemen we zo snel mogelijk contact met u op. Misschien helpt een van deze
          pagina’s u al verder:
        </p>
      }
    >
      <ul className="mb-12 divide-y divide-line border-y border-line">
        {shortcuts.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="group flex items-center justify-between gap-4 py-5">
              <span>
                <span className="display block text-2xl">{s.label}</span>
                <span className="text-sm text-muted">{s.text}</span>
              </span>
              <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
      <EnquiryForm
        subject="Vraag via deurbeslaggigant.nl"
        fields={[
          { name: "naam", label: "Naam", required: true, half: true },
          { name: "telefoon", label: "Telefoon", type: "tel", half: true },
          { name: "email", label: "E-mailadres", type: "email", required: true },
          { name: "bericht", label: "Bericht", type: "textarea", required: true },
        ]}
      />
    </InfoPage>
  );
}
