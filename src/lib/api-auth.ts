import { NextRequest } from "next/server";
import { createAnonClient } from "@/lib/supabase";

/**
 * Verifies the Supabase access token sent in the Authorization header and
 * returns the authenticated user id, or null if the request is unauthenticated
 * or the token is invalid. API routes should trust THIS id, never a user id
 * taken from the request body.
 */
export async function getAuthUserId(req: NextRequest): Promise<string | null> {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header || !header.startsWith("Bearer ")) return null;

  const token = header.slice(7).trim();
  if (!token) return null;

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}
