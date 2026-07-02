import type { Aura } from "@/lib/types";
import { getArchetype } from "@/data/archetypes";
import CharacterIllustration from "@/components/characters";

interface ShareCardProps {
  aura: Aura;
  tribeCode?: string | null;
}

/**
 * The Share My Aura card. Single source of truth — renders at a FIXED
 * 1080×1920 pixels. Used for both:
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
    { emoji: "✨", label: `${monthName} BOOK-SCOPE`, text: aura.book_scope || "", clamp: 3 },
    { emoji: "🧚", label: "SOUL READ", text: aura.spirit_book || "", clamp: 2 },
    { emoji: "🚩", label: "READING RED FLAG", text: aura.roast || "", clamp: 3 },
    { emoji: "🔮", label: "YOUR EPILOGUE", text: aura.prediction_2036 || "", clamp: 3 },
  ];

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        color: "#F5F0E8",
        flexShrink: 0,
      }}
    >
      {/* Gradient bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(170deg, ${c1}DD 0%, ${c3}BB 20%, #0D0B10 45%, #0D0B10 65%, ${c3}99 85%, ${c2}77 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 40% 10%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(ellipse at 60% 90%, rgba(255,255,255,0.06) 0%, transparent 40%)",
        }}
      />
      {/* Inner border */}
      <div
        style={{
          position: "absolute",
          top: 38,
          left: 38,
          right: 38,
          bottom: 38,
          border: "3px solid rgba(255,255,255,0.06)",
          borderRadius: 44,
          pointerEvents: "none",
        }}
      />

      {/* Content container */}
      <div style={{ position: "relative", zIndex: 1, padding: "50px 50px 40px" }}>
        {/* 'MY READING AURA' header */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          MY READING AURA
        </div>

        {/* Character */}
        <div style={{ width: 200, height: 234, margin: "0 auto 20px" }}>
          <CharacterIllustration archetype={aura.archetype} c1={c1} c2={c2} c3={c3} />
        </div>

        {/* Archetype Name */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 80,
            fontWeight: 700,
            color: "#F5F0E8",
            lineHeight: 1.05,
            textAlign: "center",
            marginBottom: 20,
            textShadow: "0 4px 22px rgba(0,0,0,0.4)",
          }}
        >
          {archetype?.name || aura.archetype}
        </div>

        {/* Bio — 2 lines max */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 24,
            color: "rgba(245,240,232,0.65)",
            lineHeight: 1.5,
            textAlign: "center",
            marginBottom: 28,
            padding: "0 20px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {aura.bio}
        </div>

        {/* Strength pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          {aura.strengths.map((str, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 24px",
                borderRadius: 60,
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.12)",
                color: "rgba(245,240,232,0.85)",
                fontSize: 20,
                fontFamily: "'DM Sans', sans-serif",
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
            gap: 16,
            marginBottom: 28,
          }}
        >
          {bonusGrid.map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "2px solid rgba(255,255,255,0.07)",
                borderRadius: 28,
                padding: 20,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 6 }}>{item.emoji}</div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 22,
                  fontStyle: "italic",
                  color: "rgba(245,240,232,0.75)",
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: item.clamp,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Gold CTA */}
        <div
          style={{
            background: "rgba(196,149,106,0.12)",
            border: "2px solid rgba(196,149,106,0.22)",
            borderRadius: 28,
            padding: "24px 32px",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 34,
              fontWeight: 700,
              color: "rgba(245,240,232,0.92)",
              marginBottom: 8,
            }}
          >
            What&apos;s your reading aura?
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 20,
              color: "rgba(196,149,106,0.8)",
            }}
          >
            join-fabled.vercel.app
          </div>
        </div>

        {/* Tribe invite (show only if code provided) */}
        {tribeCode && (
          <div
            style={{
              textAlign: "center",
              background: "rgba(255,255,255,0.03)",
              border: "2px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "14px 24px",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Join my tribe:{" "}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 22,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
              }}
            >
              {tribeCode}
            </span>
          </div>
        )}

        {/* Branding footer */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            fabled
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.12)",
              fontStyle: "italic",
              marginTop: 4,
            }}
          >
            a whimsical book club
          </div>
        </div>
      </div>
    </div>
  );
}
