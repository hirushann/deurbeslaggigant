import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Offerte aanvragen",
  description: "Vraag een offerte aan voor uw project of grotere bestelling. Ook op basis van tekeningen.",
};

export default function QuotePage() {
  return (
    <InfoPage
      eyebrow="Projecten"
      title="Offerte op maat"
      crumb="Offerte aanvragen"
      intro={
        <p>
          Werkt u aan een verbouwing, nieuwbouw of interieurproject? Stuur ons uw wensen, aantallen of tekeningen en we
          maken een voorstel voor bijpassend deur-, raam- en meubelbeslag in één uniforme stijl.
        </p>
      }
    >
      <EnquiryForm
        subject="Offerteaanvraag"
        submitLabel="Offerte aanvragen"
        fields={[
          { name: "naam", label: "Naam", required: true, half: true },
          { name: "bedrijf", label: "Bedrijf (optioneel)", half: true },
          { name: "email", label: "E-mailadres", type: "email", required: true, half: true },
          { name: "telefoon", label: "Telefoon", type: "tel", half: true },
          {
            name: "project",
            label: "Uw project",
            type: "textarea",
            required: true,
            placeholder: "Bijv. 14 binnendeuren, deurkrukken mat zwart met bijpassende vrij- en bezetgarnituren",
          },
        ]}
      />
    </InfoPage>
  );
}
