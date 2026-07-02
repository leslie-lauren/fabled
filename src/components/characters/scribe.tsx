interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Scribe({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="scribe-scRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="90" fill={c2} opacity="0.03"/>
      {/* Figure in profile - facing right, absorbed */}
      <path d="M95,120 Q88,110 96,102 Q105,94 115,92 Q125,94 130,100 Q138,108 132,118 L140,210 Q142,240 136,258 Q128,268 112,270 Q96,268 90,258 Q84,240 86,210 Z" fill="url(#scribe-scRobe)"/>
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
