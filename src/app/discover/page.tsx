"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import BottomNav from "@/components/layout/bottom-nav";
import type { DeckBook } from "@/lib/types";

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const added = parseInt(searchParams.get("added") || "", 10);
  const justAdded = Number.isInteger(added) ? added : null;

  const [shelf, setShelf] = useState<DeckBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }
      try {
        const res = await apiFetch("/api/recommendations");
        const data = await res.json();
        setShelf(data.shelf || []);
      } catch {
        setShelf([]);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  return (
    <div className="min-h-dvh px-5 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Discover</h1>
        <button
          onClick={() => router.push("/home")}
          className="text-muted-2 text-sm hover:text-text-secondary transition-colors"
        >
          Home →
        </button>
      </div>

      {/* Post-swipe reveal banner */}
      {justAdded !== null && (
        <div
          className="card mb-6 text-center animate-popIn"
          style={{ background: "linear-gradient(135deg, rgba(107,203,119,0.10), transparent)", border: "1px solid rgba(107,203,119,0.18)" }}
        >
          <p className="text-2xl mb-1">✦</p>
          <p className="font-display text-lg font-semibold mb-1">
            {justAdded > 0 ? `${justAdded} book${justAdded === 1 ? "" : "s"} added to your shelf` : "No matches this round"}
          </p>
          <p className="text-muted-1 text-xs">
            {justAdded > 0 ? "Titles revealed below." : "Try another deck — the spirits have more."}
          </p>
        </div>
      )}

      {/* Intro / CTA */}
      <div className="mb-8">
        <p className="text-muted-1 text-sm mb-4 leading-relaxed">
          Swipe blind on books picked for your reading aura. The ones you love land on your
          For-You Shelf.
        </p>
        <button
          onClick={() => router.push("/discover/swipe")}
          className="btn-primary w-full"
        >
          {shelf.length > 0 ? "Discover more books" : "Discover books for you"}
        </button>
      </div>

      {/* Shelf */}
      <div className="mb-8">
        <p className="label-mono mb-3">Your For-You Shelf</p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full bg-accent/20 animate-pulseGlow" />
          </div>
        ) : shelf.length === 0 ? (
          <div className="card text-center py-8" style={{ background: "#1a191808" }}>
            <p className="text-muted-2 text-sm">
              Nothing here yet. Swipe a deck to start your shelf.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {shelf.map((book, i) => (
              <div
                key={`${book.title}-${i}`}
                className="card"
                style={{ background: "linear-gradient(135deg, rgba(196,149,106,0.06), transparent)", border: "1px solid rgba(196,149,106,0.12)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="font-display text-base font-semibold text-text leading-snug">
                    {book.title}
                  </h3>
                  {book.genre && (
                    <span className="label-mono text-accent text-[9px] shrink-0 mt-1">{book.genre}</span>
                  )}
                </div>
                {book.author && (
                  <p className="text-muted-1 text-xs italic mb-2">{book.author}</p>
                )}
                {book.vibe && (
                  <p className="text-muted-2 text-xs leading-relaxed">{book.vibe}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nudge toward tribes */}
      <div
        className="card mb-4 text-center"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-text-secondary text-sm mb-1">Reading&apos;s better together.</p>
        <p className="text-muted-2 text-xs mb-4">Start a tribe or join one to swipe, vote, and discuss with real readers.</p>
        <div className="flex gap-2">
          <button onClick={() => router.push("/tribes/create")} className="btn-primary flex-1 text-xs py-2.5">
            Create a Tribe
          </button>
          <button onClick={() => router.push("/tribes/join")} className="btn-ghost flex-1 text-xs py-2.5">
            Join a Tribe
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
