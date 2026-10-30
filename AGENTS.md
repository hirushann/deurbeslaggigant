<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- Storefront redesign of deurbeslaggigant.nl (WordPress + WooCommerce). UI copy is Dutch; keep it that way.
- All catalogue access goes through `lib/woo.ts` (live WooCommerce Store API, cached). Don't fetch WordPress elsewhere.
- The WordPress host throttles bursts (HTTP 508, dropped connections): never fire many API calls in parallel.
  `lib/woo.ts` already queues and retries; build on it instead of calling `fetch` yourself.
- `cacheComponents` is on: wrap anything reading `searchParams` in `<Suspense>`; dynamic routes have a `loading.tsx`.
- Shop facts (phone, address, KvK, shipping threshold and costs, order cut-off) live in `site` in `lib/format.ts`. Use them, don't hard-code.
- Design tokens are in `app/globals.css`. Use them rather than raw colours:
  - Surfaces: `bg-paper` (page), `bg-surface` (white cards), `bg-stone`, `bg-sand` (amber tint), `bg-ink` (dark panels).
  - Text: `text-ink`, `text-ink-soft`, `text-muted`; `text-amber-deep` for readable amber on light.
  - Accent: `bg-amber` is the one brand colour. Primary buying actions are amber with ink text; secondary actions are ink.
  - Type: `display` (Bricolage Grotesque headings), `eyebrow` (small caps label), `container-page` (page width and gutters).
  - Shapes: cards `rounded-xl`/`rounded-2xl` with `border-line`; big feature panels `rounded-3xl`; buttons and chips `rounded-full`.
- Don't invent brand facts or claims in copy; use only what DeurbeslagGigant publishes on its current site.
- There is no showroom or visiting address for DeurbeslagGigant (the Soest showroom belongs to sister site JMO Design).
- See README.md for the open to-do list.
