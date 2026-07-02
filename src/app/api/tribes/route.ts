import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No 0/O/1/I for readability
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { name, userId } = await req.json();

    if (!name || name.length > 30) {
      return NextResponse.json(
        { error: "Tribe name is required (max 30 characters)." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check user's tribe count
    const { data: existingMemberships } = await supabase
      .from("tribe_members")
      .select("tribe_id")
      .eq("user_id", userId);

    if (existingMemberships && existingMemberships.length >= 5) {
      return NextResponse.json(
        { error: "You can be in at most 5 tribes." },
        { status: 400 }
      );
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("tribes")
        .select("id")
        .eq("invite_code", inviteCode)
        .single();

      if (!existing) break;
      inviteCode = generateInviteCode();
      attempts++;
    }

    // Create tribe
    const { data: tribe, error: tribeError } = await supabase
      .from("tribes")
      .insert({
        name,
        invite_code: inviteCode,
        created_by: userId,
        status: "empty",
      })
      .select()
      .single();

    if (tribeError) {
      return NextResponse.json(
        { error: tribeError.message },
        { status: 500 }
      );
    }

    // Add creator as member (try with role first, fallback without)
    let memberInsert = await supabase.from("tribe_members").insert({
      tribe_id: tribe.id,
      user_id: userId,
      role: "leader",
    });

    // If role column doesn't exist, retry without it
    if (memberInsert.error) {
      console.error("tribe_members insert with role failed:", memberInsert.error.message);
      memberInsert = await supabase.from("tribe_members").insert({
        tribe_id: tribe.id,
        user_id: userId,
      });
    }

    if (memberInsert.error) {
      console.error("tribe_members insert failed entirely:", memberInsert.error.message);
      // Clean up the tribe we just created
      await supabase.from("tribes").delete().eq("id", tribe.id);
      return NextResponse.json(
        { error: "Failed to add you as a member. " + memberInsert.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ tribe });
  } catch (err) {
    console.error("Create tribe error:", err);
    return NextResponse.json(
      { error: "Failed to create tribe." },
      { status: 500 }
    );
  }
}
