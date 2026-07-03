"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { fetchUserTribes, type TribeWithMembers } from "@/lib/tribe-helpers";
import BottomNav from "@/components/layout/bottom-nav";

export default function SettingsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tribes, setTribes] = useState<TribeWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmLeave, setConfirmLeave] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }
      setUserId(session.user.id);
      setEmail(session.user.email || "");

      const { data: userData } = await supabase
        .from("users")
        .select("display_name")
        .eq("id", session.user.id)
        .single();
      if (userData) setDisplayName(userData.display_name);

      const userTribes = await fetchUserTribes(supabase, session.user.id);
      setTribes(userTribes);
      setLoading(false);
    }
    load();
  }, [router]);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSaveName() {
    setSaving("name");
    const res = await apiFetch("/api/account", {
      method: "PATCH",
      body: JSON.stringify({ displayName }),
    });
    const data = await res.json();
    setSaving(null);
    if (res.ok) showMessage("success", "Display name updated");
    else showMessage("error", data.error);
  }

  async function handleSaveEmail() {
    setSaving("email");
    const res = await apiFetch("/api/account", {
      method: "PATCH",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setSaving(null);
    if (res.ok) showMessage("success", "Email updated");
    else showMessage("error", data.error);
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters");
      return;
    }
    setSaving("password");
    const res = await apiFetch("/api/account", {
      method: "PATCH",
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    setSaving(null);
    if (res.ok) {
      setNewPassword("");
      showMessage("success", "Password changed");
    } else {
      showMessage("error", data.error);
    }
  }

  async function handleLeaveTribe(tribeId: string) {
    const res = await apiFetch("/api/tribes/leave", {
      method: "POST",
      body: JSON.stringify({ tribeId }),
    });
    if (res.ok) {
      setTribes((prev) => prev.filter((t) => t.id !== tribeId));
      setConfirmLeave(null);
      showMessage("success", "Left tribe");
    } else {
      const data = await res.json();
      showMessage("error", data.error);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/welcome");
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const res = await apiFetch("/api/account", {
      method: "DELETE",
    });
    if (res.ok) {
      await supabase.auth.signOut();
      router.replace("/welcome");
    } else {
      setDeleting(false);
      const data = await res.json();
      showMessage("error", data.error);
    }
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

  return (
    <div className="min-h-dvh px-5 pt-6 pb-4">
      <button
        onClick={() => router.push("/home")}
        className="text-muted-2 text-sm mb-6 hover:text-text-secondary transition-colors"
      >
        ← Home
      </button>

      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>

      {/* Toast message */}
      {message && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-medium animate-fadeIn"
          style={{
            background: message.type === "success" ? "#6BCB7720" : "#E85D5D20",
            color: message.type === "success" ? "#6BCB77" : "#E85D5D",
            border: `1px solid ${message.type === "success" ? "#6BCB7730" : "#E85D5D30"}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Display Name */}
      <section className="mb-6">
        <p className="label-mono mb-2">Display Name</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={30}
            className="flex-1 bg-bg-card border border-muted-5/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent/40 transition-colors"
          />
          <button
            onClick={handleSaveName}
            disabled={saving === "name"}
            className="btn-primary text-xs px-4"
          >
            {saving === "name" ? "..." : "Save"}
          </button>
        </div>
      </section>

      {/* Email */}
      <section className="mb-6">
        <p className="label-mono mb-2">Email</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-bg-card border border-muted-5/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent/40 transition-colors"
          />
          <button
            onClick={handleSaveEmail}
            disabled={saving === "email"}
            className="btn-primary text-xs px-4"
          >
            {saving === "email" ? "..." : "Save"}
          </button>
        </div>
      </section>

      {/* Change Password */}
      <section className="mb-8">
        <p className="label-mono mb-2">Change Password</p>
        <div className="flex gap-2">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 6 chars)"
            className="flex-1 bg-bg-card border border-muted-5/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent/40 transition-colors placeholder:text-muted-3"
          />
          <button
            onClick={handleChangePassword}
            disabled={saving === "password" || !newPassword}
            className="btn-primary text-xs px-4 disabled:opacity-40"
          >
            {saving === "password" ? "..." : "Update"}
          </button>
        </div>
      </section>

      {/* Tribes */}
      <section className="mb-8">
        <p className="label-mono mb-3">Your Tribes</p>
        {tribes.length === 0 ? (
          <p className="text-muted-2 text-sm">No tribes yet.</p>
        ) : (
          <div className="space-y-2">
            {tribes.map((tribe) => (
              <div
                key={tribe.id}
                className="flex items-center justify-between p-3 rounded-xl bg-bg-card border border-muted-5/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-text text-sm font-medium truncate">{tribe.name}</p>
                  <p className="text-muted-2 text-xs">{tribe.members.length} member{tribe.members.length !== 1 ? "s" : ""}</p>
                </div>
                <button
                  onClick={() => setConfirmLeave(tribe.id)}
                  className="text-error/70 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-error/10 transition-colors shrink-0"
                >
                  Leave
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sign Out */}
      <section className="mb-4">
        <button
          onClick={handleSignOut}
          className="btn-ghost w-full"
        >
          Sign Out
        </button>
      </section>

      {/* Delete Account */}
      <section className="mb-8">
        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium text-error/70 border border-error/20 hover:bg-error/10 transition-colors"
        >
          Delete Account
        </button>
      </section>

      {/* Leave Tribe Confirmation */}
      {confirmLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-fadeIn" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="bg-bg-card border border-muted-5/30 rounded-2xl p-6 max-w-xs w-full animate-popIn text-center">
            <h3 className="font-display text-lg font-semibold mb-2">Leave Tribe?</h3>
            <p className="text-muted-1 text-sm mb-5">
              You&apos;ll be removed from &ldquo;{tribes.find((t) => t.id === confirmLeave)?.name}&rdquo;. You can rejoin later with the invite code.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmLeave(null)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => handleLeaveTribe(confirmLeave)}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-white bg-error/80 hover:bg-error transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-fadeIn" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="bg-bg-card border border-muted-5/30 rounded-2xl p-6 max-w-xs w-full animate-popIn text-center">
            <h3 className="font-display text-lg font-semibold mb-2 text-error">Delete Account?</h3>
            <p className="text-muted-1 text-sm mb-5">
              This is permanent. Your aura, tribe memberships, and all data will be deleted forever.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-white bg-error/80 hover:bg-error transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
