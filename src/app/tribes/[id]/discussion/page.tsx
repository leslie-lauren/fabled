"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { DiscussionQuestions } from "@/lib/types";
import MemberPill from "@/components/ui/member-pill";
import MemberAuraModal from "@/components/aura/member-aura-modal";
import LoadingOverlay from "@/components/ui/loading-overlay";
import type { Aura } from "@/lib/types";

const DISCUSSION_LOADING_MESSAGES = [
  "Reading between the lines...",
  "Crafting the warm-up round...",
  "Turning up the heat...",
  "Going deep...",
  "Preparing hot takes...",
];

const TIERS = [
  { key: "warm_up", label: "Warm Up", emoji: "☀️", color: "#D4A76A" },
  { key: "turn_up_the_heat", label: "Turn Up the Heat", emoji: "🔥", color: "#D46A6A" },
  { key: "go_deep", label: "Go Deep", emoji: "🌀", color: "#6A8BD4" },
  { key: "hot_takes", label: "Hot Take", emoji: "💣", color: "#E85D5D" },
] as const;

export default function DiscussionPage() {
  const router = useRouter();
  const params = useParams();
  const tribeId = params.id as string;

  const [questions, setQuestions] = useState<DiscussionQuestions | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [activeTier, setActiveTier] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hotTakeIndex, setHotTakeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [members, setMembers] = useState<{ name: string; color: string; aura: Aura | null; userId: string }[]>([]);
  const [selectedMember, setSelectedMember] = useState<{ name: string; aura: Aura; userId: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }

      // Fetch existing questions
      const res = await fetch(`/api/tribes/${tribeId}/discussion`);
      const data = await res.json();

      if (data.questions) {
        setQuestions(data.questions);
        setBookTitle(data.questions.book_title);
        setBookAuthor(data.questions.book_author);
      } else if (data.book) {
        setBookTitle(data.book.current_book_title);
        setBookAuthor(data.book.current_book_author);
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
          .select("*")
          .in("user_id", mUserIds);

        const mAuraMap = new Map<string, Aura>();
        if (mAuras) {
          for (const a of mAuras) mAuraMap.set(a.user_id, a as Aura);
        }

        setMembers(
          memberData.map((m: Record<string, unknown>) => {
            const aura = mAuraMap.get(m.user_id as string) || null;
            return {
              name: (m.users as Record<string, string>)?.display_name || "Unknown",
              color: aura?.color_primary || "#C4956A",
              aura,
              userId: m.user_id as string,
            };
          })
        );
      }

      setLoading(false);
    }
    load();
  }, [tribeId, router]);

  async function handleGenerate() {
    setGenerating(true);
    const res = await fetch(`/api/tribes/${tribeId}/discussion`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.questions) {
      setQuestions(data.questions);
    }
    setGenerating(false);
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

  if (!questions) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <button
          onClick={() => router.push("/home")}
          className="absolute top-6 left-5 text-muted-2 text-sm hover:text-text-secondary transition-colors"
        >
          ← Home
        </button>
        <h2 className="font-display text-xl font-bold mb-2">Discussion Mode</h2>
        <p className="text-muted-1 text-sm mb-1">
          {bookTitle} by {bookAuthor}
        </p>
        <p className="text-muted-2 text-xs mb-6">
          Generate AI discussion questions for your tribe
        </p>
        {generating && <LoadingOverlay messages={DISCUSSION_LOADING_MESSAGES} />}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary"
        >
          {generating ? "Generating..." : "Generate Questions"}
        </button>
      </div>
    );
  }

  const tier = TIERS[activeTier];
  const tierKey = tier.key as keyof Pick<DiscussionQuestions, "warm_up" | "turn_up_the_heat" | "go_deep" | "hot_takes">;
  const currentQuestions = questions[tierKey] as string[];
  const isHotTake = activeTier === 3;
  const currentQ = isHotTake
    ? currentQuestions[hotTakeIndex]
    : currentQuestions[questionIndex];
  const totalQ = isHotTake ? currentQuestions.length : currentQuestions.length;
  const currentIdx = isHotTake ? hotTakeIndex : questionIndex;

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-6 pb-8">
      {/* Header */}
      <button
        onClick={() => router.push("/home")}
        className="text-muted-2 text-sm mb-4 hover:text-text-secondary transition-colors self-start"
      >
        ← Home
      </button>

      <div className="text-center mb-5">
        <p className="label-mono text-[9px] text-muted-3 mb-1">Discussion Mode</p>
        <h2 className="font-display text-lg font-semibold">{bookTitle}</h2>
        <p className="text-muted-1 text-sm">{bookAuthor}</p>
      </div>

      {/* Tier tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar px-1">
        {TIERS.map((t, i) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveTier(i);
              setQuestionIndex(0);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-sm transition-all shrink-0"
            style={{
              background: i === activeTier ? `${t.color}20` : "transparent",
              border: `1px solid ${i === activeTier ? `${t.color}40` : "transparent"}`,
              color: i === activeTier ? t.color : "var(--color-muted-2)",
            }}
          >
            <span>{t.emoji}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          key={`${activeTier}-${currentIdx}`}
          className="card text-center py-10 px-6 animate-popIn"
          style={{
            background: `${tier.color}08`,
            border: `1px solid ${tier.color}15`,
            animation: isHotTake ? "shake 0.5s ease-in-out, popIn 0.4s ease-out" : "popIn 0.4s ease-out",
          }}
        >
          {/* Tier badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-lg">{tier.emoji}</span>
            <span className="label-mono text-[9px]" style={{ color: tier.color }}>
              {tier.label}
            </span>
          </div>

          {/* Question number */}
          {!isHotTake && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-medium"
              style={{ background: `${tier.color}20`, color: tier.color }}
            >
              {currentIdx + 1}
            </div>
          )}

          {/* Question text */}
          <p className="text-text text-base font-light leading-relaxed">
            {currentQ}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {isHotTake ? (
            <button
              onClick={() => setHotTakeIndex((i) => (i + 1) % totalQ)}
              className="btn-ghost text-sm"
              style={{ borderColor: `${tier.color}30`, color: tier.color }}
            >
              Another Hot Take 💣
            </button>
          ) : (
            <>
              <button
                onClick={() => setQuestionIndex(Math.max(0, questionIndex - 1))}
                disabled={questionIndex === 0}
                className="text-muted-3 text-xl disabled:opacity-20 transition-opacity"
              >
                ‹
              </button>

              {/* Dots */}
              <div className="flex gap-1.5">
                {currentQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestionIndex(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === questionIndex ? 18 : 6,
                      height: 6,
                      background: i === questionIndex ? tier.color : `${tier.color}30`,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setQuestionIndex(Math.min(totalQ - 1, questionIndex + 1))}
                disabled={questionIndex >= totalQ - 1}
                className="text-muted-3 text-xl disabled:opacity-20 transition-opacity"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>

      {/* Member bar */}
      <div className="flex flex-wrap justify-center gap-2 mt-6 pt-4 border-t border-muted-6/50">
        {members.map((m, i) => (
          <MemberPill
            key={i}
            name={m.name}
            color={m.color}
            onClick={() => {
              if (m.aura) setSelectedMember({ name: m.name, aura: m.aura, userId: m.userId });
            }}
          />
        ))}
      </div>

      {/* Member modal */}
      {selectedMember && (
        <MemberAuraModal
          name={selectedMember.name}
          aura={selectedMember.aura}
          onClose={() => setSelectedMember(null)}
          onViewFull={() => {
            const uid = selectedMember.userId;
            setSelectedMember(null);
            router.push(`/aura/${uid}`);
          }}
        />
      )}
    </div>
  );
}
