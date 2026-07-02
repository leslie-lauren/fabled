interface ArchivistProps {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Archivist({ c1, c2, c3, className }: ArchivistProps) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="archivist-aGlow">
          <stop offset="0%" stopColor={c2} stopOpacity="0.1"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="archivist-aRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.75"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.5"/>
        </linearGradient>
        <linearGradient id="archivist-aDesk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* Central glow */}
      <circle cx="120" cy="140" r="100" fill="url(#archivist-aGlow)"/>

      {/* Orbital rings (book paths) */}
      {[70, 55, 42].map((r, i) => (
        <ellipse key={`or${i}`} cx="120" cy="100" rx={r + 30} ry={r}
          fill="none" stroke={c2} strokeWidth="0.4" opacity={0.1 - i * 0.02}
          strokeDasharray={`${2 + i} ${4 + i * 2}`}
          transform={`rotate(${-10 + i * 8} 120 100)`}/>
      ))}

      {/* Orbiting books */}
      {([
        [62, 65, -20, 0.35], [185, 80, 15, 0.3], [55, 120, -30, 0.25],
        [190, 110, 25, 0.2], [70, 155, 10, 0.18], [178, 150, -15, 0.15],
        [90, 50, 5, 0.28], [160, 55, -10, 0.22],
      ] as const).map(([x, y, rot, op], i) => (
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
        fill="url(#archivist-aDesk)"/>
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
        fill="url(#archivist-aRobe)"/>

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
      {([[45,45],[195,40],[38,95],[202,88],[50,140],[192,145],[80,38],[165,42],[42,180],[198,175]] as const).map(([x,y],i) => (
        <circle key={`cd${i}`} cx={x} cy={y} r={0.6 + Math.sin(i) * 0.4} fill={c2} opacity={0.25 - i * 0.015}/>
      ))}

      {/* Connecting dust lines between some particles */}
      <line x1="45" y1="45" x2="80" y2="38" stroke={c2} strokeWidth="0.3" opacity="0.05"/>
      <line x1="195" y1="40" x2="165" y2="42" stroke={c2} strokeWidth="0.3" opacity="0.05"/>
    </svg>
  );
}
