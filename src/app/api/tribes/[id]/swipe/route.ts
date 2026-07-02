import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tribeId } = await params;
    const { userId, deckId, bookIndex, liked } = await req.json();
    const supabase = createServerClient();

    // Save vote (upsert)
    const { error } = await supabase.from("swipe_votes").upsert(
      {
        deck_id: deckId,
        user_id: userId,
        book_index: bookIndex,
        liked,
      },
      { onConflict: "deck_id,user_id,book_index" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if user has finished all 15
    const { count } = await supabase
      .from("swipe_votes")
      .select("*", { count: "exact", head: true })
      .eq("deck_id", deckId)
      .eq("user_id", userId);

    // Get deck to check actual book count
    const { data: deckData } = await supabase
      .from("decks")
      .select("books")
      .eq("id", deckId)
      .single();
    const totalBooks = Array.isArray(deckData?.books) ? deckData.books.length : 10;
    const finished = (count || 0) >= totalBooks;

    console.log(`[Swipe] User ${userId} book ${bookIndex} liked=${liked} | total votes: ${count}/${totalBooks} | finished: ${finished}`);

    // Check if all members have finished
    let allDone = false;
    if (finished) {
      const { data: members } = await supabase
        .from("tribe_members")
        .select("user_id")
        .eq("tribe_id", tribeId);

      if (members) {
        allDone = true;
        for (const member of members) {
          const { count: memberCount } = await supabase
            .from("swipe_votes")
            .select("*", { count: "exact", head: true })
            .eq("deck_id", deckId)
            .eq("user_id", member.user_id);

          console.log(`[Swipe] Member ${member.user_id} has ${memberCount}/${totalBooks} votes`);

          if ((memberCount || 0) < totalBooks) {
            allDone = false;
            break;
          }
        }

        if (allDone) {
          console.log(`[Swipe] All members done! Setting tribe ${tribeId} to reveal`);
          await supabase
            .from("tribes")
            .update({ status: "reveal" })
            .eq("id", tribeId);
        }
      }
    }

    return NextResponse.json({ saved: true, finished, allDone });
  } catch (err) {
    console.error("Swipe error:", err);
    return NextResponse.json(
      { error: "Failed to save vote." },
      { status: 500 }
    );
  }
}
