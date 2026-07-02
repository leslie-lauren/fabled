"use client";

import dynamic from "next/dynamic";

// Lazy-load character SVGs to keep bundle manageable
const characters: Record<string, React.ComponentType<{ c1: string; c2: string; c3: string; className?: string }>> = {
  nocturne: dynamic(() => import("./nocturne")),
  archivist: dynamic(() => import("./archivist")),
  wanderer: dynamic(() => import("./wanderer")),
  conjurer: dynamic(() => import("./conjurer")),
  oracle: dynamic(() => import("./oracle")),
  cartographer: dynamic(() => import("./cartographer")),
  scribe: dynamic(() => import("./scribe")),
  sentinel: dynamic(() => import("./sentinel")),
  heretic: dynamic(() => import("./heretic")),
  ember: dynamic(() => import("./ember")),
  revenant: dynamic(() => import("./revenant")),
  seer: dynamic(() => import("./seer")),
};

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
  c3,
  className,
}: CharacterIllustrationProps) {
  const Component = characters[archetype];

  if (!Component) {
    // Fallback: decorative orb
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

  return <Component c1={c1} c2={c2} c3={c3} className={className} />;
}
