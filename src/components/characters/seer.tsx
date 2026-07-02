interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Seer({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="seer-sGlow"><stop offset="0%" stopColor={c2} stopOpacity="0.1"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="seer-sRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="95" fill="url(#seer-sGlow)"/>
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
      <path d="M100,125 Q94,115 104,106 Q113,98 120,96 Q127,98 136,106 Q146,115 140,125 L148,220 Q150,245 144,260 Q136,270 120,272 Q104,270 96,260 Q90,245 92,220 Z" fill="url(#seer-sRobe)"/>
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
