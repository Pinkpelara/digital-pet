# Server API routes (kept for Vercel / Supabase)

GitHub Pages is static-only. These Route Handlers used to live under `src/app/api/` and **must not** sit there while `output: "export"` is on — `next build` would fail.

They are preserved here so a later Node host can restore them:

1. Copy this folder back to `src/app/api/` (keep the same nested paths).
2. In `next.config.ts`, set `GITHUB_PAGES=false` (or remove `output: "export"`) so the app is a Node server again.
3. Point Stripe webhooks at `/api/webhooks/stripe`.

The GitHub Pages demo does **not** call these handlers. Adoption, inventory, customization, studio, gifts, and admin all run in the browser against `localStorage`. Personality seeds are generated at adoption — on a real host, server-side.
