import { createClient } from "@supabase/supabase-js";

// Defensive: trim whitespace/newlines from env values. Vercel env vars can
// pick up trailing newlines when set via the dashboard, which makes the URL
// undici tries to fetch invalid ("fetch failed").
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

// Browser client (used in components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client with service role (used in API routes only)
export function createServerClient() {
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  return createClient(supabaseUrl, serviceRoleKey);
}

// Anon client for server-side use (e.g. auth signUp from API routes).
// Always go through this helper so env-value normalization (.trim) is applied.
export function createAnonClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
