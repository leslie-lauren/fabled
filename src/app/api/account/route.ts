import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// Update display name
export async function PATCH(req: NextRequest) {
  try {
    const { userId, displayName, email, currentPassword, newPassword } = await req.json();
    const supabase = createServerClient();

    // Update display name
    if (displayName !== undefined) {
      if (!displayName || displayName.length > 30) {
        return NextResponse.json({ error: "Display name is required (max 30 characters)." }, { status: 400 });
      }
      const { error } = await supabase
        .from("users")
        .update({ display_name: displayName })
        .eq("id", userId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    // Update email
    if (email !== undefined) {
      const { error } = await supabase.auth.admin.updateUserById(userId, { email });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    // Change password
    if (newPassword !== undefined) {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }
      const { error } = await supabase.auth.admin.updateUserById(userId, { password: newPassword });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No update provided" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete account
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const supabase = createServerClient();

    // Remove from all tribes
    await supabase.from("tribe_members").delete().eq("user_id", userId);

    // Delete auras
    await supabase.from("auras").delete().eq("user_id", userId);

    // Delete user row
    await supabase.from("users").delete().eq("id", userId);

    // Delete auth user
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
