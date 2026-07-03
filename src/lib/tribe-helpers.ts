import type { Aura, Tribe, MemberWithAura } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface TribeWithMembers extends Tribe {
  members: MemberWithAura[];
}

export async function fetchTribeWithMembers(
  supabase: SupabaseClient,
  tribeId: string
): Promise<TribeWithMembers | null> {
  const { data: tribe } = await supabase
    .from("tribes")
    .select("*")
    .eq("id", tribeId)
    .single();

  if (!tribe) return null;

  const members = await fetchTribeMembers(supabase, tribeId, tribe.created_by);
  return { ...tribe, members };
}

export async function fetchTribeMembers(
  supabase: SupabaseClient,
  tribeId: string,
  createdBy?: string
): Promise<MemberWithAura[]> {
  // Get members with user info and role
  let { data: memberRows, error: memberErr } = await supabase
    .from("tribe_members")
    .select("user_id, role, users(display_name)")
    .eq("tribe_id", tribeId);

  // If role column doesn't exist, retry without it and use created_by as leader
  if (memberErr) {
    const fallback = await supabase
      .from("tribe_members")
      .select("user_id, users(display_name)")
      .eq("tribe_id", tribeId);
    memberRows = (fallback.data || []).map((r: Record<string, unknown>) => ({
      ...r,
      role: createdBy && (r.user_id as string) === createdBy ? "leader" : "member",
    })) as typeof memberRows;
  }

  if (!memberRows || memberRows.length === 0) return [];

  // Get auras for all member user IDs
  const userIds = memberRows.map((m: Record<string, unknown>) => m.user_id as string);
  const { data: auras } = await supabase
    .from("auras")
    .select("*")
    .in("user_id", userIds);

  const auraMap = new Map<string, Aura>();
  if (auras) {
    for (const a of auras) {
      // Keep the latest aura per user
      if (!auraMap.has(a.user_id) || a.created_at > auraMap.get(a.user_id)!.created_at) {
        auraMap.set(a.user_id, a);
      }
    }
  }

  const members = memberRows.map((m: Record<string, unknown>) => {
    const userId = m.user_id as string;
    const users = m.users as Record<string, string> | null;
    return {
      user_id: userId,
      display_name: users?.display_name || "Unknown",
      role: (m.role as "leader" | "member") || "member",
      aura: auraMap.get(userId) || null,
    };
  });

  // If no one has role "leader", fall back to tribe creator
  const hasLeader = members.some((m) => m.role === "leader");
  if (!hasLeader && createdBy) {
    const creator = members.find((m) => m.user_id === createdBy);
    if (creator) creator.role = "leader";
  }

  // Sort leader first
  members.sort((a, b) => (a.role === "leader" ? -1 : b.role === "leader" ? 1 : 0));
  return members;
}

export async function fetchUserTribes(
  supabase: SupabaseClient,
  userId: string
): Promise<TribeWithMembers[]> {
  const { data: memberships } = await supabase
    .from("tribe_members")
    .select("tribe_id")
    .eq("user_id", userId);

  if (!memberships || memberships.length === 0) return [];

  const tribeIds = memberships.map((m) => m.tribe_id);
  const { data: tribesData } = await supabase
    .from("tribes")
    .select("*")
    .in("id", tribeIds)
    .order("created_at", { ascending: false });

  if (!tribesData || tribesData.length === 0) return [];

  // Batch all members + auras across every tribe (avoids N+1 queries).
  const { data: allMemberRows } = await supabase
    .from("tribe_members")
    .select("tribe_id, user_id, role, users(display_name)")
    .in("tribe_id", tribeIds);

  const memberUserIds = Array.from(
    new Set((allMemberRows || []).map((m: Record<string, unknown>) => m.user_id as string))
  );

  const auraMap = new Map<string, Aura>();
  if (memberUserIds.length > 0) {
    const { data: auras } = await supabase
      .from("auras")
      .select("*")
      .in("user_id", memberUserIds);
    if (auras) {
      for (const a of auras) {
        if (!auraMap.has(a.user_id) || a.created_at > auraMap.get(a.user_id)!.created_at) {
          auraMap.set(a.user_id, a);
        }
      }
    }
  }

  const membersByTribe = new Map<string, MemberWithAura[]>();
  for (const m of (allMemberRows || []) as Record<string, unknown>[]) {
    const tribeId = m.tribe_id as string;
    const uid = m.user_id as string;
    const users = m.users as Record<string, string> | null;
    const list = membersByTribe.get(tribeId) || [];
    list.push({
      user_id: uid,
      display_name: users?.display_name || "Unknown",
      role: (m.role as "leader" | "member") || "member",
      aura: auraMap.get(uid) || null,
    });
    membersByTribe.set(tribeId, list);
  }

  return tribesData.map((tribe) => {
    const members = membersByTribe.get(tribe.id) || [];
    const hasLeader = members.some((m) => m.role === "leader");
    if (!hasLeader && tribe.created_by) {
      const creator = members.find((m) => m.user_id === tribe.created_by);
      if (creator) creator.role = "leader";
    }
    members.sort((a, b) => (a.role === "leader" ? -1 : b.role === "leader" ? 1 : 0));
    return { ...tribe, members };
  });
}
