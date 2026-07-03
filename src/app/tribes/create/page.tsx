"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import BottomNav from "@/components/layout/bottom-nav";

type Phase = "input" | "share";

export default function CreateTribePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("input");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [tribeId, setTribeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/welcome");
      else setUserId(session.user.id);
    });
  }, [router]);

  async function handleCreate() {
    if (!name.trim() || !userId) return;
    setLoading(true);
    setError("");

    const res = await apiFetch("/api/tribes", {
      method: "POST",
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setInviteCode(data.tribe.invite_code);
    setTribeId(data.tribe.id);
    setPhase("share");
    setLoading(false);
  }

  async function handleShare() {
    const shareUrl = `${window.location.origin}/join/${inviteCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my Fabled tribe: ${name}`,
          text: `Join "${name}" on Fabled! Use code ${inviteCode} or tap the link.`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (phase === "share") {
    return (
      <div className="min-h-dvh px-5 pt-8 pb-4">
        <div className="max-w-sm mx-auto text-center animate-fadeInUp">
          <h2 className="font-display text-2xl font-bold mb-2">
            Tribe Created!
          </h2>
          <p className="text-muted-1 text-sm mb-8">
            Share this code with your friends
          </p>

          {/* Code display */}
          <div className="card mb-6 py-8" style={{ background: "#1a191808" }}>
            <p className="label-mono mb-2">Invite Code</p>
            <p className="font-mono text-3xl font-bold tracking-[0.3em] text-accent">
              {inviteCode}
            </p>
          </div>

          {/* Share button */}
          <button onClick={handleShare} className="btn-primary w-full mb-3">
            {copied ? "Link Copied!" : "Share Invite"}
          </button>

          <button
            onClick={() => {
              router.push(`/tribes/${tribeId}`);
            }}
            className="btn-ghost w-full"
          >
            Go to Tribe
          </button>
        </div>
        <BottomNav />
      </div>
    );
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

        <h2 className="font-display text-2xl font-bold mb-2">
          Create a Tribe
        </h2>
        <p className="text-muted-1 text-sm mb-8">
          Name your reading crew (max 30 characters)
        </p>

        <div className="mb-6">
          <label className="label-mono block mb-2">Tribe Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 30))}
            placeholder="The Nightowls"
            className="w-full bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors"
          />
          <p className="text-muted-3 text-xs mt-1 text-right">
            {name.length}/30
          </p>
        </div>

        {error && <p className="text-error text-sm mb-4">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={!name.trim() || loading}
          className="btn-primary w-full"
        >
          {loading ? "Creating..." : "Create Tribe"}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
