# Sillkin

Tiny creatures for your screen. Adopt one. Dress it. Teach it tricks. Then let it loose on your computer.

Sillkin is a **website-first** digital companion studio. Customers buy entitlements (companions, outfits, gadgets, skills, personality packs) that live in an account inventory — like a Roblox backpack, not a file download. This repository is the Next.js world. The Tauri desktop app is intentionally out of scope; download pages are honest stubs with `companions://` deep links.

## Run locally (demo mode)

Demo mode is the default. You do **not** need Supabase or Stripe keys.

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Living homepage: a creature on the nav, one behind the headline, one watching the cursor, one causing mild mischief.
- Store: `/companions`, `/closet`, `/gadgets`, `/skills`, `/personality`, `/drops`
- Try-on: open Bloop (or any companion) and equip a raincoat / play moonwalk
- Checkout: **Adopt** simulates Stripe and opens a parcel ceremony
- Gift: `/gift/WELCOME-BLOOP`
- Admin attic: `/admin` password `sillkin-admin`
- Pause roaming creatures in the header; `prefers-reduced-motion` is respected

```bash
npm run build
npm start
```

## Brand

**Sillkin** — kin that live on the window sill / the edge of your screen.

## Stack

- Next.js App Router + TypeScript (strict) + Tailwind CSS v4
- SVG/canvas-style creatures with a weighted idle / walk / nap / follow-cursor loop
- `@rive-app/react-canvas` ready — pass `riveSrc` when you have `.riv` files; SVG is the shipped fallback
- Supabase-shaped schema + RLS notes in `/supabase`
- Stripe Checkout session shape + webhook stub that grants ownership **idempotently**
- Analytics `track()` hooks (console in demo; swap in PostHog/GA via `window.silkinAnalytics`)

## Demo vs production

| | Demo (no keys) | Production |
| --- | --- | --- |
| Catalog | Seeded fixtures in `src/data/catalog.ts` | Same seed, admin overlay → Supabase `items` |
| Auth | Google / Apple / magic-link UI; local demo session | Supabase Auth (those three providers, no password-first) |
| Checkout | `POST /api/checkout` returns `/adopt/success?token=…` | Stripe Checkout Session, same success path |
| Ownership | `POST /api/ownership/grant` verifies HMAC token, writes process memory; client caches the **result** | Stripe webhook + service role insert. Client still never inserts. |
| Admin | Cookie + in-memory product overlay | Service-role CRUD |

`isDemoMode()` is true unless **both** Supabase public keys and `STRIPE_SECRET_KEY` are set (or `NEXT_PUBLIC_DEMO_MODE=false`).

## Environment

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_DEMO_MODE` | Force demo on/off |
| `DEMO_GRANT_SECRET` | Signs the short-lived grant token |
| `ADMIN_PASSWORD` | `/admin` gate (default `sillkin-admin`) |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Browser client (read + self profile) |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook / admin only |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Live checkout + verified events |

## Architecture

```
src/app/            routes + API
src/components/     creatures, store, studio, ceremony
src/data/catalog.ts seed SKUs and personalities
src/lib/server/     grants, catalog overlay, HMAC tokens
src/lib/state/      nest context (local cache of server grants)
supabase/           schema.sql + RLS.md
```

**Security:** ownership is granted only on the server after a verified purchase (or a signed demo token). RLS denies client inserts on `ownership` and `unlocked_skills`. See `supabase/RLS.md`.

**Sitemap:** `/` `/companions` `/companions/[slug]` `/closet` `/gadgets` `/skills` `/personality` `/drops` `/item/[slug]` `/my-companions` `/my-companions/[id]` `/inventory` `/gift/[code]` `/profile/[public-id]` `/desktop` `/download/windows` `/download/mac` `/about` `/support` `/privacy` `/terms` `/admin` `/login` `/adopt/success`

## Desktop stubs

- `/desktop`, `/download/windows`, `/download/mac`
- Deep links: `companions://home`, `companions://adopt/{id}`, `companions://download/{platform}`
- No Tauri code in this repo

## Audience & commerce

13+ / general. Adult account and payment. No kids chat, no social feed, no loot boxes. Fixed transparent prices. Limited drops are timed listings, not gacha.

## Deploy

Vercel-ready: Next.js default build. Set env vars in the project. Point Stripe webhooks at `/api/webhooks/stripe`. Apply `supabase/schema.sql` before flipping demo mode off.
