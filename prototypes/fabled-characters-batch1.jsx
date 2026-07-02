import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseGlow{0%,100%{opacity:.35}50%{opacity:.7}}
@keyframes floatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes orbitSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes drift{0%,100%{transform:translate(0,0)}33%{transform:translate(3px,-2px)}66%{transform:translate(-2px,2px)}}
`;

// ── THE NOCTURNE ──
// Figure engulfed in swirling dark pages, full moon, dissolving edges
function NocturneIllustration({ c1 = "#8B3A62", c2 = "#D46A8B", c3 = "#4A2040" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 240, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="nMoon">
          <stop offset="0%" stopColor={c2} stopOpacity="0.25"/>
          <stop offset="60%" stopColor={c2} stopOpacity="0.06"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="nGlow">
          <stop offset="0%" stopColor={c1} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={c1} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="nRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.4"/>
        </linearGradient>
        <clipPath id="nFade">
          <ellipse cx="120" cy="200" rx="80" ry="60"/>
        </clipPath>
      </defs>

      {/* Moon */}
      <circle cx="175" cy="55" r="50" fill="url(#nMoon)"/>
      <circle cx="175" cy="55" r="22" fill={c2} opacity="0.2"/>
      <circle cx="175" cy="55" r="18" fill={c2} opacity="0.12"/>
      <circle cx="182" cy="48" r="14" fill="#111010" opacity="0.8"/>

      {/* Ambient glow behind figure */}
      <circle cx="120" cy="150" r="90" fill="url(#nGlow)"/>

      {/* Swirling page fragments (background layer) */}
      {[
        [55, 80, -25, 0.15, 12, 8],
        [185, 95, 30, 0.12, 10, 7],
        [45, 160, -15, 0.1, 11, 7],
        [195, 170, 20, 0.08, 9, 6],
        [65, 220, -30, 0.06, 10, 6],
        [180, 230, 35, 0.05, 8, 5],
      ].map(([x, y, rot, op, w, h], i) => (
        <g key={`bp${i}`} transform={`translate(${x},${y}) rotate(${rot})`}>
          <rect x={-w/2} y={-h/2} width={w} height={h} rx="1" fill={c2} opacity={op}/>
          {/* Text lines on page */}
          <line x1={-w/2+2} y1={-h/2+2} x2={w/2-2} y2={-h/2+2} stroke={c1} strokeWidth="0.3" opacity={op*2}/>
          <line x1={-w/2+2} y1={-h/2+4} x2={w/2-4} y2={-h/2+4} stroke={c1} strokeWidth="0.3" opacity={op*1.5}/>
        </g>
      ))}

      {/* Figure body - flowing robe */}
      <path d="M95,120 Q90,108 100,100 Q110,92 120,90 Q130,92 140,100 Q150,108 145,120
               L155,200 Q158,230 150,255 Q140,268 120,270 Q100,268 90,255 Q82,230 85,200 Z"
        fill="url(#nRobe)"/>

      {/* Robe folds */}
      <path d="M100,140 Q105,180 98,230" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.15"/>
      <path d="M140,140 Q135,180 142,230" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.15"/>
      <path d="M115,135 Q112,190 108,240" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.1"/>

      {/* Dissolving edges - shadow tendrils */}
      {[
        "M85,200 Q70,210 60,225 Q55,235 62,240",
        "M90,230 Q75,240 68,255 Q65,262 70,265",
        "M155,200 Q170,208 178,220 Q182,230 176,235",
        "M150,230 Q165,238 172,250 Q175,258 170,262",
        "M95,250 Q80,258 72,268",
        "M145,250 Q160,256 168,265",
      ].map((d, i) => (
        <path key={`t${i}`} d={d} fill="none" stroke={c1} strokeWidth={2.5 - i * 0.3} opacity={0.25 - i * 0.03} strokeLinecap="round"/>
      ))}

      {/* Ink dissolution particles */}
      {[
        [75, 240, 3], [165, 235, 2.5], [68, 255, 2], [172, 250, 2],
        [80, 265, 1.5], [160, 260, 1.5], [90, 270, 1], [150, 268, 1],
      ].map(([x, y, r], i) => (
        <circle key={`ip${i}`} cx={x} cy={y} r={r} fill={c1} opacity={0.2 - i * 0.02}/>
      ))}

      {/* Head */}
      <circle cx="120" cy="80" r="18" fill={c1} opacity="0.85"/>

      {/* Hood/hair shadow */}
      <path d="M102,78 Q100,65 108,58 Q115,52 120,50 Q125,52 132,58 Q140,65 138,78"
        fill={c3} opacity="0.5"/>

      {/* Wide consuming eyes */}
      <g>
        {/* Eye sockets */}
        <ellipse cx="112" cy="78" rx="6" ry="5" fill="#111010" opacity="0.6"/>
        <ellipse cx="128" cy="78" rx="6" ry="5" fill="#111010" opacity="0.6"/>
        {/* Glowing irises */}
        <circle cx="112" cy="78" r="3.5" fill={c2} opacity="0.7"/>
        <circle cx="128" cy="78" r="3.5" fill={c2} opacity="0.7"/>
        {/* Pupils */}
        <circle cx="112" cy="78" r="1.8" fill="#111010"/>
        <circle cx="128" cy="78" r="1.8" fill="#111010"/>
        {/* Highlights */}
        <circle cx="113.5" cy="77" r="1" fill="#F5F0E8" opacity="0.6"/>
        <circle cx="129.5" cy="77" r="1" fill="#F5F0E8" opacity="0.6"/>
        {/* Glow around eyes */}
        <ellipse cx="112" cy="78" rx="8" ry="6" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.15"/>
        <ellipse cx="128" cy="78" rx="8" ry="6" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.15"/>
      </g>

      {/* Swirling page fragments (foreground, closer) */}
      {[
        [70, 115, -40, 0.2, 14, 9],
        [175, 130, 25, 0.18, 12, 8],
        [55, 175, 15, 0.15, 13, 8],
        [190, 185, -20, 0.12, 11, 7],
      ].map(([x, y, rot, op, w, h], i) => (
        <g key={`fp${i}`} transform={`translate(${x},${y}) rotate(${rot})`}>
          <rect x={-w/2} y={-h/2} width={w} height={h} rx="1.5" fill={c2} opacity={op}/>
          <line x1={-w/2+2} y1={-h/2+2.5} x2={w/2-2} y2={-h/2+2.5} stroke="#F5F0E8" strokeWidth="0.3" opacity={op}/>
          <line x1={-w/2+2} y1={-h/2+5} x2={w/2-3} y2={-h/2+5} stroke="#F5F0E8" strokeWidth="0.3" opacity={op*0.7}/>
        </g>
      ))}

      {/* Small stars / dust particles */}
      {[[155,38],[195,75],[60,50],[200,120],[48,100],[185,45]].map(([x,y],i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={0.8 + i * 0.15} fill={c2} opacity={0.3 - i * 0.03}/>
      ))}
    </svg>
  );
}

// ── THE ARCHIVIST ──
// Robed figure at towering desk, books orbiting like planets, celestial dust
function ArchivistIllustration({ c1 = "#6A7B8B", c2 = "#A8C0D4", c3 = "#3A4A5A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 240, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="aGlow">
          <stop offset="0%" stopColor={c2} stopOpacity="0.1"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="aRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.75"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.5"/>
        </linearGradient>
        <linearGradient id="aDesk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* Central glow */}
      <circle cx="120" cy="140" r="100" fill="url(#aGlow)"/>

      {/* Orbital rings (book paths) */}
      {[70, 55, 42].map((r, i) => (
        <ellipse key={`or${i}`} cx="120" cy="100" rx={r + 30} ry={r}
          fill="none" stroke={c2} strokeWidth="0.4" opacity={0.1 - i * 0.02}
          strokeDasharray={`${2 + i} ${4 + i * 2}`}
          transform={`rotate(${-10 + i * 8} 120 100)`}/>
      ))}

      {/* Orbiting books */}
      {[
        [62, 65, -20, 0.35], [185, 80, 15, 0.3], [55, 120, -30, 0.25],
        [190, 110, 25, 0.2], [70, 155, 10, 0.18], [178, 150, -15, 0.15],
        [90, 50, 5, 0.28], [160, 55, -10, 0.22],
      ].map(([x, y, rot, op], i) => (
        <g key={`ob${i}`} transform={`translate(${x},${y}) rotate(${rot})`}>
          {/* Book */}
          <rect x="-6" y="-4" width="12" height="8" rx="1" fill={i % 2 === 0 ? c1 : c2} opacity={op}/>
          <line x1="-6" y1="0" x2="6" y2="0" stroke={c3} strokeWidth="0.5" opacity={op * 0.5}/>
          {/* Spine */}
          <rect x="-6" y="-4" width="2" height="8" rx="0.5" fill={c3} opacity={op * 0.5}/>
        </g>
      ))}

      {/* Stone desk */}
      <path d="M60,195 L55,200 L55,230 Q55,235 60,235 L180,235 Q185,235 185,230 L185,200 L180,195 Z"
        fill="url(#aDesk)"/>
      {/* Desk surface */}
      <rect x="58" y="192" width="124" height="6" rx="2" fill={c1} opacity="0.3"/>
      {/* Desk texture lines */}
      <line x1="65" y1="210" x2="175" y2="210" stroke={c2} strokeWidth="0.3" opacity="0.06"/>
      <line x1="65" y1="220" x2="175" y2="220" stroke={c2} strokeWidth="0.3" opacity="0.04"/>

      {/* Open book on desk */}
      <g transform="translate(120, 186)">
        <path d="M-16,0 Q-8,-6 0,-2" fill={c2} opacity="0.2"/>
        <path d="M16,0 Q8,-6 0,-2" fill={c2} opacity="0.2"/>
        <line x1="0" y1="-2" x2="0" y2="0" stroke={c2} strokeWidth="0.4" opacity="0.15"/>
        {/* Text lines */}
        {[-12,-8,-4,4,8,12].map((x,i) => (
          <line key={`tl${i}`} x1={x < 0 ? x : x-2} y1={-3 + Math.abs(x)*0.15} x2={x < 0 ? x+4 : x+2} y2={-3 + Math.abs(x)*0.15}
            stroke={c2} strokeWidth="0.3" opacity="0.15"/>
        ))}
      </g>

      {/* Figure - seated at desk */}
      {/* Body/robe */}
      <path d="M100,130 Q95,120 105,112 Q112,106 120,104 Q128,106 135,112 Q145,120 140,130
               L148,185 Q150,190 145,192 L95,192 Q90,190 92,185 Z"
        fill="url(#aRobe)"/>

      {/* Arms resting on desk */}
      <path d="M95,155 Q82,165 78,178 Q76,185 80,188 L95,192" fill={c1} opacity="0.55" stroke={c3} strokeWidth="0.5" strokeOpacity="0.1"/>
      <path d="M145,155 Q158,165 162,178 Q164,185 160,188 L145,192" fill={c1} opacity="0.55" stroke={c3} strokeWidth="0.5" strokeOpacity="0.1"/>
      {/* Hands */}
      <ellipse cx="82" cy="188" rx="5" ry="3.5" fill={c1} opacity="0.5"/>
      <ellipse cx="158" cy="188" rx="5" ry="3.5" fill={c1} opacity="0.5"/>

      {/* Robe folds */}
      <path d="M108,130 Q106,155 104,180" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.12"/>
      <path d="M132,130 Q134,155 136,180" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.12"/>

      {/* Head */}
      <circle cx="120" cy="94" r="16" fill={c1} opacity="0.85"/>

      {/* Hood */}
      <path d="M104,92 Q102,78 110,70 Q116,65 120,63 Q124,65 130,70 Q138,78 136,92"
        fill={c3} opacity="0.5"/>

      {/* Eyes - calm, focused */}
      <circle cx="114" cy="93" r="2.5" fill="#111010"/>
      <circle cx="126" cy="93" r="2.5" fill="#111010"/>
      <circle cx="114" cy="93" r="1.5" fill={c2} opacity="0.6"/>
      <circle cx="126" cy="93" r="1.5" fill={c2} opacity="0.6"/>
      <circle cx="114.8" cy="92.5" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      <circle cx="126.8" cy="92.5" r="0.6" fill="#F5F0E8" opacity="0.5"/>

      {/* Celestial dust particles */}
      {[[45,45],[195,40],[38,95],[202,88],[50,140],[192,145],[80,38],[165,42],[42,180],[198,175]].map(([x,y],i) => (
        <circle key={`cd${i}`} cx={x} cy={y} r={0.6 + Math.sin(i) * 0.4} fill={c2} opacity={0.25 - i * 0.015}/>
      ))}

      {/* Connecting dust lines between some particles */}
      <line x1="45" y1="45" x2="80" y2="38" stroke={c2} strokeWidth="0.3" opacity="0.05"/>
      <line x1="195" y1="40" x2="165" y2="42" stroke={c2} strokeWidth="0.3" opacity="0.05"/>
    </svg>
  );
}

// ── THE WANDERER ──
// Cloaked figure in mist-filled corridor of floating pages, text-mist
function WandererIllustration({ c1 = "#7B8B6A", c2 = "#B8C8A8", c3 = "#4A5A3A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 240, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="wGlow">
          <stop offset="0%" stopColor={c1} stopOpacity="0.08"/>
          <stop offset="100%" stopColor={c1} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="wRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.7"/>
          <stop offset="80%" stopColor={c3} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="wMist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c2} stopOpacity="0"/>
          <stop offset="50%" stopColor={c2} stopOpacity="0.06"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Background glow */}
      <circle cx="120" cy="140" r="110" fill="url(#wGlow)"/>

      {/* Mist layers (horizontal fog bands) */}
      {[
        [0, 80, 240, 30, 0.04],
        [0, 130, 240, 40, 0.05],
        [0, 180, 240, 35, 0.06],
        [0, 220, 240, 45, 0.05],
        [0, 250, 240, 30, 0.04],
      ].map(([x, y, w, h, op], i) => (
        <rect key={`m${i}`} x={x} y={y} width={w} height={h} fill="url(#wMist)" opacity={op * (1 + i * 0.2)}/>
      ))}

      {/* Corridor perspective lines (faint) */}
      <line x1="40" y1="30" x2="80" y2="270" stroke={c1} strokeWidth="0.4" opacity="0.06"/>
      <line x1="200" y1="30" x2="160" y2="270" stroke={c1} strokeWidth="0.4" opacity="0.06"/>
      <line x1="60" y1="25" x2="90" y2="275" stroke={c2} strokeWidth="0.3" opacity="0.04"/>
      <line x1="180" y1="25" x2="150" y2="275" stroke={c2} strokeWidth="0.3" opacity="0.04"/>

      {/* Floating text-pages (scattered, drifting) */}
      {[
        [50, 60, -20, 0.18, 16, 11],
        [185, 75, 30, 0.15, 14, 10],
        [38, 140, 10, 0.12, 15, 10],
        [195, 150, -25, 0.1, 13, 9],
        [55, 210, -5, 0.08, 14, 9],
        [190, 215, 18, 0.07, 12, 8],
        [70, 100, 35, 0.14, 12, 8],
        [170, 110, -15, 0.11, 11, 8],
      ].map(([x, y, rot, op, w, h], i) => (
        <g key={`pg${i}`} transform={`translate(${x},${y}) rotate(${rot})`}>
          <rect x={-w/2} y={-h/2} width={w} height={h} rx="1" fill={c2} opacity={op}/>
          {/* Faint text lines */}
          {[0,1,2,3].map(j => (
            <line key={j} x1={-w/2+2} y1={-h/2+2+j*2.5} x2={-w/2+2+(w-4)*(0.8-j*0.1)} y2={-h/2+2+j*2.5}
              stroke={c1} strokeWidth="0.3" opacity={op * 0.8}/>
          ))}
        </g>
      ))}

      {/* Figure - walking, cloak trailing */}
      {/* Cloak/robe - flowing, long */}
      <path d="M105,115 Q98,105 107,96 Q114,89 120,87 Q126,89 133,96 Q142,105 135,115
               L150,210 Q155,245 148,265 Q140,275 120,278 Q100,275 92,265 Q85,245 90,210 Z"
        fill="url(#wRobe)"/>

      {/* Cloak trailing edge dissolving into mist */}
      <path d="M92,260 Q78,265 70,262 Q65,258 68,250" fill="none" stroke={c1} strokeWidth="2" opacity="0.15" strokeLinecap="round"/>
      <path d="M148,260 Q162,263 168,258 Q172,252 168,248" fill="none" stroke={c1} strokeWidth="2" opacity="0.12" strokeLinecap="round"/>

      {/* Walking staff */}
      <line x1="155" y1="105" x2="170" y2="268" stroke={c1} strokeWidth="2.5" opacity="0.35" strokeLinecap="round"/>
      <circle cx="170" cy="270" r="2" fill={c1} opacity="0.25"/>

      {/* Arm holding staff */}
      <path d="M135,140 Q145,135 152,128 Q155,122 155,115" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>

      {/* Robe folds */}
      <path d="M110,130 Q108,175 100,240" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.12"/>
      <path d="M130,130 Q132,175 138,240" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.12"/>
      <path d="M120,120 Q118,180 115,250" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.08"/>

      {/* Head */}
      <circle cx="120" cy="80" r="15" fill={c1} opacity="0.8"/>

      {/* Deep hood */}
      <path d="M105,80 Q100,65 110,56 Q116,50 120,48 Q124,50 130,56 Q140,65 135,80"
        fill={c3} opacity="0.6"/>
      {/* Hood shadow deeper */}
      <path d="M108,78 Q106,70 112,64 Q116,60 120,58 Q124,60 128,64 Q134,70 132,78"
        fill="#111010" opacity="0.2"/>

      {/* Eyes barely visible under hood */}
      <circle cx="114" cy="78" r="2" fill={c2} opacity="0.4"/>
      <circle cx="126" cy="78" r="2" fill={c2} opacity="0.4"/>
      <circle cx="114" cy="78" r="1" fill="#F5F0E8" opacity="0.25"/>
      <circle cx="126" cy="78" r="1" fill="#F5F0E8" opacity="0.25"/>

      {/* Mist particles */}
      {[[30,90],[210,85],[25,160],[215,155],[35,230],[205,225],[50,55],[190,50]].map(([x,y],i) => (
        <ellipse key={`mp${i}`} cx={x} cy={y} rx={4+i*0.5} ry={1.5+i*0.2} fill={c2} opacity={0.06-i*0.005}/>
      ))}

      {/* Tiny text fragments floating in mist */}
      {[[45,175],[195,180],[55,245],[185,240]].map(([x,y],i) => (
        <g key={`tf${i}`}>
          <line x1={x} y1={y} x2={x+8} y2={y} stroke={c2} strokeWidth="0.3" opacity="0.1"/>
          <line x1={x+1} y1={y+2.5} x2={x+6} y2={y+2.5} stroke={c2} strokeWidth="0.3" opacity="0.07"/>
        </g>
      ))}
    </svg>
  );
}

// ── THE CONJURER ──
// Two books touching spine-to-spine, hearts forming, figure watching
function ConjurerIllustration({ c1 = "#C47A5A", c2 = "#E8A888", c3 = "#7A4A3A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 240, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="cGlow">
          <stop offset="0%" stopColor={c2} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="cRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.4"/>
        </linearGradient>
      </defs>

      {/* Warm glow behind the books */}
      <circle cx="120" cy="110" r="70" fill="url(#cGlow)"/>
      <circle cx="120" cy="110" r="45" fill={c2} opacity="0.03"/>

      {/* Two books touching spine-to-spine */}
      {/* Left book */}
      <g transform="translate(100, 95) rotate(-8)">
        <rect x="-20" y="-28" width="20" height="38" rx="2" fill={c1} opacity="0.5"/>
        <rect x="-20" y="-28" width="3" height="38" rx="1" fill={c3} opacity="0.4"/>
        {/* Pages */}
        <rect x="-17" y="-26" width="15" height="34" rx="1" fill={c2} opacity="0.12"/>
        {[0,1,2,3,4,5].map(i => (
          <line key={`ll${i}`} x1="-14" y1={-22+i*6} x2="-5" y2={-22+i*6} stroke={c1} strokeWidth="0.3" opacity="0.15"/>
        ))}
      </g>
      {/* Right book */}
      <g transform="translate(140, 95) rotate(8)">
        <rect x="0" y="-28" width="20" height="38" rx="2" fill={c1} opacity="0.5"/>
        <rect x="17" y="-28" width="3" height="38" rx="1" fill={c3} opacity="0.4"/>
        <rect x="2" y="-26" width="15" height="34" rx="1" fill={c2} opacity="0.12"/>
        {[0,1,2,3,4,5].map(i => (
          <line key={`rl${i}`} x1="5" y1={-22+i*6} x2="14" y2={-22+i*6} stroke={c1} strokeWidth="0.3" opacity="0.15"/>
        ))}
      </g>

      {/* Hearts forming between the books */}
      {[
        [120, 85, 1.0, 0.35],
        [115, 72, 0.7, 0.25],
        [125, 68, 0.5, 0.2],
        [120, 58, 0.4, 0.15],
        [112, 55, 0.3, 0.1],
        [128, 52, 0.3, 0.08],
      ].map(([x, y, s, op], i) => (
        <path key={`h${i}`}
          d={`M${x},${y+3*s} Q${x-4*s},${y+1*s} ${x-4*s},${y-2*s} Q${x-4*s},${y-5*s} ${x},${y-2*s} Q${x+4*s},${y-5*s} ${x+4*s},${y-2*s} Q${x+4*s},${y+1*s} ${x},${y+3*s}`}
          fill={c2} opacity={op}/>
      ))}

      {/* Light rays between books */}
      {[0,1,2,3,4].map(i => (
        <line key={`lr${i}`}
          x1="120" y1={90-i*5}
          x2={112 + Math.sin(i * 1.5) * 15} y2={50 - i * 3}
          stroke={c2} strokeWidth="0.4" opacity={0.08 - i * 0.01}/>
      ))}

      {/* Figure - stepped back, watching */}
      {/* Robe */}
      <path d="M100,165 Q95,155 103,148 Q112,140 120,138 Q128,140 137,148 Q145,155 140,165
               L148,240 Q150,258 144,268 Q136,275 120,278 Q104,275 96,268 Q90,258 92,240 Z"
        fill="url(#cRobe)"/>

      {/* Arms open, palms out (gesture of letting go) */}
      <path d="M100,180 Q85,175 75,182 Q70,186 72,190"
        fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <path d="M140,180 Q155,175 165,182 Q170,186 168,190"
        fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      {/* Hands */}
      <circle cx="72" cy="191" r="4" fill={c1} opacity="0.45"/>
      <circle cx="168" cy="191" r="4" fill={c1} opacity="0.45"/>

      {/* Robe folds */}
      <path d="M108,168 Q106,210 102,255" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.12"/>
      <path d="M132,168 Q134,210 138,255" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.12"/>

      {/* Head */}
      <circle cx="120" cy="132" r="14" fill={c1} opacity="0.8"/>

      {/* Soft hood/hair */}
      <path d="M106,130 Q104,120 110,114 Q115,110 120,108 Q125,110 130,114 Q136,120 134,130"
        fill={c3} opacity="0.4"/>

      {/* Eyes - soft, watching upward toward the hearts */}
      <circle cx="114" cy="131" r="2.5" fill="#111010"/>
      <circle cx="126" cy="131" r="2.5" fill="#111010"/>
      <circle cx="114" cy="131" r="1.5" fill={c2} opacity="0.55"/>
      <circle cx="126" cy="131" r="1.5" fill={c2} opacity="0.55"/>
      <circle cx="114.5" cy="130.2" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      <circle cx="126.5" cy="130.2" r="0.6" fill="#F5F0E8" opacity="0.5"/>

      {/* Gentle smile */}
      <path d="M116,137 Q120,140 124,137" fill="none" stroke="#111010" strokeWidth="0.6" opacity="0.2"/>

      {/* Floating particles - warm */}
      {[[80,45],[160,42],[60,120],[180,115],[70,200],[170,195],[95,30],[145,28]].map(([x,y],i) => (
        <circle key={`wp${i}`} cx={x} cy={y} r={0.7+i*0.1} fill={c2} opacity={0.2-i*0.015}/>
      ))}
    </svg>
  );
}

// ── Display Grid ──
export default function CharacterBatch1() {
  const [selected, setSelected] = useState(null);

  const chars = [
    { name: "The Nocturne", desc: "3am finishers, intensity addicts", component: NocturneIllustration, colors: { c1: "#8B3A62", c2: "#D46A8B", c3: "#4A2040" } },
    { name: "The Archivist", desc: "Layer diggers, annotators, re-readers", component: ArchivistIllustration, colors: { c1: "#6A7B8B", c2: "#A8C0D4", c3: "#3A4A5A" } },
    { name: "The Wanderer", desc: "Atmosphere chasers, mood readers", component: WandererIllustration, colors: { c1: "#7B8B6A", c2: "#B8C8A8", c3: "#4A5A3A" } },
    { name: "The Conjurer", desc: "Romance devotees, connection chasers", component: ConjurerIllustration, colors: { c1: "#C47A5A", c2: "#E8A888", c3: "#7A4A3A" } },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#111010", padding: "24px 16px", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeInUp 0.5s ease-out" }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#F5F0E8", fontWeight: 700, marginBottom: 4 }}>
            Fabled Characters — Batch 1
          </h1>
          <p style={{ color: "#7A756D", fontSize: 13, margin: 0 }}>Tap to see each at full size</p>
        </div>

        {selected !== null ? (
          <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
            <button onClick={() => setSelected(null)} style={{
              marginBottom: 16, padding: "8px 16px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              color: "#9B958A", fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
            }}>← Back to all</button>
            <div style={{
              background: `linear-gradient(160deg, ${chars[selected].colors.c1}10, #111010 50%, ${chars[selected].colors.c3}08)`,
              border: `1px solid ${chars[selected].colors.c1}20`,
              borderRadius: 24, padding: "32px 20px", textAlign: "center",
            }}>
              {(() => { const C = chars[selected].component; return <C {...chars[selected].colors} />; })()}
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#F5F0E8", fontWeight: 700, margin: "16px 0 4px" }}>
                {chars[selected].name}
              </h2>
              <p style={{ color: "#9B958A", fontSize: 13, margin: 0 }}>{chars[selected].desc}</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {chars.map((ch, i) => (
              <div key={i} onClick={() => setSelected(i)} style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                background: `linear-gradient(160deg, ${ch.colors.c1}0C, #111010 60%, ${ch.colors.c3}06)`,
                border: `1px solid ${ch.colors.c1}18`,
                borderRadius: 18, padding: "16px 12px", cursor: "pointer",
                textAlign: "center", transition: "all 0.2s",
              }}>
                {(() => { const C = ch.component; return <C {...ch.colors} />; })()}
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: "#F5F0E8", fontWeight: 600, margin: "8px 0 2px" }}>
                  {ch.name}
                </h3>
                <p style={{ color: "#7A756D", fontSize: 10, margin: 0 }}>{ch.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
