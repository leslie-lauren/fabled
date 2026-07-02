"use client";

import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  messages: string[];
  intervalMs?: number;
}

export default function LoadingOverlay({ messages, intervalMs = 2000 }: LoadingOverlayProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [messages.length, intervalMs]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6" style={{ backgroundColor: "rgba(17, 16, 16, 0.97)" }}>
      {/* Floating sparkle */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-accent/15 animate-pulseGlow" />
        <div
          className="absolute inset-2 rounded-full animate-float"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(196,149,106,0.4), rgba(139,110,78,0.1) 70%, transparent)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-float" style={{ animationDelay: "0.5s" }}>
          ✦
        </div>
        <div className="absolute inset-4 rounded-full bg-accent/10 animate-pulseGlow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Message */}
      <p
        key={msgIndex}
        className="text-text-secondary text-base animate-fadeIn text-center"
      >
        {messages[msgIndex]}
      </p>
    </div>
  );
}
