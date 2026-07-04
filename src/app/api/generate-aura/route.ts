import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";
import { auraPrompt, AI_MODEL } from "@/data/ai-prompts";
import { ARCHETYPE_IDS } from "@/data/archetypes";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

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
    console.log("[generate-aura] Raw response:", rawText.slice(0, 300));

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
      console.error("[generate-aura] Parse failed. Cleaned text:", cleaned.slice(0, 200));
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Validate archetype
    const archetypeId = ARCHETYPE_IDS.find(
      (id) =>
        auraData.archetype.toLowerCase().includes(id) ||
        `the ${id}` === auraData.archetype.toLowerCase().replace("the ", "the ")
    );

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

    const resolvedArchetype = archetypeMap[auraData.archetype] || archetypeId || "nocturne";

    // Save to database
    const supabase = createServerClient();

    // Delete existing aura if regenerating
    await supabase.from("auras").delete().eq("user_id", userId);

    const insertPayload: Record<string, unknown> = {
      user_id: userId,
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
      books_input: books,
    };

    // Try with dimensions_summary first, fall back without it if column doesn't exist
    if (auraData.dimensionsSummary) {
      insertPayload.dimensions_summary = auraData.dimensionsSummary;
    }

    let { data, error } = await supabase
      .from("auras")
      .insert(insertPayload)
      .select()
      .single();

    // If dimensions_summary column doesn't exist yet, retry without it
    if (error && error.message.includes("dimensions_summary")) {
      delete insertPayload.dimensions_summary;
      const retry = await supabase
        .from("auras")
        .insert(insertPayload)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json(
        { error: "Failed to save aura: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ aura: data });
  } catch (err) {
    console.error("Aura generation error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
