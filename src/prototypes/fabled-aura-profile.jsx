import { useState, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
`;

const ACCENT = "#C4956A";

const AURA = {
  archetype: "The Oracle",
  colorPrimary: "#8B6AD4",
  colorSecondary: "#C8A0E8",
  colorTertiary: "#4A3A6A",
  bio: "You read like someone conducting an internal archaeology dig, excavating meaning from every page. Your bookshelf isn't entertainment — it's a toolkit for becoming who you're meant to be.",
  strengths: ["Meaning excavator", "Pattern synthesizer", "Wisdom seeker"],
  axes: [
    ["Heart", "Head", 3],
    ["Plot", "Prose", 4],
    ["Familiar", "Frontier", 2],
    ["Light", "Dark", 4],
    ["Real", "Imagined", 3],
  ],
  superlative: "Every single one of your picks wrestles with what it means to be conscious.",
  bestMatch: { name: "The Conjurer", desc: "You both read to understand the self" },
  creativeTension: { name: "The Cartographer", desc: "They want new worlds; you want this one, examined" },
};

const BOOKS_I_LOVE = [
  { title: "Project Hail Mary", author: "Andy Weir" },
  { title: "Three Body Problem", author: "Cixin Liu" },
  { title: "The Alchemist", author: "Paulo Coelho" },
  { title: "When Breath Becomes Air", author: "Paul Kalanithi" },
  { title: "Letters to a Young Poet", author: "Rainer Maria Rilke" },
  { title: "Influence", author: "Robert Cialdini" },
];

const TRIBE_READS = [
  { title: "Recursion", author: "Blake Crouch", tribe: "luna's tribe" },
  { title: "Station Eleven", author: "Emily St. John Mandel", tribe: "Lore Whores" },
  { title: "Circe", author: "Madeline Miller", tribe: "luna's tribe" },
];

function OracleCharacter({ c1, c2, c3, size = 120 }) {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="aoOrb"><stop offset="0%" stopColor={c2} stopOpacity="0.35"/><stop offset="60%" stopColor={c2} stopOpacity="0.1"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="aoRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.75"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="130" r="90" fill={c1} opacity="0.04"/>
      <path d="M98,130 Q92,120 102,112 Q112,104 120,102 Q128,104 138,112 Q148,120 142,130 L152,200 Q154,220 148,232 Q138,240 120,240 Q102,238 92,232 Q86,220 88,200 Z" fill="url(#aoRobe)"/>
      <path d="M98,150 Q88,143 82,133 Q80,127 82,123" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <path d="M142,150 Q152,143 158,133 Q160,127 158,123" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <circle cx="120" cy="105" r="28" fill="url(#aoOrb)"/>
      <circle cx="120" cy="105" r="18" fill={c2} opacity="0.08"/>
      <circle cx="120" cy="105" r="12" fill={c2} opacity="0.12"/>
      <circle cx="120" cy="105" r="5" fill={c2} opacity="0.25"/>
      <circle cx="120" cy="85" r="15" fill={c1} opacity="0.85"/>
      <path d="M105,83 Q103,70 110,63 Q116,58 120,56 Q124,58 130,63 Q137,70 135,83" fill={c3} opacity="0.5"/>
      <circle cx="114" cy="84" r="2.5" fill="#111010"/>
      <circle cx="126" cy="84" r="2.5" fill="#111010"/>
      <circle cx="114" cy="84" r="1.5" fill={c2} opacity="0.6"/>
      <circle cx="126" cy="84" r="1.5" fill={c2} opacity="0.6"/>
    </svg>
  );
}

function BookRow({ books, c1, c2, label }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#7A756D",
        fontWeight: 500, margin: "0 0 10px",
      }}>{label}</p>
      <div style={{
        display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6,
        scrollSnapType: "x mandatory", msOverflowStyle: "none", scrollbarWidth: "none",
      }}>
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {books.map((book, i) => (
          <div key={i} style={{
            scrollSnapAlign: "start",
            minWidth: 120, maxWidth: 120,
            background: `linear-gradient(155deg, ${c1}18, ${c1}08)`,
            border: `1px solid ${c1}15`,
            borderRadius: 10, padding: "14px 10px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: 130, position: "relative", overflow: "hidden", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
              background: `linear-gradient(to bottom, ${c1}40, ${c2}20)`,
              borderRadius: "10px 0 0 10px",
            }} />
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 600,
              color: "#E8E2D8", lineHeight: 1.35, margin: 0, paddingLeft: 6,
            }}>{book.title}</p>
            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#7A756D",
                margin: "6px 0 0", paddingLeft: 6, fontStyle: "italic",
              }}>{book.author}</p>
              {book.tribe && (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 8, color: "#5A564F",
                  margin: "4px 0 0", paddingLeft: 6,
                }}>{book.tribe}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {books.length > 3 && (
        <p style={{ color: "#4A463F", fontSize: 10, textAlign: "right", fontStyle: "italic", margin: "4px 0 0" }}>
          Swipe to see more →
        </p>
      )}
    </div>
  );
}

function BonusCards({ c1 }) {
  const [active, setActive] = useState(0);
  const touchRef = useRef(null);
  const cards = [
    { emoji: "✨", label: "Book-Scope", title: "THIS MONTH'S BOOK-SCOPE", content: "This month, reach for Klara and the Sun by Kazuo Ishiguro. The Story Spirits sense you need a gentle mirror right now.", serif: false },
    { emoji: "🔥", label: "Roast", title: "ROAST", content: "You've never read a book without immediately texting someone a quote from it.", serif: true },
    { emoji: "🧚", label: "Spirit Book", title: "SPIRIT BOOK", content: "Siddhartha by Hermann Hesse", serif: true },
    { emoji: "🔮", label: "2036", title: "2036 PREDICTION", content: "You'll be reading AI-generated philosophical texts that perfectly mirror your exact existential crises back to you.", serif: false },
  ];

  const next = () => setActive(i => Math.min(i + 1, cards.length - 1));
  const prev = () => setActive(i => Math.max(i - 1, 0));
  const card = cards[active];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", scrollbarWidth: "none" }}>
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {cards.map((c, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap",
            background: i === active ? `${c1}15` : "rgba(255,255,255,0.02)",
            border: `1px solid ${i === active ? `${c1}25` : "rgba(255,255,255,0.05)"}`,
            color: i === active ? "#E8E2D8" : "#5A564F",
            fontSize: 11, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            transition: "all 0.2s",
          }}>{c.emoji} {c.label}</button>
        ))}
      </div>

      {/* Single card with swipe detection */}
      <div
        onTouchStart={e => { touchRef.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (!touchRef.current) return;
          const d = touchRef.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) { d > 0 ? next() : prev(); }
          touchRef.current = null;
        }}
        style={{
          background: `linear-gradient(145deg, ${c1}0A, rgba(255,255,255,0.02))`,
          border: `1px solid ${c1}12`,
          borderRadius: 14, padding: "20px 16px", textAlign: "center",
          minHeight: 120, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <div key={active} style={{ animation: "fadeInUp 0.3s ease-out" }}>
          <p style={{ fontSize: 24, margin: "0 0 6px" }}>{card.emoji}</p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: c1,
            letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px",
            opacity: 0.7,
          }}>{card.title}</p>
          <p style={{
            fontFamily: card.serif ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
            fontSize: card.serif ? 15 : 13,
            fontStyle: "italic", color: "#C8C2B8", lineHeight: 1.6, margin: 0,
          }}>{card.content}</p>
        </div>
      </div>

      {/* Card indicator + swipe hint */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {cards.map((_, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              width: i === active ? 16 : 6, height: 6, borderRadius: 3,
              background: i === active ? `${c1}70` : "rgba(255,255,255,0.1)",
              transition: "all 0.3s", cursor: "pointer",
            }} />
          ))}
        </div>
        {active < cards.length - 1 && (
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#3A363F",
            fontStyle: "italic",
          }}>swipe →</span>
        )}
      </div>
    </div>
  );
}

export default function AuraProfile() {
  const a = AURA;
  const c1 = a.colorPrimary;
  const c2 = a.colorSecondary;
  const c3 = a.colorTertiary;

  return (
    <div style={{ minHeight: "100vh", background: "#111010", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{css}</style>

      {/* Gradient header */}
      <div style={{
        position: "relative", overflow: "hidden", padding: "20px 16px 24px",
        background: `linear-gradient(180deg, ${c1}15 0%, ${c3}08 40%, #111010 100%)`,
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 20%, ${c2}12, transparent 60%)`,
        }} />

        <p style={{ color: "#7A756D", fontSize: 13, margin: "0 0 12px", cursor: "pointer", position: "relative", zIndex: 1 }}>← Home</p>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto" }}>
          <OracleCharacter c1={c1} c2={c2} c3={c3} size={120} />

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700,
            color: c1, textAlign: "center", margin: "4px 0 4px",
          }}>{a.archetype}</h1>

          <p style={{
            fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: "italic",
            color: "#9B958A", textAlign: "center", lineHeight: 1.6, margin: "0 0 14px", padding: "0 12px",
          }}>{a.bio}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            {a.strengths.map((s, i) => (
              <span key={i} style={{
                padding: "5px 12px", borderRadius: 14,
                background: `${c1}12`, border: `1px solid ${c1}20`,
                color: c1, fontSize: 12, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* Reading Dimensions */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5A564F",
              letterSpacing: "0.12em", textTransform: "uppercase", margin: 0,
            }}>Reading Dimensions</p>
            <span onClick={() => {}} style={{
              width: 20, height: 20, borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "#5A564F", fontSize: 11, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>i</span>
          </div>

          {/* Personalized summary */}
          <div style={{
            background: `${c1}08`, border: `1px solid ${c1}10`,
            borderRadius: 12, padding: "12px 14px", marginBottom: 16,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9B958A",
              lineHeight: 1.6, margin: 0,
            }}>
              You lean heavily toward <strong style={{ color: "#E8E2D8" }}>Head</strong> over Heart and <strong style={{ color: "#E8E2D8" }}>Dark</strong> over Light. You gravitate toward prose-forward books that explore unfamiliar territory. Your bookshelf is cerebral, boundary-pushing, and unapologetically heavy.
            </p>
          </div>

          {a.axes.map(([left, right, val], i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: val <= 2 ? 500 : 400, color: val <= 2 ? "#E8E2D8" : "#5A564F" }}>{left}</span>
                <span style={{ fontSize: 12, fontWeight: val >= 4 ? 500 : 400, color: val >= 4 ? "#E8E2D8" : "#5A564F" }}>{right}</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, position: "relative" }}>
                <div style={{
                  position: "absolute", left: `${((val - 1) / 4) * 100}%`, top: "50%",
                  transform: "translate(-50%, -50%)", width: 12, height: 12, borderRadius: 6,
                  background: c1, opacity: 0.7, boxShadow: `0 0 10px ${c1}40`,
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Story Spirits */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5A564F",
            letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px",
          }}>✦ The Story Spirits Noticed</p>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: "italic",
            color: "#B8B2A8", lineHeight: 1.6, margin: 0,
          }}>"{a.superlative}"</p>
        </div>

        {/* Compatibility */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5A564F",
            letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px",
          }}>Compatibility</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
              padding: "14px 12px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #C47A5A, #E8A888)", borderRadius: "14px 14px 0 0" }} />
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5A564F", letterSpacing: "0.1em", textTransform: "uppercase", margin: "2px 0 6px" }}>Best Match</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#E8E2D8", fontWeight: 600, margin: "0 0 4px" }}>{a.bestMatch.name}</p>
              <p style={{ fontSize: 12, color: "#7A756D", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{a.bestMatch.desc}</p>
            </div>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
              padding: "14px 12px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #5A7B8B, #88B8D4)", borderRadius: "14px 14px 0 0" }} />
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5A564F", letterSpacing: "0.1em", textTransform: "uppercase", margin: "2px 0 6px" }}>Creative Tension</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#E8E2D8", fontWeight: 600, margin: "0 0 4px" }}>{a.creativeTension.name}</p>
              <p style={{ fontSize: 12, color: "#7A756D", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{a.creativeTension.desc}</p>
            </div>
          </div>
        </div>

        {/* Bonus Cards */}
        <div style={{ marginBottom: 28 }}>
          <BonusCards c1={c1} />
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0 0 24px" }} />

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto 28px" }}>
          <button style={{
            padding: "14px 24px",
            background: `linear-gradient(135deg, ${ACCENT}, #8B6E4E)`,
            border: "none", borderRadius: 12,
            color: "#F5F0E8", fontSize: 15, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            boxShadow: `0 4px 20px ${ACCENT}25`,
          }}>Share My Aura</button>
          <button style={{
            padding: "14px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
            color: "#7A756D", fontSize: 15, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          }}>Regenerate My Aura</button>
        </div>

        {/* Bookshelf */}
        <div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5A564F",
            letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px",
          }}>My Bookshelf</p>
          <BookRow books={BOOKS_I_LOVE} c1={c1} c2={c2} label="Books I Love" />
          <BookRow books={TRIBE_READS} c1={c1} c2={c2} label="Tribe Reads" />
        </div>

        <p style={{
          textAlign: "center", color: "#3A363F", fontSize: 11, marginTop: 32,
          fontFamily: "'Playfair Display', serif", letterSpacing: "0.08em",
        }}>Reading Aura • 2026</p>
      </div>
    </div>
  );
}
