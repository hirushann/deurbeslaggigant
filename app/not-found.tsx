import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Deze pagina bestaat niet (meer)</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Misschien is het product verhuisd. Zoek het op naam of artikelnummer, of ga terug naar de homepage.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-medium text-paper hover:bg-ink-soft">
          Naar de homepage
        </Link>
        <Link href="/zoeken" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium hover:border-ink">
          Zoeken
        </Link>
      </div>
    </div>
  );
}
