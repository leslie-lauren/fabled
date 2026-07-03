"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import type { Aura } from "@/lib/types";
import { fetchUserTribes, type TribeWithMembers } from "@/lib/tribe-helpers";
import BottomNav from "@/components/layout/bottom-nav";
import MemberPill from "@/components/ui/member-pill";
import MemberAuraModal from "@/components/aura/member-aura-modal";
import CharacterIllustration from "@/components/characters";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { getArchetype } from "@/data/archetypes";

const DECK_LOADING_MESSAGES = [
  "Consulting the Story Spirits...",
  "Analyzing your tribe's auras...",
  "Curating the perfect deck...",
  "Writing blind descriptions...",
  "Shuffling the cards...",
];

interface TribeProgress {
  userHasSwiped: boolean;
  userHasVoted: boolean;
  swipedCount: number;
  votedCount: number;
  totalMembers: number;
  voteRound: number;
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [aura, setAura] = useState<Aura | null>(null);
  const [tribes, setTribes] = useState<TribeWithMembers[]>([]);
  const [selectedMember, setSelectedMember] = useState<{ name: string; aura: Aura; isLeader: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingDeck, setGeneratingDeck] = useState<string | null>(null);
  const [tribeProgress, setTribeProgress] = useState<Record<string, TribeProgress>>({});

  async function handleGenerateDeck(tribeId: string) {
    if (!userId) return;
    setGeneratingDeck(tribeId);
    const res = await apiFetch(`/api/tribes/${tribeId}/generate-deck`, {
      method: "POST",
    });
    const data = await res.json();
    setGeneratingDeck(null);
    if (res.ok) {
      router.push(`/tribes/${tribeId}/swipe`);
    } else {
      toast("error", data.error || "Failed to summon books");
    }
  }

  async function loadTribeProgress(uid: string, userTribes: TribeWithMembers[]) {
    const tribeIds = userTribes.map((t) => t.id);
    if (tribeIds.length === 0) return;
    try {
      const res = await apiFetch("/api/home-status", {
        method: "POST",
        body: JSON.stringify({ tribeIds }),
      });
      const data = await res.json();
      setTribeProgress(data);
    } catch {
      // Non-critical, CTAs will fall back to basic behavior
    }
  }

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/welcome");
        return;
      }
      setUserId(session.user.id);

      const { data: auraData } = await supabase
        .from("auras")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!auraData) {
        router.replace("/aura/generate");
        return;
      }
      setAura(auraData);

      // Honor a pending invite carried through the auth flow (?joinCode=CODE).
      const joinCode = new URLSearchParams(window.location.search).get("joinCode");
      if (joinCode) {
        window.history.replaceState({}, "", "/home");
        const joinRes = await apiFetch("/api/tribes/join", {
          method: "POST",
          body: JSON.stringify({ code: joinCode.toUpperCase() }),
        });
        if (joinRes.ok) {
          const joinData = await joinRes.json();
          if (joinData.tribe?.id) {
            router.push(`/tribes/${joinData.tribe.id}`);
            return;
          }
        }
      }

      const userTribes = await fetchUserTribes(supabase, session.user.id);
      setTribes(userTribes);
      await loadTribeProgress(session.user.id, userTribes);
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Re-fetch tribes when user navigates back to this page
  const refetchTribes = useCallback(async () => {
    if (!userId) return;
    const userTribes = await fetchUserTribes(supabase, userId);
    setTribes(userTribes);
    await loadTribeProgress(userId, userTribes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    function handleVisibility() {
      if (document.visibilityState === "visible") refetchTribes();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refetchTribes);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refetchTribes);
    };
  }, [userId, refetchTribes]);

  // Re-fetch when pathname is active (catches in-app back navigation)
  useEffect(() => {
    if (pathname === "/home" && userId) {
      refetchTribes();
    }
  }, [pathname, userId, refetchTribes]);

  if (loading || !aura) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  const archetype = getArchetype(aura.archetype);
  const c1 = aura.color_primary;

  function isUserLeader(tribe: TribeWithMembers) {
    return tribe.members.find((m) => m.user_id === userId)?.role === "leader";
  }

  function leaderName(tribe: TribeWithMembers) {
    return tribe.members.find((m) => m.role === "leader")?.display_name || "leader";
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "ready":
      case "swiping": return "#C4956A";
      case "reading": return "#6BCB77";
      case "reveal":
      case "voting":
      case "tiebreaker":
      case "leader_pick": return "#6A9BC4";
      default: return "#7A756D";
    }
  }

  function getTribeCTA(tribe: TribeWithMembers) {
    const isLeader = isUserLeader(tribe);
    const progress = tribeProgress[tribe.id];

    switch (tribe.status) {
      case "empty":
        return (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}`)}
            className="btn-ghost text-xs py-2 px-4"
          >
            Invite Friends
          </button>
        );
      case "ready":
        return isLeader ? (
          <div className="flex flex-col items-end">
            <button
              onClick={() => handleGenerateDeck(tribe.id)}
              disabled={generatingDeck === tribe.id || tribe.members.length < 2}
              className="btn-primary text-xs py-2 px-4"
            >
              {generatingDeck === tribe.id ? "Summoning..." : "Summon New Books"}
            </button>
            <p className="text-muted-3 text-[10px] mt-1 text-right">
              {tribe.members.length < 2
                ? "Need at least 2 members"
                : `Based on ${tribe.members.length} members' auras. Invite more for better results.`}
            </p>
          </div>
        ) : (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}`)}
            className="btn-ghost text-xs py-2 px-4"
          >
            Waiting for tribe leader to summon books
          </button>
        );
      case "swiping":
        if (progress && progress.userHasSwiped) {
          return (
            <button
              onClick={() => router.push(`/tribes/${tribe.id}/swipe`)}
              className="btn-ghost text-xs py-2 px-4"
            >
              Swiping complete!
            </button>
          );
        }
        return (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}/swipe`)}
            className="btn-primary text-xs py-2 px-4"
          >
            Summon New Books
          </button>
        );
      case "reveal":
        return (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
            className="btn-primary text-xs py-2 px-4 animate-pulseGlow"
          >
            See Your Matches!
          </button>
        );
      case "voting":
        if (progress && progress.userHasVoted) {
          return (
            <button
              onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
              className="btn-ghost text-xs py-2 px-4"
            >
              Waiting for votes... ({progress.votedCount}/{progress.totalMembers})
            </button>
          );
        }
        return (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
            className="btn-primary text-xs py-2 px-4"
          >
            Vote Now
          </button>
        );
      case "tiebreaker":
        if (progress && progress.userHasVoted) {
          return (
            <button
              onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
              className="btn-ghost text-xs py-2 px-4"
            >
              Waiting for votes... ({progress.votedCount}/{progress.totalMembers})
            </button>
          );
        }
        return (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
            className="btn-primary text-xs py-2 px-4"
          >
            Tie! Vote for Winner
          </button>
        );
      case "leader_pick":
        if (isLeader) {
          return (
            <button
              onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
              className="btn-primary text-xs py-2 px-4"
            >
              Break the Tie
            </button>
          );
        }
        return (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}/reveal`)}
            className="btn-ghost text-xs py-2 px-4"
          >
            Tie! Waiting for tribe leader...
          </button>
        );
      case "reading":
        return (
          <button
            onClick={() => router.push(`/tribes/${tribe.id}/discussion`)}
            className="btn-primary text-xs py-2 px-4"
          >
            Start Discussion
          </button>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-dvh px-5 pt-6 pb-4">
      {generatingDeck && <LoadingOverlay messages={DECK_LOADING_MESSAGES} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Fabled</h1>
        <button
          onClick={() => router.push("/settings")}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted-6/30 transition-colors text-muted-2 hover:text-text-secondary"
          aria-label="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Mini Aura Card */}
      <p className="label-mono text-[9px] tracking-[0.15em] text-muted-3 mb-2">MY READING AURA</p>
      <button
        onClick={() => router.push("/aura")}
        className="w-full card mb-6 flex items-center gap-4 text-left"
        style={{
          background: `linear-gradient(135deg, ${c1}0A, transparent)`,
          border: `1px solid ${c1}15`,
        }}
      >
        <div className="w-12 h-14 shrink-0">
          <CharacterIllustration
            archetype={aura.archetype}
            c1={c1}
            c2={aura.color_secondary}
            c3={aura.color_tertiary}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base font-semibold" style={{ color: c1 }}>
            {archetype?.name}
          </p>
          <div className="flex gap-1.5 mt-1">
            {aura.strengths.slice(0, 2).map((s, i) => (
              <span key={i} className="text-muted-1 text-[10px]">
                {s}{i === 0 ? " ·" : ""}
              </span>
            ))}
          </div>
        </div>
        <span className="text-muted-3 text-lg">›</span>
      </button>

      {/* Tribes */}
      <div className="mb-6">
        <p className="label-mono mb-3">Your Tribes</p>

        {tribes.length === 0 ? (
          <div className="card text-center py-8" style={{ background: "#1a191808" }}>
            <p className="text-muted-2 text-sm mb-4">
              No tribes yet. Create one or join with a code.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tribes.map((tribe) => (
              <div
                key={tribe.id}
                className="card"
                style={{
                  background: `linear-gradient(135deg, ${getStatusColor(tribe.status)}08, transparent)`,
                  border: `1px solid ${getStatusColor(tribe.status)}12`,
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <button
                    onClick={() => router.push(`/tribes/${tribe.id}`)}
                    className="text-left"
                  >
                    <h3 className="text-text font-medium text-base">
                      {tribe.name}
                    </h3>
                  </button>
                  <span className="label-mono text-[9px] text-muted-3">
                    {tribe.invite_code}
                  </span>
                </div>

                {/* Members */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tribe.members.map((m) => (
                    <MemberPill
                      key={m.user_id}
                      name={m.display_name}
                      color={m.aura?.color_primary}
                      isLeader={m.role === "leader"}
                      onClick={() => {
                        if (m.aura) {
                          setSelectedMember({
                            name: m.display_name,
                            aura: m.aura,
                            isLeader: m.role === "leader",
                          });
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Current book */}
                {tribe.current_book_title && (
                  <p className="text-muted-1 text-xs mb-3">
                    📖 {tribe.current_book_title} by {tribe.current_book_author}
                  </p>
                )}

                {/* CTA */}
                <div className="flex justify-end">
                  {getTribeCTA(tribe)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => router.push("/tribes/create")}
          className="btn-primary w-full"
        >
          Create New Tribe
        </button>
        <button
          onClick={() => router.push("/tribes/join")}
          className="btn-ghost w-full"
        >
          Join a Tribe
        </button>
      </div>

      {/* Member Modal */}
      {selectedMember && (
        <MemberAuraModal
          name={selectedMember.name}
          aura={selectedMember.aura}
          isLeader={selectedMember.isLeader}
          onClose={() => setSelectedMember(null)}
          onViewFull={() => {
            setSelectedMember(null);
            router.push(`/aura/${selectedMember.aura.user_id}`);
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}
