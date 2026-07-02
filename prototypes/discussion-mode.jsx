import { useState, useRef, useEffect } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{opacity:0;transform:scale(0.8)}60%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes shake{0%,100%{transform:rotate(0)}15%{transform:rotate(-4deg)}30%{transform:rotate(4deg)}45%{transform:rotate(-3deg)}60%{transform:rotate(2deg)}75%{transform:rotate(-1deg)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
`;

const ACCENT = "#C4956A";
const ACCENT2 = "#8B6E4E";
const BOOK_COLOR = "#7B4B6A";

// Mock book (from the swipe deck - The Secret History)
const BOOK = {
  title: "The Secret History",
  author: "Donna Tartt",
  genre: "Literary Fiction",
  color: BOOK_COLOR,
};

// Discussion tiers with questions
const TIERS = [
  {
    id: "warmup",
    emoji: "☀️",
    label: "Warm Up",
    color: "#D4A76A",
    description: "Ease into it",
    questions: [
      "Which character would you most want to get dinner with, and which one would you absolutely avoid?",
      "If you had to describe this book to a friend in one sentence without using the title, what would you say?",
      "What scene is still stuck in your head?",
    ],
  },
  {
    id: "spicy",
    emoji: "🔥",
    label: "Turn Up the Heat",
    color: "#D46A6A",
    description: "Unhinged and loving it",
    questions: [
      "Which character are you secretly attracted to, and what does that say about your taste in real life?",
      "Who in this book has the biggest red flag energy that everyone just ignores? Would you still swipe right?",
      "If two characters hooked up that didn't in the book, which pairing would cause the most chaos?",
    ],
  },
  {
    id: "deep",
    emoji: "🌀",
    label: "Go Deep",
    color: "#6A8BD4",
    description: "The existential stuff",
    questions: [
      "What does this book assume is true about human nature? Do you agree?",
      "Is the ending earned, or does the author let someone off the hook?",
      "What question do you think the author was trying to answer by writing this? Did they succeed?",
    ],
  },
];

const HOT_TAKES = [
  "Henry is the actual protagonist of this book. Richard is just the camera.",
  "The group's obsession with beauty and Greek ideals is just a fancy way of saying they were bored rich kids with too much free time.",
  "Bunny was the only honest person in the entire friend group, and that's exactly why they couldn't stand him.",
  "This is secretly a love story between Richard and an idea of himself he'll never become.",
  "The 'dark academia' aesthetic has made people romanticize this book in exactly the way the book warns you not to.",
];

// ── Question Card ──
function QuestionCard({ question, tier, index, isActive }) {
  return (
    <div style={{
      background: `linear-gradient(160deg, ${tier.color}12, #111010 60%, ${tier.color}06)`,
      border: `1px solid ${tier.color}20`,
      borderRadius: 22,
      padding: "28px 24px",
      minHeight: 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      animation: isActive ? "popIn 0.4s cubic-bezier(0.16,1,0.3,1)" : "none",
    }}>
      {/* Tier badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 20,
      }}>
        <span style={{ fontSize: 16 }}>{tier.emoji}</span>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: tier.color,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>{tier.label}</span>
      </div>

      {/* Question number */}
      <div style={{
        width: 28, height: 28, borderRadius: 14,
        background: `${tier.color}15`, border: `1px solid ${tier.color}25`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: tier.color,
        }}>{index + 1}</span>
      </div>

      {/* Question text */}
      <p style={{
        fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: "italic",
        color: "#E8E2D8", lineHeight: 1.65, textAlign: "center", margin: 0,
        fontWeight: 400, maxWidth: 320,
      }}>{question}</p>
    </div>
  );
}

// ── Hot Take Card ──
function HotTakeCard({ take, isNew }) {
  return (
    <div style={{
      background: "linear-gradient(160deg, rgba(232,93,93,0.08), #111010 60%, rgba(232,93,93,0.04))",
      border: "1px solid rgba(232,93,93,0.18)",
      borderRadius: 22,
      padding: "28px 24px",
      minHeight: 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      animation: isNew ? "shake 0.5s ease-out, popIn 0.4s cubic-bezier(0.16,1,0.3,1)" : "none",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 20,
      }}>
        <span style={{ fontSize: 16 }}>💣</span>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#E85D5D",
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>Hot Take</span>
      </div>

      <p style={{
        fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: "italic",
        color: "#E8E2D8", lineHeight: 1.65, textAlign: "center", margin: "0 0 20px",
        fontWeight: 400, maxWidth: 320,
      }}>"{take}"</p>

      <p style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#7A756D",
        textAlign: "center", margin: 0,
      }}>Agree or fight. No middle ground.</p>
    </div>
  );
}

// ── Tier Selector ──
function TierSelector({ tiers, activeTier, onSelect, hotTakeAvailable, hotTakeActive, onHotTake }) {
  return (
    <div style={{
      display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 20,
    }}>
      {tiers.map((tier) => {
        const active = activeTier === tier.id;
        return (
          <button key={tier.id} onClick={() => onSelect(tier.id)} style={{
            padding: "8px 14px",
            background: active ? `${tier.color}18` : "rgba(255,255,255,0.03)",
            border: `1px solid ${active ? `${tier.color}30` : "rgba(255,255,255,0.06)"}`,
            borderRadius: 12,
            color: active ? tier.color : "#5A564F",
            fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: active ? 500 : 400,
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ fontSize: 13 }}>{tier.emoji}</span>
            {tier.label}
          </button>
        );
      })}
      <button onClick={onHotTake} style={{
        padding: "8px 14px",
        background: hotTakeActive ? "rgba(232,93,93,0.12)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hotTakeActive ? "rgba(232,93,93,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 12,
        color: hotTakeActive ? "#E85D5D" : "#5A564F",
        fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: hotTakeActive ? 500 : 400,
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <span style={{ fontSize: 13 }}>💣</span>
        Hot Take
      </button>
    </div>
  );
}

// ── Discussion Mode ──
function DiscussionMode() {
  const [activeTier, setActiveTier] = useState("warmup");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [hotTakeMode, setHotTakeMode] = useState(false);
  const [hotTakeIdx, setHotTakeIdx] = useState(0);
  const [hotTakeNew, setHotTakeNew] = useState(false);
  const [cardKey, setCardKey] = useState(0); // force re-render for animation

  const currentTier = TIERS.find(t => t.id === activeTier);
  const currentQuestion = currentTier?.questions[questionIdx] || "";
  const totalQuestions = currentTier?.questions.length || 0;

  const selectTier = (tierId) => {
    setHotTakeMode(false);
    setActiveTier(tierId);
    setQuestionIdx(0);
    setCardKey(k => k + 1);
  };

  const nextQuestion = () => {
    if (questionIdx < totalQuestions - 1) {
      setQuestionIdx(i => i + 1);
      setCardKey(k => k + 1);
    }
  };
  const prevQuestion = () => {
    if (questionIdx > 0) {
      setQuestionIdx(i => i - 1);
      setCardKey(k => k + 1);
    }
  };

  const triggerHotTake = () => {
    if (hotTakeMode) {
      // Generate new hot take
      setHotTakeIdx(i => (i + 1) % HOT_TAKES.length);
    }
    setHotTakeMode(true);
    setHotTakeNew(true);
    setTimeout(() => setHotTakeNew(false), 600);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", padding: "24px 16px",
      fontFamily: "'DM Sans',sans-serif",
    }}>
      {/* Book header */}
      <div style={{
        textAlign: "center", marginBottom: 24, animation: "fadeInUp 0.5s ease-out",
        maxWidth: 400, width: "100%",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#5A564F",
          letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px",
        }}>Discussion Mode</p>
        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#F5F0E8",
          fontWeight: 700, margin: "0 0 4px",
        }}>{BOOK.title}</h1>
        <p style={{ color: "#9B958A", fontSize: 13, margin: "0 0 4px", fontStyle: "italic" }}>
          {BOOK.author}
        </p>
        <span style={{
          padding: "3px 10px", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
          color: "#7A756D", fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
        }}>{BOOK.genre}</span>
      </div>

      {/* Tier selector */}
      <TierSelector
        tiers={TIERS}
        activeTier={hotTakeMode ? null : activeTier}
        onSelect={selectTier}
        hotTakeActive={hotTakeMode}
        onHotTake={triggerHotTake}
      />

      {/* Card area */}
      <div style={{ width: "100%", maxWidth: 400, marginBottom: 20 }}>
        {hotTakeMode ? (
          <HotTakeCard take={HOT_TAKES[hotTakeIdx]} isNew={hotTakeNew} />
        ) : (
          <QuestionCard
            key={cardKey}
            question={currentQuestion}
            tier={currentTier}
            index={questionIdx}
            isActive={true}
          />
        )}
      </div>

      {/* Navigation */}
      {!hotTakeMode ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 20,
          animation: "fadeIn 0.3s ease-out",
        }}>
          <button onClick={prevQuestion} disabled={questionIdx === 0} style={{
            width: 40, height: 40, borderRadius: 20,
            background: questionIdx === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: questionIdx === 0 ? "#3D3A35" : "#9B958A",
            fontSize: 16, cursor: questionIdx === 0 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
          }}>‹</button>

          {/* Dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {currentTier.questions.map((_, i) => (
              <div key={i} onClick={() => { setQuestionIdx(i); setCardKey(k => k + 1); }} style={{
                width: i === questionIdx ? 18 : 7, height: 7, borderRadius: 4,
                background: i === questionIdx ? currentTier.color : "rgba(255,255,255,0.08)",
                opacity: i === questionIdx ? 0.7 : 0.35,
                cursor: "pointer", transition: "all 0.3s",
              }} />
            ))}
          </div>

          <button onClick={nextQuestion} disabled={questionIdx >= totalQuestions - 1} style={{
            width: 40, height: 40, borderRadius: 20,
            background: questionIdx >= totalQuestions - 1 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: questionIdx >= totalQuestions - 1 ? "#3D3A35" : "#9B958A",
            fontSize: 16, cursor: questionIdx >= totalQuestions - 1 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
          }}>›</button>
        </div>
      ) : (
        <button onClick={triggerHotTake} style={{
          padding: "12px 28px",
          background: "rgba(232,93,93,0.08)",
          border: "1px solid rgba(232,93,93,0.18)",
          borderRadius: 12, color: "#E85D5D", fontSize: 13,
          fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
          cursor: "pointer", transition: "all 0.2s",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span>💣</span> Another Hot Take
        </button>
      )}

      {/* Tribe context */}
      <div style={{
        marginTop: 28, padding: "14px 18px",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 14, maxWidth: 400, width: "100%",
        animation: "fadeInUp 0.5s ease-out 0.3s both",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#5A564F",
          letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px",
        }}>Your Tribe</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { name: "You", color: ACCENT },
            { name: "Luna", color: "#C47A8B" },
            { name: "Max", color: "#7B5A8B" },
            { name: "Ava", color: "#5A8B7B" },
          ].map((m, i) => (
            <span key={i} style={{
              padding: "4px 10px", background: `${m.color}10`,
              border: `1px solid ${m.color}1A`, borderRadius: 12,
              color: m.color, fontSize: 11, fontWeight: 500,
            }}>{m.name}</span>
          ))}
        </div>
      </div>

      {/* Tip */}
      <p style={{
        marginTop: 16, color: "#4A463F", fontSize: 11, fontStyle: "italic",
        textAlign: "center", maxWidth: 300,
      }}>
        Pro tip: start with Warm Up, escalate to Go Deep, drop a Hot Take when things get too agreeable
      </p>
    </div>
  );
}

// ── App ──
export default function Discussion() {
  return (
    <div style={{ minHeight: "100vh", background: "#111010", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 25% 20%, rgba(123,75,106,0.04) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(139,110,78,0.03) 0%, transparent 55%)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <DiscussionMode />
      </div>
    </div>
  );
}
