import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tribeId } = await params;
    const supabase = createServerClient();

    // Get tribe status
    const { data: tribe } = await supabase
      .from("tribes")
      .select("status")
      .eq("id", tribeId)
      .single();

    // Get latest deck
    const { data: deck } = await supabase
      .from("decks")
      .select("id, books")
      .eq("tribe_id", tribeId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    const totalBooks = Array.isArray(deck?.books) ? deck.books.length : 10;

    if (!deck) {
      return NextResponse.json({ status: tribe?.status, members: [] });
    }

    // Get members with vote counts
    const { data: memberRows } = await supabase
      .from("tribe_members")
      .select("user_id, users(display_name)")
      .eq("tribe_id", tribeId);

    const members = await Promise.all(
      (memberRows || []).map(async (m: Record<string, unknown>) => {
        const { count } = await supabase
          .from("swipe_votes")
          .select("*", { count: "exact", head: true })
          .eq("deck_id", deck.id)
          .eq("user_id", m.user_id as string);

        // Get aura color
        const { data: aura } = await supabase
          .from("auras")
          .select("color_primary")
          .eq("user_id", m.user_id as string)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          name: (m.users as Record<string, string>)?.display_name || "Unknown",
          color: aura?.color_primary || "#C4956A",
          done: (count || 0) >= totalBooks,
          voteCount: count || 0,
        };
      })
    );

    return NextResponse.json({
      status: tribe?.status,
      members,
    });
  } catch (err) {
    console.error("Swipe status error:", err);
    return NextResponse.json({ error: "Failed to get status." }, { status: 500 });
  }
}
