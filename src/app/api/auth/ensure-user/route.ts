import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const id = await getAuthUserId(req);
    if (!id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { email, displayName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check if user row already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      return NextResponse.json({ ok: true });
    }

    // Insert missing user row (service role bypasses RLS)
    const { error } = await supabase.from("users").insert({
      id,
      email,
      display_name: displayName || email.split("@")[0],
    });

    if (error && !error.message.includes("duplicate")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Ensure user error:", err);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
