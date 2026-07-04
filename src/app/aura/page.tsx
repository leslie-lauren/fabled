"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Aura } from "@/lib/types";
import AuraCard from "@/components/aura/aura-card";
import BookRow from "@/components/aura/book-row";
import ShareAuraModal from "@/components/aura/share-aura-modal";
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
        }
      }
    });
  }, [router]);

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

      {/* Share Modal — reusable component shared with the aura reveal. */}
      {aura && (
        <ShareAuraModal
          aura={aura}
          open={showShare}
          onClose={() => setShowShare(false)}
          tribes={userTribes}
        />
      )}

      <BottomNav />
    </div>
  );
}
