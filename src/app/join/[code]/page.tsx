"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Aura } from "@/lib/types";
import { getArchetype } from "@/data/archetypes";
import CharacterIllustration from "@/components/characters";

type Phase = "loading" | "landing" | "input" | "generating" | "result" | "signup" | "simple-join";

export default function JoinByLinkPage() {
  const router = useRouter();
  const params = useParams();
  const code = (params.code as string).toUpperCase();

  const [phase, setPhase] = useState<Phase>("loading");
  const [tribeName, setTribeName] = useState("");
  const [tribeId, setTribeId] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [sharerAura, setSharerAura] = useState<Aura | null>(null);
  const [sharerName, setSharerName] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Book input
  const [books, setBooks] = useState<string[]>([]);
  const [currentBook, setCurrentBook] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Generation
  const [generatingMsg, setGeneratingMsg] = useState(0);
  const [generatedAura, setGeneratedAura] = useState<Aura | null>(null);

  // Signup
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  useEffect(() => {
    async function load() {
      // Fetch tribe info via public API (no auth required)
      const infoRes = await fetch(`/api/join-info?code=${code}`);
      const info = await infoRes.json();

      if (!infoRes.ok || !info.tribe) {
        setError(info.error || "This invite link doesn't exist. Check with whoever sent it.");
        setPhase("landing");
        return;
      }

      setTribeName(info.tribe.name);
      setTribeId(info.tribe.id);
      setMemberCount(info.memberCount);
      setSharerName(info.sharerName);
      if (info.sharerAura) setSharerAura(info.sharerAura);

      // Now check auth
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUserId(session.user.id);

        // Check if already a member
        const { data: existing } = await supabase
          .from("tribe_members")
          .select("tribe_id")
          .eq("tribe_id", info.tribe.id)
          .eq("user_id", session.user.id)
          .single();

        if (existing) {
          router.push("/home");
          return;
        }

        // Check if they have an aura
        const { data: userAura } = await supabase
          .from("auras")
          .select("id")
          .eq("user_id", session.user.id)
          .limit(1)
          .single();

        if (userAura) {
          setPhase("simple-join");
          return;
        }

        // Has account but no aura — show full flow
        setPhase("landing");
      } else {
        // No session — show conversion landing
        setPhase("landing");
      }
    }
    load();
  }, [code, router]);

  // Generating messages rotation
  useEffect(() => {
    if (phase !== "generating") return;
    const msgs = 4;
    const t = setInterval(() => setGeneratingMsg((i) => (i + 1) % msgs), 2200);
    return () => clearInterval(t);
  }, [phase]);

  function addBook() {
    const t = currentBook.trim();
    if (t && books.length < 7) {
      setBooks([...books, t]);
      setCurrentBook("");
      inputRef.current?.focus();
    }
  }

  function removeBook(index: number) {
    setBooks(books.filter((_, i) => i !== index));
  }

  async function handleGenerate() {
    setPhase("generating");
    try {
      const res = await fetch("/api/generate-aura-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ books }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedAura(data.aura);
      setPhase("result");
    } catch {
      setError("Something went wrong generating your aura. Please try again.");
      setPhase("input");
    }
  }

  async function handleSignup() {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setSignupError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    setSigningUp(true);
    setSignupError("");

    try {
      // Create account
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: displayName.trim() }),
      });
      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setSignupError(signupData.error || "Signup failed.");
        setSigningUp(false);
        return;
      }

      // Set session
      if (signupData.session) {
        await supabase.auth.setSession({
          access_token: signupData.session.access_token,
          refresh_token: signupData.session.refresh_token,
        });
      }

      const newUserId = signupData.user?.id;
      if (!newUserId) {
        setSignupError("Account created but couldn't get user ID.");
        setSigningUp(false);
        return;
      }

      // Generate + save their real aura
      await fetch("/api/generate-aura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ books, userId: newUserId }),
      });

      // Join the tribe
      await fetch("/api/tribes/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId: newUserId }),
      });

      router.push("/home");
    } catch {
      setSignupError("Something went wrong. Please try again.");
      setSigningUp(false);
    }
  }

  async function handleSimpleJoin() {
    if (!userId) return;
    setSigningUp(true);
    const res = await fetch("/api/tribes/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setSigningUp(false);
      return;
    }
    router.push("/home");
  }

  const generatingMessages = [
    "Consulting the Story Spirits...",
    "Finding your creature...",
    "Mapping your dimensions...",
    "Spotting your red flags...",
  ];

  // ── Loading ──
  if (phase === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  // ── Simple Join (existing user with aura) ──
  if (phase === "simple-join") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
        <div className="text-center max-w-sm">
          <h1 className="font-display text-3xl font-bold mb-2">fabled</h1>
          {error ? (
            <>
              <p className="text-error text-sm mb-6">{error}</p>
              <button onClick={() => router.push("/home")} className="btn-ghost">Go Home</button>
            </>
          ) : (
            <>
              <p className="text-accent text-sm mb-1">You&apos;ve been invited to</p>
              <h2 className="font-display text-2xl font-semibold mb-1">{tribeName}</h2>
              <p className="text-muted-1 text-sm mb-8">
                {memberCount} member{memberCount !== 1 ? "s" : ""}
              </p>
              <button
                onClick={handleSimpleJoin}
                disabled={signingUp}
                className="btn-primary w-full mb-3"
              >
                {signingUp ? "Joining..." : "Join This Tribe"}
              </button>
              <button
                onClick={() => router.push("/home")}
                className="text-muted-2 text-sm hover:text-text-secondary transition-colors"
              >
                Not now
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Landing: Sharer's Aura Preview ──
  if (phase === "landing") {
    const archetype = sharerAura ? getArchetype(sharerAura.archetype) : null;

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
        <div className="text-center max-w-sm w-full" style={{ animation: "fadeInUp 0.6s ease-out" }}>
          {error ? (
            <>
              <h1 className="font-display text-3xl font-bold mb-4">fabled</h1>
              <p className="text-error text-sm mb-6">{error}</p>
              <button onClick={() => { window.location.href = "/welcome"; }} className="btn-ghost">Go to Fabled</button>
            </>
          ) : (
            <>
              {/* Sharer's mini aura */}
              {sharerAura && (
                <div className="mb-2">
                  <div className="w-[70px] h-[80px] mx-auto">
                    <CharacterIllustration
                      archetype={sharerAura.archetype}
                      c1={sharerAura.color_primary}
                      c2={sharerAura.color_secondary}
                      c3={sharerAura.color_tertiary}
                    />
                  </div>
                </div>
              )}

              <p className="text-muted-1 text-sm mb-1">{sharerName} is</p>
              <h1 className="font-display text-3xl font-bold mb-2" style={{ color: sharerAura?.color_primary || "#F5F0E8" }}>
                {archetype?.name || "A Reader"}
              </h1>

              {sharerAura && (
                <p className="font-display text-sm italic mb-7 px-3" style={{ color: "#9B958A" }}>
                  🚩 {sharerAura.roast}
                </p>
              )}

              {/* Identity gap CTA */}
              <div
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: "rgba(196,149,106,0.08)",
                  border: "1px solid rgba(196,149,106,0.15)",
                }}
              >
                <h2 className="font-display text-xl font-bold mb-1.5">What are you?</h2>
                <p className="text-muted-2 text-sm mb-4 leading-relaxed">
                  Tell us 3 books. The Story Spirits will do the rest.
                </p>
                <button
                  onClick={() => setPhase("input")}
                  className="btn-primary w-full"
                >
                  Find My Reading Aura
                </button>
              </div>

              {/* Social proof */}
              {memberCount > 0 && (
                <div className="flex items-center justify-center gap-1.5">
                  {[...Array(Math.min(memberCount, 5))].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: `hsl(${i * 60 + 200}, 50%, 65%)`,
                        opacity: 0.6,
                      }}
                    />
                  ))}
                  <span className="text-muted-3 text-xs ml-1">
                    {memberCount} reader{memberCount !== 1 ? "s" : ""} in {sharerName}&apos;s tribe
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Book Input ──
  if (phase === "input") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5 animate-fadeIn">
        <div className="max-w-md w-full text-center" style={{ animation: "fadeInUp 0.5s ease-out" }}>
          <div className="text-4xl mb-2 animate-float">✦</div>
          <h2 className="font-display text-2xl font-bold mb-1.5">Name 3-7 books you love</h2>
          <p className="text-muted-2 text-sm mb-7">No signup required. See your aura first.</p>

          <div className="flex gap-2 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={currentBook}
              onChange={(e) => setCurrentBook(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBook()}
              placeholder={books.length === 0 ? "e.g. Normal People" : "Add another..."}
              className="flex-1 px-4 py-3.5 rounded-xl text-text text-[15px] outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
              autoFocus
            />
            <button
              onClick={addBook}
              disabled={!currentBook.trim() || books.length >= 7}
              className="px-5 py-3.5 rounded-xl text-[15px] transition-colors"
              style={{
                background: currentBook.trim() ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: currentBook.trim() ? "#F5F0E8" : "#5A564F",
              }}
            >
              +
            </button>
          </div>

          {books.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {books.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#C8C2B8",
                  }}
                >
                  <span>{b}</span>
                  <span
                    onClick={() => removeBook(i)}
                    className="cursor-pointer opacity-40 text-[11px] hover:opacity-70 transition-opacity"
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          )}

          {books.length >= 3 && (
            <button
              onClick={handleGenerate}
              className="btn-primary w-full mb-4"
              style={{ boxShadow: "0 4px 24px rgba(196,149,106,0.2)" }}
            >
              Reveal My Reading Aura
            </button>
          )}

          {books.length > 0 && books.length < 3 && (
            <p className="text-muted-3 text-sm italic">
              {3 - books.length} more book{3 - books.length !== 1 ? "s" : ""} to unlock
            </p>
          )}

          {error && <p className="text-error text-sm mt-3">{error}</p>}

          <p className="text-muted-4 text-[11px] italic mt-5">
            No account needed to see your results
          </p>
        </div>
      </div>
    );
  }

  // ── Generating ──
  if (phase === "generating") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl animate-float mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(196,149,106,0.15), rgba(139,110,78,0.15))",
            border: "1px solid rgba(196,149,106,0.12)",
          }}
        >
          ✦
        </div>
        <p
          key={generatingMsg}
          className="text-muted-1 text-[15px] font-light animate-fadeInUp"
        >
          {generatingMessages[generatingMsg]}
        </p>
      </div>
    );
  }

  // ── Result + Signup ──
  if (phase === "result" || phase === "signup") {
    const aura = generatedAura;
    if (!aura) return null;

    const archetype = getArchetype(aura.archetype);

    if (phase === "signup") {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-5 animate-fadeIn">
          <div className="max-w-sm w-full text-center" style={{ animation: "fadeInUp 0.5s ease-out" }}>
            <h2 className="font-display text-2xl font-bold mb-2">Save your aura</h2>
            <p className="text-muted-2 text-sm mb-1">
              Join <strong className="text-text">{sharerName}&apos;s tribe</strong> on Fabled
            </p>
            <p className="text-muted-3 text-xs mb-6">
              Swipe on books blind. Discover your next read together.
            </p>

            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-text text-[15px] outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                autoFocus
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-text text-[15px] outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
              <input
                type="password"
                placeholder="Password (6+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className="w-full px-4 py-3.5 rounded-xl text-text text-[15px] outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {signupError && <p className="text-error text-sm mb-3">{signupError}</p>}

            <button
              onClick={handleSignup}
              disabled={signingUp}
              className="btn-primary w-full mb-3"
            >
              {signingUp ? "Creating account..." : "Create Account & Join Tribe"}
            </button>

            <button
              onClick={() => setPhase("result")}
              className="text-muted-2 text-xs hover:text-text-secondary transition-colors"
            >
              ← Back to my aura
            </button>
          </div>
        </div>
      );
    }

    // Result phase
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5 animate-fadeIn">
        <div className="max-w-sm w-full text-center" style={{ animation: "fadeInUp 0.8s ease-out" }}>
          {/* Character */}
          <div className="w-[100px] h-[115px] mx-auto mb-2">
            <CharacterIllustration
              archetype={aura.archetype}
              c1={aura.color_primary}
              c2={aura.color_secondary}
              c3={aura.color_tertiary}
            />
          </div>

          <h1
            className="font-display text-3xl font-bold mb-1"
            style={{ color: aura.color_primary }}
          >
            {archetype?.name || aura.archetype}
          </h1>

          <p
            className="font-display text-sm italic leading-relaxed mb-4 px-5"
            style={{ color: "#B8B2A8" }}
          >
            {aura.bio}
          </p>

          {/* Strengths */}
          <div className="flex justify-center gap-1.5 flex-wrap mb-6">
            {aura.strengths.map((s, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{
                  background: `${aura.color_primary}12`,
                  border: `1px solid ${aura.color_primary}20`,
                  color: aura.color_primary,
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Conversion CTA */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: "rgba(196,149,106,0.08)",
              border: "1px solid rgba(196,149,106,0.15)",
            }}
          >
            <p className="text-text-tertiary text-sm mb-1.5">
              Save your aura and join <strong className="text-text">{sharerName}&apos;s tribe</strong>
            </p>
            <p className="text-muted-2 text-xs mb-4 leading-relaxed">
              Swipe on books blind. Discover your next read together.
            </p>
            <button
              onClick={() => {
                if (userId) {
                  // Already logged in, save aura + join
                  handleSignup();
                } else {
                  setPhase("signup");
                }
              }}
              className="btn-primary w-full"
            >
              {userId ? "Save & Join Tribe" : "Create Account & Join Tribe"}
            </button>
          </div>

          <p className="text-muted-4 text-xs italic">
            Your full aura (red flags, compatibility, and more) is waiting inside
          </p>
        </div>
      </div>
    );
  }

  return null;
}
