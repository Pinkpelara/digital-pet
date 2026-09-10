/**
 * Supabase-shaped client boundary.
 * Production: instantiate with NEXT_PUBLIC_SUPABASE_URL + ANON KEY.
 * Ownership writes must never use the anon client from the browser.
 */

export type SupabaseLikeError = { message: string };

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    configured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}

export const authProviders = ["google", "apple", "email"] as const;

export const clientWritePolicy = {
  ownership: "denied",
  companion_instances: "owner-update-only after server insert",
  equipped_items: "owner-update-only",
  unlocked_skills: "denied-client-insert",
  note: "The browser never inserts ownership. Purchases go Stripe → webhook → service role.",
};
