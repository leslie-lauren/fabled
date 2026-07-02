interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Cartographer({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="cartographer-crtGlow"><stop offset="0%" stopColor={c2} stopOpacity="0.08"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="cartographer-crtRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="100" fill="url(#cartographer-crtGlow)"/>
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
      <path d="M100,125 Q94,115 104,106 Q113,98 120,96 Q127,98 136,106 Q146,115 140,125 L150,215 Q153,240 146,258 Q138,268 120,270 Q102,268 94,258 Q87,240 90,215 Z" fill="url(#cartographer-crtRobe)"/>
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
