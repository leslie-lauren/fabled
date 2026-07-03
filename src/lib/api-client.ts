import { supabase } from "@/lib/supabase";

/**
 * fetch() wrapper for authenticated API routes. Attaches the current Supabase
 * access token as a Bearer header so the server can verify the caller's
 * identity instead of trusting a user id from the request body.
 *
 * Use plain fetch() only for pre-auth endpoints (signup, join-info,
 * generate-aura-preview).
 */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  return fetch(input, { ...init, headers });
}
