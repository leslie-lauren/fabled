import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { code } = await req.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Invalid invite code." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Find tribe
    const { data: tribe } = await supabase
      .from("tribes")
      .select("*")
      .eq("invite_code", code.toUpperCase())
      .single();

    if (!tribe) {
      return NextResponse.json(
        { error: "This code doesn't exist. Check with whoever sent it." },
        { status: 404 }
      );
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from("tribe_members")
      .select("user_id")
      .eq("tribe_id", tribe.id)
      .eq("user_id", userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `You're already in ${tribe.name}.` },
        { status: 400 }
      );
    }

    // Check tribe size
    const { count } = await supabase
      .from("tribe_members")
      .select("*", { count: "exact", head: true })
      .eq("tribe_id", tribe.id);

    if (count && count >= 12) {
      return NextResponse.json(
        { error: "This tribe is full." },
        { status: 400 }
      );
    }

    // Check user's tribe count
    const { data: userTribes } = await supabase
      .from("tribe_members")
      .select("tribe_id")
      .eq("user_id", userId);

    if (userTribes && userTribes.length >= 5) {
      return NextResponse.json(
        { error: "You can be in at most 5 tribes." },
        { status: 400 }
      );
    }

    // Join (try with role, fallback without)
    let joinResult = await supabase
      .from("tribe_members")
      .insert({ tribe_id: tribe.id, user_id: userId, role: "member" });

    if (joinResult.error) {
      console.error("Join with role failed, retrying without:", joinResult.error.message);
      joinResult = await supabase
        .from("tribe_members")
        .insert({ tribe_id: tribe.id, user_id: userId });
    }

    const joinError = joinResult.error;

    if (joinError) {
      return NextResponse.json(
        { error: joinError.message },
        { status: 500 }
      );
    }

    // Update tribe status if now has 2+ members
    if (count !== null && count + 1 >= 2 && tribe.status === "empty") {
      await supabase
        .from("tribes")
        .update({ status: "ready" })
        .eq("id", tribe.id);
    }

    return NextResponse.json({ tribe });
  } catch (err) {
    console.error("Join tribe error:", err);
    return NextResponse.json(
      { error: "Failed to join tribe." },
      { status: 500 }
    );
  }
}
