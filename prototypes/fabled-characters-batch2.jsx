import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
`;

// ── THE ORACLE ──
function OracleIllustration({ c1 = "#8B6A8B", c2 = "#C8A0D4", c3 = "#4A3A5A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <radialGradient id="oOrb"><stop offset="0%" stopColor={c2} stopOpacity="0.35"/><stop offset="60%" stopColor={c2} stopOpacity="0.1"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="oRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.75"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="95" fill={c1} opacity="0.03"/>
      {/* Seated figure */}
      <path d="M98,145 Q92,135 102,126 Q112,118 120,116 Q128,118 138,126 Q148,135 142,145 L152,220 Q154,245 148,258 Q138,268 120,270 Q102,268 92,258 Q86,245 88,220 Z" fill="url(#oRobe)"/>
      {/* Crossed legs suggestion */}
      <path d="M95,245 Q108,235 120,240 Q132,235 145,245" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.1"/>
      {/* Arms forward holding orb */}
      <path d="M98,165 Q88,158 82,148 Q80,142 82,138" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <path d="M142,165 Q152,158 158,148 Q160,142 158,138" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <ellipse cx="84" cy="136" rx="4" ry="3.5" fill={c1} opacity="0.5"/>
      <ellipse cx="156" cy="136" rx="4" ry="3.5" fill={c1} opacity="0.5"/>
      {/* Glowing orb of compressed pages */}
      <circle cx="120" cy="120" r="28" fill="url(#oOrb)"/>
      <circle cx="120" cy="120" r="18" fill={c2} opacity="0.08"/>
      <circle cx="120" cy="120" r="12" fill={c2} opacity="0.12"/>
      {/* Text swirling inside orb */}
      {[0,30,60,90,120,150].map((a,i) => {
        const r = 10 + (i%3)*3;
        const x = 120 + Math.cos(a*Math.PI/180)*r;
        const y = 120 + Math.sin(a*Math.PI/180)*r;
        return <line key={i} x1={x-3} y1={y} x2={x+3} y2={y} stroke={c1} strokeWidth="0.4" opacity="0.2"/>;
      })}
      {/* Dense center glow */}
      <circle cx="120" cy="120" r="5" fill={c2} opacity="0.25"/>
      {/* Head */}
      <circle cx="120" cy="100" r="15" fill={c1} opacity="0.85"/>
      <path d="M105,98 Q103,85 110,78 Q116,73 120,71 Q124,73 130,78 Q137,85 135,98" fill={c3} opacity="0.5"/>
      {/* Eyes - calm, centered, slightly downward at orb */}
      <circle cx="114" cy="99" r="2.5" fill="#111010"/>
      <circle cx="126" cy="99" r="2.5" fill="#111010"/>
      <circle cx="114" cy="99" r="1.5" fill={c2} opacity="0.6"/>
      <circle cx="126" cy="99" r="1.5" fill={c2} opacity="0.6"/>
      <circle cx="114.6" cy="98.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      <circle cx="126.6" cy="98.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      {/* Robe folds */}
      <path d="M108,148 Q106,190 102,245" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.1"/>
      <path d="M132,148 Q134,190 138,245" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.1"/>
      {/* Particles */}
      {[[70,70],[170,65],[55,130],[185,125],[65,200],[175,195]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r={0.7} fill={c2} opacity={0.2-i*0.02}/>))}
    </svg>
  );
}

// ── THE CARTOGRAPHER ──
function CartographerIllustration({ c1 = "#5A7B8B", c2 = "#88B8D4", c3 = "#2A4A5A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <radialGradient id="crtGlow"><stop offset="0%" stopColor={c2} stopOpacity="0.08"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="crtRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="100" fill="url(#crtGlow)"/>
      {/* Star chart lines bleeding from figure */}
      {[[85,90,45,55],[155,85,195,50],[80,140,35,130],[160,135,205,125],[90,190,50,210],[150,185,190,205]].map(([x1,y1,x2,y2],i)=>(
        <line key={`sl${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c2} strokeWidth="0.5" opacity={0.1-i*0.01}/>
      ))}
      {/* Star nodes */}
      {[[45,55],[195,50],[35,130],[205,125],[50,210],[190,205],[70,40],[170,38],[30,170],[210,168]].map(([x,y],i)=>(
        <circle key={`sn${i}`} cx={x} cy={y} r={1+i*0.1} fill={c2} opacity={0.25-i*0.015}/>
      ))}
      {/* Fantasy terrain suggestion at bottom */}
      <path d="M30,250 Q60,230 90,245 Q120,225 150,240 Q180,228 210,248" fill="none" stroke={c1} strokeWidth="1" opacity="0.08"/>
      <path d="M20,265 Q70,248 120,258 Q170,245 220,262" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.06"/>
      {/* Figure standing */}
      <path d="M100,125 Q94,115 104,106 Q113,98 120,96 Q127,98 136,106 Q146,115 140,125 L150,215 Q153,240 146,258 Q138,268 120,270 Q102,268 94,258 Q87,240 90,215 Z" fill="url(#crtRobe)"/>
      {/* Coat texture - star chart patterns on coat */}
      {[[105,145,115,142],[125,150,135,148],[108,170,118,168],[122,175,132,172],[110,200,120,198],[125,205,135,202]].map(([x1,y1,x2,y2],i)=>(
        <line key={`ct${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c2} strokeWidth="0.3" opacity="0.12"/>
      ))}
      {[[110,143,2],[130,149,1.5],[115,169,1.8],[128,173,1.5],[115,199,1.5],[130,203,1.2]].map(([x,y,r],i)=>(
        <circle key={`cd${i}`} cx={x} cy={y} r={r*0.4} fill={c2} opacity="0.15"/>
      ))}
      {/* Arm extended holding out a map/chart */}
      <path d="M140,150 Q158,142 168,138" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      {/* Unfurled map */}
      <g transform="translate(175, 130) rotate(5)">
        <rect x="-12" y="-16" width="24" height="32" rx="1.5" fill={c2} opacity="0.15"/>
        <rect x="-12" y="-16" width="24" height="32" rx="1.5" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.2"/>
        {[0,1,2,3].map(i=>(<line key={i} x1="-8" y1={-12+i*7} x2="8" y2={-12+i*7} stroke={c1} strokeWidth="0.3" opacity="0.15"/>))}
        <circle cx="0" cy="0" r="2" fill={c2} opacity="0.2"/>
        <line x1="0" y1="-4" x2="0" y2="4" stroke={c2} strokeWidth="0.3" opacity="0.15"/>
        <line x1="-4" y1="0" x2="4" y2="0" stroke={c2} strokeWidth="0.3" opacity="0.15"/>
      </g>
      <ellipse cx="170" cy="138" rx="4" ry="3" fill={c1} opacity="0.45"/>
      {/* Head */}
      <circle cx="120" cy="86" r="16" fill={c1} opacity="0.85"/>
      <path d="M104,84 Q102,72 110,64 Q116,59 120,57 Q124,59 130,64 Q138,72 136,84" fill={c3} opacity="0.5"/>
      <circle cx="114" cy="85" r="2.5" fill="#111010"/>
      <circle cx="126" cy="85" r="2.5" fill="#111010"/>
      <circle cx="114" cy="85" r="1.5" fill={c2} opacity="0.55"/>
      <circle cx="126" cy="85" r="1.5" fill={c2} opacity="0.55"/>
      <circle cx="114.6" cy="84.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      <circle cx="126.6" cy="84.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      {/* Robe folds */}
      <path d="M108,130 Q106,175 102,240" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      <path d="M132,130 Q134,175 138,240" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
    </svg>
  );
}

// ── THE SCRIBE ──
function ScribeIllustration({ c1 = "#8B8B6A", c2 = "#D4D4A8", c3 = "#5A5A3A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <linearGradient id="scRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="90" fill={c2} opacity="0.03"/>
      {/* Figure in profile - facing right, absorbed */}
      <path d="M95,120 Q88,110 96,102 Q105,94 115,92 Q125,94 130,100 Q138,108 132,118 L140,210 Q142,240 136,258 Q128,268 112,270 Q96,268 90,258 Q84,240 86,210 Z" fill="url(#scRobe)"/>
      {/* Head - turned slightly right */}
      <circle cx="118" cy="82" r="16" fill={c1} opacity="0.85"/>
      <path d="M104,80 Q102,68 108,60 Q114,55 118,53 Q122,55 128,60 Q134,68 132,80" fill={c3} opacity="0.45"/>
      {/* Profile eye */}
      <circle cx="124" cy="81" r="2.5" fill="#111010"/>
      <circle cx="124" cy="81" r="1.5" fill={c2} opacity="0.6"/>
      <circle cx="124.6" cy="80.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      {/* Subtle second eye (further side, almost hidden) */}
      <circle cx="113" cy="82" r="1.8" fill="#111010" opacity="0.4"/>
      <circle cx="113" cy="82" r="1" fill={c2} opacity="0.3"/>
      {/* Arm extending right with quill */}
      <path d="M132,140 Q148,132 160,125 Q165,120 168,115" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <ellipse cx="162" cy="122" rx="4" ry="3" fill={c1} opacity="0.45"/>
      {/* Quill */}
      <line x1="165" y1="118" x2="185" y2="85" stroke={c2} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <path d="M185,85 Q188,78 183,75 Q180,78 182,83" fill={c2} opacity="0.25"/>
      {/* Luminous words trailing from quill - starlight text */}
      {[
        [172, 100, 20], [168, 108, 16], [175, 116, 18],
        [180, 95, 14], [165, 122, 15], [178, 88, 12],
      ].map(([x,y,w],i) => (
        <g key={`lw${i}`}>
          <line x1={x} y1={y} x2={x+w} y2={y-1+i*0.5} stroke={c2} strokeWidth="0.6" opacity={0.3-i*0.04} strokeLinecap="round"/>
          {/* Glow on text */}
          <line x1={x} y1={y} x2={x+w} y2={y-1+i*0.5} stroke={c2} strokeWidth="2" opacity={0.04-i*0.005}/>
        </g>
      ))}
      {/* Scattered luminous word particles drifting */}
      {[[190,92],[195,105],[188,78],[200,98],[182,112],[192,118]].map(([x,y],i)=>(
        <circle key={`gp${i}`} cx={x} cy={y} r={1-i*0.1} fill={c2} opacity={0.25-i*0.03}/>
      ))}
      {/* Robe folds */}
      <path d="M100,125 Q98,170 94,240" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      <path d="M125,125 Q126,170 128,240" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      {/* Left hand holding robe */}
      <path d="M95,145 Q82,148 78,155" fill="none" stroke={c1} strokeWidth="3.5" opacity="0.4" strokeLinecap="round"/>
      <circle cx="78" cy="156" r="3.5" fill={c1} opacity="0.4"/>
    </svg>
  );
}

// ── THE SENTINEL ──
function SentinelIllustration({ c1 = "#8B7B5A", c2 = "#D4C088", c3 = "#5A4A2A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <linearGradient id="snArmor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.8"/><stop offset="100%" stopColor={c3} stopOpacity="0.5"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="90" fill={c2} opacity="0.03"/>
      {/* Motion lines behind */}
      {[0,1,2,3].map(i=>(
        <line key={`ml${i}`} x1={55-i*8} y1={130+i*20} x2={75-i*5} y2={125+i*20} stroke={c2} strokeWidth="1" opacity={0.12-i*0.025} strokeLinecap="round"/>
      ))}
      {/* Figure mid-sprint, leaning forward */}
      <path d="M105,115 Q96,105 105,96 Q114,88 122,86 Q130,88 138,96 Q146,105 140,115 L152,195 Q155,220 148,240 L92,240 Q85,220 88,195 Z" fill="url(#snArmor)"/>
      {/* Armor text/illuminated manuscript patterns */}
      {[[112,120,125,118],[108,135,122,133],[115,150,128,148],[110,165,124,163],[113,180,126,178],[108,195,122,193]].map(([x1,y1,x2,y2],i)=>(
        <line key={`at${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c2} strokeWidth="0.4" opacity="0.15"/>
      ))}
      {/* Armor plates suggestion */}
      <path d="M105,115 L140,115 L142,130 Q122,135 100,130 Z" fill={c1} opacity="0.15"/>
      <path d="M100,145 L142,145 L143,160 Q122,165 98,160 Z" fill={c1} opacity="0.1"/>
      {/* Sprinting legs */}
      <path d="M100,235 L82,260 Q78,268 84,270" stroke={c1} strokeWidth="5" opacity="0.55" fill="none" strokeLinecap="round"/>
      <path d="M135,235 L155,258 Q160,264 155,268" stroke={c1} strokeWidth="5" opacity="0.55" fill="none" strokeLinecap="round"/>
      {/* Shield arm (left) - book as shield */}
      <path d="M105,135 Q88,128 78,132" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.5" strokeLinecap="round"/>
      <g transform="translate(72, 128) rotate(-10)">
        <rect x="-10" y="-14" width="20" height="28" rx="2" fill={c2} opacity="0.3"/>
        <rect x="-10" y="-14" width="3" height="28" rx="1" fill={c1} opacity="0.3"/>
        <circle cx="2" cy="0" r="4" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.2"/>
      </g>
      {/* Sword arm (right) - glowing volume as weapon */}
      <path d="M140,130 Q155,118 165,108" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <g transform="translate(170, 100) rotate(35)">
        <rect x="-4" y="-18" width="8" height="28" rx="1.5" fill={c2} opacity="0.35"/>
        <line x1="0" y1="-18" x2="0" y2="10" stroke={c1} strokeWidth="0.5" opacity="0.2"/>
        {/* Glow */}
        <rect x="-6" y="-20" width="12" height="32" rx="3" fill={c2} opacity="0.05"/>
      </g>
      {/* Helmet/head */}
      <circle cx="122" cy="78" r="15" fill={c1} opacity="0.85"/>
      <path d="M108,76 Q106,64 114,58 Q118,54 122,52 Q126,54 130,58 Q138,64 136,76" fill={c3} opacity="0.55"/>
      {/* Visor */}
      <rect x="110" y="74" width="24" height="6" rx="3" fill="#111010" opacity="0.4"/>
      <circle cx="118" cy="77" r="1.5" fill={c2} opacity="0.5"/>
      <circle cx="126" cy="77" r="1.5" fill={c2} opacity="0.5"/>
    </svg>
  );
}

// ── THE HERETIC ──
function HereticIllustration({ c1 = "#7B6A8B", c2 = "#B8A0D4", c3 = "#3A2A4A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <linearGradient id="hRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="90" fill={c2} opacity="0.03"/>
      {/* Figure standing, holding cracked book */}
      <path d="M98,125 Q92,115 102,106 Q112,98 120,96 Q128,98 138,106 Q148,115 142,125 L150,220 Q152,245 146,260 Q138,270 120,272 Q102,270 94,260 Q88,245 90,220 Z" fill="url(#hRobe)"/>
      {/* Arms holding cracked book at center */}
      <path d="M98,155 Q88,148 85,140" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <path d="M142,155 Q152,148 155,140" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      {/* The cracked book */}
      <g transform="translate(120, 130)">
        {/* Left half */}
        <rect x="-18" y="-14" width="16" height="28" rx="2" fill={c1} opacity="0.45" transform="rotate(-3)"/>
        {/* Right half */}
        <rect x="2" y="-14" width="16" height="28" rx="2" fill={c1} opacity="0.45" transform="rotate(3)"/>
        {/* Crack line */}
        <path d="M0,-14 L-1,-6 L2,0 L-1,6 L1,14" stroke={c2} strokeWidth="1.5" opacity="0.5" fill="none"/>
        {/* Prismatic light exploding from crack */}
        {[[-30,-35],[30,-30],[-35,-10],[35,-8],[-28,15],[28,18],[0,-42],[-20,-40],[20,-38]].map(([x,y],i)=>(
          <line key={`pr${i}`} x1="0" y1={y > 0 ? 5 : -5} x2={x} y2={y} stroke={c2} strokeWidth={1.2-i*0.1} opacity={0.3-i*0.025} strokeLinecap="round"/>
        ))}
        {/* Prismatic particles at ray ends */}
        {[[-30,-35],[30,-30],[-35,-10],[35,-8],[-28,15],[28,18],[0,-42]].map(([x,y],i)=>(
          <circle key={`pp${i}`} cx={x} cy={y} r={2-i*0.15} fill={c2} opacity={0.25-i*0.025}/>
        ))}
      </g>
      <ellipse cx="87" cy="138" rx="4" ry="3" fill={c1} opacity="0.45"/>
      <ellipse cx="153" cy="138" rx="4" ry="3" fill={c1} opacity="0.45"/>
      {/* Head */}
      <circle cx="120" cy="86" r="15" fill={c1} opacity="0.85"/>
      <path d="M105,84 Q103,72 110,64 Q116,59 120,57 Q124,59 130,64 Q137,72 135,84" fill={c3} opacity="0.5"/>
      {/* Defiant eyes */}
      <circle cx="114" cy="85" r="2.5" fill="#111010"/>
      <circle cx="126" cy="85" r="2.5" fill="#111010"/>
      <circle cx="114" cy="85" r="1.5" fill={c2} opacity="0.65"/>
      <circle cx="126" cy="85" r="1.5" fill={c2} opacity="0.65"/>
      <circle cx="114.6" cy="84.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      <circle cx="126.6" cy="84.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      {/* Slight smirk */}
      <path d="M116,92 Q120,94 125,91" fill="none" stroke="#111010" strokeWidth="0.6" opacity="0.2"/>
      <path d="M108,128 Q106,175 102,245" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      <path d="M132,128 Q134,175 138,245" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
    </svg>
  );
}

// ── THE EMBER ──
function EmberIllustration({ c1 = "#C48B5A", c2 = "#E8C088", c3 = "#7A5A2A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <radialGradient id="eGlow"><stop offset="0%" stopColor={c2} stopOpacity="0.15"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="eRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="160" r="90" fill={c2} opacity="0.03"/>
      {/* Books arranged as nest around figure */}
      {[
        [70, 225, -20, 22, 14], [90, 235, -5, 20, 13], [145, 232, 8, 20, 13], [168, 222, 22, 22, 14],
        [60, 210, -30, 18, 12], [178, 208, 25, 18, 12],
      ].map(([x,y,r,w,h],i) => (
        <rect key={`nb${i}`} x={x-w/2} y={y-h/2} width={w} height={h} rx="2" fill={i%2===0?c1:c3} opacity={0.2-i*0.02} transform={`rotate(${r} ${x} ${y})`}/>
      ))}
      {/* Warm glow from flame */}
      <circle cx="120" cy="150" r="40" fill="url(#eGlow)"/>
      {/* Figure kneeling/sitting, cradling flame */}
      <path d="M100,155 Q94,145 104,136 Q113,128 120,126 Q127,128 136,136 Q146,145 140,155 L146,218 Q148,235 120,240 Q92,235 94,218 Z" fill="url(#eRobe)"/>
      {/* Arms cupped forward holding flame */}
      <path d="M100,170 Q90,162 86,152 Q84,146 86,142" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <path d="M140,170 Q150,162 154,152 Q156,146 154,142" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      {/* Cupped hands */}
      <path d="M86,140 Q90,135 96,136 Q100,138 98,142" fill={c1} opacity="0.45"/>
      <path d="M154,140 Q150,135 144,136 Q140,138 142,142" fill={c1} opacity="0.45"/>
      {/* Small precious flame */}
      <path d="M120,145 Q115,132 112,118 Q118,128 120,108 Q122,128 128,118 Q125,132 120,145 Z" fill={c2} opacity="0.45"/>
      <path d="M120,145 Q117,136 116,126 Q119,132 120,118 Q121,132 124,126 Q123,136 120,145 Z" fill={c1} opacity="0.3"/>
      {/* Inner flame glow */}
      <circle cx="120" cy="130" r="8" fill={c2} opacity="0.08"/>
      <circle cx="120" cy="132" r="4" fill={c2} opacity="0.12"/>
      {/* Head */}
      <circle cx="120" cy="116" r="15" fill={c1} opacity="0.85"/>
      <path d="M106,114 Q104,102 110,95 Q116,90 120,88 Q124,90 130,95 Q136,102 134,114" fill={c3} opacity="0.45"/>
      {/* Gentle, downcast eyes looking at flame */}
      <path d="M112,115 Q114.5,118 117,115" fill="none" stroke="#111010" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
      <path d="M123,115 Q125.5,118 128,115" fill="none" stroke="#111010" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
      {/* Gentle smile */}
      <path d="M116,121 Q120,123 124,121" fill="none" stroke="#111010" strokeWidth="0.5" opacity="0.2"/>
      <path d="M108,158 Q106,190 100,225" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      <path d="M132,158 Q134,190 140,225" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      {/* Warmth particles rising */}
      {[[115,105],[125,100],[120,95],[112,92],[128,88],[120,82]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={0.6+i*0.08} fill={c2} opacity={0.2-i*0.025}/>
      ))}
    </svg>
  );
}

// ── THE REVENANT ──
function RevenantIllustration({ c1 = "#5A6A5A", c2 = "#88A888", c3 = "#2A3A2A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <linearGradient id="rvRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.55"/><stop offset="100%" stopColor={c3} stopOpacity="0.2"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="90" fill={c1} opacity="0.03"/>
      {/* Dark tome merged with figure */}
      <g transform="translate(120, 140)">
        <rect x="-22" y="-50" width="44" height="65" rx="3" fill={c3} opacity="0.3"/>
        <rect x="-22" y="-50" width="5" height="65" rx="1.5" fill={c1} opacity="0.25"/>
        {/* Text on tome */}
        {[0,1,2,3,4,5,6].map(i=>(
          <line key={i} x1="-14" y1={-42+i*8} x2="14" y2={-42+i*8} stroke={c2} strokeWidth="0.3" opacity="0.08"/>
        ))}
      </g>
      {/* Translucent figure half-merged with tome */}
      <path d="M100,110 Q94,100 104,92 Q113,84 120,82 Q127,84 136,92 Q146,100 140,110 L148,210 Q150,240 144,255 Q136,265 120,268 Q104,265 96,255 Q90,240 92,210 Z" fill="url(#rvRobe)"/>
      {/* Figure is translucent - show tome through body */}
      <rect x="106" y="100" width="28" height="40" rx="2" fill={c3} opacity="0.08"/>
      {/* Shadow tendrils extending like roots */}
      {[
        "M92,210 Q72,220 58,235 Q50,245 55,252 Q48,248 42,258",
        "M88,230 Q68,242 55,258 Q50,266 56,270",
        "M148,210 Q168,218 182,232 Q190,242 185,248 Q192,245 198,255",
        "M152,230 Q172,240 185,254 Q190,262 184,266",
        "M95,248 Q78,256 65,268",
        "M145,248 Q162,254 175,265",
      ].map((d,i)=>(
        <path key={`st${i}`} d={d} fill="none" stroke={c1} strokeWidth={2.5-i*0.3} opacity={0.2-i*0.02} strokeLinecap="round"/>
      ))}
      {/* Root tendrils end nodes */}
      {[[42,258],[56,270],[198,255],[184,266],[65,268],[175,265]].map(([x,y],i)=>(
        <circle key={`rn${i}`} cx={x} cy={y} r={2-i*0.2} fill={c1} opacity={0.15-i*0.015}/>
      ))}
      {/* Head */}
      <circle cx="120" cy="74" r="16" fill={c1} opacity="0.6"/>
      <path d="M104,72 Q102,60 110,52 Q116,47 120,45 Q124,47 130,52 Q138,60 136,72" fill={c3} opacity="0.4"/>
      {/* Hollow, deep eyes */}
      <ellipse cx="113" cy="73" rx="4" ry="3.5" fill="#111010" opacity="0.5"/>
      <ellipse cx="127" cy="73" rx="4" ry="3.5" fill="#111010" opacity="0.5"/>
      <circle cx="113" cy="73" r="2" fill={c2} opacity="0.45"/>
      <circle cx="127" cy="73" r="2" fill={c2} opacity="0.45"/>
      <circle cx="113.5" cy="72.5" r="0.6" fill="#F5F0E8" opacity="0.3"/>
      <circle cx="127.5" cy="72.5" r="0.6" fill="#F5F0E8" opacity="0.3"/>
      {/* Translucency suggestion - body edges fade */}
      <path d="M92,180 Q85,185 80,182" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.1" strokeLinecap="round"/>
      <path d="M148,180 Q155,185 160,182" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.1" strokeLinecap="round"/>
    </svg>
  );
}

// ── THE SEER ──
function SeerIllustration({ c1 = "#6A8B7B", c2 = "#A8D4C0", c3 = "#3A5A4A" }) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:240, display:"block", margin:"0 auto" }}>
      <defs>
        <radialGradient id="sGlow"><stop offset="0%" stopColor={c2} stopOpacity="0.1"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="sRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="95" fill="url(#sGlow)"/>
      {/* Orbiting faces - subtle, like memories */}
      {[
        [60, 70, 10, 0.12], [180, 80, 12, 0.1], [45, 150, 9, 0.08],
        [195, 145, 11, 0.07], [70, 220, 10, 0.06], [175, 215, 9, 0.05],
      ].map(([x, y, r, op], i) => (
        <g key={`f${i}`}>
          <circle cx={x} cy={y} r={r} fill={c2} opacity={op * 0.5}/>
          {/* Minimal face suggestion - just two dots and a curve */}
          <circle cx={x-2} cy={y-1} r="0.8" fill={c1} opacity={op}/>
          <circle cx={x+2} cy={y-1} r="0.8" fill={c1} opacity={op}/>
          <path d={`M${x-1.5},${y+2} Q${x},${y+3.5} ${x+1.5},${y+2}`} fill="none" stroke={c1} strokeWidth="0.3" opacity={op*0.8}/>
        </g>
      ))}
      {/* Orbital paths for faces */}
      <ellipse cx="120" cy="140" rx="75" ry="80" fill="none" stroke={c2} strokeWidth="0.3" opacity="0.05" strokeDasharray="3 8"/>
      <ellipse cx="120" cy="140" rx="60" ry="65" fill="none" stroke={c2} strokeWidth="0.3" opacity="0.04" strokeDasharray="2 6" transform="rotate(30 120 140)"/>
      {/* Figure - standing still, quiet perception */}
      <path d="M100,125 Q94,115 104,106 Q113,98 120,96 Q127,98 136,106 Q146,115 140,125 L148,220 Q150,245 144,260 Q136,270 120,272 Q104,270 96,260 Q90,245 92,220 Z" fill="url(#sRobe)"/>
      {/* Head */}
      <circle cx="120" cy="86" r="16" fill={c1} opacity="0.85"/>
      <path d="M104,84 Q102,72 110,64 Q116,59 120,57 Q124,59 130,64 Q138,72 136,84" fill={c3} opacity="0.5"/>
      {/* Two normal eyes */}
      <circle cx="114" cy="85" r="2.5" fill="#111010"/>
      <circle cx="126" cy="85" r="2.5" fill="#111010"/>
      <circle cx="114" cy="85" r="1.5" fill={c2} opacity="0.55"/>
      <circle cx="126" cy="85" r="1.5" fill={c2} opacity="0.55"/>
      <circle cx="114.6" cy="84.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      <circle cx="126.6" cy="84.4" r="0.6" fill="#F5F0E8" opacity="0.5"/>
      {/* Third eye - barely open, subtle */}
      <ellipse cx="120" cy="72" rx="4" ry="2.5" fill={c3} opacity="0.4"/>
      <ellipse cx="120" cy="72" rx="3" ry="1.8" fill="#111010" opacity="0.3"/>
      <circle cx="120" cy="72" r="1.2" fill={c2} opacity="0.5"/>
      <circle cx="120" cy="72" r="0.5" fill="#F5F0E8" opacity="0.4"/>
      {/* Third eye glow */}
      <ellipse cx="120" cy="72" rx="8" ry="5" fill={c2} opacity="0.04"/>
      {/* Robe folds */}
      <path d="M108,128 Q106,175 102,245" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      <path d="M132,128 Q134,175 138,245" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      {/* Arms at sides, relaxed */}
      <path d="M100,140 Q88,148 82,160 Q80,168 82,172" fill="none" stroke={c1} strokeWidth="4" opacity="0.45" strokeLinecap="round"/>
      <path d="M140,140 Q152,148 158,160 Q160,168 158,172" fill="none" stroke={c1} strokeWidth="4" opacity="0.45" strokeLinecap="round"/>
    </svg>
  );
}

// ── Display ──
export default function CharacterBatch2() {
  const [selected, setSelected] = useState(null);
  const chars = [
    { name: "The Oracle", desc: "Memoir readers, self-seekers", component: OracleIllustration, colors: { c1:"#8B6A8B", c2:"#C8A0D4", c3:"#4A3A5A" } },
    { name: "The Cartographer", desc: "World-builders, lore devotees", component: CartographerIllustration, colors: { c1:"#5A7B8B", c2:"#88B8D4", c3:"#2A4A5A" } },
    { name: "The Scribe", desc: "Craft worshippers, prose-first", component: ScribeIllustration, colors: { c1:"#8B8B6A", c2:"#D4D4A8", c3:"#5A5A3A" } },
    { name: "The Sentinel", desc: "Adrenaline readers, plot-first", component: SentinelIllustration, colors: { c1:"#8B7B5A", c2:"#D4C088", c3:"#5A4A2A" } },
    { name: "The Heretic", desc: "Genre benders, contrarians", component: HereticIllustration, colors: { c1:"#7B6A8B", c2:"#B8A0D4", c3:"#3A2A4A" } },
    { name: "The Ember", desc: "Hope-seekers, comfort readers", component: EmberIllustration, colors: { c1:"#C48B5A", c2:"#E8C088", c3:"#7A5A2A" } },
    { name: "The Revenant", desc: "Gothic devotees, darkness dwellers", component: RevenantIllustration, colors: { c1:"#5A6A5A", c2:"#88A888", c3:"#2A3A2A" } },
    { name: "The Seer", desc: "Multi-POV collectors, empathy readers", component: SeerIllustration, colors: { c1:"#6A8B7B", c2:"#A8D4C0", c3:"#3A5A4A" } },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#111010", padding:"24px 16px", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{css}</style>
      <div style={{ maxWidth:500, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:32, animation:"fadeInUp 0.5s ease-out" }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#F5F0E8", fontWeight:700, marginBottom:4 }}>Fabled Characters — Batch 2</h1>
          <p style={{ color:"#7A756D", fontSize:13, margin:0 }}>Tap to see full size</p>
        </div>
        {selected !== null ? (
          <div style={{ animation:"fadeInUp 0.4s ease-out" }}>
            <button onClick={()=>setSelected(null)} style={{ marginBottom:16, padding:"8px 16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#9B958A", fontSize:13, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>← Back to all</button>
            <div style={{ background:`linear-gradient(160deg, ${chars[selected].colors.c1}10, #111010 50%, ${chars[selected].colors.c3}08)`, border:`1px solid ${chars[selected].colors.c1}20`, borderRadius:24, padding:"32px 20px", textAlign:"center" }}>
              {(()=>{ const C=chars[selected].component; return <C {...chars[selected].colors}/>; })()}
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#F5F0E8", fontWeight:700, margin:"16px 0 4px" }}>{chars[selected].name}</h2>
              <p style={{ color:"#9B958A", fontSize:13, margin:0 }}>{chars[selected].desc}</p>
            </div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {chars.map((ch,i)=>(
              <div key={i} onClick={()=>setSelected(i)} style={{ animation:`fadeInUp 0.5s ease-out ${i*0.08}s both`, background:`linear-gradient(160deg, ${ch.colors.c1}0C, #111010 60%, ${ch.colors.c3}06)`, border:`1px solid ${ch.colors.c1}18`, borderRadius:18, padding:"16px 12px", cursor:"pointer", textAlign:"center" }}>
                {(()=>{ const C=ch.component; return <C {...ch.colors}/>; })()}
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:"#F5F0E8", fontWeight:600, margin:"8px 0 2px" }}>{ch.name}</h3>
                <p style={{ color:"#7A756D", fontSize:10, margin:0 }}>{ch.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
