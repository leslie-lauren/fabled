"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { haptic } from "@/lib/haptics";
import BookInput from "@/components/aura/book-input";
import LoadingScreen from "@/components/aura/loading-screen";
import AuraCard from "@/components/aura/aura-card";
import type { Aura } from "@/lib/types";

type Phase = "input" | "loading" | "result" | "transition" | "find-tribe";

function GenerateAuraContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("joinCode");

  const [phase, setPhase] = useState<Phase>("input");
  const [aura, setAura] = useState<Aura | null>(null);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [savedBooks, setSavedBooks] = useState<string[]>([]);
  const [hasTribes, setHasTribes] = useState(false);
  const [backTarget, setBackTarget] = useState<string>("/welcome");
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/welcome");
        return;
      }
      setUserId(session.user.id);
      const { data: memberships } = await supabase
        .from("tribe_members")
        .select("tribe_id")
        .eq("user_id", session.user.id);
      if (memberships && memberships.length > 0) {
        setHasTribes(true);
        setBackTarget("/home");
      }
    });
  }, [router]);

  async function handleSubmit(books: string[]) {
    if (!userId) return;
    setSavedBooks(books);
    setPhase("loading");
    setError("");

    try {
      const res = await apiFetch("/api/generate-aura", {
        method: "POST",
        body: JSON.stringify({ books }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate aura");
      }

      setAura(data.aura);
      setPhase("result");
      haptic("celebrate");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("input");
    }
  }

  async function handleJoinTribe() {
    if (joinCode.length !== 6 || !userId) return;
    setJoinLoading(true);
    setJoinError("");

    const res = await apiFetch("/api/tribes/join", {
      method: "POST",
      body: JSON.stringify({ code: joinCode.toUpperCase() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setJoinError(data.error);
      setJoinLoading(false);
      return;
    }

    router.push(`/tribes/${data.tribe.id}`);
  }

  return (
    <div className="min-h-dvh px-5 py-8 pb-20">
      {/* Header */}
      <button
        onClick={() => router.push(backTarget)}
        className="text-muted-2 text-sm mb-4 hover:text-text-secondary transition-colors"
      >
        ← Back
      </button>
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold">Fabled</h1>
      </div>

      {phase === "input" && (
        <>
          <BookInput
            onSubmit={handleSubmit}
            loading={false}
            initialBooks={savedBooks}
          />
          {error && (
            <div className="mt-4 text-center">
              <p className="text-error text-sm mb-2">{error}</p>
              <button
                onClick={() => handleSubmit(savedBooks)}
                className="btn-ghost text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </>
      )}

      {phase === "loading" && <LoadingScreen />}

      {phase === "result" && aura && (
        <div className="max-w-sm mx-auto animate-fadeInUp">
          <AuraCard aura={aura} />

          <div className="mt-8">
            <button
              onClick={() => setPhase("transition")}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {phase === "transition" && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-fadeIn">
          <div className="animate-float mb-6">
            <span className="text-4xl">✦</span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">Your aura has been read.</h2>
          <p className="text-text-secondary text-sm mb-8 max-w-xs leading-relaxed">
            Now find your tribe and your next read!
          </p>
          <button
            onClick={() => setPhase("find-tribe")}
            className="btn-primary w-full max-w-xs"
          >
            Find My Tribe
          </button>
          {hasTribes && (
            <button
              onClick={() => router.push("/home")}
              className="btn-ghost w-full max-w-xs mt-3 text-sm"
            >
              Back to Home
            </button>
          )}
        </div>
      )}

      {phase === "find-tribe" && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-fadeIn">
          <h2 className="font-display text-2xl font-bold mb-2">Find My Tribe</h2>
          <p className="text-text-secondary text-sm mb-8 max-w-xs leading-relaxed">
            Start a new tribe or join one with an invite code.
          </p>

          <div className="w-full max-w-xs space-y-6">
            {/* Create option */}
            <button
              onClick={() => router.push("/tribes/create")}
              className="btn-primary w-full"
            >
              Create a Tribe
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-muted-5/30" />
              <span className="text-muted-3 text-xs">or</span>
              <div className="flex-1 h-px bg-muted-5/30" />
            </div>

            {/* Join option */}
            <div>
              <label className="label-mono block mb-2 text-left">Invite Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="FABLE7"
                  maxLength={6}
                  className="flex-1 bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors text-center font-mono text-lg tracking-[0.2em] uppercase"
                />
                <button
                  onClick={handleJoinTribe}
                  disabled={joinCode.length !== 6 || joinLoading}
                  className="btn-primary px-5"
                >
                  {joinLoading ? "..." : "Join"}
                </button>
              </div>
              {joinError && (
                <p className="text-error text-sm mt-2">{joinError}</p>
              )}
            </div>

            {/* Pre-filled invite code from URL */}
            {inviteCode && joinCode !== inviteCode && (
              <button
                onClick={() => {
                  setJoinCode(inviteCode.toUpperCase());
                }}
                className="text-accent text-xs hover:underline"
              >
                Use invite code: {inviteCode}
              </button>
            )}
          </div>

          {hasTribes && (
            <button
              onClick={() => router.push("/home")}
              className="btn-ghost w-full max-w-xs mt-6 text-sm"
            >
              Back to Home
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function GenerateAuraPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    }>
      <GenerateAuraContent />
    </Suspense>
  );
}
