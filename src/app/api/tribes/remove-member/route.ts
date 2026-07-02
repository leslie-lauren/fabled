import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { tribeId, leaderId, memberId } = await req.json();
    const supabase = createServerClient();

    // Verify requester is leader
    const { data: leader } = await supabase
      .from("tribe_members")
      .select("role")
      .eq("tribe_id", tribeId)
      .eq("user_id", leaderId)
      .single();

    if (!leader || leader.role !== "leader") {
      return NextResponse.json({ error: "Only the leader can remove members" }, { status: 403 });
    }

    // Can't remove yourself (use leave instead)
    if (leaderId === memberId) {
      return NextResponse.json({ error: "Leader cannot remove themselves. Transfer leadership first." }, { status: 400 });
    }

    // Remove the member
    const { error } = await supabase
      .from("tribe_members")
      .delete()
      .eq("tribe_id", tribeId)
      .eq("user_id", memberId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
