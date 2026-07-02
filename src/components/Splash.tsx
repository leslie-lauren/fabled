"use client";

import { useEffect, useState } from "react";

const ACCENT = "#C4956A";

const splashCss = `
@keyframes splashFadeIn{from{opacity:0}to{opacity:1}}
@keyframes splashDrawCircle{from{stroke-dashoffset:283}to{stroke-dashoffset:0}}
@keyframes splashFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes splashShimmer{0%,100%{opacity:0.2}50%{opacity:0.6}}
@keyframes splashGlowPulse{0%,100%{filter:blur(20px) opacity(0.3)}50%{filter:blur(30px) opacity(0.6)}}
`;

export default function Splash({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  // phases: 0 = dark, 1 = sparkles appear, 2 = orb forms, 3 = wordmark, 4 = fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1400);
    const t4 = setTimeout(() => setPhase(4), 2300);
    const t5 = setTimeout(() => onComplete(), 2800);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0A0A0C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        opacity: phase === 4 ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        overflow: "hidden",
      }}
    >
      <style>{splashCss}</style>

      {/* Ambient gradient bloom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(196,149,106,0.08) 0%, transparent 50%)",
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 1s ease-out",
        }}
      />

      {/* Outer glow ring */}
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}40, transparent 70%)`,
          animation: phase >= 2 ? "splashGlowPulse 3s ease-in-out infinite" : "none",
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      />

      {/* Orbiting sparkles around the center */}
      {phase >= 1 &&
        [...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360;
          const distance = 110;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                color: ACCENT,
                fontSize: 12,
                opacity: 0.5,
                transform: `translate(${x}px, ${y}px)`,
                animation: `splashFadeIn 0.6s ease-out ${i * 0.05}s both, splashShimmer 2s ease-in-out infinite ${i * 0.1}s`,
              }}
            >
              ✦
            </div>
          );
        })}

      {/* Central orb */}
      <div
        style={{
          position: "relative",
          width: 100,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: phase >= 2 ? 1 : 0,
          transform: `scale(${phase >= 2 ? 1 : 0.5})`,
          transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          style={{ position: "absolute" }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="283"
            style={{
              animation: phase >= 2 ? "splashDrawCircle 1.2s ease-out forwards" : "none",
              transformOrigin: "center",
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT}60, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />

        <span
          style={{
            fontSize: 32,
            color: "#F5F0E8",
            position: "relative",
            zIndex: 1,
            textShadow: `0 0 20px ${ACCENT}`,
            animation: phase >= 2 ? "splashFloat 3s ease-in-out infinite" : "none",
          }}
        >
          ✦
        </span>
      </div>

      {/* Wordmark */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "50%",
          textAlign: "center",
          opacity: phase >= 3 ? 1 : 0,
          transform: `translateX(-50%) translateY(${phase >= 3 ? 0 : 12}px)`,
          transition: "all 0.7s ease-out",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 48,
            fontWeight: 700,
            color: "#F5F0E8",
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          fabled
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            margin: "4px 0 0",
            fontStyle: "italic",
            letterSpacing: "0.05em",
          }}
        >
          a whimsical book club
        </p>
      </div>
    </div>
  );
}
