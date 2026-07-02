import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase";
import { deckPrompt } from "@/data/ai-prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tribeId } = await params;
    const { userId } = await req.json();
    const supabase = createServerClient();

    // Verify membership
    const { data: membership } = await supabase
      .from("tribe_members")
      .select("user_id")
      .eq("tribe_id", tribeId)
      .eq("user_id", userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "Not a tribe member." }, { status: 403 });
    }

    // Get tribe
    const { data: tribe } = await supabase
      .from("tribes")
      .select("*")
      .eq("id", tribeId)
      .single();

    if (!tribe || !["ready", "reading"].includes(tribe.status)) {
      return NextResponse.json(
        { error: "Tribe is not ready for a new deck." },
        { status: 400 }
      );
    }

    // Get members
    const { data: memberRows } = await supabase
      .from("tribe_members")
      .select("user_id, users(display_name)")
      .eq("tribe_id", tribeId);

    if (!memberRows || memberRows.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 members." },
        { status: 400 }
      );
    }

    // Get auras separately (no direct FK from tribe_members to auras)
    const userIds = memberRows.map((m: Record<string, unknown>) => m.user_id as string);
    const { data: auras } = await supabase
      .from("auras")
      .select("*")
      .in("user_id", userIds);

    const auraMap = new Map<string, Record<string, unknown>>();
    if (auras) {
      for (const a of auras) {
        auraMap.set(a.user_id, a);
      }
    }

    const memberProfiles = memberRows.map((m: Record<string, unknown>) => {
      const aura = auraMap.get(m.user_id as string);
      return {
        name: ((m.users as Record<string, string>)?.display_name) || "Unknown",
        archetype: (aura?.archetype as string) || "unknown",
        axes: (aura?.axes as Record<string, number>) || {},
        strengths: (aura?.strengths as string[]) || [],
      };
    });

    // Get previously served books
    const { data: history } = await supabase
      .from("tribe_book_history")
      .select("book_title")
      .eq("tribe_id", tribeId);

    const previousBooks = (history || []).map((h: Record<string, string>) => h.book_title);

    // Also check previous decks
    const { data: prevDecks } = await supabase
      .from("decks")
      .select("books")
      .eq("tribe_id", tribeId);

    if (prevDecks) {
      for (const deck of prevDecks) {
        for (const book of deck.books as Array<{ title: string }>) {
          if (!previousBooks.includes(book.title)) {
            previousBooks.push(book.title);
          }
        }
      }
    }

    const prompt = deckPrompt(memberProfiles, previousBooks);

    // Retry up to 3 attempts for clean JSON
    let deckData;
    for (let attempt = 0; attempt < 3; attempt++) {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      });

      const rawText = message.content[0].type === "text" ? message.content[0].text : "";
      console.log(`[generate-deck] Attempt ${attempt + 1} raw response (${rawText.length} chars):`);
      console.log(rawText.slice(0, 500));

      // Strip markdown backticks and any preamble/postamble
      let cleaned = rawText.trim();
      // Remove ```json ... ``` wrapping
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
      // Find the first { and last } to extract JSON object
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }

      try {
        deckData = JSON.parse(cleaned);
        if (deckData.books && Array.isArray(deckData.books) && deckData.books.length > 0) {
          console.log(`[generate-deck] Parsed ${deckData.books.length} books on attempt ${attempt + 1}`);
          break;
        }
        console.log(`[generate-deck] Parsed JSON but missing/empty books array, retrying...`);
        deckData = null;
      } catch (parseErr) {
        console.error(`[generate-deck] JSON parse failed on attempt ${attempt + 1}:`, parseErr);
        deckData = null;
      }
    }

    if (!deckData || !deckData.books) {
      return NextResponse.json(
        { error: "Failed to generate deck after multiple attempts. Please try again." },
        { status: 500 }
      );
    }

    // Save deck
    const { data: deck, error: deckError } = await supabase
      .from("decks")
      .insert({
        tribe_id: tribeId,
        books: deckData.books,
      })
      .select()
      .single();

    if (deckError) {
      return NextResponse.json({ error: deckError.message }, { status: 500 });
    }

    // Update tribe status
    await supabase
      .from("tribes")
      .update({ status: "swiping" })
      .eq("id", tribeId);

    return NextResponse.json({ deck });
  } catch (err) {
    console.error("Generate deck error:", err);
    return NextResponse.json(
      { error: "Failed to generate deck." },
      { status: 500 }
    );
  }
}
