interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Oracle({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="oracle-oOrb"><stop offset="0%" stopColor={c2} stopOpacity="0.35"/><stop offset="60%" stopColor={c2} stopOpacity="0.1"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="oracle-oRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.75"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="95" fill={c1} opacity="0.03"/>
      {/* Seated figure */}
      <path d="M98,145 Q92,135 102,126 Q112,118 120,116 Q128,118 138,126 Q148,135 142,145 L152,220 Q154,245 148,258 Q138,268 120,270 Q102,268 92,258 Q86,245 88,220 Z" fill="url(#oracle-oRobe)"/>
      {/* Crossed legs suggestion */}
      <path d="M95,245 Q108,235 120,240 Q132,235 145,245" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.1"/>
      {/* Arms forward holding orb */}
      <path d="M98,165 Q88,158 82,148 Q80,142 82,138" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <path d="M142,165 Q152,158 158,148 Q160,142 158,138" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.55" strokeLinecap="round"/>
      <ellipse cx="84" cy="136" rx="4" ry="3.5" fill={c1} opacity="0.5"/>
      <ellipse cx="156" cy="136" rx="4" ry="3.5" fill={c1} opacity="0.5"/>
      {/* Glowing orb of compressed pages */}
      <circle cx="120" cy="120" r="28" fill="url(#oracle-oOrb)"/>
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
