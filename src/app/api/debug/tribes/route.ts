import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const supabase = createServerClient();

  // 1. Check tribe_members for this user
  const { data: memberships, error: memErr } = await supabase
    .from("tribe_members")
    .select("*")
    .eq("user_id", userId);

  // 2. Check all tribes created by this user
  const { data: createdTribes, error: tribeErr } = await supabase
    .from("tribes")
    .select("*")
    .eq("created_by", userId);

  // 3. Check if role column exists by querying tribe_members columns
  const { data: roleTest, error: roleErr } = await supabase
    .from("tribe_members")
    .select("role")
    .limit(1);

  console.log("=== DEBUG: Tribe Diagnostics ===");
  console.log("User ID:", userId);
  console.log("Memberships:", JSON.stringify(memberships, null, 2));
  console.log("Membership query error:", memErr);
  console.log("Tribes created by user:", JSON.stringify(createdTribes, null, 2));
  console.log("Tribe query error:", tribeErr);
  console.log("Role column test:", JSON.stringify(roleTest, null, 2));
  console.log("Role column error:", roleErr);
  console.log("=== END DEBUG ===");

  return NextResponse.json({
    memberships: memberships || [],
    membershipError: memErr?.message || null,
    createdTribes: createdTribes || [],
    createdTribesError: tribeErr?.message || null,
    roleColumnTest: roleTest ? "exists" : "missing/error",
    roleColumnError: roleErr?.message || null,
  });
}
