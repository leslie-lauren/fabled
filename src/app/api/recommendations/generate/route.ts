import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";
import { deckPrompt, AI_MODEL } from "@/data/ai-prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const supabase = createServerClient();

    // Need the user's aura to curate a personal deck
    const { data: aura } = await supabase
      .from("auras")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!aura) {
      return NextResponse.json({ error: "Generate your aura first." }, { status: 400 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("display_name")
      .eq("id", userId)
      .single();

    // Exclude books already served in prior solo decks + the user's own inputs
    const previousBooks: string[] = Array.isArray(aura.books_input)
      ? [...(aura.books_input as string[])]
      : [];

    const { data: priorDecks } = await supabase
      .from("solo_decks")
      .select("books")
      .eq("user_id", userId);

    for (const d of priorDecks || []) {
      for (const b of (d.books as Array<{ title: string }>) || []) {
        if (b?.title && !previousBooks.includes(b.title)) previousBooks.push(b.title);
      }
    }

    const memberProfiles = [
      {
        name: (user?.display_name as string) || "Reader",
        archetype: (aura.archetype as string) || "unknown",
        axes: (aura.axes as Record<string, number>) || {},
        strengths: (aura.strengths as string[]) || [],
      },
    ];

    const prompt = deckPrompt(memberProfiles, previousBooks);

    let deckData: { books?: Array<Record<string, unknown>> } | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const message = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      });

      const rawText = message.content[0].type === "text" ? message.content[0].text : "";
      let cleaned = rawText.trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }

      try {
        const parsed = JSON.parse(cleaned);
        if (parsed.books && Array.isArray(parsed.books) && parsed.books.length > 0) {
          deckData = parsed;
          break;
        }
      } catch {
        // retry
      }
    }

    if (!deckData || !deckData.books) {
      return NextResponse.json(
        { error: "Failed to curate books. Please try again." },
        { status: 500 }
      );
    }

    const { data: deck, error } = await supabase
      .from("solo_decks")
      .insert({ user_id: userId, books: deckData.books, liked: [] })
      .select("id, books")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deck });
  } catch (err) {
    console.error("Solo deck generation error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
