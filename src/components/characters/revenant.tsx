interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Revenant({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="revenant-rvRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.55"/><stop offset="100%" stopColor={c3} stopOpacity="0.2"/></linearGradient>
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
      <path d="M100,110 Q94,100 104,92 Q113,84 120,82 Q127,84 136,92 Q146,100 140,110 L148,210 Q150,240 144,255 Q136,265 120,268 Q104,265 96,255 Q90,240 92,210 Z" fill="url(#revenant-rvRobe)"/>
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
