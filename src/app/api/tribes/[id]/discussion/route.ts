import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase";
import { discussionPrompt } from "@/data/ai-prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tribeId } = await params;
  const supabase = createServerClient();

  // Get tribe's current book
  const { data: tribe } = await supabase
    .from("tribes")
    .select("current_book_title, current_book_author")
    .eq("id", tribeId)
    .single();

  if (!tribe?.current_book_title) {
    return NextResponse.json({ error: "No current book." }, { status: 400 });
  }

  // Check for existing questions
  const { data: existing } = await supabase
    .from("discussion_questions")
    .select("*")
    .eq("tribe_id", tribeId)
    .eq("book_title", tribe.current_book_title)
    .limit(1)
    .single();

  if (existing) {
    return NextResponse.json({ questions: existing });
  }

  return NextResponse.json({ questions: null, book: tribe });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tribeId } = await params;
    const supabase = createServerClient();

    const { data: tribe } = await supabase
      .from("tribes")
      .select("current_book_title, current_book_author")
      .eq("id", tribeId)
      .single();

    if (!tribe?.current_book_title) {
      return NextResponse.json({ error: "No current book." }, { status: 400 });
    }

    const prompt = discussionPrompt(tribe.current_book_title, tribe.current_book_author || "Unknown");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";
    console.log("[discussion] Raw response:", rawText.slice(0, 300));

    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    let questionData;
    try {
      questionData = JSON.parse(cleaned);
    } catch {
      console.error("[discussion] Parse failed. Cleaned text:", cleaned.slice(0, 200));
      return NextResponse.json(
        { error: "Failed to parse questions. Please try again." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("discussion_questions")
      .insert({
        tribe_id: tribeId,
        book_title: tribe.current_book_title,
        book_author: tribe.current_book_author || "Unknown",
        warm_up: questionData.warmUp,
        turn_up_the_heat: questionData.turnUpTheHeat,
        go_deep: questionData.goDeep,
        hot_takes: questionData.hotTakes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ questions: data });
  } catch (err) {
    console.error("Discussion error:", err);
    return NextResponse.json(
      { error: "Failed to generate questions." },
      { status: 500 }
    );
  }
}
