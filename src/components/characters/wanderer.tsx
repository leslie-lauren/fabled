interface WandererProps {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Wanderer({ c1, c2, c3, className }: WandererProps) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="wanderer-wGlow">
          <stop offset="0%" stopColor={c1} stopOpacity="0.08"/>
          <stop offset="100%" stopColor={c1} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="wanderer-wRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.7"/>
          <stop offset="80%" stopColor={c3} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="wanderer-wMist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c2} stopOpacity="0"/>
          <stop offset="50%" stopColor={c2} stopOpacity="0.06"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Background glow */}
      <circle cx="120" cy="140" r="110" fill="url(#wanderer-wGlow)"/>

      {/* Mist layers (horizontal fog bands) */}
      {([
        [0, 80, 240, 30, 0.04],
        [0, 130, 240, 40, 0.05],
        [0, 180, 240, 35, 0.06],
        [0, 220, 240, 45, 0.05],
        [0, 250, 240, 30, 0.04],
      ] as const).map(([x, y, w, h, op], i) => (
        <rect key={`m${i}`} x={x} y={y} width={w} height={h} fill="url(#wanderer-wMist)" opacity={op * (1 + i * 0.2)}/>
      ))}

      {/* Corridor perspective lines (faint) */}
      <line x1="40" y1="30" x2="80" y2="270" stroke={c1} strokeWidth="0.4" opacity="0.06"/>
      <line x1="200" y1="30" x2="160" y2="270" stroke={c1} strokeWidth="0.4" opacity="0.06"/>
      <line x1="60" y1="25" x2="90" y2="275" stroke={c2} strokeWidth="0.3" opacity="0.04"/>
      <line x1="180" y1="25" x2="150" y2="275" stroke={c2} strokeWidth="0.3" opacity="0.04"/>

      {/* Floating text-pages (scattered, drifting) */}
      {([
        [50, 60, -20, 0.18, 16, 11],
        [185, 75, 30, 0.15, 14, 10],
        [38, 140, 10, 0.12, 15, 10],
        [195, 150, -25, 0.1, 13, 9],
        [55, 210, -5, 0.08, 14, 9],
        [190, 215, 18, 0.07, 12, 8],
        [70, 100, 35, 0.14, 12, 8],
        [170, 110, -15, 0.11, 11, 8],
      ] as const).map(([x, y, rot, op, w, h], i) => (
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
        fill="url(#wanderer-wRobe)"/>

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
      {([[30,90],[210,85],[25,160],[215,155],[35,230],[205,225],[50,55],[190,50]] as const).map(([x,y],i) => (
        <ellipse key={`mp${i}`} cx={x} cy={y} rx={4+i*0.5} ry={1.5+i*0.2} fill={c2} opacity={0.06-i*0.005}/>
      ))}

      {/* Tiny text fragments floating in mist */}
      {([[45,175],[195,180],[55,245],[185,240]] as const).map(([x,y],i) => (
        <g key={`tf${i}`}>
          <line x1={x} y1={y} x2={x+8} y2={y} stroke={c2} strokeWidth="0.3" opacity="0.1"/>
          <line x1={x+1} y1={y+2.5} x2={x+6} y2={y+2.5} stroke={c2} strokeWidth="0.3" opacity="0.07"/>
        </g>
      ))}
    </svg>
  );
}
