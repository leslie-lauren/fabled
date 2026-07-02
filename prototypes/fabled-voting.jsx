import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{opacity:0;transform:scale(0.85)}60%{transform:scale(1.03)}100%{opacity:1;transform:scale(1)}}
@keyframes crownBounce{0%{transform:translateY(0) scale(1)}40%{transform:translateY(-4px) scale(1.1)}100%{transform:translateY(0) scale(1)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
`;

const ACCENT = "#C4956A";

const MEMBERS = [
  { name: "You", color: ACCENT },
  { name: "Luna", color: "#C47A8B" },
  { name: "Max", color: "#7B5A8B" },
];

// Books from reveal (only "Everyone loved this" and "Strong match" tiers)
const VOTEABLE_BOOKS = [
  {
    id: 1, title: "Station Eleven", author: "Emily St. John Mandel",
    genre: "Literary Fiction", moodTags: ["post-apocalyptic", "hopeful melancholy"],
    color: "#4A7B8B", tier: "everyone", swipeMatch: 100,
    // Simulated other member votes (not You)
    otherVotes: { Luna: true, Max: true },
  },
  {
    id: 2, title: "Piranesi", author: "Susanna Clarke",
    genre: "Speculative Fiction", moodTags: ["surreal", "mind-bending"],
    color: "#5A7B7B", tier: "everyone", swipeMatch: 100,
    otherVotes: { Luna: true, Max: false },
  },
  {
    id: 3, title: "Circe", author: "Madeline Miller",
    genre: "Historical Fantasy", moodTags: ["mythological", "feminist retelling"],
    color: "#8B6B3A", tier: "strong", swipeMatch: 75,
    otherVotes: { Luna: true, Max: true },
  },
  {
    id: 4, title: "The Secret History", author: "Donna Tartt",
    genre: "Literary Fiction", moodTags: ["dark academia", "slow burn"],
    color: "#7B4B6A", tier: "strong", swipeMatch: 75,
    otherVotes: { Luna: false, Max: true },
  },
  {
    id: 5, title: "Normal People", author: "Sally Rooney",
    genre: "Contemporary Fiction", moodTags: ["will-they-won't-they", "quiet devastation"],
    color: "#6B8B5A", tier: "strong", swipeMatch: 75,
    otherVotes: { Luna: true, Max: false },
  },
];

function VoteBookCard({ book, myVote, onToggle, allVotes, winner, locked }) {
  const voterNames = [];
  if (myVote) voterNames.push({ name: "You", color: ACCENT });
  Object.entries(book.otherVotes).forEach(([name, voted]) => {
    if (voted || allVotes[name]?.[book.id]) {
      const member = MEMBERS.find(m => m.name === name);
      if (member && voted) voterNames.push(member);
    }
  });
  // Add simulated votes from others
  const totalVotes = voterNames.length;

  const isWinner = winner === book.id;

  return (
    <div style={{
      background: isWinner
        ? `linear-gradient(135deg, ${book.color}18, ${ACCENT}0C, #111010)`
        : `linear-gradient(135deg, ${book.color}0C, #111010)`,
      border: `1px solid ${isWinner ? `${ACCENT}35` : `${book.color}20`}`,
      borderRadius: 18,
      padding: "16px",
      transition: "all 0.3s",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Winner badge */}
      {isWinner && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: `linear-gradient(135deg, ${ACCENT}, #8B6E4E)`,
          padding: "4px 12px", borderRadius: 10,
          display: "flex", alignItems: "center", gap: 4,
          animation: "popIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{ fontSize: 12 }}>👑</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            color: "#F5F0E8", letterSpacing: "0.06em", fontWeight: 500,
          }}>YOUR NEXT READ</span>
        </div>
      )}

      {/* Tier badge */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: book.tier === "everyone" ? "#6BCB77" : ACCENT,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {book.tier === "everyone" ? "🎉 Everyone loved this" : "✨ Strong match"}
        </span>
      </div>

      {/* Book info */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 17,
          color: "#F5F0E8", fontWeight: 600, margin: "0 0 3px",
        }}>{book.title}</h3>
        <p style={{
          color: "#9B958A", fontSize: 12, margin: "0 0 8px", fontStyle: "italic",
        }}>{book.author}</p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span style={{
            padding: "2px 8px", background: "rgba(255,255,255,0.05)",
            borderRadius: 10, color: "#9B958A", fontSize: 10,
          }}>{book.genre}</span>
          {book.moodTags.map((t, i) => (
            <span key={i} style={{
              padding: "2px 8px", background: `${book.color}10`,
              borderRadius: 10, color: "#7A756D", fontSize: 10,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Vote section */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        {/* Who voted */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              color: "#5A564F", letterSpacing: "0.08em",
            }}>{totalVotes} VOTE{totalVotes !== 1 ? "S" : ""}</span>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {voterNames.map((v, i) => (
              <span key={i} style={{
                padding: "3px 8px", borderRadius: 8,
                background: `${v.color}12`, border: `1px solid ${v.color}1A`,
                color: v.color, fontSize: 10, fontWeight: 500,
              }}>{v.name}</span>
            ))}
            {totalVotes === 0 && (
              <span style={{ color: "#4A463F", fontSize: 10, fontStyle: "italic" }}>No votes yet</span>
            )}
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => !locked && onToggle(book.id)}
          disabled={locked}
          style={{
            padding: "10px 20px",
            background: myVote
              ? `linear-gradient(135deg, ${ACCENT}, #8B6E4E)`
              : "rgba(255,255,255,0.04)",
            border: myVote
              ? "none"
              : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: myVote ? "#F5F0E8" : "#9B958A",
            fontSize: 13, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: locked ? "default" : "pointer",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6,
            opacity: locked ? 0.6 : 1,
          }}
        >
          {myVote ? "✓ I'd read this" : "I'd read this"}
        </button>
      </div>
    </div>
  );
}

function VotingPhase({ onLockIn }) {
  const [myVotes, setMyVotes] = useState({});
  const [locked, setLocked] = useState(false);

  const toggleVote = (bookId) => {
    if (locked) return;
    setMyVotes(prev => ({ ...prev, [bookId]: !prev[bookId] }));
  };

  const totalSelected = Object.values(myVotes).filter(Boolean).length;

  const handleLockIn = () => {
    setLocked(true);
    setTimeout(() => onLockIn(myVotes), 1500);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", padding: "24px 16px 120px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center", marginBottom: 20, maxWidth: 400, width: "100%",
        animation: "fadeInUp 0.5s ease-out",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5A564F",
          letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px",
        }}>Vote for Your Next Read</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#F5F0E8",
          fontWeight: 700, margin: "0 0 6px",
        }}>What would you read? ✦</h2>
        <p style={{
          color: "#7A756D", fontSize: 13, margin: 0, lineHeight: 1.5,
        }}>
          Tap "I'd read this" on every book you'd be up for. The book with the most votes across your tribe wins.
        </p>
      </div>

      {/* Tribe status */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 20,
        animation: "fadeInUp 0.5s ease-out 0.1s both",
      }}>
        {MEMBERS.map((m, i) => (
          <div key={i} style={{
            padding: "5px 12px",
            background: (m.name === "You" && locked) ? "rgba(107,203,119,0.08)" : `${m.color}10`,
            border: `1px solid ${(m.name === "You" && locked) ? "rgba(107,203,119,0.15)" : `${m.color}1A`}`,
            borderRadius: 14,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: 3,
              background: m.name !== "You" ? "#6BCB77" : locked ? "#6BCB77" : "rgba(255,255,255,0.15)",
            }} />
            <span style={{
              color: m.name !== "You" ? m.color : locked ? "#6BCB77" : m.color,
              fontSize: 11, fontWeight: 500,
            }}>{m.name}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
              color: m.name !== "You" ? "#6BCB77" : locked ? "#6BCB77" : "#5A564F",
            }}>{m.name !== "You" ? "voted" : locked ? "voted" : "voting..."}</span>
          </div>
        ))}
      </div>

      {/* Book cards */}
      <div style={{
        width: "100%", maxWidth: 400,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {VOTEABLE_BOOKS.map((book, i) => (
          <div key={book.id} style={{ animation: `fadeInUp 0.5s ease-out ${0.15 + i * 0.08}s both` }}>
            <VoteBookCard
              book={book}
              myVote={myVotes[book.id] || false}
              onToggle={toggleVote}
              allVotes={{}}
              winner={null}
              locked={locked}
            />
          </div>
        ))}
      </div>

      {/* Lock in button */}
      {!locked && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, #111010 60%, transparent)",
          padding: "16px 16px 28px",
          display: "flex", justifyContent: "center",
        }}>
          <button
            onClick={handleLockIn}
            disabled={totalSelected === 0}
            style={{
              padding: "16px 48px", maxWidth: 400, width: "100%",
              background: totalSelected > 0
                ? `linear-gradient(135deg, ${ACCENT}, #8B6E4E)`
                : "rgba(255,255,255,0.04)",
              border: totalSelected > 0
                ? "none"
                : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              color: totalSelected > 0 ? "#F5F0E8" : "#5A564F",
              fontSize: 15, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              cursor: totalSelected > 0 ? "pointer" : "default",
              boxShadow: totalSelected > 0 ? `0 4px 20px ${ACCENT}30` : "none",
              transition: "all 0.3s",
            }}
          >
            {totalSelected === 0
              ? "Select at least one book"
              : `Lock in ${totalSelected} vote${totalSelected !== 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {locked && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, #111010 60%, transparent)",
          padding: "16px 16px 28px",
          display: "flex", justifyContent: "center",
        }}>
          <div style={{
            padding: "16px 48px", maxWidth: 400, width: "100%",
            background: "rgba(107,203,119,0.08)",
            border: "1px solid rgba(107,203,119,0.15)",
            borderRadius: 14, textAlign: "center",
          }}>
            <span style={{ color: "#6BCB77", fontSize: 14, fontWeight: 500 }}>
              ✓ Votes locked in! Waiting for results...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsView({ myVotes }) {
  // Calculate winner
  const scores = VOTEABLE_BOOKS.map(book => {
    let count = myVotes[book.id] ? 1 : 0;
    Object.values(book.otherVotes).forEach(v => { if (v) count++; });
    return { ...book, totalVotes: count };
  }).sort((a, b) => {
    if (b.totalVotes !== a.totalVotes) return b.totalVotes - a.totalVotes;
    return b.swipeMatch - a.swipeMatch; // tiebreaker
  });

  const winnerId = scores[0].id;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", padding: "24px 16px 100px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center", marginBottom: 24, maxWidth: 400, width: "100%",
        animation: "fadeInUp 0.5s ease-out",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5A564F",
          letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px",
        }}>Voting Complete</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#F5F0E8",
          fontWeight: 700, margin: "0 0 6px",
        }}>The Tribe Has Spoken ✦</h2>
        <p style={{ color: "#7A756D", fontSize: 13, margin: 0 }}>
          Your next read has been chosen
        </p>
      </div>

      {/* Results */}
      <div style={{
        width: "100%", maxWidth: 400,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {scores.map((book, i) => (
          <div key={book.id} style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}>
            <VoteBookCard
              book={book}
              myVote={myVotes[book.id] || false}
              onToggle={() => {}}
              allVotes={{}}
              winner={winnerId}
              locked={true}
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        display: "flex", gap: 10, marginTop: 24, maxWidth: 400, width: "100%",
        animation: "fadeInUp 0.5s ease-out 0.6s both",
      }}>
        <button style={{
          flex: 1, padding: "14px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, color: "#9B958A", fontSize: 13, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          🔄 Re-vote
        </button>
        <button style={{
          flex: 1.5, padding: "14px",
          background: `linear-gradient(135deg, ${ACCENT}, #8B6E4E)`,
          border: "none",
          borderRadius: 14, color: "#F5F0E8", fontSize: 13, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          boxShadow: `0 4px 20px ${ACCENT}25`,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          💬 Start Discussion
        </button>
      </div>

      {/* Accessible from home note */}
      <p style={{
        marginTop: 16, color: "#4A463F", fontSize: 11, fontStyle: "italic",
        textAlign: "center",
      }}>
        These results stay available from your tribe page
      </p>
    </div>
  );
}

export default function VotingPrototype() {
  const [phase, setPhase] = useState("voting"); // voting | results
  const [myVotes, setMyVotes] = useState({});

  return (
    <div style={{ minHeight: "100vh", background: "#111010", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 30% 20%, rgba(196,149,106,0.03) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(139,110,78,0.03) 0%, transparent 55%)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {phase === "voting" ? (
          <VotingPhase onLockIn={(votes) => { setMyVotes(votes); setPhase("results"); }} />
        ) : (
          <ResultsView myVotes={myVotes} />
        )}
      </div>
    </div>
  );
}
