"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WelcomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"landing" | "signup" | "signin" | "forgot">("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
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
      await fetch("/api/auth/ensure-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: signInData.user.id,
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

  if (mode === "landing") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-accent/8 blur-3xl animate-pulseGlow" />

        <div className="relative z-10 text-center max-w-sm">
          <h1 className="font-display text-5xl font-bold mb-3 tracking-tight">
            Fabled
          </h1>
          <p className="text-text-secondary text-lg mb-1">
            A whimsical book club
          </p>
          <p className="text-muted-1 text-sm mb-12">
            Discover your reading aura. Swipe on books blind.
            <br />
            Discuss with your tribe.
          </p>

          <button
            onClick={() => setMode("signup")}
            className="btn-primary w-full mb-4 text-base"
          >
            Discover Your Reading Aura
          </button>

          <button
            onClick={() => setMode("signin")}
            className="text-muted-1 text-sm hover:text-text-secondary transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
      <div className="w-full max-w-sm">
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
