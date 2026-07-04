import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { deckId, liked } = await req.json();
    if (!deckId || !Array.isArray(liked)) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const likedIndices = liked
      .filter((n) => Number.isInteger(n) && n >= 0)
      .slice(0, 50);

    const supabase = createServerClient();

    // Scope the update to the caller's own deck.
    const { error } = await supabase
      .from("solo_decks")
      .update({ liked: likedIndices })
      .eq("id", deckId)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
}
