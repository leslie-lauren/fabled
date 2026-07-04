import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auraPrompt, AI_MODEL } from "@/data/ai-prompts";
import { ARCHETYPE_IDS } from "@/data/archetypes";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Preview-only aura generation (no auth, no DB save).
 * Used by the conversion landing page so users can see their aura
 * before creating an account.
 */
export async function POST(req: NextRequest) {
  try {
    const { books } = await req.json();

    if (!books || !Array.isArray(books) || books.length < 3 || books.length > 7) {
      return NextResponse.json(
        { error: "Please provide 3-7 books." },
        { status: 400 }
      );
    }

    const prompt = auraPrompt(books);

    const message = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1400,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip markdown backticks and preamble
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    let auraData;
    try {
      auraData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Map archetype name to ID
    const archetypeMap: Record<string, string> = {
      "The Archivist": "archivist",
      "The Nocturne": "nocturne",
      "The Wanderer": "wanderer",
      "The Oracle": "oracle",
      "The Cartographer": "cartographer",
      "The Scribe": "scribe",
      "The Sentinel": "sentinel",
      "The Heretic": "heretic",
      "The Ember": "ember",
      "The Revenant": "revenant",
      "The Seer": "seer",
      "The Conjurer": "conjurer",
    };

    const archetypeId = ARCHETYPE_IDS.find(
      (id) => auraData.archetype.toLowerCase().includes(id)
    );
    const resolvedArchetype = archetypeMap[auraData.archetype] || archetypeId || "nocturne";

    // Return aura object matching Aura type shape (but without DB fields)
    const aura = {
      id: "preview",
      user_id: "preview",
      archetype: resolvedArchetype,
      color_primary: auraData.colorPrimary,
      color_secondary: auraData.colorSecondary,
      color_tertiary: auraData.colorTertiary,
      bio: auraData.bio,
      superlative: auraData.superlative,
      roast: auraData.roast,
      strengths: auraData.strengths,
      axes: auraData.axes,
      book_scope: auraData.bookScope,
      spirit_book: auraData.spiritBook,
      prediction_2036: auraData.prediction2036,
      dimensions_summary: auraData.dimensionsSummary || "",
      books_input: books,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ aura });
  } catch (err) {
    console.error("Preview aura generation error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
