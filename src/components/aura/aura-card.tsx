"use client";

import { useState, useRef } from "react";
import type { Aura } from "@/lib/types";
import { getArchetype } from "@/data/archetypes";
import AxisBar from "./axis-bar";
import AxesInfoModal from "./axes-info-modal";
import CharacterIllustration from "../characters";

const AXES_META = [
  { key: "heartVsHead" as const, left: "Heart", right: "Head" },
  { key: "plotVsProse" as const, left: "Plot", right: "Prose" },
  { key: "familiarVsFrontier" as const, left: "Familiar", right: "Frontier" },
  { key: "lightVsDark" as const, left: "Light", right: "Dark" },
  { key: "realVsImagined" as const, left: "Real", right: "Imagined" },
];

const MONTH_NAME = new Date().toLocaleString("default", { month: "long" });

const BONUS_CARDS = [
  { key: "bookScope", emoji: "✨", label: `${MONTH_NAME} Book-Scope`, fullLabel: `${MONTH_NAME.toUpperCase()} BOOK-SCOPE` },
  { key: "spiritBook", emoji: "🧚", label: "Soul Read", fullLabel: "SOUL READ" },
  { key: "roast", emoji: "🚩", label: "Reading Red Flag", fullLabel: "READING RED FLAG" },
  { key: "prediction2036", emoji: "🔮", label: "Your Epilogue", fullLabel: "YOUR EPILOGUE" },
] as const;

interface AuraCardProps {
  aura: Aura;
  showRegenerate?: boolean;
  onRegenerate?: () => void;
}

export default function AuraCard({ aura, showRegenerate, onRegenerate }: AuraCardProps) {
  const [showAxesInfo, setShowAxesInfo] = useState(false);
  const [bonusIndex, setBonusIndex] = useState(0);
  const touchRef = useRef<number | null>(null);

  const archetype = getArchetype(aura.archetype);
  const c1 = aura.color_primary;
  const c2 = aura.color_secondary;
  const c3 = aura.color_tertiary;

  const bonusFieldMap: Record<string, string> = {
    bookScope: aura.book_scope,
    roast: aura.roast,
    spiritBook: aura.spirit_book,
    prediction2036: aura.prediction_2036,
  };

  const nextBonus = () => setBonusIndex((i) => Math.min(i + 1, BONUS_CARDS.length - 1));
  const prevBonus = () => setBonusIndex((i) => Math.max(i - 1, 0));

  return (
    <div
      className="card animate-cardReveal"
      style={{
        background: `linear-gradient(160deg, ${c1}0C, #141312 40%, ${c2}08)`,
        border: `1px solid ${c1}20`,
      }}
    >
      {/* 1. Character Illustration */}
      <div className="flex justify-center mb-4">
        <div className="w-[180px] h-[210px]">
          <CharacterIllustration
            archetype={aura.archetype}
            c1={c1}
            c2={c2}
            c3={c3}
          />
        </div>
      </div>

      {/* 2. Archetype Name */}
      <h2
        className="font-display text-3xl font-bold text-center mb-3"
        style={{ color: c1 }}
      >
        {archetype?.name || aura.archetype}
      </h2>

      {/* 3. Bio */}
      <p className="font-display text-sm italic text-center leading-relaxed mb-5 px-3" style={{ color: "#9B958A" }}>
        {aura.bio}
      </p>

      {/* 4. Strengths */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {aura.strengths.map((s, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${c1}12`,
              border: `1px solid ${c1}20`,
              color: c1,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* 5. Reading Dimensions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="label-mono">Reading Dimensions</p>
          <button
            onClick={() => setShowAxesInfo(true)}
            className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] cursor-pointer transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#5A564F", fontFamily: "'DM Sans', sans-serif" }}
          >
            i
          </button>
        </div>

        {/* Personalized dimensions summary */}
        {aura.dimensions_summary && (
          <div
            className="rounded-xl px-3.5 py-3 mb-4 text-xs leading-relaxed"
            style={{
              background: `${c1}08`,
              border: `1px solid ${c1}10`,
              color: "#9B958A",
            }}
          >
            {aura.dimensions_summary}
          </div>
        )}

        {AXES_META.map((axis) => (
          <AxisBar
            key={axis.key}
            label=""
            leftLabel={axis.left}
            rightLabel={axis.right}
            value={aura.axes[axis.key]}
            color={c1}
          />
        ))}
      </div>

      {/* 6. Story Spirits Noticed */}
      <div className="mb-6 text-center px-2">
        <p className="label-mono mb-2.5" style={{ color: "#5A564F" }}>
          ✦ The Story Spirits Noticed
        </p>
        <p className="font-display text-sm italic leading-relaxed" style={{ color: "#B8B2A8" }}>
          &ldquo;{aura.superlative}&rdquo;
        </p>
      </div>

      {/* 7. Compatibility */}
      {archetype && (
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <div
            className="rounded-xl p-3 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: "linear-gradient(90deg, #C47A5A, #E8A888)" }} />
            <p className="label-mono text-[9px] mt-0.5 mb-1.5" style={{ color: "#5A564F" }}>Best Match</p>
            <p className="font-display text-sm font-semibold mb-1" style={{ color: "#E8E2D8" }}>
              {getArchetype(archetype.compatibility.bestMatch)?.name}
            </p>
            <p className="text-xs italic leading-relaxed" style={{ color: "#7A756D" }}>
              {archetype.compatibility.bestDescription}
            </p>
          </div>
          <div
            className="rounded-xl p-3 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: "linear-gradient(90deg, #5A7B8B, #88B8D4)" }} />
            <p className="label-mono text-[9px] mt-0.5 mb-1.5" style={{ color: "#5A564F" }}>Creative Tension</p>
            <p className="font-display text-sm font-semibold mb-1" style={{ color: "#E8E2D8" }}>
              {getArchetype(archetype.compatibility.tension)?.name}
            </p>
            <p className="text-xs italic leading-relaxed" style={{ color: "#7A756D" }}>
              {archetype.compatibility.tensionDescription}
            </p>
          </div>
        </div>
      )}

      {/* 8. Bonus Cards with fade animation */}
      <div className="mb-6">
        {/* Tab bar */}
        <div className="flex gap-1 mb-3 overflow-x-auto no-scrollbar">
          {BONUS_CARDS.map((card, i) => (
            <button
              key={card.key}
              onClick={() => setBonusIndex(i)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all duration-200 shrink-0"
              style={{
                background: i === bonusIndex ? `${c1}15` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === bonusIndex ? `${c1}25` : "rgba(255,255,255,0.05)"}`,
                color: i === bonusIndex ? "#E8E2D8" : "#5A564F",
              }}
            >
              <span>{card.emoji}</span>
              <span>{card.label}</span>
            </button>
          ))}
        </div>

        {/* Card with fade animation */}
        <div
          className="relative min-h-[120px]"
          onTouchStart={(e) => { touchRef.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchRef.current === null) return;
            const d = touchRef.current - e.changedTouches[0].clientX;
            if (Math.abs(d) > 40) { d > 0 ? nextBonus() : prevBonus(); }
            touchRef.current = null;
          }}
        >
          {BONUS_CARDS.map((card, i) => (
            <div
              key={card.key}
              className="rounded-xl p-5 flex flex-col items-center justify-center text-center transition-opacity duration-300"
              style={{
                background: `linear-gradient(145deg, ${c1}0A, rgba(255,255,255,0.02))`,
                border: `1px solid ${c1}12`,
                minHeight: 120,
                display: i === bonusIndex ? "flex" : "none",
                animation: i === bonusIndex ? "fadeInUp 0.3s ease-out" : undefined,
              }}
            >
              <p className="text-2xl mb-1.5">{card.emoji}</p>
              <p
                className="font-mono text-[9px] tracking-[0.1em] uppercase mb-2.5"
                style={{ color: c1, opacity: 0.7 }}
              >
                {card.fullLabel}
              </p>
              <p
                className={`text-sm font-light leading-relaxed ${
                  card.key === "spiritBook"
                    ? "font-display italic"
                    : ""
                }`}
                style={{ color: "#C8C2B8" }}
              >
                {bonusFieldMap[card.key]}
              </p>
            </div>
          ))}
        </div>

        {/* Progress dots + swipe hint */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          <div className="flex gap-1">
            {BONUS_CARDS.map((_, i) => (
              <div
                key={i}
                onClick={() => setBonusIndex(i)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === bonusIndex ? 16 : 6,
                  height: 6,
                  background: i === bonusIndex ? `${c1}70` : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
          {bonusIndex < BONUS_CARDS.length - 1 && (
            <span className="text-[10px] italic" style={{ color: "#3A363F" }}>swipe →</span>
          )}
        </div>
      </div>

      {/* 9. Footer */}
      <p className="label-mono text-center text-[9px] tracking-[0.2em] text-muted-3">
        READING AURA ✦ 2026
      </p>

      {/* Regenerate (shown below Share on the page, not inside card) */}
      {showRegenerate && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="w-full mt-6 py-3.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#7A756D" }}
        >
          Regenerate My Aura
        </button>
      )}

      {showAxesInfo && <AxesInfoModal onClose={() => setShowAxesInfo(false)} />}
    </div>
  );
}
