import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes popIn{0%{opacity:0;transform:scale(0.85)}60%{transform:scale(1.03)}100%{opacity:1;transform:scale(1)}}
@keyframes pulseGlow{0%,100%{opacity:.3}50%{opacity:.6}}
@keyframes shimmerBg{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
`;

const ACCENT = "#C4956A";

// ── Mock Data ──
const USER = {
  name: "Leslie",
  archetype: "Feral Fae",
  color: "#D46A6A",
  color2: "#8B4A6A",
  bio: "You read like something is chasing you. Intensity is your love language, and every book is a dare you can't refuse.",
  strengths: ["Fearless taste", "Emotional stamina", "Late-night finisher"],
  creature: "fae",
};

const TRIBE_MEMBERS = [
  { name: "Luna", archetype: "Swoon Fawn", color: "#C47A8B", bio: "You read to ache. Every love story is a mirror, and you wouldn't have it any other way.", strengths: ["Empathy engine", "Romantic instinct", "Tissue-ready"] },
  { name: "Max", archetype: "Doom Bloom", color: "#7B5A8B", bio: "You garden in the dark. The stranger and more unsettling, the more alive you feel on the page.", strengths: ["Darkness navigator", "Gothic intuition", "Unflinching eye"] },
  { name: "Ava", archetype: "Glitch Witch", color: "#5A8B7B", bio: "Your shelves make no sense and that's the whole point. Genre is a suggestion you politely ignore.", strengths: ["Genre anarchist", "Pattern breaker", "Surprise seeker"] },
];

// Tribe activity states
const TRIBE = {
  name: "The Nightowls",
  code: "FABLE7",
  currentBook: { title: "The Secret History", author: "Donna Tartt" },
  status: "reading", // "waiting" | "swiping" | "voting" | "reading"
  nextDeckReady: true,
};

// ── Member Aura Modal ──
function MemberAuraModal({ member, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "fadeIn 0.2s ease-out",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: `linear-gradient(160deg, ${member.color}12, #141312 50%, ${member.color}08)`,
        border: `1px solid ${member.color}20`,
        borderRadius: 24, padding: "28px 22px", maxWidth: 340, width: "100%",
        animation: "popIn 0.35s cubic-bezier(0.16,1,0.3,1)",
        position: "relative",
      }}>
        <span onClick={onClose} style={{
          position: "absolute", top: 14, right: 16, color: "#5A564F",
          cursor: "pointer", fontSize: 16, padding: "4px 8px",
        }}>✕</span>

        {/* Mini creature placeholder */}
        <div style={{
          width: 56, height: 56, borderRadius: 28, margin: "0 auto 14px",
          background: `linear-gradient(135deg, ${member.color}25, ${member.color}10)`,
          border: `1px solid ${member.color}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
        }}>
          {member.archetype === "Swoon Fawn" ? "🦌" : member.archetype === "Doom Bloom" ? "🌺" : member.archetype === "Glitch Witch" ? "🧙" : member.archetype === "Feral Fae" ? "🧚" : "✦"}
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#5A564F",
            letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px",
          }}>{member.name}'s Reading Aura</p>
          <h3 style={{
            fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#F5F0E8",
            fontWeight: 700, margin: "0 0 12px",
          }}>{member.archetype}</h3>
          <p style={{
            color: "#B8B2A8", fontSize: 13, lineHeight: 1.6, fontWeight: 300,
            margin: "0 0 16px",
          }}>{member.bio}</p>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6 }}>
            {member.strengths.map((s, i) => (
              <span key={i} style={{
                padding: "4px 10px", background: `${member.color}10`,
                border: `1px solid ${member.color}1A`, borderRadius: 12,
                color: member.color, fontSize: 10, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </div>

        <p style={{
          textAlign: "center", marginTop: 16, fontSize: 11, color: "#4A463F", fontStyle: "italic",
        }}>Tap "View Full Aura" to see their complete profile</p>
      </div>
    </div>
  );
}

// ── Tappable Member Pill ──
function MemberPill({ member, onTap, size = "default" }) {
  const small = size === "small";
  return (
    <span onClick={() => onTap(member)} style={{
      padding: small ? "3px 8px" : "5px 12px",
      background: `${member.color}10`,
      border: `1px solid ${member.color}1A`,
      borderRadius: 14,
      color: member.color,
      fontSize: small ? 10 : 11,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>{member.name}</span>
  );
}

// ── Home Screen ──
export default function HomeScreen() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState("home"); // home | tribes | profile

  return (
    <div style={{ minHeight: "100vh", background: "#111010", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 20% 15%, ${USER.color}06 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, ${ACCENT}04 0%, transparent 55%)`,
      }} />

      {/* Member aura modal */}
      {selectedMember && (
        <MemberAuraModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      <div style={{ position: "relative", zIndex: 1, padding: "20px 16px 100px", maxWidth: 420, margin: "0 auto" }}>

        {/* ── Header / Logo ── */}
        <div style={{ animation: "fadeInUp 0.5s ease-out", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#F5F0E8",
                fontWeight: 700, margin: "0 0 2px", letterSpacing: "-0.02em",
              }}>Fabled</h1>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#5A564F",
                fontWeight: 300, margin: 0, fontStyle: "italic",
              }}>a whimsical book club</p>
            </div>
            {/* Notification bell placeholder */}
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, cursor: "pointer",
            }}>🔔</div>
          </div>
        </div>

        {/* ── Your Aura Card (mini) ── */}
        <div style={{
          animation: "fadeInUp 0.5s ease-out 0.1s both",
          background: `linear-gradient(145deg, ${USER.color}10, #111010 60%, ${USER.color2}08)`,
          border: `1px solid ${USER.color}18`,
          borderRadius: 20, padding: "18px 18px", marginBottom: 16,
          cursor: "pointer", transition: "all 0.2s",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -30, right: -30, width: 100, height: 100,
            background: `radial-gradient(circle, ${USER.color}10, transparent 70%)`,
            borderRadius: "50%", animation: "pulseGlow 5s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            {/* Creature avatar */}
            <div style={{
              width: 50, height: 50, borderRadius: 25,
              background: `linear-gradient(135deg, ${USER.color}20, ${USER.color2}15)`,
              border: `1px solid ${USER.color}25`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>🧚</div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#5A564F",
                letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 3px",
              }}>Your Reading Aura</p>
              <h3 style={{
                fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#F5F0E8",
                fontWeight: 600, margin: "0 0 3px",
              }}>{USER.archetype}</h3>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {USER.strengths.slice(0, 2).map((s, i) => (
                  <span key={i} style={{
                    padding: "2px 7px", background: `${USER.color}0C`,
                    borderRadius: 8, color: USER.color, fontSize: 9, fontWeight: 500,
                  }}>{s}</span>
                ))}
              </div>
            </div>
            <span style={{ color: "#4A463F", fontSize: 14 }}>›</span>
          </div>
        </div>

        {/* ── Tribe Section ── */}
        <div style={{ animation: "fadeInUp 0.5s ease-out 0.2s both", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{
              fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#F5F0E8",
              fontWeight: 600, margin: 0,
            }}>Your Tribe</h2>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#5A564F",
              letterSpacing: "0.08em", padding: "4px 10px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
            }}>Code: {TRIBE.code}</span>
          </div>

          {/* Tribe card */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 18, padding: "16px 16px", marginBottom: 10,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "#E8E2D8",
                fontWeight: 500, margin: 0,
              }}>{TRIBE.name}</h3>
              <span style={{
                padding: "3px 10px", background: "rgba(107,203,119,0.08)",
                border: "1px solid rgba(107,203,119,0.15)", borderRadius: 10,
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#6BCB77",
              }}>active</span>
            </div>

            {/* Members row - all tappable */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              <MemberPill member={USER} onTap={setSelectedMember} />
              {TRIBE_MEMBERS.map((m, i) => (
                <MemberPill key={i} member={m} onTap={setSelectedMember} />
              ))}
            </div>

            {/* Currently reading */}
            <div style={{
              background: `linear-gradient(135deg, rgba(123,75,106,0.08), transparent)`,
              border: "1px solid rgba(123,75,106,0.12)",
              borderRadius: 14, padding: "12px 14px",
            }}>
              <p style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#5A564F",
                letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px",
              }}>📖 Currently Reading</p>
              <p style={{
                fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#E8E2D8",
                fontWeight: 600, margin: "0 0 2px",
              }}>{TRIBE.currentBook.title}</p>
              <p style={{ color: "#7A756D", fontSize: 12, margin: 0, fontStyle: "italic" }}>
                {TRIBE.currentBook.author}
              </p>
            </div>
          </div>
        </div>

        {/* ── Action Cards ── */}
        <div style={{ animation: "fadeInUp 0.5s ease-out 0.3s both" }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#F5F0E8",
            fontWeight: 600, margin: "0 0 12px",
          }}>What's Next</h2>

          {/* Discussion CTA */}
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}0C, #111010)`,
            border: `1px solid ${ACCENT}18`,
            borderRadius: 18, padding: "18px 16px", marginBottom: 10,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${ACCENT}12`, border: `1px solid ${ACCENT}1A`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>💬</div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#F5F0E8",
                  fontWeight: 500, margin: "0 0 3px",
                }}>Start Discussion</p>
                <p style={{ color: "#7A756D", fontSize: 12, margin: 0 }}>
                  3 tiers of questions + hot takes for The Secret History
                </p>
              </div>
              <span style={{ color: "#4A463F", fontSize: 14 }}>›</span>
            </div>
          </div>

          {/* New Deck CTA */}
          {TRIBE.nextDeckReady && (
            <div style={{
              background: "linear-gradient(135deg, rgba(107,203,119,0.06), #111010)",
              border: "1px solid rgba(107,203,119,0.12)",
              borderRadius: 18, padding: "18px 16px", marginBottom: 10,
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(107,203,119,0.08)", border: "1px solid rgba(107,203,119,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>📚</div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#F5F0E8",
                    fontWeight: 500, margin: "0 0 3px",
                  }}>New Deck Ready</p>
                  <p style={{ color: "#7A756D", fontSize: 12, margin: 0 }}>
                    The book star gods curated 8 new picks for your tribe
                  </p>
                </div>
                <span style={{
                  padding: "4px 12px", background: "rgba(107,203,119,0.1)",
                  border: "1px solid rgba(107,203,119,0.2)", borderRadius: 10,
                  color: "#6BCB77", fontSize: 11, fontWeight: 500,
                  fontFamily: "'DM Sans',sans-serif",
                }}>Swipe</span>
              </div>
            </div>
          )}

          {/* Invite friends */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 18, padding: "18px 16px", marginBottom: 10,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>✉️</div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#F5F0E8",
                  fontWeight: 500, margin: "0 0 3px",
                }}>Invite to Tribe</p>
                <p style={{ color: "#7A756D", fontSize: 12, margin: 0 }}>
                  Share code <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#9B958A" }}>{TRIBE.code}</span> with friends
                </p>
              </div>
              <span style={{ color: "#4A463F", fontSize: 14 }}>›</span>
            </div>
          </div>
        </div>

        {/* ── Create New Tribe ── */}
        <div style={{ animation: "fadeInUp 0.5s ease-out 0.4s both", marginTop: 8 }}>
          <button style={{
            width: "100%", padding: "16px",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#7A756D",
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: 16 }}>+</span>
            Create New Tribe
          </button>
        </div>

        {/* ── Tagline footer ── */}
        <div style={{
          textAlign: "center", marginTop: 32, animation: "fadeInUp 0.5s ease-out 0.5s both",
        }}>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#3D3A35",
            lineHeight: 1.5, margin: 0,
          }}>Discover your reading aura. Swipe on books blind. Discuss with your tribe.</p>
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, #111010 70%, transparent)",
        padding: "12px 0 20px", zIndex: 50,
      }}>
        <div style={{
          display: "flex", justifyContent: "center", gap: 0,
          maxWidth: 320, margin: "0 auto",
        }}>
          {[
            { id: "home", icon: "🏠", label: "Home" },
            { id: "tribes", icon: "👥", label: "Tribes" },
            { id: "aura", icon: "✦", label: "My Aura" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "8px 0", background: "none", border: "none", cursor: "pointer",
            }}>
              <span style={{
                fontSize: tab.icon === "✦" ? 16 : 15,
                opacity: activeTab === tab.id ? 1 : 0.35,
                transition: "opacity 0.2s",
              }}>{tab.icon}</span>
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 10,
                color: activeTab === tab.id ? "#F5F0E8" : "#4A463F",
                fontWeight: activeTab === tab.id ? 500 : 400,
                transition: "color 0.2s",
              }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
