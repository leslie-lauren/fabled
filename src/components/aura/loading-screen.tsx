"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "Reading the stars...",
  "Consulting the archives...",
  "Analyzing your literary DNA...",
  "Summoning your archetype...",
  "Calibrating your reading dimensions...",
  "Brewing your aura colors...",
  "Almost there...",
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      {/* Floating orb */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-accent/15 animate-pulseGlow" />
        <div
          className="absolute inset-2 rounded-full animate-float"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(196,149,106,0.4), rgba(139,110,78,0.1) 70%, transparent)",
          }}
        />
        <div className="absolute inset-4 rounded-full bg-accent/10 animate-pulseGlow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Message */}
      <p
        key={msgIndex}
        className="text-text-secondary text-base animate-fadeIn text-center"
      >
        {MESSAGES[msgIndex]}
      </p>
    </div>
  );
}
