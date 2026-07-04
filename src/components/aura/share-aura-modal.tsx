"use client";

import { useState, useRef } from "react";
import type { Aura } from "@/lib/types";
import ShareCard from "./share-card";

interface TribeInfo {
  id: string;
  name: string;
  invite_code: string;
}

interface ShareAuraModalProps {
  aura: Aura;
  open: boolean;
  onClose: () => void;
  tribes?: TribeInfo[];
}

/**
 * Share My Aura modal — a single ShareCard is used for both the scaled
 * on-screen preview and the offscreen 1080×1920 html2canvas capture.
 * Reused by the aura reveal (/aura/generate) and the My Aura page (/aura).
 */
export default function ShareAuraModal({ aura, open, onClose, tribes = [] }: ShareAuraModalProps) {
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  async function handleShare() {
    setSharing(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const card = shareCardRef.current;
      if (!card) { setSharing(false); return; }

      // Wait for web fonts so html2canvas doesn't rasterize fallback metrics
      // that overflow the fixed 1080×1920 frame.
      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch { /* fonts API unsupported */ }
      }

      const canvas = await html2canvas(card, {
        backgroundColor: null,
        width: 1080,
        height: 1920,
        scale: 1,
        windowWidth: 1080,
        windowHeight: 1920,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) { setSharing(false); return; }
        const file = new File([blob], "my-reading-aura.png", { type: "image/png" });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: "My Reading Aura on Fabled" });
          } catch {
            // User cancelled share
          }
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "my-reading-aura.png";
          a.click();
          URL.revokeObjectURL(url);
        }
        setSharing(false);
      }, "image/png");
    } catch {
      setSharing(false);
    }
  }

  if (!open) return null;

  const effectiveSelected = selectedTribe ?? (tribes.length ? tribes[tribes.length - 1].id : null);
  const activeTribe = tribes.find((t) => t.id === effectiveSelected);
  const tribeCode = activeTribe?.invite_code || null;

  const PREVIEW_SCALE = 340 / 1080;
  const PREVIEW_W = 340;
  const PREVIEW_H = Math.round(1920 * PREVIEW_SCALE);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn"
      style={{ background: "#0A090C" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#F5F0E8",
        }}
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="min-h-full flex flex-col items-center justify-start px-5 pt-14 pb-10">
        <p className="label-mono text-center mb-4 text-[10px] tracking-[0.25em]" style={{ color: "#7A756D" }}>
          SHARE MY READING AURA
        </p>

        {/* Scaled preview */}
        <div
          style={{
            width: PREVIEW_W,
            height: PREVIEW_H,
            overflow: "hidden",
            borderRadius: 20,
            boxShadow: "0 10px 50px rgba(0,0,0,0.6)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE})`,
              transformOrigin: "top left",
              width: 1080,
              height: 1920,
            }}
          >
            <ShareCard aura={aura} tribeCode={tribeCode} />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 w-full max-w-[340px] space-y-2.5">
          {tribes.length > 1 && (
            <select
              value={effectiveSelected || ""}
              onChange={(e) => setSelectedTribe(e.target.value)}
              className="w-full bg-bg border border-muted-5/30 rounded-xl px-3 py-2 text-text text-sm"
            >
              <option value="">No tribe invite</option>
              {tribes.map((t) => (
                <option key={t.id} value={t.id}>Include {t.name} invite</option>
              ))}
            </select>
          )}
          <button
            onClick={handleShare}
            disabled={sharing}
            className="btn-primary w-full text-sm"
          >
            {sharing ? "Generating..." : "Save as Image"}
          </button>
          <p className="text-muted-3 text-[11px] text-center italic pt-1">
            Saves a 1080×1920 PNG to your device. Perfect for IG Stories.
          </p>
        </div>
      </div>

      {/* Offscreen capture source */}
      <div
        ref={shareCardRef}
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          width: 1080,
          height: 1920,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <ShareCard aura={aura} tribeCode={tribeCode} />
      </div>
    </div>
  );
}
