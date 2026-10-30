"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/format";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea";
  required?: boolean;
  half?: boolean;
  placeholder?: string;
};

/**
 * Collects an enquiry and opens it as a pre-filled e-mail.
 * Swap `onSubmit` for a server action once a mail/CRM backend is chosen.
 */
export function EnquiryForm({
  subject,
  fields,
  submitLabel = "Versturen",
}: {
  subject: string;
  fields: Field[];
  submitLabel?: string;
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = fields
      .map((f) => `${f.label}: ${data.get(f.name) ?? ""}`)
      .join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const input =
    "w-full rounded-lg border border-line bg-surface px-4 py-3 text-[0.95rem] outline-none transition placeholder:text-muted/70 focus:border-ink focus:shadow-[0_0_0_4px_rgb(160_123_82/0.15)]";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8">
      {fields.map((f) => (
        <label key={f.name} className={`flex flex-col gap-2 ${f.half ? "" : "sm:col-span-2"}`}>
          <span className="text-sm font-medium">
            {f.label}
            {f.required && <span className="text-amber-deep"> *</span>}
          </span>
          {f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} rows={5} placeholder={f.placeholder} className={input} />
          ) : (
            <input name={f.name} type={f.type ?? "text"} required={f.required} placeholder={f.placeholder} className={input} />
          )}
        </label>
      ))}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          {sent
            ? "Uw e-mailprogramma is geopend met uw bericht. Verstuur het daar."
            : "We reageren binnen een werkdag."}
        </p>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 font-medium text-paper transition hover:bg-ink-soft"
        >
          {submitLabel}
          <Send className="size-4" />
        </button>
      </div>
    </form>
  );
}
