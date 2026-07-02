import { useState, useEffect } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeOut{from{opacity:1}to{opacity:0}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
@keyframes drawCircle{from{stroke-dashoffset:283}to{stroke-dashoffset:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%,100%{opacity:0.2}50%{opacity:0.6}}
@keyframes orbitOut{0%{transform:translate(0,0) scale(0)}100%{transform:var(--final);opacity:0.4}}
@keyframes glowPulse{0%,100%{filter:blur(20px) opacity(0.3)}50%{filter:blur(30px) opacity(0.6)}}
`;

const ACCENT = "#C4956A";

/* ─────────────────────────────────────────
   SPLASH SCREEN (2.5 sec intro animation)
   ───────────────────────────────────────── */
function Splash({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // phases: 0 = dark, 1 = sparkles appear, 2 = orb forms, 3 = wordmark, 4 = fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1400);
    const t4 = setTimeout(() => setPhase(4), 2300);
    const t5 = setTimeout(() => onComplete(), 2800);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#0A0A0C",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", zIndex: 100,
      opacity: phase === 4 ? 0 : 1,
      transition: "opacity 0.5s ease-out",
      overflow: "hidden",
    }}>
      <style>{css}</style>

      {/* Ambient gradient bloom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(196,149,106,0.08) 0%, transparent 50%)",
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 1s ease-out",
      }} />

      {/* Outer glow ring */}
      <div style={{
        position: "absolute", width: 200, height: 200, borderRadius: "50%",
        background: `radial-gradient(circle, ${ACCENT}40, transparent 70%)`,
        animation: phase >= 2 ? "glowPulse 3s ease-in-out infinite" : "none",
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 0.8s ease-out",
      }} />

      {/* Orbiting sparkles around the center */}
      {phase >= 1 && [...Array(8)].map((_, i) => {
        const angle = (i / 8) * 360;
        const distance = 110;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;
        return (
          <div key={i} style={{
            position: "absolute",
            color: ACCENT,
            fontSize: 12,
            opacity: 0.5,
            transform: `translate(${x}px, ${y}px)`,
            animation: `fadeIn 0.6s ease-out ${i * 0.05}s both, shimmer 2s ease-in-out infinite ${i * 0.1}s`,
          }}>✦</div>
        );
      })}

      {/* Central orb that forms */}
      <div style={{
        position: "relative",
        width: 100, height: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: phase >= 2 ? 1 : 0,
        transform: `scale(${phase >= 2 ? 1 : 0.5})`,
        transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        {/* Animated SVG circle drawing itself */}
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: "absolute" }}>
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="283"
            style={{
              animation: phase >= 2 ? "drawCircle 1.2s ease-out forwards" : "none",
              transformOrigin: "center",
            }}
          />
        </svg>

        {/* Inner glow */}
        <div style={{
          position: "absolute", inset: 20,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}60, transparent 70%)`,
          filter: "blur(8px)",
        }} />

        {/* Sparkle in center */}
        <span style={{
          fontSize: 32, color: "#F5F0E8",
          position: "relative", zIndex: 1,
          textShadow: `0 0 20px ${ACCENT}`,
          animation: phase >= 2 ? "float 3s ease-in-out infinite" : "none",
        }}>✦</span>
      </div>

      {/* Wordmark */}
      <div style={{
        position: "absolute",
        bottom: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        opacity: phase >= 3 ? 1 : 0,
        transform: `translateX(-50%) translateY(${phase >= 3 ? 0 : 12}px)`,
        transition: "all 0.7s ease-out",
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 48, fontWeight: 700,
          color: "#F5F0E8", margin: 0,
          letterSpacing: "0.04em",
        }}>fabled</h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "rgba(255,255,255,0.4)", margin: "4px 0 0",
          fontStyle: "italic", letterSpacing: "0.05em",
        }}>a whimsical book club</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SIGN-IN / PRE-ONBOARDING SCREEN
   First screen for new users
   ───────────────────────────────────────── */
function SignInScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0C",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{css}</style>

      {/* Ambient gradient */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 20%, rgba(196,149,106,0.1) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(139,106,212,0.06) 0%, transparent 60%)",
      }} />

      {/* Sparkle dots */}
      {[
        { top: "12%", left: "15%", delay: 0 },
        { top: "20%", right: "20%", delay: 0.5 },
        { top: "75%", left: "20%", delay: 1.5 },
        { top: "65%", right: "15%", delay: 1 },
      ].map((s, i) => (
        <div key={i} style={{
          position: "fixed", ...s, color: ACCENT,
          fontSize: 8, opacity: 0.4,
          animation: `shimmer 3s ease-in-out infinite ${s.delay}s`,
          pointerEvents: "none",
        }}>✦</div>
      ))}

      {/* Main content */}
      <div style={{
        position: "relative", zIndex: 1,
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 24px",
        maxWidth: 420, width: "100%", margin: "0 auto",
        textAlign: "center",
      }}>
        {/* Wordmark at top */}
        <div style={{
          marginBottom: 48,
          animation: "fadeInDown 0.6s ease-out",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ color: ACCENT, fontSize: 18 }}>✦</span>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700,
              color: "#F5F0E8", letterSpacing: "0.03em",
            }}>fabled</span>
          </div>
        </div>

        {/* Floating orb visual */}
        <div style={{
          marginBottom: 32,
          animation: "fadeInUp 0.6s ease-out 0.1s both, float 4s ease-in-out infinite",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 40,
            background: `radial-gradient(circle, ${ACCENT}30, ${ACCENT}10, transparent)`,
            border: `1px solid ${ACCENT}25`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 60px ${ACCENT}20`,
          }}>
            <span style={{ fontSize: 32, color: "#F5F0E8", textShadow: `0 0 20px ${ACCENT}` }}>✦</span>
          </div>
        </div>

        {/* Welcome text */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ACCENT,
          letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px",
          animation: "fadeInUp 0.6s ease-out 0.2s both",
        }}>Welcome to Fabled</p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700,
          color: "#F5F0E8", margin: "0 0 16px",
          lineHeight: 1.15, letterSpacing: "-0.02em",
          animation: "fadeInUp 0.6s ease-out 0.3s both",
        }}>
          The Story Spirits<br />
          <em style={{ fontStyle: "italic", color: ACCENT }}>are waiting</em>.
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#9B958A",
          lineHeight: 1.6, margin: "0 0 40px", padding: "0 8px",
          animation: "fadeInUp 0.6s ease-out 0.4s both",
        }}>
          Discover your reading aura,<br />find your tribe.
        </p>

        {/* Primary CTA: Get Started */}
        <button style={{
          width: "100%", maxWidth: 320,
          padding: "16px 32px",
          background: `linear-gradient(135deg, ${ACCENT}, #8B6E4E)`,
          border: "none", borderRadius: 14,
          color: "#F5F0E8", fontSize: 15, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          boxShadow: `0 4px 24px ${ACCENT}30`,
          marginBottom: 12,
          animation: "fadeInUp 0.6s ease-out 0.5s both",
        }}>Get started</button>

        {/* Divider with "or" */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          margin: "12px 0", width: "100%", maxWidth: 320,
          animation: "fadeInUp 0.6s ease-out 0.6s both",
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontSize: 11, color: "#5A564F", fontStyle: "italic" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Secondary CTAs */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 8,
          width: "100%", maxWidth: 320,
          animation: "fadeInUp 0.6s ease-out 0.7s both",
        }}>
          <button style={{
            padding: "12px 20px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, color: "#C8C2B8",
            fontSize: 14, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>🔑</span>
            Continue with invite code
          </button>

          <button style={{
            padding: "12px 20px",
            background: "transparent",
            border: "none",
            color: "#7A756D", fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            textDecoration: "underline", textUnderlineOffset: 3,
            textDecorationColor: "rgba(255,255,255,0.15)",
          }}>I already have an account</button>
        </div>

        {/* Privacy/terms */}
        <p style={{
          marginTop: 32, color: "#3A363F", fontSize: 10,
          maxWidth: 280, lineHeight: 1.5,
          animation: "fadeInUp 0.6s ease-out 0.8s both",
        }}>
          By continuing, you agree to our <span style={{ color: "#5A564F", cursor: "pointer", textDecoration: "underline" }}>Terms</span> and <span style={{ color: "#5A564F", cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>.
        </p>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center", padding: "0 24px 32px",
        animation: "fadeIn 1s ease-out 1s both",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#3A363F",
          margin: 0, fontStyle: "italic", letterSpacing: "0.05em",
        }}>a whimsical book club · made with ✦</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN: shows splash, then sign-in
   ───────────────────────────────────────── */
export default function FabledIntroFlow() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState("flow"); // flow | splash | signin

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0A0A0C" }}>
      <style>{css}</style>

      {/* View toggle (for prototype only - not part of actual app) */}
      <div style={{
        position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)",
        zIndex: 200, display: "flex", gap: 6,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)",
        padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
      }}>
        {[
          ["flow", "Full Flow"],
          ["splash", "Splash Only"],
          ["signin", "Sign-In Only"],
        ].map(([id, label]) => (
          <button key={id} onClick={() => {
            setView(id);
            if (id === "flow") setShowSplash(true);
            if (id === "splash") setShowSplash(true);
            if (id === "signin") setShowSplash(false);
          }} style={{
            padding: "5px 11px", borderRadius: 7,
            background: view === id ? "rgba(255,255,255,0.1)" : "transparent",
            border: "none", color: view === id ? "#F5F0E8" : "#7A756D",
            fontSize: 10, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          }}>{label}</button>
        ))}
        {view !== "signin" && (
          <button onClick={() => setShowSplash(true)} style={{
            padding: "5px 11px", borderRadius: 7,
            background: "rgba(196,149,106,0.15)",
            border: "1px solid rgba(196,149,106,0.25)",
            color: ACCENT, fontSize: 10,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          }}>Replay splash</button>
        )}
      </div>

      {/* Splash */}
      {showSplash && view !== "signin" && (
        <Splash onComplete={() => {
          if (view === "flow") setShowSplash(false);
        }} />
      )}

      {/* Sign-in screen */}
      {(!showSplash || view === "signin") && view !== "splash" && <SignInScreen />}

      {/* Splash placeholder for splash-only view */}
      {view === "splash" && !showSplash && (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#5A564F", fontSize: 13, fontStyle: "italic",
        }}>Click "Replay splash" to see the animation again</div>
      )}
    </div>
  );
}
