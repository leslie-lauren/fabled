"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";

const ACCENT = "#C4956A";

const welcomeCss = `
@keyframes welcomeFadeIn{from{opacity:0}to{opacity:1}}
@keyframes welcomeFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes welcomeFadeInDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes welcomeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes welcomeShimmer{0%,100%{opacity:0.2}50%{opacity:0.6}}
`;

export default function WelcomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"landing" | "signup" | "signin" | "forgot" | "invite">("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  function handleInviteCodeSubmit() {
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      setError("Enter your invite code.");
      return;
    }
    router.push(`/join/${code}`);
  }

  async function handleSignUp() {
    if (!email || !password || !displayName) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    let res: Response;
    try {
      res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });
    } catch (err) {
      console.error("[signup] network error:", err);
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
      return;
    }

    let data: { error?: string; session?: { access_token: string; refresh_token: string } } = {};
    try {
      data = await res.json();
    } catch (err) {
      console.error("[signup] failed to parse response JSON:", err);
    }

    if (!res.ok) {
      console.warn("[signup] server error", res.status, data);
      setError(data.error || `Signup failed (HTTP ${res.status})`);
      setLoading(false);
      return;
    }

    // Set the session client-side so Supabase auth is active
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    // Check for pending tribe invite
    const pendingCode = localStorage.getItem("fabled_invite_code");
    if (pendingCode) {
      localStorage.removeItem("fabled_invite_code");
      router.push(`/aura/generate?joinCode=${pendingCode}`);
    } else {
      router.push("/aura/generate");
    }
    setLoading(false);
  }

  async function handleSignIn() {
    if (!email || !password) {
      setError("Email and password required.");
      return;
    }
    setLoading(true);
    setError("");

    const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Ensure public.users row exists (fixes orphaned auth users from failed signups)
    if (signInData.user) {
      await apiFetch("/api/auth/ensure-user", {
        method: "POST",
        body: JSON.stringify({
          email: signInData.user.email,
          displayName: signInData.user.user_metadata?.display_name || email.split("@")[0],
        }),
      });
    }

    const pendingCode = localStorage.getItem("fabled_invite_code");
    if (pendingCode) {
      localStorage.removeItem("fabled_invite_code");
      router.push(`/home?joinCode=${pendingCode}`);
    } else {
      router.push("/home");
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email address.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  }

  if (mode === "forgot") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-bold mb-2 text-center">
            Reset Password
          </h1>
          <p className="text-muted-1 text-sm text-center mb-8">
            {resetSent
              ? "Check your email for a password reset link."
              : "Enter your email and we'll send a reset link."}
          </p>

          {!resetSent && (
            <div className="space-y-4">
              <div>
                <label className="label-mono block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>

              {error && (
                <p className="text-error text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading ? "..." : "Send Reset Link"}
              </button>
            </div>
          )}

          <button
            onClick={() => { setMode("signin"); setError(""); setResetSent(false); }}
            className="text-muted-1 text-sm hover:text-text-secondary transition-colors w-full text-center mt-4 block"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (mode === "invite") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-bold mb-2 text-center">
            Enter Invite Code
          </h1>
          <p className="text-muted-1 text-sm text-center mb-8">
            Paste the code from your tribe&apos;s invitation.
          </p>

          <div className="space-y-4">
            <div>
              <label className="label-mono block mb-2">Invite Code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234"
                autoCapitalize="characters"
                className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors tracking-widest text-center font-mono"
              />
            </div>

            {error && <p className="text-error text-sm text-center">{error}</p>}

            <button onClick={handleInviteCodeSubmit} className="btn-primary w-full mt-2">
              Continue
            </button>

            <button
              onClick={() => {
                setMode("landing");
                setError("");
                setInviteCode("");
              }}
              className="text-muted-1 text-sm hover:text-text-secondary transition-colors w-full text-center mt-4 block"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "landing") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0A0C",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{welcomeCss}</style>

        {/* Ambient gradient */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 50% 20%, rgba(196,149,106,0.1) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(139,106,212,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Sparkle dots */}
        {[
          { top: "12%", left: "15%", delay: 0 },
          { top: "20%", right: "20%", delay: 0.5 },
          { top: "75%", left: "20%", delay: 1.5 },
          { top: "65%", right: "15%", delay: 1 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: "fixed",
              ...s,
              color: ACCENT,
              fontSize: 8,
              opacity: 0.4,
              animation: `welcomeShimmer 3s ease-in-out infinite ${s.delay}s`,
              pointerEvents: "none",
            }}
          >
            ✦
          </div>
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            maxWidth: 420,
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Wordmark at top */}
          <div style={{ marginBottom: 48, animation: "welcomeFadeInDown 0.6s ease-out" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: ACCENT, fontSize: 18 }}>✦</span>
              <span
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#F5F0E8",
                  letterSpacing: "0.03em",
                }}
              >
                fabled
              </span>
            </div>
          </div>

          {/* Floating orb visual */}
          <div
            style={{
              marginBottom: 32,
              animation:
                "welcomeFadeInUp 0.6s ease-out 0.1s both, welcomeFloat 4s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                background: `radial-gradient(circle, ${ACCENT}30, ${ACCENT}10, transparent)`,
                border: `1px solid ${ACCENT}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 60px ${ACCENT}20`,
              }}
            >
              <span style={{ fontSize: 32, color: "#F5F0E8", textShadow: `0 0 20px ${ACCENT}` }}>
                ✦
              </span>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 10,
              color: ACCENT,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 12px",
              animation: "welcomeFadeInUp 0.6s ease-out 0.2s both",
            }}
          >
            Welcome to Fabled
          </p>

          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#F5F0E8",
              margin: "0 0 16px",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              animation: "welcomeFadeInUp 0.6s ease-out 0.3s both",
            }}
          >
            The Story Spirits
            <br />
            <em style={{ fontStyle: "italic", color: ACCENT }}>are waiting</em>.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 15,
              color: "#9B958A",
              lineHeight: 1.6,
              margin: "0 0 40px",
              padding: "0 8px",
              animation: "welcomeFadeInUp 0.6s ease-out 0.4s both",
            }}
          >
            Discover your reading aura. Swipe on books blind. Find your next read. Discuss with your tribe.
          </p>

          <button
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "16px 32px",
              background: `linear-gradient(135deg, ${ACCENT}, #8B6E4E)`,
              border: "none",
              borderRadius: 14,
              color: "#F5F0E8",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              cursor: "pointer",
              boxShadow: `0 4px 24px ${ACCENT}30`,
              marginBottom: 12,
              animation: "welcomeFadeInUp 0.6s ease-out 0.5s both",
            }}
          >
            Get started
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "12px 0",
              width: "100%",
              maxWidth: 320,
              animation: "welcomeFadeInUp 0.6s ease-out 0.6s both",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: 11, color: "#5A564F", fontStyle: "italic" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
              maxWidth: 320,
              animation: "welcomeFadeInUp 0.6s ease-out 0.7s both",
            }}
          >
            <button
              onClick={() => {
                setMode("invite");
                setError("");
              }}
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#C8C2B8",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>🔑</span>
              Continue with invite code
            </button>

            <button
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                color: "#7A756D",
                fontSize: 13,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                textDecorationColor: "rgba(255,255,255,0.15)",
              }}
            >
              I already have an account
            </button>
          </div>

          <p
            style={{
              marginTop: 32,
              color: "#3A363F",
              fontSize: 10,
              maxWidth: 280,
              lineHeight: 1.5,
              animation: "welcomeFadeInUp 0.6s ease-out 0.8s both",
            }}
          >
            By continuing, you agree to our{" "}
            <span
              onClick={() => router.push("/terms")}
              style={{ color: "#5A564F", cursor: "pointer", textDecoration: "underline" }}
            >
              Terms
            </span>{" "}
            and{" "}
            <span
              onClick={() => router.push("/privacy")}
              style={{ color: "#5A564F", cursor: "pointer", textDecoration: "underline" }}
            >
              Privacy Policy
            </span>
            .
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 24px 32px",
            animation: "welcomeFadeIn 1s ease-out 1s both",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 11,
              color: "#3A363F",
              margin: 0,
              fontStyle: "italic",
              letterSpacing: "0.05em",
            }}
          >
            a whimsical book club · made with ✦
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={() => {
            setMode("landing");
            setError("");
          }}
          className="text-muted-1 text-sm hover:text-text transition-colors mb-6 inline-flex items-center gap-1.5"
        >
          <span aria-hidden>←</span> Back
        </button>
        <h1 className="font-display text-3xl font-bold mb-2 text-center">
          {mode === "signup" ? "Join Fabled" : "Welcome Back"}
        </h1>
        <p className="text-muted-1 text-sm text-center mb-8">
          {mode === "signup"
            ? "Create your account to discover your reading aura"
            : "Sign in to continue your journey"}
        </p>

        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="label-mono block mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="label-mono block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="label-mono block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(""); }}
              className="text-muted-2 text-xs hover:text-accent transition-colors text-right w-full -mt-2"
            >
              Forgot password?
            </button>
          )}

          {error && (
            <p className="text-error text-sm text-center">{error}</p>
          )}

          <button
            onClick={mode === "signup" ? handleSignUp : handleSignIn}
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading
              ? "..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </button>

          <button
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError("");
            }}
            className="text-muted-1 text-sm hover:text-text-secondary transition-colors w-full text-center mt-4 block"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
