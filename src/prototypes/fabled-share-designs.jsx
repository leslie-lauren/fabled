import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
`;

const AURA = {
  archetype: "The Oracle",
  colorPrimary: "#8B6AD4",
  colorSecondary: "#C8A0E8",
  colorTertiary: "#4A3A6A",
  bio: "You read like someone conducting an internal archaeology dig, excavating meaning from every page.",
  strengths: ["Meaning excavator", "Pattern synthesizer", "Wisdom seeker"],
  roast: "You've never read a book without immediately texting someone a quote from it.",
  bookScope: "Klara and the Sun by Kazuo Ishiguro",
  spiritBook: "Siddhartha by Hermann Hesse",
  prediction2036: "Reading AI-generated philosophical texts that mirror your exact existential crises back to you.",
  axes: { heartVsHead: 3, plotVsProse: 4, familiarVsFrontier: 2, lightVsDark: 4, realVsImagined: 3 },
};

function OracleChar({ size = 100 }) {
  const c1 = "#8B6AD4", c2 = "#C8A0E8", c3 = "#4A3A6A";
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size * 1.17, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="o1"><stop offset="0%" stopColor={c2} stopOpacity="0.35"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="o2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.8"/><stop offset="100%" stopColor={c3} stopOpacity="0.45"/></linearGradient>
      </defs>
      <circle cx="120" cy="150" r="80" fill={c1} opacity="0.03"/>
      <path d="M100,140 Q94,130 104,122 Q114,114 120,112 Q126,114 136,122 Q146,130 140,140 L148,210 Q150,230 146,242 Q138,248 120,248 Q102,246 94,242 Q90,230 92,210 Z" fill="url(#o2)"/>
      <path d="M100,158 Q90,150 84,142 Q82,136 84,132" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <path d="M140,158 Q150,150 156,142 Q158,136 156,132" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <circle cx="120" cy="115" r="24" fill="url(#o1)"/>
      <circle cx="120" cy="115" r="14" fill={c2} opacity="0.1"/>
      <circle cx="120" cy="115" r="6" fill={c2} opacity="0.2"/>
      <circle cx="120" cy="96" r="16" fill={c1} opacity="0.85"/>
      <path d="M107,94 Q105,82 112,75 Q117,70 120,68 Q123,70 128,75 Q135,82 133,94" fill={c3} opacity="0.5"/>
      <circle cx="115" cy="95" r="2.2" fill="#111010"/>
      <circle cx="125" cy="95" r="2.2" fill="#111010"/>
      <circle cx="115" cy="95" r="1.3" fill={c2} opacity="0.6"/>
      <circle cx="125" cy="95" r="1.3" fill={c2} opacity="0.6"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   DESIGN A: "The Tarot Card"
   All 4 bonus items as elegant quadrants
   ═══════════════════════════════════════════ */
function DesignA({ aura, tribeCode }) {
  const c1 = aura.colorPrimary, c2 = aura.colorSecondary, c3 = aura.colorTertiary;
  return (
    <div style={{
      width: 300, height: 533, borderRadius: 20, overflow: "hidden",
      position: "relative", boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
    }}>
      {/* BG */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, ${c1}DD 0%, ${c3}BB 20%, #0D0B10 45%, #0D0B10 65%, ${c3}99 85%, ${c2}77 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 10%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(ellipse at 60% 90%, rgba(255,255,255,0.06) 0%, transparent 40%)" }} />
      {/* Decorative border lines */}
      <div style={{ position: "absolute", inset: 16, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", padding: "22px 20px 16px" }}>
        {/* Header */}
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 4px", textAlign: "center" }}>My Reading Aura</p>

        {/* Character */}
        <OracleChar size={85} />

        {/* Name */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#F5F0E8", textAlign: "center", margin: "-2px 0 4px", lineHeight: 1.05, textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>{aura.archetype}</h2>

        {/* Bio */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "rgba(245,240,232,0.6)", textAlign: "center", lineHeight: 1.5, margin: "0 0 8px", padding: "0 8px" }}>{aura.bio}</p>

        {/* Strengths */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
          {aura.strengths.map((s, i) => (
            <span key={i} style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(245,240,232,0.8)", fontSize: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{s}</span>
          ))}
        </div>

        {/* 4 Bonus Items - 2x2 Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[
            { emoji: "🔥", label: "ROAST", text: `"${aura.roast}"`, italic: true },
            { emoji: "✨", label: "BOOK-SCOPE", text: aura.bookScope, italic: false },
            { emoji: "🧚", label: "SPIRIT BOOK", text: aura.spiritBook, italic: false },
            { emoji: "🔮", label: "2036", text: aura.prediction2036, italic: false },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10, padding: "8px 7px", textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <p style={{ fontSize: 12, margin: "0 0 2px" }}>{item.emoji}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 5.5, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", margin: "0 0 4px" }}>{item.label}</p>
              <p style={{
                fontFamily: item.italic ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
                fontSize: item.italic ? 8 : 7.5,
                fontStyle: "italic", color: "rgba(245,240,232,0.7)", lineHeight: 1.4, margin: 0,
              }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* CTA */}
        <div style={{ background: "rgba(196,149,106,0.12)", border: "1px solid rgba(196,149,106,0.2)", borderRadius: 10, padding: "8px 12px", textAlign: "center", marginBottom: 5 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 600, color: "rgba(245,240,232,0.9)", margin: "0 0 2px" }}>What's your reading aura?</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, color: "rgba(196,149,106,0.7)", margin: 0 }}>join-fabled.vercel.app</p>
        </div>
        {tribeCode && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "5px 10px", textAlign: "center", marginBottom: 5 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>Join my tribe: <span style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>{tribeCode}</span></p>
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 10, color: "rgba(255,255,255,0.18)", margin: 0, letterSpacing: "0.08em" }}>fabled</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 5.5, color: "rgba(255,255,255,0.1)", margin: "1px 0 0", fontStyle: "italic" }}>a whimsical book club</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DESIGN B: "The Scroll"
   Vertical flow, roast as hero, rest stacked
   ═══════════════════════════════════════════ */
function DesignB({ aura, tribeCode }) {
  const c1 = aura.colorPrimary, c2 = aura.colorSecondary, c3 = aura.colorTertiary;
  return (
    <div style={{
      width: 300, height: 533, borderRadius: 20, overflow: "hidden",
      position: "relative", boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${c1}CC 0%, ${c3}AA 15%, #0D0B10 40%, #0D0B10 70%, ${c2}44 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.15) 0%, transparent 35%)" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", padding: "24px 22px 16px" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px", textAlign: "center" }}>My Reading Aura</p>

        <OracleChar size={75} />

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#F5F0E8", textAlign: "center", margin: "0 0 10px", lineHeight: 1.05, textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>{aura.archetype}</h2>

        {/* Strengths as a single line */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.45)", textAlign: "center", margin: "0 0 14px", letterSpacing: "0.03em" }}>
          {aura.strengths.join("  ·  ")}
        </p>

        {/* Hero roast - the star of this design */}
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "16px 14px", textAlign: "center", marginBottom: 10,
        }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 6, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", margin: "0 0 6px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <span style={{ fontSize: 10 }}>🔥</span> ROAST
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: "italic", color: "rgba(245,240,232,0.85)", lineHeight: 1.55, margin: 0 }}>"{aura.roast}"</p>
        </div>

        {/* Three smaller items in a row */}
        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
          {[
            { emoji: "✨", label: "NEXT READ", text: aura.bookScope },
            { emoji: "🧚", label: "SPIRIT BOOK", text: aura.spiritBook },
            { emoji: "🔮", label: "2036", text: aura.prediction2036 },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "7px 5px", textAlign: "center",
            }}>
              <p style={{ fontSize: 10, margin: "0 0 2px" }}>{item.emoji}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 4.5, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", margin: "0 0 3px" }}>{item.label}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7, fontStyle: "italic", color: "rgba(245,240,232,0.6)", lineHeight: 1.35, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ background: "rgba(196,149,106,0.12)", border: "1px solid rgba(196,149,106,0.2)", borderRadius: 10, padding: "8px 12px", textAlign: "center", marginBottom: 5 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 600, color: "rgba(245,240,232,0.9)", margin: "0 0 2px" }}>What's your reading aura?</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, color: "rgba(196,149,106,0.7)", margin: 0 }}>join-fabled.vercel.app</p>
        </div>
        {tribeCode && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "5px 10px", textAlign: "center", marginBottom: 5 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>Join my tribe: <span style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>{tribeCode}</span></p>
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 10, color: "rgba(255,255,255,0.18)", margin: 0, letterSpacing: "0.08em" }}>fabled</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 5.5, color: "rgba(255,255,255,0.1)", margin: "1px 0 0", fontStyle: "italic" }}>a whimsical book club</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DESIGN C: "The Identity Card"
   Clean, editorial, dimensions as visual
   ═══════════════════════════════════════════ */
function DesignC({ aura, tribeCode }) {
  const c1 = aura.colorPrimary, c2 = aura.colorSecondary, c3 = aura.colorTertiary;
  const axes = [
    ["Heart", "Head", aura.axes.heartVsHead],
    ["Plot", "Prose", aura.axes.plotVsProse],
    ["Familiar", "Frontier", aura.axes.familiarVsFrontier],
    ["Light", "Dark", aura.axes.lightVsDark],
    ["Real", "Imagined", aura.axes.realVsImagined],
  ];
  return (
    <div style={{
      width: 300, height: 533, borderRadius: 20, overflow: "hidden",
      position: "relative", boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(155deg, #0D0B10 0%, ${c3}44 30%, #0D0B10 50%, ${c1}33 70%, #0D0B10 100%)` }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: `linear-gradient(180deg, ${c1}99, transparent)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.1) 0%, transparent 40%)" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", padding: "20px 22px 16px" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 4px", textAlign: "center" }}>My Reading Aura</p>

        <OracleChar size={80} />

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#F5F0E8", textAlign: "center", margin: "0 0 4px", lineHeight: 1.05 }}>{aura.archetype}</h2>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "rgba(245,240,232,0.55)", textAlign: "center", lineHeight: 1.5, margin: "0 0 10px", padding: "0 6px" }}>{aura.bio}</p>

        {/* Dimensions as the visual centerpiece */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "12px 14px", marginBottom: 8,
        }}>
          {axes.map(([left, right, val], i) => (
            <div key={i} style={{ marginBottom: i < axes.length - 1 ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 7, fontFamily: "'DM Sans', sans-serif", fontWeight: val <= 2 ? 600 : 400, color: val <= 2 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>{left}</span>
                <span style={{ fontSize: 7, fontFamily: "'DM Sans', sans-serif", fontWeight: val >= 4 ? 600 : 400, color: val >= 4 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>{right}</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, position: "relative" }}>
                <div style={{
                  position: "absolute", left: `${((val - 1) / 4) * 100}%`, top: "50%",
                  transform: "translate(-50%, -50%)", width: 8, height: 8, borderRadius: "50%",
                  background: c2, opacity: 0.7, boxShadow: `0 0 8px ${c2}50`,
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Roast as a pull quote */}
        <div style={{ textAlign: "center", marginBottom: 8, padding: "0 4px" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, fontStyle: "italic", color: "rgba(245,240,232,0.7)", lineHeight: 1.5, margin: 0 }}>
            🔥 "{aura.roast}"
          </p>
        </div>

        {/* Spirit Book + 2036 side by side */}
        <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 5, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", margin: "0 0 3px" }}>🧚 SPIRIT BOOK</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 8.5, fontStyle: "italic", color: "rgba(245,240,232,0.65)", margin: 0, lineHeight: 1.35 }}>{aura.spiritBook}</p>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 5, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", margin: "0 0 3px" }}>🔮 2036</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, fontStyle: "italic", color: "rgba(245,240,232,0.6)", margin: 0, lineHeight: 1.35 }}>{aura.prediction2036}</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ background: "rgba(196,149,106,0.12)", border: "1px solid rgba(196,149,106,0.2)", borderRadius: 10, padding: "8px 12px", textAlign: "center", marginBottom: 5 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 600, color: "rgba(245,240,232,0.9)", margin: "0 0 2px" }}>What's your reading aura?</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, color: "rgba(196,149,106,0.7)", margin: 0 }}>join-fabled.vercel.app</p>
        </div>
        {tribeCode && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "5px 10px", textAlign: "center", marginBottom: 5 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>Join my tribe: <span style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>{tribeCode}</span></p>
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 10, color: "rgba(255,255,255,0.18)", margin: 0, letterSpacing: "0.08em" }}>fabled</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 5.5, color: "rgba(255,255,255,0.1)", margin: "1px 0 0", fontStyle: "italic" }}>a whimsical book club</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
export default function ShareCardDesigns() {
  const [active, setActive] = useState("A");

  const designs = { A: "The Tarot Card", B: "The Scroll", C: "The Identity Card" };
  const descriptions = {
    A: "All 4 bonus items in a clean 2x2 grid. Balanced, scannable, nothing hidden.",
    B: "Roast as the hero moment (it's the most shareable). Book-Scope, Spirit Book, and 2036 as a supporting trio below.",
    C: "Reading dimensions as the visual centerpiece. Roast as a pull quote. Spirit Book and 2036 as a subtle split footer. More editorial, less playful.",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B10", padding: "24px 16px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#F5F0E8", fontWeight: 700, marginBottom: 4 }}>Share Card Designs</h1>
          <p style={{ color: "#7A756D", fontSize: 13 }}>Three static designs, no animation. All IG Story ready (9:16).</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          {Object.entries(designs).map(([key, name]) => (
            <button key={key} onClick={() => setActive(key)} style={{
              padding: "8px 16px", borderRadius: 10,
              background: active === key ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${active === key ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
              color: active === key ? "#F5F0E8" : "#5A564F",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>{key}: {name}</button>
          ))}
        </div>

        <p style={{ color: "#9B958A", fontSize: 12, textAlign: "center", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px", lineHeight: 1.5 }}>
          {descriptions[active]}
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {active === "A" && <DesignA aura={AURA} tribeCode="JC67ZV" />}
          {active === "B" && <DesignB aura={AURA} tribeCode="JC67ZV" />}
          {active === "C" && <DesignC aura={AURA} tribeCode="JC67ZV" />}
        </div>
      </div>
    </div>
  );
}
