"use client";

import { ARCHETYPE_MAP, getArchetype } from "@/data/archetypes";

interface CharacterIllustrationProps {
  archetype: string;
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function CharacterIllustration({
  archetype,
  c1,
  c2,
  className,
}: CharacterIllustrationProps) {
  if (!ARCHETYPE_MAP[archetype]) {
    // Fallback for unknown/legacy archetypes: decorative orb
    return (
      <svg viewBox="0 0 240 280" className={className}>
        <defs>
          <radialGradient id="fallback-grad" cx="50%" cy="45%" r="40%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.6" />
            <stop offset="100%" stopColor={c2} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="120" cy="130" r="60" fill="url(#fallback-grad)" />
        <circle cx="120" cy="130" r="30" fill={c1} opacity="0.2" />
      </svg>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/characters/${archetype}.png`}
      alt={getArchetype(archetype)?.name || archetype}
      className={`w-full h-full object-contain rounded-2xl ${className || ""}`}
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.35))" }}
    />
  );
}
