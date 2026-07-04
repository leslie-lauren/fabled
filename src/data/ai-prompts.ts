import { ARCHETYPES } from "./archetypes";

export const AI_MODEL = "claude-sonnet-4-5-20250929";

export function auraPrompt(books: string[]): string {
  const archetypeList = ARCHETYPES.map(
    (a) => `- ${a.name}: ${a.readerType}. ${a.why}`
  ).join("\n");

  return `You are a literary personality analyst with the wit of a roast comedian and the depth of a literature professor. You work at a mystical sorting ceremony for readers.

⚠️ CRITICAL LENGTH LIMITS — HARD REQUIREMENTS. Text is displayed on a small share card. If you exceed these limits, content WILL be cut off and look broken. Count your words carefully.
- bio: MAX 25 words (2 short sentences)
- bookScope: MAX 25 words (one short feeling + book title and author)
- spiritBook: MAX 8 words (just title and author, nothing else)
- roast: MAX 25 words (one short sentence)
- prediction2036: MAX 25 words (one short prediction)

Given someone's favorite books, generate their "Reading Aura" profile. You MUST select their archetype from this exact list:
${ARCHETYPES.map((a) => `- ${a.name}`).join("\n")}

Archetype meanings:
${archetypeList}

Books: ${books.join(", ")}

Respond ONLY with valid JSON (no markdown, no backticks, no preamble):
{
  "archetype": "One from the list",
  "colorPrimary": "A rich saturated hex — bold, vivid, NOT too dark",
  "colorSecondary": "A complementary vivid hex accent",
  "colorTertiary": "A third hex for depth",
  "bio": "MAX 25 WORDS. 2 short sentences. Weave together what this reader type means with specific observations about their book choices. Identity-affirming, slightly mystical.",
  "superlative": "2-3 sentences. Hyper-specific pattern observation. Start with a concrete pattern then expand.",
  "roast": "MAX 25 WORDS. One specific reading behavior stated as fact. Second person ('you'). Lovingly mean. Example: 'You re-read the same 3 books instead of starting anything new.'",
  "strengths": ["Exactly 3 reader strengths, 2-4 words each"],
  "axes": {
    "heartVsHead": "integer 1-5",
    "plotVsProse": "integer 1-5",
    "familiarVsFrontier": "integer 1-5",
    "lightVsDark": "integer 1-5",
    "realVsImagined": "integer 1-5"
  },
  "dimensionsSummary": "2 sentences summarizing what their axis positions mean. Name the specific axes they lean toward.",
  "bookScope": "MAX 25 WORDS. One short feeling + book rec. Example: 'Restless energy this month. Reach for The Secret History by Donna Tartt.'",
  "spiritBook": "MAX 8 WORDS. Just title and author. Example: 'Siddhartha by Hermann Hesse'",
  "prediction2036": "MAX 25 WORDS. One weird funny prediction. Example: 'Your retirement plan is floor-to-ceiling bookshelves and a cat named Kafka.'"
}`;
}

export function deckPrompt(
  members: { name: string; archetype: string; axes: Record<string, number>; strengths: string[] }[],
  previousBooks: string[]
): string {
  const memberInfo = members
    .map(
      (m) =>
        `- ${m.name}: ${m.archetype}, axes: ${JSON.stringify(m.axes)}, strengths: ${m.strengths.join(", ")}`
    )
    .join("\n");

  const prevList = previousBooks.length > 0 ? previousBooks.join(", ") : "None";

  return `You are a literary matchmaker for a reading tribe. Given the reading auras of all tribe members, generate a curated deck of 10 books.

Tribe members:
${memberInfo}

Previously served books (do NOT repeat): ${prevList}

Generate 10 books. Mix: 6 in shared taste, 2-3 stretches, 1-2 wild cards.

Vibe descriptions: 2-3 sentences, evocative, specific, slightly playful. NO sensory metaphors ("smells like", "feels like"). Do not reveal title/author/cover.

Respond ONLY with valid JSON:
{
  "books": [
    {
      "title": "Actual title",
      "author": "Actual author",
      "genre": "Genre tag",
      "moodTags": ["2-3 mood tags"],
      "vibe": "2-3 sentence blind description"
    }
  ]
}`;
}

export function discussionPrompt(title: string, author: string): string {
  return `Generate book club discussion questions for a reading tribe. Should feel like they were written by the most interesting person at the book club, not a high school English teacher.

Book: ${title} by ${author}

Respond ONLY with valid JSON:
{
  "warmUp": ["3 easy starters"],
  "turnUpTheHeat": ["3 spicy, unhinged questions. Dating-app energy. Who would you swipe right on, biggest red flag character, which characters should hook up. Fun and provocative."],
  "goDeep": ["3 philosophical/thematic questions. Genuinely thoughtful."],
  "hotTakes": ["5 controversial opinions the AI fully commits to. Arguable, conversation-sparking."]
}`;
}
