interface ConjurerProps {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Conjurer({ c1, c2, c3, className }: ConjurerProps) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="conjurer-cGlow">
          <stop offset="0%" stopColor={c2} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="conjurer-cRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.4"/>
        </linearGradient>
      </defs>

      {/* Warm glow behind the books */}
      <circle cx="120" cy="110" r="70" fill="url(#conjurer-cGlow)"/>
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
      {([
        [120, 85, 1.0, 0.35],
        [115, 72, 0.7, 0.25],
        [125, 68, 0.5, 0.2],
        [120, 58, 0.4, 0.15],
        [112, 55, 0.3, 0.1],
        [128, 52, 0.3, 0.08],
      ] as const).map(([x, y, s, op], i) => (
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
        fill="url(#conjurer-cRobe)"/>

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
      {([[80,45],[160,42],[60,120],[180,115],[70,200],[170,195],[95,30],[145,28]] as const).map(([x,y],i) => (
        <circle key={`wp${i}`} cx={x} cy={y} r={0.7+i*0.1} fill={c2} opacity={0.2-i*0.015}/>
      ))}
    </svg>
  );
}
