import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServerClient();

  const { data: allVotes, error: votesErr } = await supabase
    .from("book_votes")
    .select("*")
    .order("deck_id")
    .order("user_id")
    .order("book_index");

  const { data: latestDeck, error: deckErr } = await supabase
    .from("decks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    book_votes: { data: allVotes, error: votesErr?.message || null, count: allVotes?.length || 0 },
    latest_deck: { data: latestDeck, error: deckErr?.message || null },
  });
}
