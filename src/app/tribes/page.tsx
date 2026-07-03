"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Aura } from "@/lib/types";
import { fetchUserTribes, type TribeWithMembers } from "@/lib/tribe-helpers";
import BottomNav from "@/components/layout/bottom-nav";
import MemberPill from "@/components/ui/member-pill";
import MemberAuraModal from "@/components/aura/member-aura-modal";

const STATUS_META: Record<string, { label: string; color: string }> = {
  empty: { label: "Waiting for members", color: "#7A756D" },
  ready: { label: "Ready to swipe", color: "#C4956A" },
  swiping: { label: "Swiping in progress", color: "#C4956A" },
  reveal: { label: "Reveal ready", color: "#6A9BC4" },
  voting: { label: "Voting", color: "#6A9BC4" },
  tiebreaker: { label: "Tiebreaker vote", color: "#6A9BC4" },
  leader_pick: { label: "Leader breaks the tie", color: "#6A9BC4" },
  reading: { label: "Currently reading", color: "#6BCB77" },
};

export default function TribesPage() {
  const router = useRouter();
  const [tribes, setTribes] = useState<TribeWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<{ name: string; aura: Aura; isLeader: boolean } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }
      setUserId(session.user.id);

      const userTribes = await fetchUserTribes(supabase, session.user.id);
      setTribes(userTribes);
      setLoading(false);
    }
    load();
  }, [router]);

  function handleCopyCode(code: string) {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      // Clipboard not available
    });
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh px-5 pt-6 pb-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-xl font-bold">Your Tribes</h1>
        <span className="text-muted-2 text-xs">{tribes.length}/5</span>
      </div>

      {tribes.length === 0 ? (
        <div className="card text-center py-12" style={{ background: "#1a191808" }}>
          <p className="text-muted-2 text-sm mb-2">No tribes yet</p>
          <p className="text-muted-3 text-xs mb-6">
            Create a tribe and invite your friends to start reading together
          </p>
          <button
            onClick={() => router.push("/tribes/create")}
            className="btn-primary text-sm"
          >
            Create Your First Tribe
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tribes.map((tribe) => {
            const status = STATUS_META[tribe.status] || STATUS_META.empty;
            return (
              <div
                key={tribe.id}
                className="card"
                style={{
                  background: `linear-gradient(135deg, ${status.color}08, transparent)`,
                  border: `1px solid ${status.color}12`,
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-text font-semibold text-base">
                    {tribe.name}
                  </h3>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${status.color}18`, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Invite code */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs text-muted-2 tracking-wider">
                    {tribe.invite_code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(tribe.invite_code)}
                    className="text-[10px] text-accent hover:text-accent/80 transition-colors"
                  >
                    {copied === tribe.invite_code ? "Copied!" : "Copy link"}
                  </button>
                </div>

                {/* Members */}
                <div className="mb-3">
                  <p className="label-mono text-[9px] mb-1.5">
                    Members ({tribe.members.length}/12)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tribe.members.map((m) => (
                      <MemberPill
                        key={m.user_id}
                        name={m.display_name}
                        color={m.aura?.color_primary}
                        isLeader={m.role === "leader"}
                        onClick={() => {
                          if (m.aura) {
                            setSelectedMember({ name: m.display_name, aura: m.aura, isLeader: m.role === "leader" });
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Current book */}
                {tribe.current_book_title && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-success/8 border border-success/12">
                    <span className="text-sm">📖</span>
                    <div>
                      <p className="text-text text-xs font-medium">{tribe.current_book_title}</p>
                      <p className="text-muted-1 text-[10px]">{tribe.current_book_author}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  {tribe.status === "swiping" && (
                    <button
                      onClick={() => router.push(`/tribes/${tribe.id}/swipe`)}
                      className="btn-primary text-xs py-2 px-4 flex-1"
                    >
                      Swipe Now →
                    </button>
                  )}
                  {tribe.status === "reveal" && (
                    <button
                      onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
                      className="btn-primary text-xs py-2 px-4 flex-1 animate-pulseGlow"
                    >
                      See Your Matches! ✦
                    </button>
                  )}
                  {tribe.status === "voting" && (
                    <button
                      onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
                      className="btn-primary text-xs py-2 px-4 flex-1"
                    >
                      Vote for Next Read →
                    </button>
                  )}
                  {(tribe.status === "tiebreaker" || tribe.status === "leader_pick") && (
                    <button
                      onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
                      className="btn-primary text-xs py-2 px-4 flex-1"
                    >
                      Break the Tie →
                    </button>
                  )}
                  {tribe.status === "reading" && (
                    <button
                      onClick={() => router.push(`/tribes/${tribe.id}/discussion`)}
                      className="btn-primary text-xs py-2 px-4 flex-1"
                    >
                      {tribe.current_book_title ? `Discuss ${tribe.current_book_title}` : "Discussion →"}
                    </button>
                  )}
                  {tribe.status === "ready" && tribe.members.length >= 2 && (
                    <button
                      onClick={() => router.push(`/tribes/${tribe.id}`)}
                      className="btn-primary text-xs py-2 px-4 flex-1"
                    >
                      {tribe.members.find((m) => m.user_id === userId)?.role === "leader" ? "Summon New Books →" : "View Tribe"}
                    </button>
                  )}
                  {(tribe.status === "empty" || (tribe.status === "ready" && tribe.members.length < 2)) && (
                    <button
                      onClick={() => router.push(`/tribes/${tribe.id}`)}
                      className="btn-ghost text-xs py-2 px-4 flex-1"
                    >
                      Invite Friends →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create tribe button */}
      {tribes.length < 5 && tribes.length > 0 && (
        <button
          onClick={() => router.push("/tribes/create")}
          className="btn-primary w-full mt-6"
        >
          Create New Tribe
        </button>
      )}

      {/* Join tribe */}
      <button
        onClick={() => router.push("/tribes/join")}
        className="btn-ghost w-full mt-3"
      >
        Join a Tribe
      </button>

      {/* Member modal */}
      {selectedMember && (
        <MemberAuraModal
          name={selectedMember.name}
          aura={selectedMember.aura}
          isLeader={selectedMember.isLeader}
          onClose={() => setSelectedMember(null)}
          onViewFull={() => {
            const uid = selectedMember.aura.user_id;
            setSelectedMember(null);
            router.push(`/aura/${uid}`);
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}
