import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createAnonClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Use anon client for auth signup (so session is created properly)
    const anonClient = createAnonClient();

    let data, authError;
    try {
      const res = await anonClient.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      data = res.data;
      authError = res.error;
    } catch (err) {
      console.error("[signup] supabase.auth.signUp threw:", err);
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Auth service unreachable: ${msg}` },
        { status: 502 },
      );
    }

    if (authError) {
      console.warn("[signup] authError:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Signup failed (no user returned)." }, { status: 500 });
    }

    // Use service role client to insert user row (bypasses RLS)
    try {
      const serviceClient = createServerClient();
      const { error: insertError } = await serviceClient.from("users").insert({
        id: data.user.id,
        email,
        display_name: displayName,
      });

      if (insertError && !insertError.message.includes("duplicate")) {
        console.warn("[signup] insertError:", insertError.message);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    } catch (err) {
      console.error("[signup] users insert threw:", err);
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Database unreachable: ${msg}` },
        { status: 502 },
      );
    }

    return NextResponse.json({
      user: { id: data.user.id, email },
      session: data.session,
    });
  } catch (err) {
    console.error("[signup] unhandled error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Signup failed: ${msg}` }, { status: 500 });
  }
}
