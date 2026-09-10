# Sillkin

Tiny creatures for your screen. Adopt one. Dress it. Teach it tricks. Then let it loose on your computer.

**Live site:** [https://pinkpelara.github.io/digital-pet/](https://pinkpelara.github.io/digital-pet/)

Sillkin is a **website-first** digital companion studio. Customers buy entitlements (companions, outfits, gadgets, skills, personality packs) that live in an account inventory — like a Roblox backpack, not a file download. This repository is the Next.js world. The Tauri desktop app is intentionally out of scope; download pages are honest stubs with `companions://` deep links.

## GitHub Pages

The site is a static export (`output: "export"`) with `basePath` / `assetPrefix` set to `/digital-pet` so assets resolve on the project Pages URL above.

A workflow at `.github/workflows/deploy-pages.yml` builds `out/` and deploys on push to `main` (and this feature branch, plus **Run workflow**). In the GitHub repo: **Settings → Pages → Source: GitHub Actions**.

On Pages, demo adoption, inventory, try-on, studio, gifts, and admin run entirely in the browser (`localStorage`). There is no Node server.

## Run locally (demo mode)

Demo mode is the default. You do **not** need Supabase or Stripe keys.

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Because `basePath` is `/digital-pet` by default, open [http://localhost:3000/digital-pet/](http://localhost:3000/digital-pet/). To serve at the site root instead:

```bash
GITHUB_PAGES=false npm run dev
```

- Living homepage: a creature on the nav, one behind the headline, one watching the cursor, one causing mild mischief.
- Store: `/companions`, `/closet`, `/gadgets`, `/skills`, `/personality`, `/drops`
- Try-on: open Bloop (or any companion) and equip a raincoat / play moonwalk
- Checkout: **Adopt** grants into the local nest and opens a parcel ceremony
- Gift: `/gift/WELCOME-BLOOP`
- Admin attic: `/admin` password `sillkin-admin`
- Pause roaming creatures in the header; `prefers-reduced-motion` is respected

```bash
npm run build          # static export → out/
npx serve out          # preview the Pages build (not `npm start`)
```

`npm start` is for a Node host after you turn export off. GitHub Pages only serves `out/`.

## Brand

**Sillkin** — kin that live on the window sill / the edge of your screen.

## Stack

- Next.js App Router + TypeScript (strict) + Tailwind CSS v4
- SVG/canvas-style creatures with a weighted idle / walk / nap / follow-cursor loop
- `@rive-app/react-canvas` ready — pass `riveSrc` when you have `.riv` files; SVG is the shipped fallback
- Supabase-shaped schema + RLS notes in `/supabase`
- Stripe Checkout session shape + webhook stub (kept under `src/server/api` for a later Vercel deploy)
- Analytics `track()` hooks (console in demo; swap in PostHog/GA via `window.silkinAnalytics`)

## Demo vs production

| | GitHub Pages / local demo | Production (Vercel + keys) |
| --- | --- | --- |
| Catalog | Seeded fixtures in `src/data/catalog.ts` | Same seed, admin overlay → Supabase `items` |
| Auth | Google / Apple / magic-link UI; local demo session | Supabase Auth (those three providers, no password-first) |
| Checkout | Client grant → `/adopt/success?items=…` | Restore `src/server/api` to `src/app/api`, Stripe Checkout Session |
| Ownership | `localStorage` key `sillkin.nest.v1` | Stripe webhook + service role insert. Client still never inserts. |
| Admin | Session unlock + local overlay | Service-role CRUD |

`isDemoMode()` is true unless **both** Supabase public keys and `STRIPE_SECRET_KEY` are set (or `NEXT_PUBLIC_DEMO_MODE=false`).

## Environment

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `GITHUB_PAGES` | Default on. Set to `false` to drop `/digital-pet` basePath and (when copied back) allow API routes |
| `NEXT_PUBLIC_DEMO_MODE` | Force demo on/off |
| `DEMO_GRANT_SECRET` | Signs the short-lived grant token (Node API only) |
| `ADMIN_PASSWORD` | `/admin` gate on a Node host (Pages demo uses `sillkin-admin`) |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Browser client (read + self profile) |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook / admin only |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Live checkout + verified events |

## Architecture

```
src/app/            static routes (no Route Handlers while exporting)
src/server/api/     Stripe/Supabase handlers — copy to src/app/api for Vercel
src/components/     creatures, store, studio, ceremony
src/data/catalog.ts seed SKUs and personalities
src/lib/server/     grants, catalog overlay, HMAC tokens (Node)
src/lib/state/      nest context (localStorage demo nest)
supabase/           schema.sql + RLS.md
```

**Security:** on a Node deploy, ownership is granted only on the server after a verified purchase (or a signed demo token). RLS denies client inserts on `ownership` and `unlocked_skills`. See `supabase/RLS.md`. The Pages preview stores the same nest shape locally so the UI can be tried without a backend.

**Sitemap:** `/` `/companions` `/companions/[slug]` `/closet` `/gadgets` `/skills` `/personality` `/drops` `/item/[slug]` `/my-companions` `/my-companions/studio` `/inventory` `/gift/[code]` `/profile/[public-id]` `/desktop` `/download/windows` `/download/mac` `/about` `/support` `/privacy` `/terms` `/admin` `/login` `/adopt/success`

## Desktop stubs

- `/desktop`, `/download/windows`, `/download/mac`
- Deep links: `companions://home`, `companions://adopt/{id}`, `companions://download/{platform}`
- No Tauri code in this repo

## Audience & commerce

13+ / general. Adult account and payment. No kids chat, no social feed, no loot boxes. Fixed transparent prices. Limited drops are timed listings, not gacha.

## Deploy

**GitHub Pages (current):** push to `main` (or run the workflow). Live URL: https://pinkpelara.github.io/digital-pet/

**Vercel (later):** copy `src/server/api` → `src/app/api`, set `GITHUB_PAGES=false`, remove or gate `output: "export"`. Set env vars in the project. Point Stripe webhooks at `/api/webhooks/stripe`. Apply `supabase/schema.sql` before flipping demo mode off.
