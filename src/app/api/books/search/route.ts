import { NextRequest, NextResponse } from "next/server";

interface OpenLibraryDoc {
  title?: string;
  author_name?: string[];
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      q
    )}&limit=8&fields=title,author_name`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Fabled/1.0 (book autocomplete)" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = (await res.json()) as { docs?: OpenLibraryDoc[] };
    const seen = new Set<string>();
    const results: { title: string; author: string }[] = [];

    for (const doc of data.docs ?? []) {
      const title = doc.title?.trim();
      if (!title) continue;
      const author = doc.author_name?.[0]?.trim() ?? "";
      const key = `${title.toLowerCase()}|${author.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ title, author });
      if (results.length >= 6) break;
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
