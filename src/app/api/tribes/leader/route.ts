import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";

// Transfer leadership
export async function POST(req: NextRequest) {
  try {
    const currentLeaderId = await getAuthUserId(req);
    if (!currentLeaderId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { tribeId, newLeaderId } = await req.json();
    const supabase = createServerClient();

    // Verify current user is leader
    const { data: current } = await supabase
      .from("tribe_members")
      .select("role")
      .eq("tribe_id", tribeId)
      .eq("user_id", currentLeaderId)
      .single();

    if (!current || current.role !== "leader") {
      return NextResponse.json({ error: "Only the leader can transfer leadership" }, { status: 403 });
    }

    // Demote current leader
    await supabase
      .from("tribe_members")
      .update({ role: "member" })
      .eq("tribe_id", tribeId)
      .eq("user_id", currentLeaderId);

    // Promote new leader
    await supabase
      .from("tribe_members")
      .update({ role: "leader" })
      .eq("tribe_id", tribeId)
      .eq("user_id", newLeaderId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
