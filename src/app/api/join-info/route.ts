import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Public endpoint: fetch tribe + sharer info for the conversion landing page.
 * No auth required — uses service role to bypass RLS.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Fetch tribe
  const { data: tribe } = await supabase
    .from("tribes")
    .select("id, name, invite_code, created_by")
    .eq("invite_code", code)
    .single();

  if (!tribe) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  // Member count
  const { count } = await supabase
    .from("tribe_members")
    .select("*", { count: "exact", head: true })
    .eq("tribe_id", tribe.id);

  // Leader's aura
  const { data: leaderAura } = await supabase
    .from("auras")
    .select("*")
    .eq("user_id", tribe.created_by)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Leader's name
  const { data: leaderUser } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", tribe.created_by)
    .single();

  return NextResponse.json({
    tribe: {
      id: tribe.id,
      name: tribe.name,
      invite_code: tribe.invite_code,
    },
    memberCount: count || 0,
    sharerName: leaderUser?.display_name || "",
    sharerAura: leaderAura || null,
  });
}
