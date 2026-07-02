"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase will auto-detect the recovery token from the URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check if already in recovery state
    setTimeout(() => setReady(true), 1000);
  }, []);

  async function handleReset() {
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/home"), 2000);
    }
  }

  if (!ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fadeIn">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold mb-2 text-center">
          {success ? "Password Updated" : "Set New Password"}
        </h1>
        <p className="text-muted-1 text-sm text-center mb-8">
          {success
            ? "Redirecting you home..."
            : "Choose a new password for your account."}
        </p>

        {!success && (
          <div className="space-y-4">
            <div>
              <label className="label-mono block mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div>
              <label className="label-mono block mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type it again"
                className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-error text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? "..." : "Update Password"}
            </button>
          </div>
        )}

        <button
          onClick={() => router.push("/welcome")}
          className="text-muted-1 text-sm hover:text-text-secondary transition-colors w-full text-center mt-4 block"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
