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

    // Get latest deck
    const { data: deck } = await supabase
      .from("decks")
      .select("*")
      .eq("tribe_id", tribeId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!deck) {
      return NextResponse.json({ error: "No deck found." }, { status: 404 });
    }

    // Get all swipe votes for this deck
    const { data: allVotes } = await supabase
      .from("swipe_votes")
      .select("user_id, book_index, liked")
      .eq("deck_id", deck.id);

    // Get members (with fallback if role column doesn't exist)
    let { data: memberRows, error: memberErr } = await supabase
      .from("tribe_members")
      .select("user_id, role, users(display_name)")
      .eq("tribe_id", tribeId);

    if (memberErr) {
      const fallback = await supabase
        .from("tribe_members")
        .select("user_id, users(display_name)")
        .eq("tribe_id", tribeId);
      memberRows = (fallback.data || []).map((r: Record<string, unknown>) => ({
        ...r,
        role: "member",
      })) as typeof memberRows;
    }

    const mUserIds = (memberRows || []).map((m: Record<string, unknown>) => m.user_id as string);
    const { data: mAuras } = await supabase
      .from("auras")
      .select("user_id, color_primary")
      .in("user_id", mUserIds.length > 0 ? mUserIds : ["none"]);

    const auraColorMap = new Map<string, string>();
    if (mAuras) {
      for (const a of mAuras) auraColorMap.set(a.user_id, a.color_primary);
    }

    const memberMap = Object.fromEntries(
      (memberRows || []).map((m: Record<string, unknown>) => [
        m.user_id,
        {
          name: (m.users as Record<string, string>)?.display_name || "Unknown",
          color: auraColorMap.get(m.user_id as string) || "#C4956A",
          role: (m.role as string) || "member",
        },
      ])
    );

    const totalMembers = (memberRows || []).length;

    // Count finished swipers
    const finishedUsers = new Set<string>();
    (allVotes || []).forEach((v) => finishedUsers.add(v.user_id));
    const totalVoters = finishedUsers.size;

    const books = deck.books as Array<{ title: string; author: string; genre: string; moodTags: string[]; vibe: string }>;

    // Calculate match scores
    const results = books.map((book, i) => {
      const bookSwipes = (allVotes || []).filter((v) => v.book_index === i);
      const yesVotes = bookSwipes.filter((v) => v.liked);
      const matchPct = totalVoters > 0 ? (yesVotes.length / totalVoters) * 100 : 0;

      let tier: string;
      if (matchPct === 100 && totalVoters > 0) tier = "Everyone loved this";
      else if (matchPct >= 75) tier = "Strong match";
      else if (matchPct >= 50) tier = "Split decision";
      else tier = "Niche pick";

      return {
        ...book,
        index: i,
        matchPct: Math.round(matchPct),
        yesCount: yesVotes.length,
        totalVoters,
        totalMembers,
        tier,
        voters: bookSwipes.map((v) => ({
          userId: v.user_id,
          name: memberMap[v.user_id]?.name || "Unknown",
          color: memberMap[v.user_id]?.color || "#C4956A",
          liked: v.liked,
        })),
      };
    });

    results.sort((a, b) => b.matchPct - a.matchPct);

    // Get all book_votes with round info
    const { data: bookVotes } = await supabase
      .from("book_votes")
      .select("user_id, book_index, round")
      .eq("deck_id", deck.id);

    // Get tribe status
    const { data: tribeInfo } = await supabase
      .from("tribes")
      .select("status, current_book_title, current_book_author")
      .eq("id", tribeId)
      .single();

    // Compute tied book indexes for tiebreaker/leader_pick
    let tiedBookIndexes: number[] = [];
    const status = tribeInfo?.status || "reveal";

    if (status === "tiebreaker" || status === "leader_pick") {
      const relevantRound = status === "tiebreaker" ? 1 : 2;
      const roundVotes = (bookVotes || []).filter((v) => v.round === relevantRound);
      const counts: Record<number, number> = {};
      roundVotes.forEach((v) => {
        counts[v.book_index] = (counts[v.book_index] || 0) + 1;
      });
      const maxVotes = Math.max(...Object.values(counts), 0);
      tiedBookIndexes = Object.entries(counts)
        .filter(([, c]) => c === maxVotes)
        .map(([idx]) => parseInt(idx));
    }

    const membersArr = Object.entries(memberMap).map(([id, m]) => ({
      userId: id,
      ...(m as { name: string; color: string; role: string }),
    }));

    return NextResponse.json({
      deckId: deck.id,
      results,
      bookVotes: bookVotes || [],
      tribeStatus: status,
      totalMembers,
      tiedBookIndexes,
      currentBook: tribeInfo?.current_book_title ? {
        title: tribeInfo.current_book_title,
        author: tribeInfo.current_book_author,
      } : null,
      members: membersArr,
    });
  } catch (err) {
    console.error("Reveal error:", err);
    return NextResponse.json({ error: "Failed to load reveal." }, { status: 500 });
  }
}
