import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, tribeId } = await req.json();
    const supabase = createServerClient();

    // Check if leaving user is leader
    const { data: leavingMember } = await supabase
      .from("tribe_members")
      .select("role")
      .eq("user_id", userId)
      .eq("tribe_id", tribeId)
      .single();

    const wasLeader = leavingMember?.role === "leader";

    // Remove membership
    const { error } = await supabase
      .from("tribe_members")
      .delete()
      .eq("user_id", userId)
      .eq("tribe_id", tribeId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Check remaining members
    const { data: remaining } = await supabase
      .from("tribe_members")
      .select("user_id, joined_at")
      .eq("tribe_id", tribeId)
      .order("joined_at", { ascending: true });

    if (!remaining || remaining.length === 0) {
      // Tribe is empty, delete it
      await supabase.from("tribes").delete().eq("id", tribeId);
    } else if (wasLeader) {
      // Auto-transfer leadership to earliest-joined remaining member
      await supabase
        .from("tribe_members")
        .update({ role: "leader" })
        .eq("tribe_id", tribeId)
        .eq("user_id", remaining[0].user_id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
