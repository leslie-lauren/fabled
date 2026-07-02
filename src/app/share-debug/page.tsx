"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Aura } from "@/lib/types";
import ShareCard from "@/components/aura/share-card";

/**
 * Debug page for the Share My Aura card.
 * Renders the SAME ShareCard component used by the share flow — at its full
 * 1080×1920 resolution — so the layout can be visually verified in the browser.
 * Visit on desktop, zoom out (Cmd+-) to see the full frame, then screenshot
 * for review.
 */
export default function ShareDebugPage() {
  const router = useRouter();
  const [aura, setAura] = useState<Aura | null>(null);
  const [tribeCode, setTribeCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/welcome");
        return;
      }
      const { data } = await supabase
        .from("auras")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!data) {
        router.replace("/aura/generate");
        return;
      }
      setAura(data);

      // Load first tribe for invite code demo
      const { data: memberships } = await supabase
        .from("tribe_members")
        .select("tribe_id")
        .eq("user_id", session.user.id)
        .limit(1);
      if (memberships && memberships.length > 0) {
        const { data: tribe } = await supabase
          .from("tribes")
          .select("invite_code")
          .eq("id", memberships[0].tribe_id)
          .single();
        if (tribe) setTribeCode(tribe.invite_code);
      }
    });
  }, [router]);

  if (!aura) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F0E8" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111010", padding: 40 }}>
      {/* Header info */}
      <div style={{ maxWidth: 800, margin: "0 auto 40px", color: "#9B958A", fontFamily: "'DM Sans', sans-serif" }}>
        <h1 style={{ color: "#F5F0E8", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Share Card Debug Preview</h1>
        <p style={{ fontSize: 14, marginBottom: 4 }}>
          Full 1080×1920 resolution. Zoom out (Cmd+-) to see the whole frame.
        </p>
        <p style={{ fontSize: 13, opacity: 0.7 }}>
          Archetype: {aura.archetype} · Colors: {aura.color_primary} / {aura.color_secondary} / {aura.color_tertiary}
        </p>
        <button
          onClick={() => router.push("/aura")}
          style={{ marginTop: 12, padding: "8px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#F5F0E8", fontSize: 13, cursor: "pointer" }}
        >
          ← Back to aura page
        </button>
      </div>

      {/* The actual 1080×1920 card — same component used by /aura share flow */}
      <div style={{ margin: "0 auto", width: 1080, boxShadow: "0 20px 80px rgba(0,0,0,0.8)" }}>
        <ShareCard aura={aura} tribeCode={tribeCode} />
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
