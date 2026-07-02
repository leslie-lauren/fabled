import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, tribeIds } = await req.json();
    const supabase = createServerClient();

    if (!userId || !Array.isArray(tribeIds) || tribeIds.length === 0) {
      return NextResponse.json({});
    }

    // Get tribe statuses
    const { data: tribesData } = await supabase
      .from("tribes")
      .select("id, status")
      .in("id", tribeIds);

    // Filter to active tribes only
    const activeTribes = (tribesData || []).filter(
      (t) => !["empty", "reading"].includes(t.status)
    );

    if (activeTribes.length === 0) {
      return NextResponse.json({});
    }

    const activeTribeIds = activeTribes.map((t) => t.id);

    // Get member counts for active tribes
    const { data: allMembers } = await supabase
      .from("tribe_members")
      .select("tribe_id, user_id")
      .in("tribe_id", activeTribeIds);

    // Get latest deck per tribe
    const { data: decks } = await supabase
      .from("decks")
      .select("id, tribe_id")
      .in("tribe_id", activeTribeIds)
      .order("created_at", { ascending: false });

    // Map tribe_id -> latest deck_id
    const tribeDecks = new Map<string, string>();
    for (const d of decks || []) {
      if (!tribeDecks.has(d.tribe_id)) tribeDecks.set(d.tribe_id, d.id);
    }

    const deckIds = [...tribeDecks.values()];

    // Get swipe votes for these decks
    const { data: swipeVotes } = await supabase
      .from("swipe_votes")
      .select("deck_id, user_id")
      .in("deck_id", deckIds.length > 0 ? deckIds : ["none"]);

    // Get book votes for these decks
    const { data: bookVotes } = await supabase
      .from("book_votes")
      .select("deck_id, user_id, round")
      .in("deck_id", deckIds.length > 0 ? deckIds : ["none"]);

    // Build per-tribe progress
    const result: Record<string, {
      userHasSwiped: boolean;
      userHasVoted: boolean;
      swipedCount: number;
      votedCount: number;
      totalMembers: number;
      voteRound: number;
    }> = {};

    for (const tribe of activeTribes) {
      const tribeMembers = (allMembers || []).filter((m) => m.tribe_id === tribe.id);
      const totalMembers = tribeMembers.length;
      const deckId = tribeDecks.get(tribe.id);

      // Determine current vote round
      let voteRound = 1;
      if (tribe.status === "tiebreaker") voteRound = 2;
      else if (tribe.status === "leader_pick") voteRound = 3;

      // Swipe progress
      const deckSwipes = (swipeVotes || []).filter((v) => v.deck_id === deckId);
      const swipedUserIds = new Set(deckSwipes.map((v) => v.user_id));
      const userHasSwiped = swipedUserIds.has(userId);
      const swipedCount = swipedUserIds.size;

      // Vote progress (for current round)
      const deckBookVotes = (bookVotes || []).filter(
        (v) => v.deck_id === deckId && v.round === voteRound
      );
      const votedUserIds = new Set(deckBookVotes.map((v) => v.user_id));
      const userHasVoted = votedUserIds.has(userId);
      const votedCount = votedUserIds.size;

      result[tribe.id] = {
        userHasSwiped,
        userHasVoted,
        swipedCount,
        votedCount,
        totalMembers,
        voteRound,
      };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Home status error:", err);
    return NextResponse.json({});
  }
}
