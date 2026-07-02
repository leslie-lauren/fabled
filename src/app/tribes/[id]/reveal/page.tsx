"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MemberPill from "@/components/ui/member-pill";
import type { Aura } from "@/lib/types";
import MemberAuraModal from "@/components/aura/member-aura-modal";

interface RevealBook {
  title: string;
  author: string;
  genre: string;
  moodTags: string[];
  vibe: string;
  index: number;
  matchPct: number;
  yesCount: number;
  totalVoters: number;
  totalMembers: number;
  tier: string;
  voters: { userId: string; name: string; color: string; liked: boolean }[];
}

interface Member {
  userId: string;
  name: string;
  color: string;
  role: string;
}

type Phase =
  | "reveal"
  | "transition"
  | "voting"
  | "waiting"
  | "results"
  | "tiebreaker"
  | "tiebreaker_waiting"
  | "leader_pick";

export default function RevealPage() {
  const router = useRouter();
  const params = useParams();
  const tribeId = params.id as string;

  const [results, setResults] = useState<RevealBook[]>([]);
  const [deckId, setDeckId] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [phase, setPhase] = useState<Phase>("reveal");
  const [revealed, setRevealed] = useState(0);
  const [loading, setLoading] = useState(true);

  // Voting state
  const [myApprovals, setMyApprovals] = useState<Record<number, boolean>>({});
  const [locked, setLocked] = useState(false);
  const [allBookVotes, setAllBookVotes] = useState<{ user_id: string; book_index: number; round: number }[]>([]);
  const [tribeStatus, setTribeStatus] = useState("");
  const [currentBook, setCurrentBook] = useState<{ title: string; author: string } | null>(null);

  // Tiebreaker state
  const [tiedBookIndexes, setTiedBookIndexes] = useState<number[]>([]);
  const [tiebreakerChoice, setTiebreakerChoice] = useState<number | null>(null);
  const [voteRound, setVoteRound] = useState(1);

  // Expand state for book cards
  const [expandedBooks, setExpandedBooks] = useState<Record<number, boolean>>({});

  // Aura modal state
  const [selectedMemberAura, setSelectedMemberAura] = useState<{ name: string; aura: Aura; isLeader: boolean } | null>(null);

  const voteableBooks = results.filter(
    (b) => b.tier === "Everyone loved this" || b.tier === "Strong match"
  );

  // Votes for current round only (for counting who voted)
  const currentRoundVotes = allBookVotes.filter((v) => v.round === voteRound);
  const votedUserIds = new Set(currentRoundVotes.map((v) => v.user_id));

  // Vote counts from round 1 approval votes (for display on book cards)
  const round1Votes = allBookVotes.filter((v) => v.round === 1);
  const voteCounts: Record<number, { count: number; voters: Member[] }> = {};
  for (const book of results) {
    const voters = round1Votes
      .filter((v) => v.book_index === book.index)
      .map((v) => members.find((m) => m.userId === v.user_id))
      .filter(Boolean) as Member[];
    voteCounts[book.index] = { count: voters.length, voters };
  }

  const isLeader = members.find((m) => m.userId === userId)?.role === "leader";
  const leaderName = members.find((m) => m.role === "leader")?.name || "the leader";

  function getWinnerIndex(): number | null {
    if (tribeStatus !== "reading") return null;
    // When reading, winner was determined server-side. Find book matching currentBook
    if (currentBook) {
      const match = results.find((b) => b.title === currentBook.title);
      if (match) return match.index;
    }
    // Fallback: most round-1 votes
    let best: { index: number; votes: number } | null = null;
    for (const book of voteableBooks) {
      const count = voteCounts[book.index]?.count || 0;
      if (!best || count > best.votes) {
        best = { index: book.index, votes: count };
      }
    }
    return best?.index ?? null;
  }

  function allVotedForRound() {
    return members.length > 0 && members.every((m) => votedUserIds.has(m.userId));
  }

  const loadData = useCallback(async (isRefresh = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/welcome"); return; }
    setUserId(session.user.id);

    const res = await fetch(`/api/tribes/${tribeId}/reveal`);
    const data = await res.json();

    if (data.results) {
      setResults(data.results);
      setDeckId(data.deckId);
      setMembers(data.members || []);
      setAllBookVotes(data.bookVotes || []);
      setTribeStatus(data.tribeStatus || "reveal");
      setCurrentBook(data.currentBook || null);
      setTiedBookIndexes(data.tiedBookIndexes || []);

      const status = data.tribeStatus || "reveal";
      const votes = data.bookVotes || [];
      const mems = data.members || [];

      // Determine which round we're in
      let round = 1;
      if (status === "tiebreaker") round = 2;
      else if (status === "leader_pick") round = 3;
      setVoteRound(round);

      // Check user's existing votes for the current round
      const myRoundVotes = votes.filter(
        (v: { user_id: string; round: number }) => v.user_id === session.user.id && v.round === round
      );

      // Check if everyone voted for the current round
      const roundVotes = votes.filter((v: { round: number }) => v.round === round);
      const votedUsers = new Set(roundVotes.map((v: { user_id: string }) => v.user_id));
      const everyoneVoted = mems.length > 0 && mems.every((m: Member) => votedUsers.has(m.userId));

      if (status === "reading") {
        setPhase("results");
        setRevealed(data.results.length);
        // Restore user's R1 approvals for highlighting
        const myR1 = votes.filter(
          (v: { user_id: string; round: number }) => v.user_id === session.user.id && v.round === 1
        );
        if (myR1.length > 0) {
          const approvals: Record<number, boolean> = {};
          myR1.forEach((v: { book_index: number }) => { approvals[v.book_index] = true; });
          setMyApprovals(approvals);
          setLocked(true);
        }
      } else if (status === "tiebreaker") {
        setRevealed(data.results.length);
        if (myRoundVotes.length > 0) {
          setTiebreakerChoice(myRoundVotes[0].book_index);
          setLocked(true);
          setPhase(everyoneVoted ? "results" : "tiebreaker_waiting");
        } else {
          setLocked(false);
          setPhase("tiebreaker");
        }
      } else if (status === "leader_pick") {
        setRevealed(data.results.length);
        setPhase("leader_pick");
      } else if (everyoneVoted && (status === "voting" || status === "reveal")) {
        // All voted in R1 but status hasn't updated yet — show results
        setPhase("results");
        setRevealed(data.results.length);
      } else if (myRoundVotes.length > 0) {
        // User voted in R1, waiting for others
        const approvals: Record<number, boolean> = {};
        myRoundVotes.forEach((v: { book_index: number }) => { approvals[v.book_index] = true; });
        setMyApprovals(approvals);
        setLocked(true);
        setPhase("waiting");
        setRevealed(data.results.length);
      } else if (!isRefresh) {
        setPhase("reveal");
      }
    }

    setLoading(false);

    if (!isRefresh) {
      data.results?.forEach((_: unknown, i: number) => {
        setTimeout(() => setRevealed((r) => Math.max(r, i + 1)), 400 + i * 300);
      });
    }
  }, [tribeId, router]);

  useEffect(() => { loadData(false); }, [loadData]);

  // Realtime subscription for vote updates
  useEffect(() => {
    if (!deckId) return;
    const channel = supabase
      .channel(`book-votes-${deckId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "book_votes",
        filter: `deck_id=eq.${deckId}`,
      }, () => { loadData(true); })
      .subscribe();

    // Also listen for tribe status changes (for tiebreaker transitions)
    const tribeChannel = supabase
      .channel(`tribe-status-${tribeId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "tribes",
        filter: `id=eq.${tribeId}`,
      }, () => { loadData(true); })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(tribeChannel);
    };
  }, [deckId, tribeId, loadData]);

  function handleToggle(bookIndex: number) {
    if (locked) return;
    setMyApprovals((prev) => {
      const next = { ...prev };
      if (next[bookIndex]) delete next[bookIndex];
      else next[bookIndex] = true;
      return next;
    });
  }

  function handleUndo() {
    setLocked(false);
    setMyApprovals({});
    setTiebreakerChoice(null);
    const currentPhase = phase;
    if (currentPhase === "tiebreaker_waiting") {
      setPhase("tiebreaker");
    } else {
      setPhase("voting");
    }
    fetch(`/api/tribes/${tribeId}/vote`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deckId, userId, round: voteRound }),
    }).then(() => loadData(true));
  }

  async function handleLockIn() {
    if (!userId || !deckId) return;
    const approvedIndexes = Object.keys(myApprovals)
      .filter((k) => myApprovals[parseInt(k)])
      .map((k) => parseInt(k));

    if (approvedIndexes.length === 0) return;
    setLocked(true);
    setPhase("waiting");

    const res = await fetch(`/api/tribes/${tribeId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, deckId, approvedBookIndexes: approvedIndexes, round: 1 }),
    });

    const data = await res.json();
    if (data.allVoted) {
      if (data.tied) {
        setTiedBookIndexes(data.tiedIndexes || []);
        loadData(true);
      } else {
        setPhase("results");
        loadData(true);
      }
    }
  }

  async function handleTiebreakerVote() {
    if (!userId || !deckId || tiebreakerChoice === null) return;
    setLocked(true);
    setPhase("tiebreaker_waiting");

    const res = await fetch(`/api/tribes/${tribeId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, deckId, approvedBookIndexes: [tiebreakerChoice], round: 2 }),
    });

    const data = await res.json();
    if (data.allVoted) {
      loadData(true);
    }
  }

  async function handleLeaderPick(bookIndex: number) {
    if (!userId || !deckId) return;

    await fetch(`/api/tribes/${tribeId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, deckId, approvedBookIndexes: [bookIndex], round: 3 }),
    });

    loadData(true);
  }

  async function handleRevote() {
    if (!deckId) return;
    await fetch(`/api/tribes/${tribeId}/vote`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deckId }),
    });
    setMyApprovals({});
    setLocked(false);
    setAllBookVotes([]);
    setTiebreakerChoice(null);
    setTiedBookIndexes([]);
    setVoteRound(1);
    setPhase("voting");
    loadData(false);
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

  const winnerIndex = getWinnerIndex();
  const winnerBook = winnerIndex !== null ? results.find((b) => b.index === winnerIndex) : null;
  const totalSelected = Object.values(myApprovals).filter(Boolean).length;
  const waitingMembers = members.filter((m) => !votedUserIds.has(m.userId));

  // Determine what books to show
  let booksToShow: RevealBook[];
  if (phase === "reveal" || phase === "transition") {
    booksToShow = results;
  } else if (phase === "tiebreaker" || phase === "tiebreaker_waiting" || phase === "leader_pick") {
    booksToShow = results.filter((b) => tiedBookIndexes.includes(b.index));
  } else if (phase === "voting" || phase === "waiting") {
    booksToShow = voteableBooks;
  } else {
    // results: sort by vote count, then match %
    booksToShow = [...voteableBooks].sort((a, b) => {
      const aVotes = voteCounts[a.index]?.count || 0;
      const bVotes = voteCounts[b.index]?.count || 0;
      if (bVotes !== aVotes) return bVotes - aVotes;
      return b.matchPct - a.matchPct;
    });
  }

  const showVoteStatus = ["voting", "waiting", "results", "tiebreaker", "tiebreaker_waiting"].includes(phase);

  return (
    <div className="min-h-dvh px-4 pt-6 pb-36">
      {/* Back */}
      <button
        onClick={() => router.push("/home")}
        className="text-muted-2 text-sm mb-4 hover:text-text-secondary transition-colors"
      >
        ← Home
      </button>

      {/* Header */}
      <div className="text-center mb-5 animate-fadeInUp">
        {phase === "reveal" && (
          <>
            <p className="label-mono text-[9px] mb-1">The Reveal</p>
            <h1 className="font-display text-2xl font-bold mb-1">Your matches are in ✦</h1>
            {revealed >= results.length && voteableBooks.length > 0 && (
              <button
                onClick={() => setPhase("transition")}
                className="btn-primary mt-4 w-full max-w-xs text-base py-3.5 animate-fadeInUp"
              >
                Time to Vote →
              </button>
            )}
          </>
        )}
        {phase === "transition" && (
          <>
            <div className="animate-float mb-4">
              <span className="text-3xl">✦</span>
            </div>
            <h1 className="font-display text-xl font-bold mb-2">
              Your tribe matched on {voteableBooks.length} book{voteableBooks.length !== 1 ? "s" : ""}.
            </h1>
            <p className="text-text-secondary text-sm mb-1">But you can only read one.</p>
            <p className="text-muted-2 text-xs">Which one wins?</p>
          </>
        )}
        {phase === "voting" && (
          <>
            <p className="label-mono text-[9px] mb-1">Vote for Your Next Read</p>
            <h1 className="font-display text-xl font-bold mb-1">
              Tap the books you&apos;d read
            </h1>
            <p className="text-muted-2 text-xs">You can approve multiple books. The most-voted wins.</p>
          </>
        )}
        {phase === "waiting" && (
          <>
            <div className="animate-float mb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-success/10 animate-pulseGlow flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
            <h1 className="font-display text-xl font-bold mb-2">Your votes are locked in!</h1>
            <p className="text-text-secondary text-sm">
              {waitingMembers.length === 0
                ? "Everyone has voted!"
                : "Waiting for the rest of your tribe."}
            </p>
            {!allVotedForRound() && (
              <button
                onClick={handleUndo}
                className="mt-4 px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#B8B2A8" }}
              >
                Undo
              </button>
            )}
          </>
        )}
        {phase === "tiebreaker" && (
          <>
            <div className="animate-float mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h1 className="font-display text-xl font-bold mb-2">It&apos;s a tie!</h1>
            <p className="text-text-secondary text-sm mb-1">Pick ONE book to break the tie.</p>
            <p className="text-muted-2 text-xs">{tiedBookIndexes.length} books are tied. Choose your favorite.</p>
          </>
        )}
        {phase === "tiebreaker_waiting" && (
          <>
            <div className="animate-float mb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-success/10 animate-pulseGlow flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
            <h1 className="font-display text-xl font-bold mb-2">Your tiebreaker vote is locked in!</h1>
            <p className="text-text-secondary text-sm">
              {waitingMembers.length === 0
                ? "Everyone has voted!"
                : "Waiting for the rest of your tribe."}
            </p>
            {!allVotedForRound() && (
              <button
                onClick={handleUndo}
                className="mt-4 px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#B8B2A8" }}
              >
                Undo
              </button>
            )}
          </>
        )}
        {phase === "leader_pick" && (
          <>
            <div className="animate-float mb-4">
              <span className="text-3xl">👑</span>
            </div>
            {isLeader ? (
              <>
                <h1 className="font-display text-xl font-bold mb-2">Break the Tie</h1>
                <p className="text-text-secondary text-sm">Still tied after two rounds. You decide!</p>
              </>
            ) : (
              <>
                <h1 className="font-display text-xl font-bold mb-2">Waiting for tribe leader</h1>
                <p className="text-text-secondary text-sm">Still tied after two rounds. The tribe leader will break the tie.</p>
              </>
            )}
          </>
        )}
        {phase === "results" && winnerBook && (
          <>
            <p className="label-mono text-[9px] mb-1">The Tribe Has Spoken</p>
            <h1 className="font-display text-2xl font-bold mb-1">✦ {winnerBook.title} ✦</h1>
            <p className="text-muted-1 text-sm italic mb-3">by {winnerBook.author}</p>
            <p className="text-text-secondary text-xs max-w-xs mx-auto leading-relaxed">
              When you&apos;ve finished reading, come back. The Story Spirits have questions.
            </p>
          </>
        )}
        {phase === "results" && !winnerBook && (
          <>
            <p className="label-mono text-[9px] mb-1">Voting Complete</p>
            <h1 className="font-display text-2xl font-bold mb-1">The Tribe Has Spoken ✦</h1>
          </>
        )}
      </div>

      {/* Results phase: CTAs before book list */}
      {phase === "results" && (
        <div className="max-w-md mx-auto mb-6 flex gap-3 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => router.push(`/tribes/${tribeId}/discussion`)}
            className="flex-[1.5] py-3.5 rounded-[14px] text-[13px] font-medium flex items-center justify-center gap-1.5"
            style={{ background: "linear-gradient(135deg, #C4956A, #8B6E4E)", color: "#F5F0E8", boxShadow: "0 4px 20px rgba(196,149,106,0.15)" }}
          >
            Start Discussion
          </button>
          <button
            onClick={() => router.push("/home")}
            className="flex-1 py-3.5 rounded-[14px] text-[13px] font-medium flex items-center justify-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9B958A" }}
          >
            Back to Home
          </button>
        </div>
      )}

      {/* Member vote status bar */}
      {showVoteStatus && (
        <div className="flex flex-wrap justify-center gap-2 mb-5 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          {members.map((m) => {
            const hasVoted = votedUserIds.has(m.userId);
            const isMe = m.userId === userId;
            const showAsVoted = hasVoted || (isMe && locked);
            return (
              <div
                key={m.userId}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
                style={{
                  background: showAsVoted ? "rgba(107,203,119,0.08)" : `${m.color}10`,
                  border: `1px solid ${showAsVoted ? "rgba(107,203,119,0.15)" : `${m.color}1A`}`,
                }}
              >
                {m.role === "leader" && <span className="text-[9px]">👑</span>}
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: showAsVoted ? "#6BCB77" : "rgba(255,255,255,0.15)" }}
                />
                <span style={{ color: showAsVoted ? "#6BCB77" : m.color, fontWeight: 500 }}>
                  {isMe ? "You" : m.name}
                </span>
                <span className="font-mono text-[8px]" style={{ color: showAsVoted ? "#6BCB77" : "#5A564F" }}>
                  {showAsVoted ? "voted" : "voting..."}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Transition screen: full-page CTA to start voting */}
      {phase === "transition" && (
        <div className="max-w-md mx-auto mt-4 text-center animate-fadeInUp">
          <button
            onClick={() => setPhase("voting")}
            className="btn-primary w-full text-base py-4"
          >
            Start Voting →
          </button>
        </div>
      )}

      {/* Book cards */}
      {phase !== "transition" && (
        <div className="max-w-md mx-auto space-y-3">
          {booksToShow.map((book, i) => {
            if (phase === "reveal" && i >= revealed) return null;
            const isWinner = winnerIndex === book.index && phase === "results";
            const isVoteable = book.tier === "Everyone loved this" || book.tier === "Strong match";
            const myVote = myApprovals[book.index] || false;
            const bookVoteData = voteCounts[book.index] || { count: 0, voters: [] };
            const tierColor = book.tier === "Everyone loved this" ? "#6BCB77" : book.tier === "Strong match" ? "#C4956A" : book.tier === "Split decision" ? "#8B8580" : "#5A564F";
            const isTiebreakerSelected = tiebreakerChoice === book.index;

            return (
              <div
                key={book.index}
                className="animate-fadeInUp"
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              >
                <div
                  className="rounded-[18px] p-4 relative overflow-hidden transition-all"
                  style={{
                    background: isWinner
                      ? `linear-gradient(135deg, ${tierColor}18, rgba(196,149,106,0.05), #111010)`
                      : `linear-gradient(135deg, ${tierColor}0C, #111010)`,
                    border: `1px solid ${isWinner ? "rgba(196,149,106,0.22)" : `${tierColor}20`}`,
                  }}
                >
                  {isWinner && (
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-[10px] animate-popIn"
                      style={{ background: "linear-gradient(135deg, #C4956A, #8B6E4E)" }}
                    >
                      <span className="text-xs">👑</span>
                      <span className="font-mono text-[9px] text-text tracking-wider font-medium">
                        YOUR NEXT READ
                      </span>
                    </div>
                  )}

                  <div className="mb-2.5">
                    <span className="font-mono text-[9px] tracking-wider uppercase" style={{ color: tierColor }}>
                      {book.tier === "Everyone loved this" ? "🎉 Everyone loved this"
                        : book.tier === "Strong match" ? "✨ Strong match"
                        : book.tier === "Split decision" ? "🤔 Split decision"
                        : "👀 Niche pick"}
                    </span>
                  </div>

                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedBooks((prev) => ({ ...prev, [book.index]: !prev[book.index] }))}
                  >
                    <h3 className="font-display text-[17px] font-semibold text-text mb-0.5">
                      {book.title}
                    </h3>
                    <p className="text-muted-1 text-xs italic mb-2">{book.author}</p>
                    <div className="flex flex-wrap gap-1 mb-1">
                      <span className="px-2 py-0.5 rounded-[10px] text-[10px] text-muted-1 bg-white/[0.05]">
                        {book.genre}
                      </span>
                      {book.moodTags.map((t, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-[10px] text-[10px] text-muted-2" style={{ background: `${tierColor}10` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    {!expandedBooks[book.index] && (
                      <p className="text-muted-4 text-[10px] mt-1">Tap to see the original mystery description</p>
                    )}
                  </button>

                  {/* Expandable vibe/mystery description */}
                  {expandedBooks[book.index] && book.vibe && (
                    <div
                      className="mt-2 mb-3 px-3 py-3 rounded-xl text-text-secondary text-xs font-light leading-relaxed italic"
                      style={{ background: `${tierColor}08`, border: `1px solid ${tierColor}12` }}
                    >
                      <p className="label-mono text-[8px] text-muted-3 mb-1.5 not-italic">THE BLIND DESCRIPTION</p>
                      &ldquo;{book.vibe}&rdquo;
                    </div>
                  )}
                  {!expandedBooks[book.index] && <div className="mb-3" />}

                  {/* Reveal phase: show swipe match count + who swiped yes */}
                  {phase === "reveal" && (
                    <div className="pt-2 border-t border-white/[0.04]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] text-muted-3 tracking-wider">SWIPE MATCHES</span>
                        <span className="font-mono text-xs font-bold" style={{ color: tierColor }}>
                          {book.yesCount}/{book.totalMembers}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {book.voters.filter((v) => v.liked).map((v) => (
                          <MemberPill
                            key={v.userId}
                            name={v.userId === userId ? "You" : v.name}
                            color={v.color}
                          />
                        ))}
                        {book.yesCount === 0 && (
                          <span className="text-muted-5 text-[10px] italic">No one swiped yes</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Voting/waiting/results: show vote toggle + voter pills */}
                  {(phase === "voting" || phase === "waiting" || phase === "results") && isVoteable && (
                    <div className="pt-3 border-t border-white/[0.04]">
                      {phase === "voting" && (
                        <button
                          onClick={() => handleToggle(book.index)}
                          disabled={locked}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-medium transition-all mb-3"
                          style={{
                            background: myVote
                              ? "linear-gradient(135deg, #C4956A, #8B6E4E)"
                              : "rgba(255,255,255,0.04)",
                            border: myVote ? "none" : "1px solid rgba(255,255,255,0.1)",
                            color: myVote ? "#F5F0E8" : "#9B958A",
                          }}
                        >
                          {myVote ? "✓ I'd read this" : "I'd read this"}
                        </button>
                      )}

                      {/* Show highlighted state for locked-in user */}
                      {(phase === "waiting" || phase === "results") && myVote && (
                        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
                          style={{ background: "rgba(196,149,106,0.08)", border: "1px solid rgba(196,149,106,0.15)" }}
                        >
                          <span className="text-[11px] font-medium" style={{ color: "#C4956A" }}>✓ You&apos;d read this</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[9px] text-muted-4 tracking-wider">
                          {bookVoteData.count} VOTE{bookVoteData.count !== 1 ? "S" : ""}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {bookVoteData.voters.map((v) => (
                            <MemberPill
                              key={v.userId}
                              name={v.userId === userId ? "You" : v.name}
                              color={v.color}
                              isLeader={v.role === "leader"}
                            />
                          ))}
                          {bookVoteData.count === 0 && (phase === "voting" || phase === "waiting") && (
                            <span className="text-muted-5 text-[10px] italic">No votes yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tiebreaker: single-select radio button */}
                  {(phase === "tiebreaker" || phase === "tiebreaker_waiting") && (
                    <div className="pt-3 border-t border-white/[0.04]">
                      {phase === "tiebreaker" && (
                        <button
                          onClick={() => setTiebreakerChoice(book.index)}
                          disabled={locked}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-medium transition-all"
                          style={{
                            background: isTiebreakerSelected
                              ? "linear-gradient(135deg, #C4956A, #8B6E4E)"
                              : "rgba(255,255,255,0.04)",
                            border: isTiebreakerSelected ? "none" : "1px solid rgba(255,255,255,0.1)",
                            color: isTiebreakerSelected ? "#F5F0E8" : "#9B958A",
                          }}
                        >
                          {isTiebreakerSelected ? "✓ This is my pick" : "Pick this book"}
                        </button>
                      )}
                      {phase === "tiebreaker_waiting" && tiebreakerChoice === book.index && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                          style={{ background: "rgba(196,149,106,0.08)", border: "1px solid rgba(196,149,106,0.15)" }}
                        >
                          <span className="text-[11px] font-medium" style={{ color: "#C4956A" }}>✓ Your pick</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Leader pick: immediate action button */}
                  {phase === "leader_pick" && isLeader && (
                    <div className="pt-3 border-t border-white/[0.04]">
                      <button
                        onClick={() => handleLeaderPick(book.index)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-medium transition-all"
                        style={{
                          background: "linear-gradient(135deg, #C4956A, #8B6E4E)",
                          color: "#F5F0E8",
                          boxShadow: "0 4px 20px rgba(196,149,106,0.15)",
                        }}
                      >
                        👑 Pick the Winner
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reveal → Transition CTA at bottom */}
      {phase === "reveal" && revealed >= results.length && voteableBooks.length > 0 && (
        <div className="max-w-md mx-auto mt-8 text-center animate-fadeInUp">
          <button
            onClick={() => setPhase("transition")}
            className="btn-primary w-full text-base py-4"
          >
            Time to Vote →
          </button>
        </div>
      )}

      {/* Sticky bottom bar: voting */}
      {phase === "voting" && !locked && (
        <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: "linear-gradient(to top, #111010 60%, transparent)" }}>
          <div className="px-4 pb-7 pt-4 flex justify-center">
            <button
              onClick={handleLockIn}
              disabled={totalSelected === 0}
              className="w-full max-w-md py-4 rounded-[14px] text-[15px] font-medium transition-all"
              style={{
                background: totalSelected > 0
                  ? "linear-gradient(135deg, #C4956A, #8B6E4E)"
                  : "rgba(255,255,255,0.04)",
                border: totalSelected > 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                color: totalSelected > 0 ? "#F5F0E8" : "#5A564F",
                cursor: totalSelected > 0 ? "pointer" : "default",
                boxShadow: totalSelected > 0 ? "0 4px 20px rgba(196,149,106,0.2)" : "none",
              }}
            >
              {totalSelected === 0
                ? "Select at least one book"
                : `Lock in ${totalSelected} vote${totalSelected !== 1 ? "s" : ""} ✦`}
            </button>
          </div>
        </div>
      )}

      {/* Sticky bottom bar: tiebreaker */}
      {phase === "tiebreaker" && !locked && (
        <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: "linear-gradient(to top, #111010 60%, transparent)" }}>
          <div className="px-4 pb-7 pt-4 flex justify-center">
            <button
              onClick={handleTiebreakerVote}
              disabled={tiebreakerChoice === null}
              className="w-full max-w-md py-4 rounded-[14px] text-[15px] font-medium transition-all"
              style={{
                background: tiebreakerChoice !== null
                  ? "linear-gradient(135deg, #C4956A, #8B6E4E)"
                  : "rgba(255,255,255,0.04)",
                border: tiebreakerChoice !== null ? "none" : "1px solid rgba(255,255,255,0.08)",
                color: tiebreakerChoice !== null ? "#F5F0E8" : "#5A564F",
                cursor: tiebreakerChoice !== null ? "pointer" : "default",
                boxShadow: tiebreakerChoice !== null ? "0 4px 20px rgba(196,149,106,0.2)" : "none",
              }}
            >
              {tiebreakerChoice === null
                ? "Pick one book"
                : "Lock in tiebreaker vote ✦"}
            </button>
          </div>
        </div>
      )}

      {/* Leader-only re-vote at bottom of results */}
      {phase === "results" && isLeader && (
        <div className="max-w-md mx-auto mt-6 animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
          <button
            onClick={handleRevote}
            className="w-full py-3 rounded-[14px] text-[13px] font-medium flex items-center justify-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9B958A" }}
          >
            🔄 Re-vote
          </button>
        </div>
      )}

      {/* Member aura modal */}
      {selectedMemberAura && (
        <MemberAuraModal
          name={selectedMemberAura.name}
          aura={selectedMemberAura.aura}
          isLeader={selectedMemberAura.isLeader}
          onClose={() => setSelectedMemberAura(null)}
          onViewFull={() => {
            setSelectedMemberAura(null);
            router.push(`/aura/${selectedMemberAura.aura.user_id}`);
          }}
        />
      )}
    </div>
  );
}
