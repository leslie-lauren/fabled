"use client";

import type { Aura } from "@/lib/types";
import { getArchetype } from "@/data/archetypes";
import CharacterIllustration from "../characters";

interface MemberAuraModalProps {
  name: string;
  aura: Aura;
  isLeader?: boolean;
  onClose: () => void;
  onViewFull?: () => void;
}

export default function MemberAuraModal({
  name,
  aura,
  isLeader = false,
  onClose,
  onViewFull,
}: MemberAuraModalProps) {
  const archetype = getArchetype(aura.archetype);
  const c1 = aura.color_primary;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl p-6 pb-10 animate-popIn"
        style={{
          background: `linear-gradient(160deg, ${c1}0C, #1a1918 50%)`,
          border: `1px solid ${c1}15`,
          borderBottom: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-muted-2 hover:text-text transition-colors text-xl"
        >
          &times;
        </button>

        <div className="flex items-start gap-4">
          {/* Mini character */}
          <div className="w-14 h-16 shrink-0">
            <CharacterIllustration
              archetype={aura.archetype}
              c1={c1}
              c2={aura.color_secondary}
              c3={aura.color_tertiary}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-text font-medium text-base">{name}</p>
              {isLeader && <span className="text-xs">👑</span>}
            </div>
            {isLeader && (
              <p className="text-muted-3 text-[10px] font-mono tracking-wider uppercase">Tribe Leader</p>
            )}
            <p
              className="font-display text-sm font-semibold mb-1"
              style={{ color: c1 }}
            >
              {archetype?.name}
            </p>
            <p className="text-muted-1 text-xs leading-relaxed mb-3">
              {aura.bio}
            </p>

            {/* Strengths */}
            <div className="flex flex-wrap gap-1.5">
              {aura.strengths.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-[10px]"
                  style={{
                    background: `${c1}14`,
                    border: `1px solid ${c1}20`,
                    color: c1,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {onViewFull && (
          <button
            onClick={onViewFull}
            className="mt-5 text-accent text-sm font-medium hover:underline w-full text-center"
          >
            View Full Aura →
          </button>
        )}
      </div>
    </div>
  );
}
