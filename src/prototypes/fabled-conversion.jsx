import { useState, useRef, useEffect } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeOnly{from{opacity:0}to{opacity:1}}
@keyframes pulseGlow{0%,100%{opacity:.3}50%{opacity:.7}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
`;

const AURA = {
  archetype: "The Oracle",
  colorPrimary: "#8B6AD4",
  colorSecondary: "#C8A0E8",
  colorTertiary: "#4A3A6A",
  bio: "You read like someone conducting an internal archaeology dig, excavating meaning from every page.",
  strengths: ["Meaning excavator", "Pattern synthesizer", "Wisdom seeker"],
  axes: { heartVsHead: 3, plotVsProse: 4, familiarVsFrontier: 2, lightVsDark: 4, realVsImagined: 3 },
  superlative: "Every single one of your picks wrestles with what it means to be conscious. You're not reading for entertainment — you're assembling a philosophy one book at a time.",
  roast: "You've never read a book without immediately texting someone a quote from it.",
  bookScope: "This month, reach for Klara and the Sun by Kazuo Ishiguro.",
  spiritBook: "Siddhartha by Hermann Hesse",
  prediction2036: "You'll be reading AI-generated philosophical texts that perfectly mirror your exact existential crises back to you.",
};

const TRIBE = {
  name: "Lore Whores",
  code: "JC67ZV",
  memberCount: 5,
  sharerName: "Leslie",
};

/* ── Oracle Character (simplified) ── */
function OracleCharacter({ c1, c2, c3, size = 90 }) {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="soOrb"><stop offset="0%" stopColor={c2} stopOpacity="0.35"/><stop offset="60%" stopColor={c2} stopOpacity="0.1"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="soRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.75"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="130" r="90" fill={c1} opacity="0.04"/>
      <path d="M98,130 Q92,120 102,112 Q112,104 120,102 Q128,104 138,112 Q148,120 142,130 L152,200 Q154,220 148,232 Q138,240 120,240 Q102,238 92,232 Q86,220 88,200 Z" fill="url(#soRobe)"/>
      <path d="M98,150 Q88,143 82,133 Q80,127 82,123" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <path d="M142,150 Q152,143 158,133 Q160,127 158,123" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <circle cx="120" cy="105" r="28" fill="url(#soOrb)"/>
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

/* ── Animated Bonus with Hook Frame ── */
function AnimatedWithHook({ aura }) {
  const [activeCard, setActiveCard] = useState(0);
  const cards = [
    { emoji: "🔥", label: "Roast", content: `"${aura.roast}"`, serif: true },
    { emoji: "✨", label: "Book-Scope", content: aura.bookScope, serif: false },
    { emoji: "🧚", label: "Spirit Book", content: aura.spiritBook, serif: true },
    { emoji: "🔮", label: "2036", content: aura.prediction2036, serif: false },
    { emoji: "✦", label: "", content: "", isHook: true },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard(i => (i + 1) % cards.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const card = cards[activeCard];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14, padding: "14px 14px", textAlign: "center",
        width: "100%", height: 95,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div key={activeCard} style={{
          animation: "fadeOnly 0.5s ease-out",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {card.isHook ? (
            <>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700,
                color: "rgba(245,240,232,0.95)", margin: "0 0 4px", textAlign: "center",
              }}>What's yours?</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 8.5,
                color: "rgba(255,255,255,0.55)", margin: 0,
              }}>Find your reading aura ↓</p>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px",
                display: "flex", alignItems: "center", gap: 4,
              }}><span style={{ fontSize: 12 }}>{card.emoji}</span> {card.label}</p>
              <p style={{
                fontFamily: card.serif ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
                fontSize: card.serif ? 10.5 : 9,
                fontStyle: "italic",
                color: "rgba(245,240,232,0.85)", lineHeight: 1.5, margin: 0,
                maxWidth: 200,
              }}>{card.content}</p>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {cards.map((_, i) => (
          <div key={i} style={{
            width: i === activeCard ? 14 : 5, height: 4, borderRadius: 2,
            background: i === activeCard
              ? cards[i].isHook ? "rgba(196,149,106,0.8)" : "rgba(255,255,255,0.6)"
              : "rgba(255,255,255,0.12)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Share Card (Conversion-Optimized) ── */
function ConversionShareCard({ aura, tribe }) {
  const c1 = aura.colorPrimary;
  const c2 = aura.colorSecondary;
  const c3 = aura.colorTertiary;

  return (
    <div style={{
      width: 270, height: 480,
      borderRadius: 16, overflow: "hidden",
      position: "relative", flexShrink: 0,
      boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(165deg, ${c1}CC 0%, ${c3}AA 25%, #111010 50%, ${c2}88 75%, ${c1}66 100%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 30% 15%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 85%, rgba(255,255,255,0.06) 0%, transparent 50%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        height: "100%", padding: "16px 16px 14px",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 2px", textAlign: "center",
        }}>My Reading Aura</p>

        <OracleCharacter c1={c1} c2={c2} c3={c3} size={80} />

        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700,
          color: "#F5F0E8", textAlign: "center", margin: "0 0 6px",
          lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}>{aura.archetype}</h2>

        {/* Bio + Strengths */}
        <div style={{ textAlign: "center", margin: "0 0 8px", padding: "0 4px" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 8.5,
            color: "rgba(245,240,232,0.65)", lineHeight: 1.5, margin: "0 0 8px",
          }}>{aura.bio}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            {aura.strengths.map((s, i) => (
              <span key={i} style={{
                padding: "3px 9px", borderRadius: 10,
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(245,240,232,0.85)", fontSize: 7, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
              }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.1)", margin: "4px auto 8px" }} />

        {/* Animated bonus cards with hook */}
        <AnimatedWithHook aura={aura} />

        <div style={{ flex: 1 }} />

        {/* CTA - the identity gap */}
        <div style={{
          background: "rgba(196,149,106,0.15)", border: "1px solid rgba(196,149,106,0.25)",
          borderRadius: 10, padding: "8px 12px", textAlign: "center", marginBottom: 6,
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontSize: 11, fontWeight: 600,
            color: "rgba(245,240,232,0.9)", margin: "0 0 2px",
          }}>What's your reading aura?</p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 7.5,
            color: "rgba(196,149,106,0.8)", margin: 0,
          }}>join-fabled.vercel.app</p>
        </div>

        {/* Tribe invite */}
        {tribe && (
          <div style={{
            textAlign: "center", marginBottom: 6,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, padding: "7px 12px",
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.45)",
              margin: 0, letterSpacing: "0.08em",
            }}>Join my tribe: <span style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em" }}>{tribe.code}</span></p>
          </div>
        )}

        {/* Fabled branding + tagline */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontSize: 11, color: "rgba(255,255,255,0.25)",
            margin: 0, letterSpacing: "0.08em",
          }}>fabled</p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 6, color: "rgba(255,255,255,0.15)",
            margin: "1px 0 0", fontStyle: "italic",
          }}>a whimsical book club</p>
        </div>
      </div>
    </div>
  );
}

/* ── Landing Page (what viewer sees after tapping link) ── */
function LandingPage({ sharer, tribe }) {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState("");
  const [phase, setPhase] = useState("landing"); // landing | input | generating | result
  const inputRef = useRef(null);
  const c1 = sharer.colorPrimary;
  const c2 = sharer.colorSecondary;

  const addBook = () => {
    const t = currentBook.trim();
    if (t && books.length < 7) { setBooks([...books, t]); setCurrentBook(""); inputRef.current?.focus(); }
  };

  if (phase === "landing") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh", padding: "24px 20px",
        textAlign: "center",
      }}>
        <div style={{ animation: "fadeInUp 0.6s ease-out", maxWidth: 380 }}>
          {/* Sharer's mini aura */}
          <OracleCharacter c1={c1} c2={c2} c3={sharer.colorTertiary} size={70} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9B958A",
            margin: "8px 0 4px",
          }}>{tribe.sharerName} is</p>

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700,
            color: "#F5F0E8", margin: "0 0 8px", letterSpacing: "-0.02em",
          }}>{sharer.archetype}</h1>

          <p style={{
            fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: "italic",
            color: "#9B958A", lineHeight: 1.5, margin: "0 0 28px",
          }}>"{sharer.roast}"</p>

          {/* The identity gap */}
          <div style={{
            background: "rgba(196,149,106,0.08)", border: "1px solid rgba(196,149,106,0.15)",
            borderRadius: 16, padding: "20px", marginBottom: 20,
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
              color: "#F5F0E8", margin: "0 0 6px",
            }}>What are you?</h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7A756D",
              margin: "0 0 16px", lineHeight: 1.5,
            }}>Tell us 3 books. The Story Spirits will do the rest.</p>
            <button onClick={() => setPhase("input")} style={{
              padding: "14px 40px",
              background: "linear-gradient(135deg, #C4956A, #8B6E4E)",
              border: "none", borderRadius: 12,
              color: "#F5F0E8", fontSize: 15, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(196,149,106,0.25)",
            }}>Find My Reading Aura</button>
          </div>

          {/* Tribe social proof */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {[...Array(Math.min(tribe.memberCount, 5))].map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: 4,
                background: `hsl(${i * 60 + 200}, 50%, 65%)`, opacity: 0.6,
              }} />
            ))}
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#5A564F",
            }}>{tribe.memberCount} readers in {tribe.sharerName}'s tribe</span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "input") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh", padding: "24px 20px",
      }}>
        <div style={{ animation: "fadeInUp 0.5s ease-out", maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8, animation: "float 4s ease-in-out infinite" }}>✦</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#F5F0E8",
            fontWeight: 700, marginBottom: 6,
          }}>Name 3-7 books you love</h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7A756D",
            marginBottom: 28,
          }}>No signup required. See your aura first.</p>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input ref={inputRef} type="text" value={currentBook}
              onChange={e => setCurrentBook(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addBook()}
              placeholder={books.length === 0 ? "e.g. Normal People" : "Add another..."}
              style={{
                flex: 1, padding: "14px 18px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, color: "#F5F0E8", fontSize: 15,
                fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <button onClick={addBook} disabled={!currentBook.trim() || books.length >= 7}
              style={{
                padding: "14px 20px",
                background: currentBook.trim() ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
                color: currentBook.trim() ? "#F5F0E8" : "#5A564F",
                fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                cursor: currentBook.trim() ? "pointer" : "default",
              }}>+</button>
          </div>

          {books.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, justifyContent: "center" }}>
              {books.map((b, i) => (
                <div key={i} style={{
                  padding: "8px 14px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
                  color: "#C8C2B8", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>{b}</span>
                  <span onClick={() => setBooks(books.filter((_, j) => j !== i))}
                    style={{ cursor: "pointer", opacity: 0.4, fontSize: 11 }}>✕</span>
                </div>
              ))}
            </div>
          )}

          {books.length >= 3 && (
            <button onClick={() => {
              setPhase("generating");
              setTimeout(() => setPhase("result"), 3000);
            }} style={{
              padding: "16px 48px",
              background: "linear-gradient(135deg, #C4956A, #8B6E4E)",
              border: "none", borderRadius: 14,
              color: "#F5F0E8", fontSize: 16, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              boxShadow: "0 4px 24px rgba(196,149,106,0.2)",
            }}>Reveal My Reading Aura</button>
          )}

          {books.length > 0 && books.length < 3 && (
            <p style={{ color: "#6B655C", fontSize: 13, fontStyle: "italic" }}>
              {3 - books.length} more book{3 - books.length !== 1 ? "s" : ""} to unlock
            </p>
          )}

          {/* No signup messaging */}
          <p style={{
            marginTop: 20, color: "#4A463F", fontSize: 11, fontStyle: "italic",
          }}>No account needed to see your results</p>
        </div>
      </div>
    );
  }

  if (phase === "generating") {
    const msgs = ["Consulting the Story Spirits...", "Finding your creature...", "Mapping your dimensions...", "Writing your roast..."];
    const [idx, setIdx] = useState(0);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1) % msgs.length), 2000); return () => clearInterval(t); }, []);
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 32,
          background: "linear-gradient(135deg, rgba(196,149,106,0.15), rgba(139,110,78,0.15))",
          border: "1px solid rgba(196,149,106,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, animation: "float 3s ease-in-out infinite", marginBottom: 24,
        }}>✦</div>
        <p key={idx} style={{
          color: "#9B958A", fontSize: 15, fontWeight: 300,
          fontFamily: "'DM Sans', sans-serif",
          animation: "fadeInUp 0.3s ease-out",
        }}>{msgs[idx]}</p>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh", padding: "24px 20px",
      }}>
        <div style={{ animation: "fadeInUp 0.8s ease-out", maxWidth: 400, width: "100%", textAlign: "center" }}>
          <OracleCharacter c1="#D46A6A" c2="#E8A0A0" c3="#7A3A3A" size={100} />

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700,
            color: "#F5F0E8", margin: "8px 0 4px",
          }}>The Nocturne</h1>

          <p style={{
            fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: "italic",
            color: "#B8B2A8", lineHeight: 1.6, margin: "0 0 16px", padding: "0 20px",
          }}>You read to feel something so big it can't be ignored. Emotional extremity is the point, not a side effect.</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
            {["Fearless taste", "Emotional stamina", "Late-night finisher"].map((s, i) => (
              <span key={i} style={{
                padding: "4px 11px", background: "rgba(212,106,106,0.1)",
                border: "1px solid rgba(212,106,106,0.2)", borderRadius: 14,
                color: "#D46A6A", fontSize: 11, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>

          {/* The conversion moment */}
          <div style={{
            background: "rgba(196,149,106,0.08)", border: "1px solid rgba(196,149,106,0.15)",
            borderRadius: 16, padding: "20px", marginBottom: 16,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C8C2B8",
              margin: "0 0 6px",
            }}>Save your aura and join <strong style={{ color: "#F5F0E8" }}>{tribe.sharerName}'s tribe</strong></p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#7A756D",
              margin: "0 0 14px",
            }}>Swipe on books blind. Discover your next read together.</p>
            <button style={{
              padding: "14px 40px", width: "100%",
              background: "linear-gradient(135deg, #C4956A, #8B6E4E)",
              border: "none", borderRadius: 12,
              color: "#F5F0E8", fontSize: 15, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(196,149,106,0.25)",
            }}>Create Account & Join Tribe</button>
          </div>

          <p style={{
            color: "#5A564F", fontSize: 12, fontStyle: "italic",
          }}>Your full aura (roast, compatibility, and more) is waiting inside</p>
        </div>
      </div>
    );
  }
}

/* ── Comparison View: Old vs New ── */
function ComparisonCards() {
  return (
    <div style={{
      display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap",
      alignItems: "flex-start",
    }}>
      {/* New conversion card */}
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6BCB77",
          marginBottom: 8, fontWeight: 500,
        }}>✓ New: Conversion-optimized</p>
        <ConversionShareCard aura={AURA} tribe={TRIBE} />
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function ConversionPrototype() {
  const [view, setView] = useState("card"); // card | landing

  return (
    <div style={{
      minHeight: "100vh", background: "#111010", padding: "24px 16px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeInUp 0.5s ease-out" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#F5F0E8",
            fontWeight: 700, marginBottom: 4,
          }}>Share → Convert Flow</h1>
          <p style={{ color: "#7A756D", fontSize: 13 }}>
            Share card + what the viewer sees after tapping
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {[
            ["card", "Share Card"],
            ["landing", "Landing Page (what viewer sees)"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: "8px 16px", borderRadius: 10,
              background: view === id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${view === id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
              color: view === id ? "#F5F0E8" : "#5A564F",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>

        {view === "card" ? (
          <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
            <ComparisonCards />
            <div style={{
              maxWidth: 400, margin: "24px auto 0", textAlign: "center",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 14, padding: "16px",
            }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5A564F", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>What changed</p>
              <div style={{ textAlign: "left", color: "#9B958A", fontSize: 12, lineHeight: 1.7 }}>
                <p style={{ margin: "0 0 4px" }}>✦ Animation ends with "What's yours?" hook frame</p>
                <p style={{ margin: "0 0 4px" }}>✦ "5 readers in this tribe" social proof</p>
                <p style={{ margin: "0 0 4px" }}>✦ Gold CTA: "What's your reading aura?"</p>
                <p style={{ margin: "0 0 4px" }}>✦ Link includes tribe code in URL</p>
                <p style={{ margin: 0 }}>✦ Tribe join is invisible, baked into the flow</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
            <div style={{
              maxWidth: 420, margin: "0 auto",
              background: "#111010",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, overflow: "hidden",
            }}>
              <LandingPage sharer={AURA} tribe={TRIBE} />
            </div>
            <div style={{
              maxWidth: 400, margin: "24px auto 0", textAlign: "center",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 14, padding: "16px",
            }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5A564F", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Conversion flow</p>
              <div style={{ textAlign: "left", color: "#9B958A", fontSize: 12, lineHeight: 1.7 }}>
                <p style={{ margin: "0 0 4px" }}>1. "[Name] is The Oracle. What are you?"</p>
                <p style={{ margin: "0 0 4px" }}>2. Enter 3 books (no signup required)</p>
                <p style={{ margin: "0 0 4px" }}>3. See your aura (the dopamine hit)</p>
                <p style={{ margin: "0 0 4px" }}>4. THEN: "Save & join [name]'s tribe"</p>
                <p style={{ margin: 0 }}>5. Signup only after they're hooked</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
