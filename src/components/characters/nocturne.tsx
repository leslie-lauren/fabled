interface NocturneProps {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Nocturne({ c1, c2, c3, className }: NocturneProps) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="nocturne-nMoon">
          <stop offset="0%" stopColor={c2} stopOpacity="0.25"/>
          <stop offset="60%" stopColor={c2} stopOpacity="0.06"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="nocturne-nGlow">
          <stop offset="0%" stopColor={c1} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={c1} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="nocturne-nRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={c3} stopOpacity="0.4"/>
        </linearGradient>
        <clipPath id="nocturne-nFade">
          <ellipse cx="120" cy="200" rx="80" ry="60"/>
        </clipPath>
      </defs>

      {/* Moon */}
      <circle cx="175" cy="55" r="50" fill="url(#nocturne-nMoon)"/>
      <circle cx="175" cy="55" r="22" fill={c2} opacity="0.2"/>
      <circle cx="175" cy="55" r="18" fill={c2} opacity="0.12"/>
      <circle cx="182" cy="48" r="14" fill="#111010" opacity="0.8"/>

      {/* Ambient glow behind figure */}
      <circle cx="120" cy="150" r="90" fill="url(#nocturne-nGlow)"/>

      {/* Swirling page fragments (background layer) */}
      {([
        [55, 80, -25, 0.15, 12, 8],
        [185, 95, 30, 0.12, 10, 7],
        [45, 160, -15, 0.1, 11, 7],
        [195, 170, 20, 0.08, 9, 6],
        [65, 220, -30, 0.06, 10, 6],
        [180, 230, 35, 0.05, 8, 5],
      ] as const).map(([x, y, rot, op, w, h], i) => (
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
        fill="url(#nocturne-nRobe)"/>

      {/* Robe folds */}
      <path d="M100,140 Q105,180 98,230" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.15"/>
      <path d="M140,140 Q135,180 142,230" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.15"/>
      <path d="M115,135 Q112,190 108,240" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.1"/>

      {/* Dissolving edges - shadow tendrils */}
      {([
        "M85,200 Q70,210 60,225 Q55,235 62,240",
        "M90,230 Q75,240 68,255 Q65,262 70,265",
        "M155,200 Q170,208 178,220 Q182,230 176,235",
        "M150,230 Q165,238 172,250 Q175,258 170,262",
        "M95,250 Q80,258 72,268",
        "M145,250 Q160,256 168,265",
      ] as const).map((d, i) => (
        <path key={`t${i}`} d={d} fill="none" stroke={c1} strokeWidth={2.5 - i * 0.3} opacity={0.25 - i * 0.03} strokeLinecap="round"/>
      ))}

      {/* Ink dissolution particles */}
      {([
        [75, 240, 3], [165, 235, 2.5], [68, 255, 2], [172, 250, 2],
        [80, 265, 1.5], [160, 260, 1.5], [90, 270, 1], [150, 268, 1],
      ] as const).map(([x, y, r], i) => (
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
      {([
        [70, 115, -40, 0.2, 14, 9],
        [175, 130, 25, 0.18, 12, 8],
        [55, 175, 15, 0.15, 13, 8],
        [190, 185, -20, 0.12, 11, 7],
      ] as const).map(([x, y, rot, op, w, h], i) => (
        <g key={`fp${i}`} transform={`translate(${x},${y}) rotate(${rot})`}>
          <rect x={-w/2} y={-h/2} width={w} height={h} rx="1.5" fill={c2} opacity={op}/>
          <line x1={-w/2+2} y1={-h/2+2.5} x2={w/2-2} y2={-h/2+2.5} stroke="#F5F0E8" strokeWidth="0.3" opacity={op}/>
          <line x1={-w/2+2} y1={-h/2+5} x2={w/2-3} y2={-h/2+5} stroke="#F5F0E8" strokeWidth="0.3" opacity={op*0.7}/>
        </g>
      ))}

      {/* Small stars / dust particles */}
      {([[155,38],[195,75],[60,50],[200,120],[48,100],[185,45]] as const).map(([x,y],i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={0.8 + i * 0.15} fill={c2} opacity={0.3 - i * 0.03}/>
      ))}
    </svg>
  );
}
