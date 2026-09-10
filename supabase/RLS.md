# Row Level Security notes

Companions treats **ownership as a server-side fact**. The browser is a view, not a ledger.

## Who may write what

| Table | Anon | Authenticated client | Service role (webhook / admin) |
| --- | --- | --- | --- |
| `items`, `companions` | read active | read active | full CRUD |
| `ownership` | none | **select own rows only** | insert after verified Stripe event |
| `companion_instances` | none | select + update name only | insert when a companion SKU is granted (seed generated server-side) |
| `equipped_items` | none | upsert own instance slots | optional repair |
| `unlocked_skills` | none | select | insert when a skill SKU is granted |
| `discoveries` | none | select | insert |
| `users` | none | select/update self | insert on first auth |

## Hard rules

1. The Next.js client **never** inserts into `ownership`. Demo mode still goes through `POST /api/ownership/grant` with a signed token.
2. Stripe `checkout.session.completed` is verified, then granted **idempotently** via `stripe_event_id` uniqueness.
3. Gift redemptions and admin jobs use the same grant function.
4. Customization (outfits) is the one client write: `equipped_items` for instances the user already owns. Behaviour counters and discovered traits are written by the server, never set by the client.
5. If a policy looks like it would allow `insert` on `ownership`, it is a bug.

## Demo vs production

- Demo: in-memory maps in `src/lib/server/grants.ts` plus `localStorage` cache of what the API already granted.
- Production: this SQL on Supabase; webhook uses `SUPABASE_SERVICE_ROLE_KEY`.
