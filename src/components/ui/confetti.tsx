"use client";

import { useState } from "react";

const COLORS = ["#C4956A", "#6BCB77", "#6A9BC4", "#E8A888", "#F5F0E8"];

interface Piece {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
  drift: number;
}

/**
 * One-shot celebratory confetti burst. Renders fixed, full-screen, and
 * non-interactive; unmount it (or toggle rendering) to replay. Only mounted
 * client-side (behind a trigger), so randomized layout is safe.
 */
export default function Confetti({ count = 36 }: { count?: number }) {
  const [pieces] = useState<Piece[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 120,
    }))
  );

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden" aria-hidden>
      <style>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(-10vh) rotate(0deg); }
          100% { opacity: 0; transform: translateY(105vh) rotate(720deg); }
        }
      `}</style>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            borderRadius: 2,
            marginLeft: p.drift,
            animation: `confettiFall ${1.4 + p.delay}s cubic-bezier(0.3,0.7,0.5,1) ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
