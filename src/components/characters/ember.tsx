interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Ember({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="ember-eGlow"><stop offset="0%" stopColor={c2} stopOpacity="0.15"/><stop offset="100%" stopColor={c2} stopOpacity="0"/></radialGradient>
        <linearGradient id="ember-eRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.7"/><stop offset="100%" stopColor={c3} stopOpacity="0.4"/></linearGradient>
      </defs>
      <circle cx="120" cy="160" r="90" fill={c2} opacity="0.03"/>
      {/* Books arranged as nest around figure */}
      {[
        [70, 225, -20, 22, 14], [90, 235, -5, 20, 13], [145, 232, 8, 20, 13], [168, 222, 22, 22, 14],
        [60, 210, -30, 18, 12], [178, 208, 25, 18, 12],
      ].map(([x,y,r,w,h],i) => (
        <rect key={`nb${i}`} x={x-w/2} y={y-h/2} width={w} height={h} rx="2" fill={i%2===0?c1:c3} opacity={0.2-i*0.02} transform={`rotate(${r} ${x} ${y})`}/>
      ))}
      {/* Warm glow from flame */}
      <circle cx="120" cy="150" r="40" fill="url(#ember-eGlow)"/>
      {/* Figure kneeling/sitting, cradling flame */}
      <path d="M100,155 Q94,145 104,136 Q113,128 120,126 Q127,128 136,136 Q146,145 140,155 L146,218 Q148,235 120,240 Q92,235 94,218 Z" fill="url(#ember-eRobe)"/>
      {/* Arms cupped forward holding flame */}
      <path d="M100,170 Q90,162 86,152 Q84,146 86,142" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <path d="M140,170 Q150,162 154,152 Q156,146 154,142" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      {/* Cupped hands */}
      <path d="M86,140 Q90,135 96,136 Q100,138 98,142" fill={c1} opacity="0.45"/>
      <path d="M154,140 Q150,135 144,136 Q140,138 142,142" fill={c1} opacity="0.45"/>
      {/* Small precious flame */}
      <path d="M120,145 Q115,132 112,118 Q118,128 120,108 Q122,128 128,118 Q125,132 120,145 Z" fill={c2} opacity="0.45"/>
      <path d="M120,145 Q117,136 116,126 Q119,132 120,118 Q121,132 124,126 Q123,136 120,145 Z" fill={c1} opacity="0.3"/>
      {/* Inner flame glow */}
      <circle cx="120" cy="130" r="8" fill={c2} opacity="0.08"/>
      <circle cx="120" cy="132" r="4" fill={c2} opacity="0.12"/>
      {/* Head */}
      <circle cx="120" cy="116" r="15" fill={c1} opacity="0.85"/>
      <path d="M106,114 Q104,102 110,95 Q116,90 120,88 Q124,90 130,95 Q136,102 134,114" fill={c3} opacity="0.45"/>
      {/* Gentle, downcast eyes looking at flame */}
      <path d="M112,115 Q114.5,118 117,115" fill="none" stroke="#111010" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
      <path d="M123,115 Q125.5,118 128,115" fill="none" stroke="#111010" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
      {/* Gentle smile */}
      <path d="M116,121 Q120,123 124,121" fill="none" stroke="#111010" strokeWidth="0.5" opacity="0.2"/>
      <path d="M108,158 Q106,190 100,225" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      <path d="M132,158 Q134,190 140,225" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1"/>
      {/* Warmth particles rising */}
      {[[115,105],[125,100],[120,95],[112,92],[128,88],[120,82]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={0.6+i*0.08} fill={c2} opacity={0.2-i*0.025}/>
      ))}
    </svg>
  );
}
