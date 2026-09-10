# Companions (temporary name)

Tiny digital creatures that actually live with you. Adopt one, give it a name, discover its
personality, dress it, give it gadgets, teach it skills — and eventually let it roam your computer.
Every adopted companion develops a little differently.

**Live site:** [https://pinkpelara.github.io/digital-pet/](https://pinkpelara.github.io/digital-pet/)

> The brand name is temporary (`TEMP_BRAND_NAME` in `src/lib/brand.ts`). Replace it in that one file
> and every visible string updates.

## The product thesis

**You do not choose its personality. You meet it.**

- A **species** has broad tendencies. An **adopted companion instance** gets a hidden personality
  seed (curiosity, courage, clinginess, sleepiness, sociability, mischief, energy, drama).
- Users never see numbers and cannot edit them with sliders. Personality is discovered through
  living together: "Mine is unbelievably cowardly." / "Yours sleeps constantly."
- Personality is **not for sale**. There are no personality packs. Objects and skills change
  *opportunities* for behaviour: a hammock means more naps, a skateboard means skating, a camera
  means photography, an explorer kit means expeditions.
- Ownership is permanent and lives in the account (Roblox-like inventory). No loot boxes, no
  currency, no downloadable zip files, no social feed.

## What exists today

| Surface | Status |
| --- | --- |
| Website (adopt, customize, live companions) | Live |
| Browser install / home screen | Live, where the browser supports it |
| Desktop roaming (transparent companion over your whole computer) | Prototype — **not shipped**, and no download pretends otherwise |

## GitHub Pages

Static export (`output: "export"`) with `basePath` / `assetPrefix` set to `/digital-pet`.

`.github/workflows/deploy-pages.yml` builds `out/` and deploys on push (plus **Run workflow**). If
the URL 404s, enable Pages once in **Settings → Pages** (GitHub Actions or `gh-pages` branch) and
re-run the workflow.

On Pages, adoption, inventory, studio, gifts, and admin run entirely in the browser
(`localStorage`). There is no Node server.

## Run locally (demo mode)

Demo mode is the default — no Supabase or Stripe keys needed.

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

`basePath` is `/digital-pet` by default, so open
[http://localhost:3000/digital-pet/](http://localhost:3000/digital-pet/). For the site root:

```bash
GITHUB_PAGES=false npm run dev
```

Things to try:

- **Homepage**: creatures moving in their pens, two Bloops behaving differently, gadget behaviour
  demo, "something happened while you were gone", desktop vision.
- **Adopt**: `/companions/bloop` → Adopt → parcel shakes → creature climbs out → name it →
  "[NAME] moved in." → "Where should [NAME] live?" (here / browser / desktop later).
- **My companions**: `/my-companions` → open one → profile with discovered personality, secrets,
  "What did they just do?" share card, and the "We think we figured [NAME] out" reveal card.
- **Studio**: `/my-companions/studio?id=…` → equip owned items, trigger taught skills.
- **Gift ceremony**: `/gift/WELCOME-BLOOP`, `/gift/TINY-PROBLEM`.
- **Where they live**: `/live` · browser: `/browser` · desktop (honest): `/desktop`
- **Admin catalogue**: `/admin`, password `companions-admin`
- **Accessibility**: pause creatures in the header; `prefers-reduced-motion` is respected everywhere.

```bash
npm run build          # static export → out/
npx serve out          # preview the Pages build
npm run lint
```

## Architecture notes

- **Individuality**: `src/lib/personality.ts` (seeds, discovery rules, reveal card copy),
  `src/lib/types.ts` (`CompanionInstance.seed`, `discovered`, `counters`, `secrets`, `bonds`),
  `src/lib/state/grant-demo.ts` (seed generated at adoption).
- **Behaviour engine**: `src/components/creatures/behavior.ts` — weighted moods driven by the seed.
  `src/components/creatures/LivePen.tsx` runs a creature inside a box; `RoamingCreature` / `WorldLayer`
  still roam the viewport.
- **Creature rendering**: lightweight SVG (`Creature.tsx`) with a Rive-ready swap
  (`RiveCreature.tsx`, pass `riveSrc`). A three.js figurine pipeline (`src/components/stage/*`) is
  preserved for future art direction — the product is **not** committed to 2D or 3D yet.
- **Commerce**: `items` in `src/data/catalog.ts`; kinds are `companion | outfit | gadget | skill |
  drop`. Server-authoritative grants in `src/lib/server/grants.ts` + `src/server/api/*`.
- **Production scaffolding**: Supabase schema/RLS in `supabase/`, Stripe Checkout + webhook stub in
  `src/server/api/`, `src/lib/stripe.ts`.

## Stack

- Next.js App Router + TypeScript (strict) + Tailwind CSS v4
- SVG creatures + Rive readiness + optional three.js figurine stage
- Supabase-shaped schema with RLS, Stripe session shape and webhook stub
- Demo mode / localStorage (`companions.nest.v2`) with the same code paths as production grants

## Demo vs production

| | GitHub Pages / local demo | Production (Vercel + keys) |
| --- | --- | --- |
| Catalog | Seeded fixtures in `src/data/catalog.ts` | Same seed, admin overlay → Supabase `items` |
| Auth | Google / Apple / magic-link UI; local demo session | Supabase Auth (those three providers, no password-first) |
| Checkout | Client grant → `/adopt/success?items=…` | Restore `src/server/api` to `src/app/api`, Stripe Checkout |
| Ownership | `localStorage` key `companions.nest.v2` | Stripe webhook + service role insert. Client never inserts. |
| Personality seed | Generated in the browser at adoption | Generated server-side at grant; never client-writable |
| Admin | Session unlock + local overlay | Service-role CRUD |

`isDemoMode()` is true unless **both** Supabase public keys and `STRIPE_SECRET_KEY` are set (or
`NEXT_PUBLIC_DEMO_MODE=false`).
