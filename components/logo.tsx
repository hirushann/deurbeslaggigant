import Image from "next/image";
import Link from "next/link";

/**
 * The DeurbeslagGigant wordmark is an amber mark with dark text, made for light backgrounds.
 * On dark backgrounds `invert hue-rotate-180` flips the text to light while keeping the amber.
 */
export function Logo({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`} aria-label="DeurbeslagGigant — naar de homepage">
      <Image
        src="/dg-logo.png"
        alt=""
        width={1148}
        height={167}
        priority
        className={`h-6 w-auto sm:h-7 lg:h-8 ${tone === "dark" ? "invert hue-rotate-180" : ""}`}
      />
    </Link>
  );
}
