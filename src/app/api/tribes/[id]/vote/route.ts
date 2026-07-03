import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";

// POST: Lock in votes (approval, tiebreaker, or leader pick)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tribeId } = await params;
    const userId = await getAuthUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { deckId, approvedBookIndexes, round = 1 } = await req.json();
    const supabase = createServerClient();

    if (!Array.isArray(approvedBookIndexes) || approvedBookIndexes.length === 0) {
      return NextResponse.json({ error: "Select at least one book." }, { status: 400 });
    }

    // Round 2 (tiebreaker) and Round 3 (leader pick) must be single choice
    if ((round === 2 || round === 3) && approvedBookIndexes.length !== 1) {
      return NextResponse.json({ error: "Pick exactly one book." }, { status: 400 });
    }

    // Round 3: validate caller is leader
    if (round === 3) {
      const { data: membership } = await supabase
        .from("tribe_members")
        .select("role")
        .eq("tribe_id", tribeId)
        .eq("user_id", userId)
        .single();
      if (membership?.role !== "leader") {
        return NextResponse.json({ error: "Only the leader can break the tie." }, { status: 403 });
      }
    }

    console.log(`[Vote] R${round} | User ${userId} | books: ${approvedBookIndexes.join(",")} | deck: ${deckId}`);

    // Delete existing votes for this user on this deck FOR THIS ROUND only
    await supabase
      .from("book_votes")
      .delete()
      .eq("deck_id", deckId)
      .eq("user_id", userId)
      .eq("round", round);

    // Insert votes
    const rows = approvedBookIndexes.map((bookIndex: number) => ({
      deck_id: deckId,
      user_id: userId,
      book_index: bookIndex,
      round,
    }));

    const { error: insertErr } = await supabase.from("book_votes").insert(rows);
    if (insertErr) {
      console.error("[Vote] Insert error:", insertErr.message);
      return NextResponse.json({ error: "Failed to save votes: " + insertErr.message }, { status: 500 });
    }

    // Update tribe status
    if (round === 1) {
      await supabase.from("tribes").update({ status: "voting" }).eq("id", tribeId);
    }

    // Check if all members have voted for this round
    const { data: members } = await supabase
      .from("tribe_members")
      .select("user_id")
      .eq("tribe_id", tribeId);

    const { data: roundVotes } = await supabase
      .from("book_votes")
      .select("user_id, book_index")
      .eq("deck_id", deckId)
      .eq("round", round);

    const votedUsers = new Set((roundVotes || []).map((v) => v.user_id));
    const allVoted = members?.every((m) => votedUsers.has(m.user_id)) ?? false;

    console.log(`[Vote] R${round} | Members: ${members?.length}, Voted: ${votedUsers.size}, All: ${allVoted}`);

    if (allVoted || round === 3) {
      // Count votes per book for this round
      const counts: Record<number, number> = {};
      (roundVotes || []).forEach((v) => {
        counts[v.book_index] = (counts[v.book_index] || 0) + 1;
      });

      const maxVotes = Math.max(...Object.values(counts), 0);
      const tiedIndexes = Object.entries(counts)
        .filter(([, c]) => c === maxVotes)
        .map(([idx]) => parseInt(idx));

      console.log(`[Vote] R${round} | Counts: ${JSON.stringify(counts)} | Max: ${maxVotes} | Tied: ${tiedIndexes}`);

      if (tiedIndexes.length === 1 || round === 3) {
        // We have a winner
        const winnerIndex = tiedIndexes[0];
        const { data: deck } = await supabase
          .from("decks")
          .select("books")
          .eq("id", deckId)
          .single();

        if (deck) {
          const books = deck.books as Array<{ title: string; author: string }>;
          const winner = books[winnerIndex];
          console.log(`[Vote] Winner: ${winner.title} by ${winner.author}`);

          await supabase.from("tribes").update({
            status: "reading",
            current_book_title: winner.title,
            current_book_author: winner.author,
          }).eq("id", tribeId);

          // Record the chosen book so it isn't served again and to track the
          // tribe's reading streak.
          await supabase.from("tribe_book_history").upsert(
            {
              tribe_id: tribeId,
              book_title: winner.title,
              book_author: winner.author,
            },
            { onConflict: "tribe_id,book_title,book_author" }
          );
        }

        return NextResponse.json({ saved: true, allVoted: true, winner: true });
      } else {
        // Tie — advance to next round
        if (round === 1) {
          console.log(`[Vote] R1 tie between ${tiedIndexes.length} books → tiebreaker`);
          await supabase.from("tribes").update({ status: "tiebreaker" }).eq("id", tribeId);
          return NextResponse.json({ saved: true, allVoted: true, tied: true, tiedIndexes });
        } else if (round === 2) {
          console.log(`[Vote] R2 tie between ${tiedIndexes.length} books → leader_pick`);
          await supabase.from("tribes").update({ status: "leader_pick" }).eq("id", tribeId);
          return NextResponse.json({ saved: true, allVoted: true, tied: true, tiedIndexes });
        }
      }
    }

    return NextResponse.json({ saved: true, allVoted });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ error: "Failed to vote." }, { status: 500 });
  }
}

// DELETE: Undo single user's votes (round-scoped), or full re-vote (clear all)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tribeId } = await params;
    const userId = await getAuthUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { deckId, round, scope } = await req.json();
    const supabase = createServerClient();

    if (scope === "revote") {
      // Full re-vote is leader-only: delete ALL votes for this deck and reset.
      const { data: membership } = await supabase
        .from("tribe_members")
        .select("role")
        .eq("tribe_id", tribeId)
        .eq("user_id", userId)
        .single();
      if (membership?.role !== "leader") {
        return NextResponse.json({ error: "Only the leader can reset the vote." }, { status: 403 });
      }

      console.log(`[Vote] Full re-vote for deck ${deckId}`);
      await supabase.from("book_votes").delete().eq("deck_id", deckId);
      await supabase.from("tribes").update({
        status: "reveal",
        current_book_title: null,
        current_book_author: null,
      }).eq("id", tribeId);

      return NextResponse.json({ ok: true });
    }

    // Single-user undo: delete the caller's own votes for the specified round.
    console.log(`[Vote] Undo R${round || 1} for user ${userId} on deck ${deckId}`);
    let query = supabase
      .from("book_votes")
      .delete()
      .eq("deck_id", deckId)
      .eq("user_id", userId);
    if (round) query = query.eq("round", round);
    await query;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Re-vote error:", err);
    return NextResponse.json({ error: "Failed to reset votes." }, { status: 500 });
  }
}
