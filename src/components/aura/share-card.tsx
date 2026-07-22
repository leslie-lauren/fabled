import type { Aura } from "@/lib/types";
import { getArchetype } from "@/data/archetypes";
import CharacterIllustration from "@/components/characters";

interface ShareCardProps {
  aura: Aura;
  tribeCode?: string | null;
}

/**
 * The Share My Aura card. Single source of truth — renders at a FIXED
 * 1080×1920 pixels (Instagram story size). Used for both:
 * - the on-screen preview (wrap in a div with transform: scale(0.315))
 * - the html2canvas capture (use as-is for a 1080×1920 PNG)
 *
 * All font sizes, padding, and margins here are tuned for the full 1080×1920
 * resolution. Do NOT scale values inside this component.
 */
export default function ShareCard({ aura, tribeCode }: ShareCardProps) {
  const c1 = aura.color_primary;
  const c2 = aura.color_secondary;
  const c3 = aura.color_tertiary;
  const archetype = getArchetype(aura.archetype);
  const monthName = new Date().toLocaleString("default", { month: "long" }).toUpperCase();

  const bonusGrid = [
    { emoji: "✨", label: `${monthName} BOOK-SCOPE`, text: aura.book_scope || "" },
    { emoji: "🧚", label: "SOUL READ", text: aura.spirit_book || "" },
    { emoji: "🚩", label: "READING RED FLAG", text: aura.roast || "" },
    { emoji: "🔮", label: "YOUR EPILOGUE", text: aura.prediction_2036 || "" },
  ];

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-body)",
        color: "#F5F0E8",
        flexShrink: 0,
      }}
    >
      {/* Gradient bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(170deg, ${c1}DD 0%, ${c3}BB 18%, #0D0B10 42%, #0D0B10 68%, ${c3}99 88%, ${c2}77 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 12%, rgba(255,255,255,0.14) 0%, transparent 48%), radial-gradient(ellipse at 50% 92%, rgba(255,255,255,0.07) 0%, transparent 42%)",
        }}
      />

      {/* Content container — flex column filling the full 1920px */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 60px 56px",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 26,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
          }}
        >
          ✦ My Reading Aura ✦
        </div>

        {/* Character hero */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 640,
              height: 640,
              background: `radial-gradient(circle, ${c1}55 0%, transparent 65%)`,
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 330,
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CharacterIllustration archetype={aura.archetype} c1={c1} c2={c2} c3={c3} />
          </div>
        </div>

        {/* Archetype name + bio */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 104,
              fontWeight: 700,
              color: "#F5F0E8",
              lineHeight: 1.05,
              textShadow: "0 6px 28px rgba(0,0,0,0.45)",
              marginBottom: 24,
            }}
          >
            {archetype?.name || aura.archetype}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "rgba(245,240,232,0.78)",
              lineHeight: 1.45,
              padding: "0 40px",
            }}
          >
            {aura.bio}
          </div>
        </div>

        {/* Strength pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {aura.strengths.map((str, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 34px",
                borderRadius: 60,
                background: "rgba(255,255,255,0.09)",
                border: "2px solid rgba(255,255,255,0.16)",
                color: "rgba(245,240,232,0.9)",
                fontSize: 27,
                fontWeight: 500,
                whiteSpace: "nowrap",
                lineHeight: 1.4,
              }}
            >
              {str}
            </span>
          ))}
        </div>

        {/* 2x2 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {bonusGrid.map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.09)",
                borderRadius: 32,
                padding: "26px 28px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8, lineHeight: 1 }}>{item.emoji}</div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 17,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 27,
                  color: "rgba(245,240,232,0.85)",
                  lineHeight: 1.35,
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Gold CTA — the conversion moment */}
        <div
          style={{
            background: "linear-gradient(135deg, #EBBE85 0%, #D9A06B 55%, #C4885A 100%)",
            borderRadius: 32,
            padding: "34px 40px",
            textAlign: "center",
            boxShadow: "0 12px 44px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 46,
              fontWeight: 700,
              color: "#211508",
              marginBottom: 8,
            }}
          >
            What&apos;s your reading aura?
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: 600,
              color: "rgba(33,21,8,0.75)",
              letterSpacing: "0.02em",
            }}
          >
            {tribeCode ? (
              <>join my tribe · code {tribeCode} · join-fabled.vercel.app</>
            ) : (
              <>find yours at join-fabled.vercel.app</>
            )}
          </div>
        </div>

        {/* Branding footer */}
        <div
          style={{
            textAlign: "center",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
            }}
          >
            fabled
          </span>
          <span
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            a whimsical book club
          </span>
        </div>
      </div>
    </div>
  );
}
