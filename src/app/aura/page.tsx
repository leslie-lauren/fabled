"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Aura } from "@/lib/types";
import { getArchetype } from "@/data/archetypes";
import AuraCard from "@/components/aura/aura-card";
import BookRow from "@/components/aura/book-row";
import CharacterIllustration from "@/components/characters";
import BottomNav from "@/components/layout/bottom-nav";

interface PastRead {
  title: string;
  author: string;
  tribeName: string;
}

interface TribeInfo {
  id: string;
  name: string;
  invite_code: string;
}

export default function MyAuraPage() {
  const router = useRouter();
  const [aura, setAura] = useState<Aura | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pastReads, setPastReads] = useState<PastRead[]>([]);
  const [showShare, setShowShare] = useState(false);
  const [userTribes, setUserTribes] = useState<TribeInfo[]>([]);
  const [selectedTribeForShare, setSelectedTribeForShare] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

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

      // Get past reads
      const { data: memberships } = await supabase
        .from("tribe_members")
        .select("tribe_id")
        .eq("user_id", session.user.id);

      if (memberships && memberships.length > 0) {
        const tribeIds = memberships.map((m) => m.tribe_id);
        const { data: tribes } = await supabase
          .from("tribes")
          .select("id, name, current_book_title, current_book_author, status")
          .in("id", tribeIds)
          .eq("status", "reading");

        const reads: PastRead[] = [];
        if (tribes) {
          for (const t of tribes) {
            if (t.current_book_title) {
              reads.push({ title: t.current_book_title, author: t.current_book_author || "", tribeName: t.name });
            }
          }
        }
        setPastReads(reads);
      }

      // Get user tribes for share feature
      const { data: allMemberships } = await supabase
        .from("tribe_members")
        .select("tribe_id")
        .eq("user_id", session.user.id);

      if (allMemberships && allMemberships.length > 0) {
        const allTribeIds = allMemberships.map((m) => m.tribe_id);
        const { data: allTribes } = await supabase
          .from("tribes")
          .select("id, name, invite_code")
          .in("id", allTribeIds);
        if (allTribes) {
          setUserTribes(allTribes);
          setSelectedTribeForShare(allTribes[allTribes.length - 1]?.id || null);
        }
      }
    });
  }, [router]);

  async function handleShare(withTribe: boolean) {
    setSharing(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const card = shareCardRef.current;
      if (!card) { setSharing(false); return; }

      // Clone the capture card into a wrapper appended to <body>.
      // The wrapper is visible (so html2canvas computes all styles)
      // but hidden from the user by an opaque overlay behind it and
      // overflow:hidden + fixed dimensions on the wrapper itself.
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:99998;background:#000;";
      document.body.appendChild(overlay);

      const wrapper = document.createElement("div");
      wrapper.style.cssText = "position:fixed;left:0;top:0;width:340px;height:604px;z-index:99999;overflow:hidden;";
      const clone = card.cloneNode(true) as HTMLElement;
      clone.style.display = "block";
      clone.style.position = "relative";
      clone.style.width = "340px";
      clone.style.height = "604px";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // Let the browser compute layout and styles across two frames
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // Update tribe invite text if needed
      const tribeInviteEl = clone.querySelector("[data-tribe-invite]") as HTMLElement;
      if (tribeInviteEl) {
        if (withTribe && selectedTribeForShare) {
          const tribe = userTribes.find((t) => t.id === selectedTribeForShare);
          if (tribe) {
            tribeInviteEl.style.display = "block";
            tribeInviteEl.innerHTML = `<span style="font-family:'JetBrains Mono',monospace;font-size:6px;letter-spacing:0.12em;color:rgba(255,255,255,0.5)">Join my tribe: </span><span style="font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:0.15em;color:rgba(255,255,255,0.7)">${tribe.invite_code}</span>`;
          }
        } else {
          tribeInviteEl.style.display = "none";
        }
      }

      // Wait one more frame after tribe invite update
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // Capture the 340×604 card at 3.176x scale → outputs 1080×1920 PNG
      const scaleFactor = 1080 / 340;
      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        width: 340,
        height: 604,
        scale: scaleFactor,
      });

      console.log(`[share] canvas: ${canvas.width}x${canvas.height}`);

      // Clean up: remove cloned card and overlay
      document.body.removeChild(wrapper);
      document.body.removeChild(overlay);

      canvas.toBlob(async (blob) => {
        if (!blob) { setSharing(false); return; }
        const file = new File([blob], "my-reading-aura.png", { type: "image/png" });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: "My Reading Aura on Fabled" });
          } catch {
            // User cancelled share
          }
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "my-reading-aura.png";
          a.click();
          URL.revokeObjectURL(url);
        }
        setSharing(false);
        setShowShare(false);
      }, "image/png");
    } catch {
      setSharing(false);
    }
  }

  function handleRegenerate() {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    router.push("/aura/generate");
  }

  if (!aura) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  const c1 = aura.color_primary;
  const c2 = aura.color_secondary;

  // Prepare bookshelf data
  const booksILove = (aura.books_input || []).map((b: string) => {
    const parts = b.split(" by ");
    return parts.length > 1
      ? { title: parts.slice(0, -1).join(" by "), author: parts[parts.length - 1] }
      : { title: b };
  });

  const tribeReads = pastReads.map((r) => ({
    title: r.title,
    author: r.author,
    tribe: r.tribeName,
  }));

  return (
    <div className="min-h-dvh pb-4">
      {/* Navigation */}
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.push("/home")}
            className="text-muted-2 text-sm hover:text-text-secondary transition-colors"
          >
            ← Home
          </button>
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
      </div>

      {/* Aura Card */}
      <div className="max-w-sm mx-auto px-5">
        <AuraCard aura={aura} />

        {/* CTAs: Share (gold) above Regenerate (ghost) */}
        <div className="flex flex-col gap-2.5 mt-6">
          <button
            onClick={() => setShowShare(true)}
            className="btn-primary w-full text-sm"
          >
            Share My Aura
          </button>
          <button
            onClick={handleRegenerate}
            className="btn-ghost w-full text-sm"
          >
            Regenerate My Aura
          </button>
        </div>

        {/* Bookshelf */}
        <div className="mt-8">
          <p className="label-mono mb-4">My Bookshelf</p>
          <BookRow books={booksILove} c1={c1} c2={c2} label="Books I Love" />
          {tribeReads.length > 0 && (
            <BookRow books={tribeReads} c1={c1} c2={c2} label="Tribe Reads" />
          )}
          {tribeReads.length === 0 && (
            <div className="mb-5">
              <p className="text-muted-2 text-xs font-medium mb-2.5">Tribe Reads</p>
              <p className="text-muted-3 text-xs italic">No tribe reads yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="label-mono text-center text-[9px] tracking-[0.2em] text-muted-3 mt-4 mb-2">
          READING AURA ✦ 2026
        </p>
      </div>

      {/* Regenerate Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-fadeIn" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="bg-bg-card border border-muted-5/30 rounded-2xl p-6 max-w-xs w-full animate-popIn text-center">
            <h3 className="font-display text-lg font-semibold mb-2">
              Regenerate Aura?
            </h3>
            <p className="text-muted-1 text-sm mb-5">
              This will update your aura across all your tribes. Your books will be reset.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/aura/generate")}
                className="btn-primary flex-1"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal — card preview + share options */}
      {showShare && aura && (() => {
        const sc1 = aura.color_primary;
        const sc2 = aura.color_secondary;
        const sc3 = aura.color_tertiary;
        const archetype = getArchetype(aura.archetype);
        const monthName = new Date().toLocaleString("default", { month: "long" }).toUpperCase();
        const bonusGrid = [
          { emoji: "✨", label: `${monthName} BOOK-SCOPE`, text: aura.book_scope || "", clamp: 6 },
          { emoji: "🧚", label: "SOUL READ", text: aura.spirit_book || "", clamp: 3 },
          { emoji: "🚩", label: "READING RED FLAG", text: aura.roast || "", clamp: 6 },
          { emoji: "🔮", label: "YOUR EPILOGUE", text: aura.prediction_2036 || "", clamp: 6 },
        ];

        // Card content renderer — always at 340×604 base size (no scale factor needed)
        const renderCardContent = () => (
          <>
            {/* Gradient bg */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, ${sc1}DD 0%, ${sc3}BB 20%, #0D0B10 45%, #0D0B10 65%, ${sc3}99 85%, ${sc2}77 100%)` }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 10%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(ellipse at 60% 90%, rgba(255,255,255,0.06) 0%, transparent 40%)" }} />
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, bottom: 12, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, pointerEvents: "none" as const }} />

            <div style={{ position: "relative", zIndex: 1, padding: "18px 20px 14px" }}>
              {/* Header */}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 4 }}>
                MY READING AURA
              </div>
              {/* Character */}
              <div style={{ width: 70, height: 82, margin: "0 auto 2px" }}>
                <CharacterIllustration archetype={aura.archetype} c1={sc1} c2={sc2} c3={sc3} />
              </div>
              {/* Name */}
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#F5F0E8", lineHeight: 1.05, textAlign: "center", marginBottom: 4, textShadow: "0 1.5px 8px rgba(0,0,0,0.4)" }}>
                {archetype?.name || aura.archetype}
              </div>
              {/* Bio — 2 lines max */}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, color: "rgba(245,240,232,0.6)", lineHeight: 1.5, textAlign: "center", marginBottom: 6, padding: "0 6px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                {aura.bio}
              </div>
              {/* Strength pills — flex centered vertically */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "nowrap" as const, marginBottom: 8, overflow: "hidden" }}>
                {aura.strengths.map((str, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(245,240,232,0.8)", fontSize: 7, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap" as const, lineHeight: 1.4 }}>
                    {str}
                  </span>
                ))}
              </div>
              {/* 2x2 Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
                {bonusGrid.map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 6px", textAlign: "center", display: "flex", flexDirection: "column" as const, alignItems: "center", height: 110, overflow: "hidden" }}>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{item.emoji}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 5, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 3 }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontStyle: "italic", color: "rgba(245,240,232,0.7)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: item.clamp, WebkitBoxOrient: "vertical" as const }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* Gold CTA */}
              <div style={{ background: "rgba(196,149,106,0.12)", border: "1px solid rgba(196,149,106,0.2)", borderRadius: 10, padding: "7px 12px", textAlign: "center", marginBottom: 5 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, fontWeight: 600, color: "rgba(245,240,232,0.9)", marginBottom: 2 }}>
                  What&apos;s your reading aura?
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7, color: "rgba(196,149,106,0.7)" }}>
                  join-fabled.vercel.app
                </div>
              </div>
              {/* Tribe invite */}
              <div data-tribe-invite style={{ display: "none", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "5px 10px", marginBottom: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.4)" }} />
              {/* Branding */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 7, color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em" }}>fabled</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 5, color: "rgba(255,255,255,0.1)", fontStyle: "italic", marginTop: 1 }}>a whimsical book club</div>
              </div>
            </div>
          </>
        );

        const cardContainerStyle: React.CSSProperties = {
          width: 340, height: 604, borderRadius: 20, overflow: "hidden",
          position: "relative", flexShrink: 0,
          fontFamily: "'DM Sans', sans-serif", color: "#F5F0E8",
        };

        return (
          <>
            {/* Modal overlay with card preview */}
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 animate-fadeIn" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setShowShare(false)}>
              <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center">
                {/* Card preview — 340×604, fixed size; also the capture source */}
                <div ref={shareCardRef} style={{ ...cardContainerStyle, boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
                  {renderCardContent()}
                </div>

                {/* Share options below card */}
                <div className="mt-5 w-[340px] space-y-2.5">
                  {userTribes.length > 0 && (
                    <>
                      {userTribes.length > 1 && (
                        <select
                          value={selectedTribeForShare || ""}
                          onChange={(e) => setSelectedTribeForShare(e.target.value)}
                          className="w-full bg-bg border border-muted-5/30 rounded-xl px-3 py-2 text-text text-sm"
                        >
                          {userTribes.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      )}
                      <button onClick={() => handleShare(true)} disabled={sharing} className="btn-primary w-full text-sm">
                        {sharing ? "Generating..." : "Share with tribe invite"}
                      </button>
                    </>
                  )}
                  <button onClick={() => handleShare(false)} disabled={sharing} className="btn-ghost w-full text-sm">
                    {sharing ? "Generating..." : "Share without tribe invite"}
                  </button>
                  <button onClick={() => setShowShare(false)} className="text-muted-2 text-xs w-full text-center pt-1 hover:text-text-secondary transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

          </>
        );
      })()}

      <BottomNav />
    </div>
  );
}
