"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import type { Aura } from "@/lib/types";
import { fetchTribeWithMembers, type TribeWithMembers } from "@/lib/tribe-helpers";
import { getArchetype } from "@/data/archetypes";
import BottomNav from "@/components/layout/bottom-nav";
import MemberAuraModal from "@/components/aura/member-aura-modal";
import CharacterIllustration from "@/components/characters";
import LoadingOverlay from "@/components/ui/loading-overlay";

const DECK_LOADING_MESSAGES = [
  "Consulting the Story Spirits...",
  "Analyzing your tribe's auras...",
  "Curating the perfect deck...",
  "Writing blind descriptions...",
  "Shuffling the cards...",
];

export default function TribeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tribeId = params.id as string;
  const { toast } = useToast();

  const [tribe, setTribe] = useState<TribeWithMembers | null>(null);
  const [bookCount, setBookCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingDeck, setGeneratingDeck] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ name: string; aura: Aura; isLeader: boolean; userId: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmTransfer, setConfirmTransfer] = useState<{ userId: string; name: string } | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<{ userId: string; name: string } | null>(null);

  const isLeader = tribe?.members.find((m) => m.user_id === userId)?.role === "leader";

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }
      setUserId(session.user.id);

      const t = await fetchTribeWithMembers(supabase, tribeId);
      if (!t) { router.replace("/home"); return; }
      setTribe(t);

      const { count } = await supabase
        .from("tribe_book_history")
        .select("*", { count: "exact", head: true })
        .eq("tribe_id", tribeId);
      setBookCount(count || 0);

      setLoading(false);
    }
    load();
  }, [tribeId, router]);

  async function handleGenerateDeck() {
    if (!userId) return;
    setGeneratingDeck(true);
    const res = await apiFetch(`/api/tribes/${tribeId}/generate-deck`, {
      method: "POST",
    });
    const data = await res.json();
    setGeneratingDeck(false);
    if (res.ok) {
      router.push(`/tribes/${tribeId}/swipe`);
    } else {
      toast("error", data.error || "Failed to summon books");
    }
  }

  async function handleTransferLeadership(newLeaderId: string) {
    const res = await apiFetch("/api/tribes/leader", {
      method: "POST",
      body: JSON.stringify({ tribeId, newLeaderId }),
    });
    if (res.ok) {
      setConfirmTransfer(null);
      const t = await fetchTribeWithMembers(supabase, tribeId);
      if (t) setTribe(t);
      toast("success", "Leadership transferred.");
    } else {
      toast("error", "Couldn't transfer leadership.");
    }
  }

  async function handleRemoveMember(memberId: string) {
    const res = await apiFetch("/api/tribes/remove-member", {
      method: "POST",
      body: JSON.stringify({ tribeId, memberId }),
    });
    if (res.ok) {
      setConfirmRemove(null);
      const t = await fetchTribeWithMembers(supabase, tribeId);
      if (t) setTribe(t);
      toast("success", "Member removed.");
    } else {
      toast("error", "Couldn't remove member.");
    }
  }

  function handleShare() {
    const shareUrl = `${window.location.origin}/join/${tribe?.invite_code}`;
    if (navigator.share) {
      navigator.share({
        title: `Join ${tribe?.name} on Fabled`,
        text: `Join "${tribe?.name}" on Fabled! Code: ${tribe?.invite_code}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }

  if (loading || !tribe) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  // Aura chemistry: find best-match ("twins") and tension ("opposites") pairs
  // among members, grounded in each archetype's compatibility data.
  const auraMembers = tribe.members.filter((m) => m.aura);
  const twins: { a: string; b: string; desc: string }[] = [];
  const opposites: { a: string; b: string; desc: string }[] = [];
  for (let i = 0; i < auraMembers.length; i++) {
    for (let j = i + 1; j < auraMembers.length; j++) {
      const a = auraMembers[i];
      const b = auraMembers[j];
      const archA = getArchetype(a.aura!.archetype);
      const archB = getArchetype(b.aura!.archetype);
      if (!archA || !archB) continue;
      if (archA.compatibility.bestMatch === b.aura!.archetype) {
        twins.push({ a: a.display_name, b: b.display_name, desc: archA.compatibility.bestDescription });
      } else if (archB.compatibility.bestMatch === a.aura!.archetype) {
        twins.push({ a: b.display_name, b: a.display_name, desc: archB.compatibility.bestDescription });
      } else if (archA.compatibility.tension === b.aura!.archetype) {
        opposites.push({ a: a.display_name, b: b.display_name, desc: archA.compatibility.tensionDescription });
      } else if (archB.compatibility.tension === a.aura!.archetype) {
        opposites.push({ a: b.display_name, b: a.display_name, desc: archB.compatibility.tensionDescription });
      }
    }
  }
  const chemistry = [
    ...twins.slice(0, 2).map((t) => ({ ...t, type: "twin" as const })),
    ...opposites.slice(0, 2).map((t) => ({ ...t, type: "opposite" as const })),
  ];

  const statusColor =
    tribe.status === "reading" ? "#6BCB77" :
    tribe.status === "swiping" || tribe.status === "ready" ? "#C4956A" :
    tribe.status === "reveal" || tribe.status === "voting" ? "#6A9BC4" :
    "#7A756D";

  const statusLabel: Record<string, string> = {
    empty: "Waiting for members",
    ready: "Ready to swipe",
    swiping: "Swiping in progress",
    reveal: "Reveal ready",
    voting: "Voting on next read",
    tiebreaker: "Tiebreaker vote",
    leader_pick: "Leader breaks the tie",
    reading: "Currently reading",
  };

  return (
    <div className="min-h-dvh px-5 pt-6 pb-4">
      {generatingDeck && <LoadingOverlay messages={DECK_LOADING_MESSAGES} />}

      <button
        onClick={() => router.push("/home")}
        className="text-muted-2 text-sm mb-6 hover:text-text-secondary transition-colors"
      >
        ← Home
      </button>

      {/* Tribe header */}
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">{tribe.name}</h1>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full inline-block"
          style={{ background: `${statusColor}18`, color: statusColor }}
        >
          {statusLabel[tribe.status] || tribe.status}
        </span>
      </div>

      {/* Invite code card */}
      <div className="card text-center mb-6 py-5" style={{ background: "#1a191808" }}>
        <p className="label-mono mb-1">Invite Code</p>
        <p className="font-mono text-2xl font-bold tracking-[0.25em] text-accent mb-3">
          {tribe.invite_code}
        </p>
        <button onClick={handleShare} className="btn-ghost text-xs">
          {copied ? "Link Copied!" : "Share Invite"}
        </button>
      </div>

      {/* Members */}
      <div className="mb-6">
        <p className="label-mono mb-3">Members ({tribe.members.length}/12)</p>
        <div className="space-y-2">
          {tribe.members.map((m) => (
            <button
              key={m.user_id}
              onClick={() => {
                if (m.aura) setSelectedMember({ name: m.display_name, aura: m.aura, isLeader: m.role === "leader", userId: m.user_id });
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors hover:bg-white/[0.02]"
              style={{ border: `1px solid ${m.aura?.color_primary || "#3D3A35"}15` }}
            >
              {m.aura ? (
                <div className="w-10 h-12 shrink-0">
                  <CharacterIllustration
                    archetype={m.aura.archetype}
                    c1={m.aura.color_primary}
                    c2={m.aura.color_secondary}
                    c3={m.aura.color_tertiary}
                  />
                </div>
              ) : (
                <div className="w-10 h-12 shrink-0 rounded-lg bg-muted-5/20" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-text text-sm font-medium">{m.display_name}</p>
                  {m.role === "leader" && <span className="text-xs">👑</span>}
                </div>
                {m.aura && (
                  <p className="text-xs mt-0.5" style={{ color: m.aura.color_primary }}>
                    {m.aura.archetype.replace(/^\w/, (c) => c.toUpperCase()).replace(/^(\w+)/, "The $1")}
                  </p>
                )}
              </div>
              <span className="text-muted-3 text-sm">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tribe chemistry */}
      {chemistry.length > 0 && (
        <div className="mb-6">
          <p className="label-mono mb-3">Tribe Chemistry</p>
          <div className="space-y-2">
            {chemistry.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl"
                style={{
                  background: c.type === "twin" ? "#6BCB7708" : "#6A9BC408",
                  border: `1px solid ${c.type === "twin" ? "#6BCB7718" : "#6A9BC418"}`,
                }}
              >
                <p className="text-sm text-text">
                  <span className="mr-1">{c.type === "twin" ? "✦" : "⚡"}</span>
                  <span className="font-medium">{c.a}</span>
                  {c.type === "twin" ? " & " : " vs "}
                  <span className="font-medium">{c.b}</span>
                  <span className="text-muted-2">
                    {c.type === "twin" ? " are aura twins" : " are opposites"}
                  </span>
                </p>
                <p className="text-muted-2 text-xs mt-0.5 italic">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current book */}
      {tribe.current_book_title && (
        <div className="card mb-6" style={{ background: "#6BCB7708", border: "1px solid #6BCB7712" }}>
          <div className="flex items-center justify-between mb-1">
            <p className="label-mono text-success">Currently Reading</p>
            {bookCount > 0 && (
              <p className="text-muted-2 text-xs">
                {bookCount === 1 ? "1st book together" : `${bookCount} books together`}
              </p>
            )}
          </div>
          <p className="text-text font-medium">{tribe.current_book_title}</p>
          <p className="text-muted-1 text-sm">{tribe.current_book_author}</p>
        </div>
      )}

      {/* Actions based on state */}
      <div className="space-y-3">
        {tribe.status === "ready" && tribe.members.length >= 2 && isLeader && (
          <div>
            <button
              onClick={handleGenerateDeck}
              disabled={generatingDeck}
              className="btn-primary w-full"
            >
              {generatingDeck ? "Summoning..." : "Summon New Books"}
            </button>
            <p className="text-muted-3 text-xs mt-1.5 text-center">The Story Spirits will curate picks for your tribe.</p>
          </div>
        )}

        {tribe.status === "ready" && tribe.members.length >= 2 && !isLeader && (
          <p className="text-muted-2 text-sm text-center py-2 italic">Waiting for the tribe leader to summon new books</p>
        )}

        {tribe.status === "swiping" && (
          <button
            onClick={() => router.push(`/tribes/${tribeId}/swipe`)}
            className="btn-primary w-full"
          >
            Start Swiping
          </button>
        )}

        {(tribe.status === "reveal" || tribe.status === "voting" || tribe.status === "tiebreaker" || tribe.status === "leader_pick") && (
          <button
            onClick={() => router.push(`/tribes/${tribeId}/reveal`)}
            className="btn-primary w-full"
          >
            {tribe.status === "reveal" ? "See Your Matches!" : "Vote for Next Read"}
          </button>
        )}

        {tribe.status === "reading" && (
          <>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/tribes/${tribeId}/reveal`)}
                className="btn-ghost flex-1"
              >
                View Results
              </button>
              <button
                onClick={() => router.push(`/tribes/${tribeId}/discussion`)}
                className="btn-primary flex-[1.5]"
              >
                Discussion
              </button>
            </div>
            {isLeader && (
              <div>
                <button
                  onClick={handleGenerateDeck}
                  disabled={generatingDeck}
                  className="btn-ghost w-full"
                >
                  {generatingDeck ? "Summoning..." : "Summon New Books"}
                </button>
                <p className="text-muted-3 text-xs mt-1.5 text-center">The Story Spirits will curate picks for your tribe.</p>
              </div>
            )}
          </>
        )}

        {tribe.status === "empty" && (
          <div className="text-center py-4">
            <p className="text-muted-2 text-sm">
              Invite at least one more person to get started
            </p>
          </div>
        )}
      </div>

      {/* Member modal with leader actions */}
      {selectedMember && (
        <>
          <MemberAuraModal
            name={selectedMember.name}
            aura={selectedMember.aura}
            isLeader={selectedMember.isLeader}
            onClose={() => setSelectedMember(null)}
            onViewFull={() => {
              const uid = selectedMember.userId;
              setSelectedMember(null);
              router.push(`/aura/${uid}`);
            }}
          />
          {/* Leader actions overlay on modal */}
          {isLeader && selectedMember.userId !== userId && (
            <div className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 pt-2" style={{ background: "linear-gradient(to top, rgba(26,25,24,0.98) 60%, transparent)" }}>
              <div className="flex gap-3 max-w-md mx-auto">
                <button
                  onClick={() => {
                    setSelectedMember(null);
                    setConfirmTransfer({ userId: selectedMember.userId, name: selectedMember.name });
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-accent border border-accent/20 hover:bg-accent/10 transition-colors"
                >
                  👑 Make Leader
                </button>
                <button
                  onClick={() => {
                    setSelectedMember(null);
                    setConfirmRemove({ userId: selectedMember.userId, name: selectedMember.name });
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-error/70 border border-error/20 hover:bg-error/10 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Transfer leadership confirmation */}
      {confirmTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-fadeIn" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="bg-bg-card border border-muted-5/30 rounded-2xl p-6 max-w-xs w-full animate-popIn text-center">
            <h3 className="font-display text-lg font-semibold mb-2">Transfer Leadership?</h3>
            <p className="text-muted-1 text-sm mb-5">
              Make {confirmTransfer.name} the tribe leader? You&apos;ll become a regular member.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmTransfer(null)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => handleTransferLeadership(confirmTransfer.userId)}
                className="btn-primary flex-1"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove member confirmation */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-fadeIn" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="bg-bg-card border border-muted-5/30 rounded-2xl p-6 max-w-xs w-full animate-popIn text-center">
            <h3 className="font-display text-lg font-semibold mb-2">Remove Member?</h3>
            <p className="text-muted-1 text-sm mb-5">
              Remove {confirmRemove.name} from the tribe? They can rejoin with the invite code.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemove(null)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => handleRemoveMember(confirmRemove.userId)}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-white bg-error/80 hover:bg-error transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
