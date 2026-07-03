"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { haptic } from "@/lib/haptics";
import SwipeCard from "@/components/swipe/swipe-card";
import MemberPill from "@/components/ui/member-pill";
import type { DeckBook } from "@/lib/types";

type Phase = "shuffling" | "intro" | "swiping" | "waiting";

const SHUFFLE_MESSAGES = [
  "The Story Spirits are shuffling your deck...",
  "Preparing your blind picks...",
  "Almost ready...",
];

export default function SwipePage() {
  const router = useRouter();
  const params = useParams();
  const tribeId = params.id as string;

  const [phase, setPhase] = useState<Phase>("shuffling");
  const [userId, setUserId] = useState<string | null>(null);
  const [deckId, setDeckId] = useState<string | null>(null);
  const [books, setBooks] = useState<DeckBook[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<boolean[]>([]);
  const [tribeName, setTribeName] = useState("");
  const [members, setMembers] = useState<{ name: string; color: string; done: boolean; voteCount: number }[]>([]);
  const [totalBooks, setTotalBooks] = useState(10);
  const [loading, setLoading] = useState(true);
  const [shuffleMsg, setShuffleMsg] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }
      setUserId(session.user.id);

      // Get tribe info
      const { data: tribe } = await supabase
        .from("tribes")
        .select("name, status")
        .eq("id", tribeId)
        .single();

      if (tribe) setTribeName(tribe.name);

      // Get latest deck
      const { data: deck } = await supabase
        .from("decks")
        .select("*")
        .eq("tribe_id", tribeId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!deck) { router.push("/home"); return; }
      setDeckId(deck.id);
      setBooks(deck.books as DeckBook[]);

      // Get existing votes (for resume)
      const { data: existingVotes } = await supabase
        .from("swipe_votes")
        .select("book_index, liked")
        .eq("deck_id", deck.id)
        .eq("user_id", session.user.id)
        .order("book_index", { ascending: true });

      const deckTotal = Array.isArray(deck.books) ? (deck.books as DeckBook[]).length : 10;
      setTotalBooks(deckTotal);

      if (existingVotes && existingVotes.length > 0) {
        const voteArr: boolean[] = [];
        existingVotes.forEach((v) => { voteArr[v.book_index] = v.liked; });
        setVotes(voteArr);
        setCurrentIndex(existingVotes.length);
        if (existingVotes.length >= deckTotal) {
          setPhase("waiting");
        }
      }

      // Get members (separate queries to avoid FK join issue)
      const { data: memberData } = await supabase
        .from("tribe_members")
        .select("user_id, users(display_name)")
        .eq("tribe_id", tribeId);

      if (memberData) {
        const mUserIds = memberData.map((m: Record<string, unknown>) => m.user_id as string);
        const { data: mAuras } = await supabase
          .from("auras")
          .select("user_id, color_primary")
          .in("user_id", mUserIds);

        const mAuraMap = new Map<string, string>();
        if (mAuras) {
          for (const a of mAuras) mAuraMap.set(a.user_id, a.color_primary);
        }

        const { data: allDeckVotes } = await supabase
          .from("swipe_votes")
          .select("user_id")
          .eq("deck_id", deck.id);

        const voteCountByUser = new Map<string, number>();
        for (const v of allDeckVotes || []) {
          voteCountByUser.set(v.user_id, (voteCountByUser.get(v.user_id) || 0) + 1);
        }

        const memberList = memberData.map((m: Record<string, unknown>) => {
          const uid = m.user_id as string;
          const count = voteCountByUser.get(uid) || 0;
          return {
            name: (m.users as Record<string, string>)?.display_name || "Unknown",
            color: mAuraMap.get(uid) || "#C4956A",
            done: count >= deckTotal,
            voteCount: count,
          };
        });
        setMembers(memberList);
      }

      setLoading(false);

      // If user already finished swiping, skip the shuffling transition
      if (existingVotes && existingVotes.length >= deckTotal) {
        // Already set to "waiting" above
      } else {
        // Show shuffling transition, then go to intro
        setPhase("shuffling");
      }
    }
    load();
  }, [tribeId, router]);

  // Cycle shuffling messages
  useEffect(() => {
    if (phase !== "shuffling" || loading) return;
    const msgTimer = setInterval(() => setShuffleMsg((i) => (i + 1) % SHUFFLE_MESSAGES.length), 900);
    const transitionTimer = setTimeout(() => setPhase("intro"), 2500);
    return () => { clearInterval(msgTimer); clearTimeout(transitionTimer); };
  }, [phase, loading]);

  // Poll for member status updates when in waiting phase
  const pollStatus = useCallback(async () => {
    if (!tribeId) return;
    try {
      const res = await apiFetch(`/api/tribes/${tribeId}/swipe-status`);
      const data = await res.json();

      if (data.status === "reveal") {
        // All done! Redirect to reveal
        router.push(`/tribes/${tribeId}/reveal`);
        return;
      }

      if (data.members) {
        setMembers(data.members);
      }
    } catch {
      // Silently ignore polling errors
    }
  }, [tribeId, router]);

  useEffect(() => {
    if (phase !== "waiting") return;

    // Poll every 3 seconds
    const interval = setInterval(pollStatus, 3000);
    // Also poll immediately
    pollStatus();

    return () => clearInterval(interval);
  }, [phase, pollStatus]);

  async function handleSwipe(liked: boolean) {
    if (!userId || !deckId) return;

    haptic("light");
    const newVotes = [...votes];
    newVotes[currentIndex] = liked;
    setVotes(newVotes);

    // Save to server
    const res = await apiFetch(`/api/tribes/${tribeId}/swipe`, {
      method: "POST",
      body: JSON.stringify({
        deckId,
        bookIndex: currentIndex,
        liked,
      }),
    });

    const data = await res.json();

    if (currentIndex + 1 >= books.length) {
      haptic("success");
      if (data.allDone) {
        // Everyone is done, go straight to reveal
        router.push(`/tribes/${tribeId}/reveal`);
      } else {
        setPhase("waiting");
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  if (loading || phase === "shuffling") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center animate-fadeIn">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl animate-float mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(196,149,106,0.15), rgba(139,110,78,0.15))",
            border: "1px solid rgba(196,149,106,0.12)",
          }}
        >
          ✦
        </div>
        {!loading && (
          <p
            key={shuffleMsg}
            className="text-muted-1 text-sm font-light animate-fadeInUp text-center px-8"
          >
            {SHUFFLE_MESSAGES[shuffleMsg]}
          </p>
        )}
      </div>
    );
  }

  // Intro screen
  if (phase === "intro") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
        <button
          onClick={() => router.push("/home")}
          className="absolute top-6 left-5 text-muted-2 text-sm hover:text-text-secondary transition-colors"
        >
          ← Home
        </button>
        <div className="text-center max-w-sm">
          <h2 className="font-display text-2xl font-bold mb-2">
            Blind Book Deck
          </h2>
          <p className="text-muted-1 text-sm mb-1">{tribeName}</p>
          <p className="text-muted-2 text-xs mb-8 max-w-xs mx-auto leading-relaxed">
            You&apos;ll see 10 book descriptions with no titles or authors.
            Swipe right on vibes that call to you, left on ones that don&apos;t.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {members.map((m, i) => (
              <MemberPill key={i} name={m.name} color={m.color} />
            ))}
          </div>

          <button
            onClick={() => setPhase("swiping")}
            className="btn-primary w-full"
          >
            Start Swiping
          </button>
        </div>
      </div>
    );
  }

  // Waiting screen
  if (phase === "waiting") {
    const allDone = members.every((m) => m.done);
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
        <button
          onClick={() => router.push("/home")}
          className="absolute top-6 left-5 text-muted-2 text-sm hover:text-text-secondary transition-colors"
        >
          ← Home
        </button>
        <div className="text-center max-w-sm">
          <div className="animate-float mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/15 animate-pulseGlow flex items-center justify-center">
              <span className="text-2xl">✦</span>
            </div>
          </div>

          <h2 className="font-display text-xl font-bold mb-2">
            Swiping complete!
          </h2>
          <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            When everyone finishes, the Story Spirits reveal which books chose your tribe back.
          </p>

          <div className="space-y-2 mt-4">
            {members.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: `${m.color}08`, border: `1px solid ${m.color}12` }}
              >
                <span className="text-text-secondary text-sm">{m.name}</span>
                <div className="flex items-center gap-2">
                  {m.done ? (
                    <span className="text-xs font-medium text-success">Done</span>
                  ) : (
                    <span className="text-xs font-medium text-muted-2">
                      {m.voteCount > 0 ? `${m.voteCount}/${totalBooks}` : "Swiping..."}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {allDone && (
            <button
              onClick={() => router.push(`/tribes/${tribeId}/reveal`)}
              className="btn-primary mt-6 animate-pulseGlow"
            >
              See Your Matches! →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Swiping
  return (
    <div className="min-h-dvh flex flex-col px-5 pt-6 pb-8">
      <button
        onClick={() => router.push("/home")}
        className="text-muted-2 text-sm mb-4 hover:text-text-secondary transition-colors self-start"
      >
        ← Home
      </button>
      {/* Header */}
      <div className="text-center mb-4">
        <p className="label-mono text-[9px] text-muted-3 mb-1">{tribeName}</p>
        <h2 className="font-display text-lg font-semibold">
          Book {currentIndex + 1} of {books.length}
        </h2>
      </div>

      {/* Card stack */}
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

      {/* Buttons */}
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

      {/* Progress dots */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: books.length }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{
              background:
                i < currentIndex
                  ? votes[i]
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
