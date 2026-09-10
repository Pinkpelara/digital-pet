export function isDemoMode(): boolean {
  const explicit = process.env.NEXT_PUBLIC_DEMO_MODE ?? process.env.DEMO_MODE;
  if (explicit === "false") return false;
  if (explicit === "true") return true;
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);
  return !(hasSupabase && hasStripe);
}

export function demoGrantSecret(): string {
  return process.env.DEMO_GRANT_SECRET ?? "sillkin-demo-grant-not-for-production";
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "sillkin-admin";
}
