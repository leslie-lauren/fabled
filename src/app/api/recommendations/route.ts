import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";
import type { DeckBook } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const supabase = createServerClient();

    const { data: decks, error } = await supabase
      .from("solo_decks")
      .select("books, liked, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Table may not exist yet (migration pending) — degrade to empty shelf.
    if (error) {
      return NextResponse.json({ shelf: [] });
    }

    const shelf: DeckBook[] = [];
    const seen = new Set<string>();
    for (const d of decks || []) {
      const books = (d.books as DeckBook[]) || [];
      const liked = (d.liked as number[]) || [];
      for (const idx of liked) {
        const book = books[idx];
        if (!book) continue;
        const key = `${book.title?.toLowerCase()}|${book.author?.toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        shelf.push(book);
      }
    }

    return NextResponse.json({ shelf });
  } catch {
    return NextResponse.json({ shelf: [] });
  }
}
