"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { haptic } from "@/lib/haptics";
import SwipeCard from "@/components/swipe/swipe-card";
import type { DeckBook } from "@/lib/types";

type Phase = "loading" | "swiping" | "saving";

const LOADING_MESSAGES = [
  "The Story Spirits are reading your aura...",
  "Curating books just for you...",
  "Writing blind descriptions...",
  "Shuffling your deck...",
];

export default function DiscoverSwipePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [deckId, setDeckId] = useState<string | null>(null);
  const [books, setBooks] = useState<DeckBook[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIndices, setLikedIndices] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function start() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }

      const res = await apiFetch("/api/recommendations/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't curate books.");
        return;
      }
      setDeckId(data.deck.id);
      setBooks(data.deck.books as DeckBook[]);
      setPhase("swiping");
    }
    start();
  }, [router]);

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 1600);
    return () => clearInterval(t);
  }, [phase]);

  async function finish(liked: number[]) {
    setPhase("saving");
    if (deckId) {
      try {
        await apiFetch("/api/recommendations/complete", {
          method: "POST",
          body: JSON.stringify({ deckId, liked }),
        });
      } catch {
        // Shelf will just miss this batch; non-fatal.
      }
    }
    router.push(`/discover?added=${liked.length}`);
  }

  function handleSwipe(liked: boolean) {
    haptic("light");
    const nextLiked = liked ? [...likedIndices, currentIndex] : likedIndices;
    setLikedIndices(nextLiked);

    if (currentIndex + 1 >= books.length) {
      haptic("success");
      finish(nextLiked);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center animate-fadeIn">
        <p className="text-error text-sm mb-4">{error}</p>
        <button onClick={() => router.push("/discover")} className="btn-ghost text-sm">
          Back to Discover
        </button>
      </div>
    );
  }

  if (phase === "loading" || phase === "saving") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center animate-fadeIn px-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl animate-float mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(196,149,106,0.15), rgba(139,110,78,0.15))",
            border: "1px solid rgba(196,149,106,0.12)",
          }}
        >
          ✦
        </div>
        <p key={msgIndex} className="text-muted-1 text-sm font-light animate-fadeInUp text-center">
          {phase === "saving" ? "Building your shelf..." : LOADING_MESSAGES[msgIndex]}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-6 pb-8">
      <button
        onClick={() => router.push("/discover")}
        className="text-muted-2 text-sm mb-4 hover:text-text-secondary transition-colors self-start"
      >
        ← Discover
      </button>

      <div className="text-center mb-4">
        <p className="label-mono text-[9px] text-muted-3 mb-1">FOR YOU</p>
        <h2 className="font-display text-lg font-semibold">
          Book {currentIndex + 1} of {books.length}
        </h2>
      </div>

      <div className="flex-1 relative" style={{ minHeight: 380 }}>
        {books.map((book, i) => {
          if (i < currentIndex || i > currentIndex + 1) return null;
          return (
            <SwipeCard
              key={i}
              book={book}
              index={i}
              total={books.length}
              onSwipe={handleSwipe}
              isActive={i === currentIndex}
            />
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-4 mb-4">
        <button
          onClick={() => handleSwipe(false)}
          className="w-14 h-14 rounded-full border-2 border-error/40 text-error text-2xl flex items-center justify-center hover:bg-error/10 transition-colors"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe(true)}
          className="w-14 h-14 rounded-full border-2 border-success/40 text-success text-2xl flex items-center justify-center hover:bg-success/10 transition-colors"
        >
          ♥
        </button>
      </div>

      <div className="flex justify-center gap-1">
        {books.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{
              background:
                i < currentIndex
                  ? likedIndices.includes(i)
                    ? "var(--color-success)"
                    : "var(--color-error)"
                  : i === currentIndex
                    ? "var(--color-text)"
                    : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
