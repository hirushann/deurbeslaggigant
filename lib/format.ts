const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value: number) {
  return euro.format(value);
}

const named: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  hellip: "…",
  euro: "€",
  times: "×",
};

/** Decode the HTML entities WordPress puts in names and titles. */
export function decodeEntities(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return named[code.toLowerCase()] ?? match;
  });
}

export function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

export const site = {
  name: "DeurbeslagGigant",
  url: "https://deurbeslaggigant.nl",
  email: "info@deurbeslaggigant.nl",
  phone: "0578-760509",
  phoneHref: "tel:+31578760509",
  whatsappHref: "https://wa.me/31578760509",
  telegram: "Deurbeslaggigant",
  /** Postal address only; there is no showroom. */
  street: "Oenerweg 30",
  postcode: "8181 RJ",
  city: "Heerde",
  kvk: "77245350",
  btw: "NL003174000B88",
  freeShippingFrom: 100,
  shippingCost: 6.95,
  orderCutoff: "13:00",
};
