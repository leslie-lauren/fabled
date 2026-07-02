import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createServerClient();

  // Check if role column exists by trying to query it
  const { error: checkError } = await supabase
    .from("tribe_members")
    .select("role")
    .limit(1);

  if (checkError && checkError.message.includes("role")) {
    // Column doesn't exist - we can't ALTER TABLE via the data API
    // Return instructions for manual migration
    return NextResponse.json({
      error: "Role column does not exist. Run this SQL in Supabase SQL Editor:",
      sql: `ALTER TABLE public.tribe_members ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'member'));
UPDATE public.tribe_members tm SET role = 'leader' FROM public.tribes t WHERE tm.tribe_id = t.id AND tm.user_id = t.created_by;`,
    });
  }

  // Column exists - set existing creators as leaders
  // Get all tribes
  const { data: tribes } = await supabase.from("tribes").select("id, created_by");
  if (tribes) {
    for (const tribe of tribes) {
      await supabase
        .from("tribe_members")
        .update({ role: "leader" })
        .eq("tribe_id", tribe.id)
        .eq("user_id", tribe.created_by);
    }
  }

  return NextResponse.json({ success: true, message: "Leaders set for all existing tribes" });
}
