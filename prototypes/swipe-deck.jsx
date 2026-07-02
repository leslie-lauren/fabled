import { useState, useRef, useEffect } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes cardReveal{0%{opacity:0;transform:scale(.92);filter:blur(6px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}
@keyframes popIn{0%{opacity:0;transform:scale(0.5)}60%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes slideOutLeft{to{opacity:0;transform:translateX(-120%) rotate(-12deg)}}
@keyframes slideOutRight{to{opacity:0;transform:translateX(120%) rotate(12deg)}}
@keyframes confettiBurst{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-60px) scale(0.3)}}
`;

const ACCENT = "#C4956A";
const ACCENT2 = "#8B6E4E";

// ── Book Deck (hidden info + blind descriptions) ──
const DECK = [
  {
    id: 1,
    vibe: "A group of misfits at an elite college become obsessed with ancient Greek ideals of beauty and morality, until their devotion turns deadly. Every character is brilliant, insufferable, and hiding something.",
    genre: "Literary Fiction",
    moodTags: ["dark academia", "slow burn", "moral decay"],
    title: "The Secret History",
    author: "Donna Tartt",
    color: "#7B4B6A",
  },
  {
    id: 2,
    vibe: "Civilization collapses, but a traveling theater troupe keeps performing Shakespeare in the wreckage. A meditation on what survives when everything else doesn't.",
    genre: "Literary Fiction",
    moodTags: ["post-apocalyptic", "hopeful melancholy", "interconnected"],
    title: "Station Eleven",
    author: "Emily St. John Mandel",
    color: "#4A7B8B",
  },
  {
    id: 3,
    vibe: "A woman from mythology gets tired of being a footnote in men's stories and decides to write her own. Witchcraft, exile, and a lion that is also a metaphor.",
    genre: "Historical Fantasy",
    moodTags: ["mythological", "feminist retelling", "slow power"],
    title: "Circe",
    author: "Madeline Miller",
    color: "#8B6B3A",
  },
  {
    id: 4,
    vibe: "A science teacher wakes up alone on a spaceship with no memory of how he got there, and the fate of Earth depends on him figuring it out. Pure problem-solving joy with a friendship that sneaks up on you.",
    genre: "Science Fiction",
    moodTags: ["sci-fi", "puzzle box", "surprisingly emotional"],
    title: "Project Hail Mary",
    author: "Andy Weir",
    color: "#3A6B8B",
  },
  {
    id: 5,
    vibe: "Two people who grew up together keep orbiting each other through college and beyond, never quite getting the timing right. Every conversation is loaded. Every silence is louder.",
    genre: "Contemporary Fiction",
    moodTags: ["contemporary", "will-they-won't-they", "quiet devastation"],
    title: "Normal People",
    author: "Sally Rooney",
    color: "#6B8B5A",
  },
  {
    id: 6,
    vibe: "A young woman visits her cousin's glamorous estate in 1950s Mexico, and the walls start doing things walls shouldn't do. Gothic horror with a protagonist who fights back instead of running.",
    genre: "Gothic Horror",
    moodTags: ["gothic horror", "atmospheric", "colonial critique"],
    title: "Mexican Gothic",
    author: "Silvia Moreno-Garcia",
    color: "#5A3A5A",
  },
  {
    id: 7,
    vibe: "A man lives in an impossible house full of marble statues and rising tides, keeping meticulous journals about a world he doesn't realize is strange. The kind of book that quietly rearranges your brain.",
    genre: "Speculative Fiction",
    moodTags: ["surreal", "mysterious", "quietly mind-bending"],
    title: "Piranesi",
    author: "Susanna Clarke",
    color: "#5A7B7B",
  },
  {
    id: 8,
    vibe: "A woman who tried to end her life wakes up in a library between worlds, where every book contains a version of her life if she'd made different choices. Sounds cheesy. Somehow isn't.",
    genre: "Contemporary Fiction",
    moodTags: ["philosophical", "hopeful", "second chances"],
    title: "The Midnight Library",
    author: "Matt Haig",
    color: "#4B5A8B",
  },
];

// ── Simulated tribe members ──
const MEMBERS = [
  { name: "Luna", archetype: "Swoon Fawn", color: "#C47A8B", votes: { 1:false, 2:true, 3:true, 4:false, 5:true, 6:false, 7:true, 8:true } },
  { name: "Max", archetype: "Doom Bloom", color: "#7B5A8B", votes: { 1:true, 2:true, 3:false, 4:false, 5:false, 6:true, 7:true, 8:false } },
  { name: "Ava", archetype: "Glitch Witch", color: "#5A8B7B", votes: { 1:true, 2:true, 3:true, 4:true, 5:false, 6:true, 7:true, 8:false } },
];

// ── Swipe Card ──
function SwipeCard({ book, onSwipe, isTop }) {
  const cardRef = useRef(null);
  const dragState = useRef({ startX: 0, currentX: 0, dragging: false });
  const [offset, setOffset] = useState(0);
  const [exiting, setExiting] = useState(null); // 'left' | 'right' | null

  const handleStart = (clientX) => {
    if (!isTop) return;
    dragState.current = { startX: clientX, currentX: clientX, dragging: true };
  };
  const handleMove = (clientX) => {
    if (!dragState.current.dragging) return;
    dragState.current.currentX = clientX;
    setOffset(clientX - dragState.current.startX);
  };
  const handleEnd = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    const diff = dragState.current.currentX - dragState.current.startX;
    if (Math.abs(diff) > 80) {
      doSwipe(diff > 0 ? "right" : "left");
    } else {
      setOffset(0);
    }
  };
  const doSwipe = (dir) => {
    setExiting(dir);
    setTimeout(() => onSwipe(dir === "right"), 300);
  };

  const rotation = offset * 0.08;
  const opacity = Math.max(0.3, 1 - Math.abs(offset) * 0.003);
  const yesOpacity = Math.min(1, Math.max(0, offset / 100));
  const nahOpacity = Math.min(1, Math.max(0, -offset / 100));

  if (!isTop) {
    return (
      <div style={{
        position: "absolute", top: 8, left: 8, right: 8,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 22, height: "100%", transform: "scale(0.95)",
      }} />
    );
  }

  return (
    <div
      ref={cardRef}
      onTouchStart={e => handleStart(e.touches[0].clientX)}
      onTouchMove={e => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={e => { e.preventDefault(); handleStart(e.clientX); }}
      onMouseMove={e => { if (dragState.current.dragging) handleMove(e.clientX); }}
      onMouseUp={handleEnd}
      onMouseLeave={() => { if (dragState.current.dragging) handleEnd(); }}
      style={{
        position: "absolute", top: 0, left: 0, right: 0,
        cursor: "grab", userSelect: "none", touchAction: "pan-y",
        transform: exiting
          ? `translateX(${exiting === "right" ? "120%" : "-120%"}) rotate(${exiting === "right" ? "15" : "-15"}deg)`
          : `translateX(${offset}px) rotate(${rotation}deg)`,
        opacity: exiting ? 0 : opacity,
        transition: exiting ? "all 0.3s ease-out" : offset === 0 ? "all 0.2s ease-out" : "none",
      }}
    >
      {/* Swipe labels */}
      <div style={{
        position: "absolute", top: 20, left: 20, zIndex: 10,
        padding: "6px 16px", borderRadius: 8,
        border: "2px solid #6BCB77", color: "#6BCB77",
        fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16,
        opacity: yesOpacity, transform: `rotate(-12deg) scale(${0.8 + yesOpacity * 0.2})`,
        transition: "opacity 0.1s",
      }}>YES</div>
      <div style={{
        position: "absolute", top: 20, right: 20, zIndex: 10,
        padding: "6px 16px", borderRadius: 8,
        border: "2px solid #E85D5D", color: "#E85D5D",
        fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16,
        opacity: nahOpacity, transform: `rotate(12deg) scale(${0.8 + nahOpacity * 0.2})`,
        transition: "opacity 0.1s",
      }}>NAH</div>

      <div style={{
        background: `linear-gradient(160deg, ${book.color}18, #111010 50%, ${book.color}0A)`,
        border: `1px solid ${book.color}25`,
        borderRadius: 22, padding: "32px 24px", minHeight: 340,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        {/* Genre + Mood tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20, justifyContent: "center" }}>
          <span style={{
            padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, color: "#C8C2B8", fontSize: 10, fontWeight: 500,
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.03em",
          }}>{book.genre}</span>
          {book.moodTags.map((t, i) => (
            <span key={i} style={{
              padding: "4px 10px", background: `${book.color}15`, border: `1px solid ${book.color}25`,
              borderRadius: 14, color: book.color, fontSize: 10, fontWeight: 500,
              fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.03em",
            }}>{t}</span>
          ))}
        </div>

        {/* Vibe description */}
        <p style={{
          fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: "italic",
          color: "#E8E2D8", lineHeight: 1.7, textAlign: "center", margin: 0, fontWeight: 400,
        }}>"{book.vibe}"</p>
      </div>
    </div>
  );
}

// ── Swipe Phase ──
function SwipePhase({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [votes, setVotes] = useState({});

  const handleSwipe = (liked) => {
    const book = DECK[currentIdx];
    const newVotes = { ...votes, [book.id]: liked };
    setVotes(newVotes);

    if (currentIdx >= DECK.length - 1) {
      setTimeout(() => onComplete(newVotes), 400);
    } else {
      setTimeout(() => setCurrentIdx(i => i + 1), 50);
    }
  };

  const currentBook = DECK[currentIdx];
  const nextBook = DECK[currentIdx + 1];

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "20px 16px",
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeInUp 0.5s ease-out" }}>
        <p style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#5A564F",
          letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px",
        }}>Book {currentIdx + 1} of {DECK.length}</p>
        <h2 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#F5F0E8",
          fontWeight: 600, margin: 0,
        }}>Would you read this?</h2>
      </div>

      {/* Card stack */}
      <div style={{ position: "relative", width: "100%", maxWidth: 380, height: 380, marginBottom: 24 }}>
        {nextBook && <SwipeCard book={nextBook} onSwipe={() => {}} isTop={false} />}
        <SwipeCard key={currentBook.id} book={currentBook} onSwipe={handleSwipe} isTop={true} />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 24, animation: "fadeInUp 0.5s ease-out 0.2s both" }}>
        <button onClick={() => handleSwipe(false)} style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(232,93,93,0.08)", border: "1px solid rgba(232,93,93,0.2)",
          color: "#E85D5D", fontSize: 22, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(232,93,93,0.15)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(232,93,93,0.08)"; }}
        >✕</button>
        <button onClick={() => handleSwipe(true)} style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(107,203,119,0.08)", border: "1px solid rgba(107,203,119,0.2)",
          color: "#6BCB77", fontSize: 22, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(107,203,119,0.15)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(107,203,119,0.08)"; }}
        >♥</button>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 5, marginTop: 20 }}>
        {DECK.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: 3,
            background: i < currentIdx ? (votes[DECK[i].id] ? "#6BCB77" : "#E85D5D")
              : i === currentIdx ? "#F5F0E8" : "rgba(255,255,255,0.08)",
            opacity: i <= currentIdx ? 0.7 : 0.3,
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Waiting Screen (simulated) ──
function WaitingScreen({ onReady }) {
  const [membersReady, setMembersReady] = useState([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setMembersReady(["Ava"]), 1200),
      setTimeout(() => setMembersReady(["Ava", "Luna"]), 2800),
      setTimeout(() => setMembersReady(["Ava", "Luna", "Max"]), 4200),
      setTimeout(() => onReady(), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: 24,
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{ animation: "float 3s ease-in-out infinite", fontSize: 36, marginBottom: 20 }}>✦</div>
      <h2 style={{
        fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#F5F0E8",
        fontWeight: 600, marginBottom: 8,
      }}>Waiting for your tribe...</h2>
      <p style={{ color: "#7A756D", fontSize: 13, marginBottom: 28 }}>Results drop when everyone finishes</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 260 }}>
        {/* You */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
          background: "rgba(107,203,119,0.06)", border: "1px solid rgba(107,203,119,0.12)",
          borderRadius: 12,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: "#6BCB77" }} />
          <span style={{ color: "#C8C2B8", fontSize: 13, flex: 1 }}>You</span>
          <span style={{ color: "#6BCB77", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>done</span>
        </div>
        {/* Members */}
        {MEMBERS.map((m, i) => {
          const ready = membersReady.includes(m.name);
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              background: ready ? "rgba(107,203,119,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${ready ? "rgba(107,203,119,0.12)" : "rgba(255,255,255,0.04)"}`,
              borderRadius: 12, transition: "all 0.4s",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 4,
                background: ready ? "#6BCB77" : "rgba(255,255,255,0.1)",
                transition: "background 0.4s",
              }} />
              <span style={{ color: "#C8C2B8", fontSize: 13, flex: 1 }}>{m.name}</span>
              <span style={{
                color: ready ? "#6BCB77" : "#5A564F", fontSize: 11,
                fontFamily: "'JetBrains Mono',monospace",
              }}>{ready ? "done" : "swiping..."}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Reveal Screen ──
function RevealScreen({ userVotes, onReset }) {
  const [revealedIdx, setRevealedIdx] = useState(-1);

  useEffect(() => {
    // Stagger reveal
    DECK.forEach((_, i) => {
      setTimeout(() => setRevealedIdx(i), 600 + i * 400);
    });
  }, []);

  // Calculate matches
  const results = DECK.map(book => {
    const userLiked = userVotes[book.id] || false;
    const memberVotes = MEMBERS.map(m => m.votes[book.id]);
    const allVotes = [userLiked, ...memberVotes];
    const yesCount = allVotes.filter(Boolean).length;
    const total = allVotes.length;
    const pct = yesCount / total;
    const voters = [
      { name: "You", liked: userLiked },
      ...MEMBERS.map(m => ({ name: m.name, liked: m.votes[book.id] })),
    ];
    return { ...book, yesCount, total, pct, voters, userLiked };
  }).sort((a, b) => b.pct - a.pct);

  const getTier = (pct) => {
    if (pct === 1) return { label: "Everyone loved this", emoji: "🎉", color: "#6BCB77" };
    if (pct >= 0.75) return { label: "Strong match", emoji: "✨", color: ACCENT };
    if (pct >= 0.5) return { label: "Split decision", emoji: "🤔", color: "#8B8580" };
    return { label: "Niche pick", emoji: "👀", color: "#5A564F" };
  };

  let lastTier = "";

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", padding: "24px 16px",
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeInUp 0.5s ease-out" }}>
        <h2 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#F5F0E8",
          fontWeight: 700, marginBottom: 6,
        }}>The Reveal ✦</h2>
        <p style={{ color: "#7A756D", fontSize: 13, margin: 0 }}>
          Here's what your tribe matched on
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
        {results.map((book, i) => {
          const tier = getTier(book.pct);
          const showTierHeader = tier.label !== lastTier;
          lastTier = tier.label;
          const revealed = i <= revealedIdx;

          return (
            <div key={book.id}>
              {showTierHeader && revealed && (
                <div style={{
                  padding: "12px 0 6px", marginTop: i > 0 ? 8 : 0,
                  animation: "fadeIn 0.4s ease-out",
                }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: tier.color,
                    letterSpacing: "0.1em", textTransform: "uppercase", margin: 0,
                  }}>{tier.emoji} {tier.label}</p>
                </div>
              )}

              <div style={{
                background: revealed ? `linear-gradient(135deg, ${book.color}0C, #111010)` : "rgba(255,255,255,0.02)",
                border: `1px solid ${revealed ? `${book.color}20` : "rgba(255,255,255,0.04)"}`,
                borderRadius: 16, padding: revealed ? "16px" : "16px",
                opacity: revealed ? 1 : 0.3,
                transform: revealed ? "scale(1)" : "scale(0.97)",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}>
                {revealed ? (
                  <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                    {/* Book info */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <h3 style={{
                          fontFamily: "'Playfair Display',serif", fontSize: 16, color: "#F5F0E8",
                          fontWeight: 600, margin: "0 0 2px",
                        }}>{book.title}</h3>
                        <p style={{ color: "#9B958A", fontSize: 12, margin: 0, fontStyle: "italic" }}>{book.author}</p>
                      </div>
                      <div style={{
                        padding: "4px 10px", background: `${tier.color}15`,
                        border: `1px solid ${tier.color}25`, borderRadius: 10,
                        fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                        color: tier.color,
                      }}>{book.yesCount}/{book.total}</div>
                    </div>

                    {/* Genre + Mood tags */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{
                        padding: "2px 8px", background: "rgba(255,255,255,0.05)",
                        borderRadius: 10, color: "#9B958A", fontSize: 10,
                      }}>{book.genre}</span>
                      {book.moodTags.map((t, j) => (
                        <span key={j} style={{
                          padding: "2px 8px", background: `${book.color}10`,
                          borderRadius: 10, color: "#7A756D", fontSize: 10,
                        }}>{t}</span>
                      ))}
                    </div>

                    {/* Who voted */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {book.voters.map((v, j) => (
                        <span key={j} style={{
                          padding: "3px 8px", borderRadius: 8,
                          background: v.liked ? "rgba(107,203,119,0.08)" : "rgba(232,93,93,0.06)",
                          color: v.liked ? "#6BCB77" : "#9B958A",
                          fontSize: 10, fontWeight: v.name === "You" ? 500 : 400,
                        }}>
                          {v.liked ? "♥" : "✕"} {v.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                    }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {revealedIdx >= DECK.length - 1 && (
        <div style={{ marginTop: 28, animation: "fadeInUp 0.5s ease-out", textAlign: "center" }}>
          <p style={{ color: "#7A756D", fontSize: 12, marginBottom: 16, fontStyle: "italic" }}>
            Tap a book to vote it as your tribe's next read
          </p>
          <button onClick={onReset} style={{
            padding: "14px 36px",
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            border: "none", borderRadius: 14, color: "#F5F0E8", fontSize: 15, fontWeight: 500,
            fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
            boxShadow: `0 4px 20px ${ACCENT}30`,
          }}>Start Over</button>
        </div>
      )}
    </div>
  );
}

// ── Intro Screen ──
function IntroScreen({ onStart }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: 24,
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{ animation: "fadeInUp 0.6s ease-out", textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 40, marginBottom: 12, animation: "float 4s ease-in-out infinite" }}>📚</div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#F5F0E8",
          fontWeight: 700, marginBottom: 8,
        }}>The Deck</h1>
        <p style={{ color: "#9B958A", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
          The book star gods curated 8 books for your tribe based on everyone's reading auras.
        </p>
        <p style={{ color: "#7A756D", fontSize: 13, lineHeight: 1.5, marginBottom: 32 }}>
          You'll see vibe descriptions only. No titles, no authors, no covers. Swipe right on the ones that call to you. After everyone finishes, we reveal the matches.
        </p>

        {/* Tribe members */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          <div style={{
            padding: "6px 12px", background: `${ACCENT}10`, border: `1px solid ${ACCENT}20`,
            borderRadius: 14, color: ACCENT, fontSize: 11, fontWeight: 500,
          }}>You</div>
          {MEMBERS.map((m, i) => (
            <div key={i} style={{
              padding: "6px 12px", background: `${m.color}10`, border: `1px solid ${m.color}20`,
              borderRadius: 14, color: m.color, fontSize: 11, fontWeight: 500,
            }}>{m.name}</div>
          ))}
        </div>

        <button onClick={onStart} style={{
          padding: "16px 48px",
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
          border: "none", borderRadius: 14, color: "#F5F0E8", fontSize: 16, fontWeight: 500,
          fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
          boxShadow: `0 4px 24px ${ACCENT}25`,
        }}>Start Swiping</button>
      </div>
    </div>
  );
}

// ── App ──
export default function SwipeDeck() {
  const [phase, setPhase] = useState("intro"); // intro | swipe | waiting | reveal
  const [userVotes, setUserVotes] = useState({});

  return (
    <div style={{ minHeight: "100vh", background: "#111010", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 30% 20%, rgba(196,149,106,0.03) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(139,110,78,0.03) 0%, transparent 55%)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {phase === "intro" && <IntroScreen onStart={() => setPhase("swipe")} />}
        {phase === "swipe" && (
          <SwipePhase onComplete={(votes) => {
            setUserVotes(votes);
            setPhase("waiting");
          }} />
        )}
        {phase === "waiting" && <WaitingScreen onReady={() => setPhase("reveal")} />}
        {phase === "reveal" && (
          <RevealScreen userVotes={userVotes} onReset={() => { setPhase("intro"); setUserVotes({}); }} />
        )}
      </div>
    </div>
  );
}
