interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Heretic({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="heretic-hRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="90" fill={c2} opacity="0.03"/>
      {/* Figure standing, holding cracked book */}
      <path d="M98,125 Q92,115 102,106 Q112,98 120,96 Q128,98 138,106 Q148,115 142,125 L150,220 Q152,245 146,260 Q138,270 120,272 Q102,270 94,260 Q88,245 90,220 Z" fill="url(#heretic-hRobe)"/>
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
