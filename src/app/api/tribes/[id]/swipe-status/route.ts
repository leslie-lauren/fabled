import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tribeId } = await params;
    const authId = await getAuthUserId(req);
    if (!authId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

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

    // Get members
    const { data: memberRows } = await supabase
      .from("tribe_members")
      .select("user_id, users(display_name)")
      .eq("tribe_id", tribeId);

    const memberIds = (memberRows || []).map((m: Record<string, unknown>) => m.user_id as string);

    // Batch: all swipe votes for this deck, and all member aura colors.
    const [{ data: allVotes }, { data: auras }] = await Promise.all([
      supabase.from("swipe_votes").select("user_id").eq("deck_id", deck.id),
      memberIds.length > 0
        ? supabase.from("auras").select("user_id, color_primary, created_at").in("user_id", memberIds)
        : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    ]);

    const voteCountByUser = new Map<string, number>();
    for (const v of allVotes || []) {
      voteCountByUser.set(v.user_id, (voteCountByUser.get(v.user_id) || 0) + 1);
    }

    const colorByUser = new Map<string, string>();
    const latestByUser = new Map<string, string>();
    for (const a of (auras || []) as Record<string, unknown>[]) {
      const uid = a.user_id as string;
      const created = (a.created_at as string) || "";
      if (!latestByUser.has(uid) || created > latestByUser.get(uid)!) {
        latestByUser.set(uid, created);
        colorByUser.set(uid, (a.color_primary as string) || "#C4956A");
      }
    }

    const members = (memberRows || []).map((m: Record<string, unknown>) => {
      const uid = m.user_id as string;
      const count = voteCountByUser.get(uid) || 0;
      return {
        name: (m.users as Record<string, string>)?.display_name || "Unknown",
        color: colorByUser.get(uid) || "#C4956A",
        done: count >= totalBooks,
        voteCount: count,
      };
    });

    return NextResponse.json({
      status: tribe?.status,
      members,
    });
  } catch (err) {
    console.error("Swipe status error:", err);
    return NextResponse.json({ error: "Failed to get status." }, { status: 500 });
  }
}
