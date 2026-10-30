# DeurbeslagGigant — Next.js redesign

A redesign of [deurbeslaggigant.nl](https://deurbeslaggigant.nl) (WordPress + WooCommerce, Shoptimizer theme) as a Next.js 16
storefront. WordPress stays the back office: products, prices, stock and images are read live from its WooCommerce Store API.

The architecture is shared with the JMO Design storefront (`../jmodesign`), which runs on the same kind of WooCommerce setup.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## How it fits together

| Path | What it is |
| --- | --- |
| `app/page.tsx` | Homepage: hero, quick links, categories, popular handles, collections, security (SKG), newest, brands, service + B2B, about |
| `app/categorie/[slug]` | Category page, server-side paging and sorting (`?pagina=2&sorteer=prijs-oplopend`) |
| `app/merken`, `app/merken/[slug]` | Brand index and per-brand product listing |
| `app/product/[slug]` | Product page: gallery, buy box, favourites, specs, related products, JSON-LD |
| `app/zoeken`, `app/api/search` | Search page and the JSON endpoint behind the header's live search |
| `app/winkelwagen`, `app/favorieten` | Cart and favourites, stored in the visitor's browser. **Checkout is not connected yet** |
| `app/{contact,offerte-aanvragen,retourneren,over-ons}` | Info pages; forms open a pre-filled e-mail |
| `app/[...legacy]` | Old WordPress URLs (`/{product}/`, `/{parent}/{category}/`) → 308 to the new URL, unknown paths → search |
| `lib/woo.ts` | All WooCommerce access, cached with `"use cache"` (`hours` for products, `days` for categories/brands) |
| `lib/format.ts` | Price formatting and `site`: contact details, shipping threshold/costs, order cut-off |
| `components/` | UI. `cart/` and `favorites/` are client-side contexts |

## Design

Light, crisp storefront built around the amber of the existing logo.

- Colours (`app/globals.css`): paper `#f4f3ef`, white surfaces, ink `#15171c`, amber `#f4a51c` (amber-deep `#9a5d00` for text), sand `#fcefd2`.
- Type: Bricolage Grotesque for headings (`display`), Geist for body text.
- Amber = buy. Primary purchase buttons are amber; everything else is ink or outlined.
- Product cards are white bordered cards with stock status and an add-to-cart button always visible.

## Notes on the WordPress host

- The host answers bursts with **HTTP 508** and sometimes drops connections. `lib/woo.ts` limits concurrent requests and retries
  network errors and 5xx with backoff, and `next.config.ts` keeps build concurrency low. Product images can also fail on first
  load for the same reason; they recover once the image optimizer has them cached.
- WooCommerce's "Uncategorized" category holds ~2,900 products; it's hidden from navigation and those products are only reachable via
  search and brand pages. Worth categorising in WordPress.
- Some products have internal notes in the SKU field; `lib/woo.ts` hides SKUs that aren't a single code.
- Products with price 0 are shown as price-on-request.

## Still to do

- **Checkout**: connect the cart to WooCommerce's Store API cart/checkout (Mollie is the payment provider in WordPress).
- **Filters** on category pages (brand, in stock, price, finish). The Store API supports `brand`, `stock_status`,
  `min_price`/`max_price` and attribute filters; several category descriptions already mention filters.
- **Kennisbank** (knowledge base) and legal pages (algemene voorwaarden, privacy policy) from WordPress pages/posts.
- **Forms**: replace the `mailto:` handler in `components/enquiry-form.tsx` with a server action plus e-mail provider; the returns form
  should show the return address after submitting, as the current site does.
- **Product sitemap**: 8.5k product URLs belong in a split sitemap (`generateSitemaps`).
- **Cache invalidation**: call `revalidateTag("products")` from a WooCommerce webhook for instant stock/price updates.
- **Full production build** has only been compile-checked; the prerender step reads the live API and should be run once against
  the host (or a staging copy) before deploying.
