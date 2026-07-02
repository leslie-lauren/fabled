"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Aura } from "@/lib/types";
import AuraCard from "@/components/aura/aura-card";
import BookRow from "@/components/aura/book-row";
import ShareCard from "@/components/aura/share-card";
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

  async function handleShare() {
    setSharing(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const card = shareCardRef.current;
      if (!card) { setSharing(false); return; }

      // Capture the ShareCard at its NATIVE 1080×1920 resolution.
      // It's rendered offscreen (left:-10000px) at full size so html2canvas
      // gets pixel-perfect output with no scaling math.
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        width: 1080,
        height: 1920,
        scale: 1,
        windowWidth: 1080,
        windowHeight: 1920,
      });

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

      {/* Share Modal — SINGLE ShareCard component for preview + capture.
          Preview = full-size card scaled down visually via CSS transform.
          Capture = same card rendered offscreen at native 1080×1920. */}
      {showShare && aura && (() => {
        const activeTribe = userTribes.find((t) => t.id === selectedTribeForShare);
        const tribeCode = activeTribe?.invite_code || null;
        const PREVIEW_SCALE = 340 / 1080; // 0.31481…
        const PREVIEW_W = 340;
        const PREVIEW_H = Math.round(1920 * PREVIEW_SCALE); // 604

        return (
          <div
            className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn"
            style={{ background: "#0A090C" }}
          >
            {/* Close button — top right */}
            <button
              onClick={() => setShowShare(false)}
              className="fixed top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#F5F0E8",
              }}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Scrollable content — preview card + controls */}
            <div className="min-h-full flex flex-col items-center justify-start px-5 pt-14 pb-10">
              <p className="label-mono text-center mb-4 text-[10px] tracking-[0.25em]" style={{ color: "#7A756D" }}>
                SHARE MY READING AURA
              </p>

              {/* Scaled preview: fixed-size window that crops the transformed ShareCard.
                  transform-origin: top left so the scaled card fills from (0,0). */}
              <div
                style={{
                  width: PREVIEW_W,
                  height: PREVIEW_H,
                  overflow: "hidden",
                  borderRadius: 20,
                  boxShadow: "0 10px 50px rgba(0,0,0,0.6)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: "top left",
                    width: 1080,
                    height: 1920,
                  }}
                >
                  <ShareCard aura={aura} tribeCode={tribeCode} />
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 w-full max-w-[340px] space-y-2.5">
                {userTribes.length > 1 && (
                  <select
                    value={selectedTribeForShare || ""}
                    onChange={(e) => setSelectedTribeForShare(e.target.value)}
                    className="w-full bg-bg border border-muted-5/30 rounded-xl px-3 py-2 text-text text-sm"
                  >
                    <option value="">No tribe invite</option>
                    {userTribes.map((t) => (
                      <option key={t.id} value={t.id}>Include {t.name} invite</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="btn-primary w-full text-sm"
                >
                  {sharing ? "Generating..." : "Save as Image"}
                </button>
                <p className="text-muted-3 text-[11px] text-center italic pt-1">
                  Saves a 1080×1920 PNG to your device. Perfect for IG Stories.
                </p>
              </div>
            </div>

            {/* Offscreen capture source — SAME ShareCard component, rendered at
                native 1080×1920. Positioned far offscreen so user never sees it,
                but still in the DOM so html2canvas can capture it. */}
            <div
              ref={shareCardRef}
              style={{
                position: "fixed",
                left: -10000,
                top: 0,
                width: 1080,
                height: 1920,
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              <ShareCard aura={aura} tribeCode={tribeCode} />
            </div>
          </div>
        );
      })()}

      <BottomNav />
    </div>
  );
}
