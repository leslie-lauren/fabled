"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/layout/bottom-nav";

export default function JoinTribePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/welcome");
      else setUserId(session.user.id);
    });
  }, [router]);

  async function handleJoin() {
    if (code.length !== 6 || !userId) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/tribes/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.toUpperCase(), userId }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push(`/tribes/${data.tribe.id}`);
  }

  return (
    <div className="min-h-dvh px-5 pt-8 pb-4">
      <div className="max-w-sm mx-auto animate-fadeInUp">
        <button
          onClick={() => router.back()}
          className="text-muted-2 text-sm mb-6 hover:text-text-secondary transition-colors"
        >
          ← Back
        </button>

        <h2 className="font-display text-2xl font-bold mb-2">Join a Tribe</h2>
        <p className="text-muted-1 text-sm mb-8">
          Enter the 6-character invite code
        </p>

        <div className="mb-6">
          <label className="label-mono block mb-2">Invite Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="FABLE7"
            maxLength={6}
            className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors text-center font-mono text-xl tracking-[0.2em] uppercase"
          />
        </div>

        {error && <p className="text-error text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handleJoin}
          disabled={code.length !== 6 || loading}
          className="btn-primary w-full"
        >
          {loading ? "Joining..." : "Join Tribe"}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
