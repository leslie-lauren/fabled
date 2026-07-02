interface Props {
  c1: string;
  c2: string;
  c3: string;
  className?: string;
}

export default function Sentinel({ c1, c2, c3, className }: Props) {
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sentinel-snArmor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity="0.8"/><stop offset="100%" stopColor={c3} stopOpacity="0.5"/></linearGradient>
      </defs>
      <circle cx="120" cy="140" r="90" fill={c2} opacity="0.03"/>
      {/* Motion lines behind */}
      {[0,1,2,3].map(i=>(
        <line key={`ml${i}`} x1={55-i*8} y1={130+i*20} x2={75-i*5} y2={125+i*20} stroke={c2} strokeWidth="1" opacity={0.12-i*0.025} strokeLinecap="round"/>
      ))}
      {/* Figure mid-sprint, leaning forward */}
      <path d="M105,115 Q96,105 105,96 Q114,88 122,86 Q130,88 138,96 Q146,105 140,115 L152,195 Q155,220 148,240 L92,240 Q85,220 88,195 Z" fill="url(#sentinel-snArmor)"/>
      {/* Armor text/illuminated manuscript patterns */}
      {[[112,120,125,118],[108,135,122,133],[115,150,128,148],[110,165,124,163],[113,180,126,178],[108,195,122,193]].map(([x1,y1,x2,y2],i)=>(
        <line key={`at${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c2} strokeWidth="0.4" opacity="0.15"/>
      ))}
      {/* Armor plates suggestion */}
      <path d="M105,115 L140,115 L142,130 Q122,135 100,130 Z" fill={c1} opacity="0.15"/>
      <path d="M100,145 L142,145 L143,160 Q122,165 98,160 Z" fill={c1} opacity="0.1"/>
      {/* Sprinting legs */}
      <path d="M100,235 L82,260 Q78,268 84,270" stroke={c1} strokeWidth="5" opacity="0.55" fill="none" strokeLinecap="round"/>
      <path d="M135,235 L155,258 Q160,264 155,268" stroke={c1} strokeWidth="5" opacity="0.55" fill="none" strokeLinecap="round"/>
      {/* Shield arm (left) - book as shield */}
      <path d="M105,135 Q88,128 78,132" fill="none" stroke={c1} strokeWidth="4.5" opacity="0.5" strokeLinecap="round"/>
      <g transform="translate(72, 128) rotate(-10)">
        <rect x="-10" y="-14" width="20" height="28" rx="2" fill={c2} opacity="0.3"/>
        <rect x="-10" y="-14" width="3" height="28" rx="1" fill={c1} opacity="0.3"/>
        <circle cx="2" cy="0" r="4" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.2"/>
      </g>
      {/* Sword arm (right) - glowing volume as weapon */}
      <path d="M140,130 Q155,118 165,108" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>
      <g transform="translate(170, 100) rotate(35)">
        <rect x="-4" y="-18" width="8" height="28" rx="1.5" fill={c2} opacity="0.35"/>
        <line x1="0" y1="-18" x2="0" y2="10" stroke={c1} strokeWidth="0.5" opacity="0.2"/>
        {/* Glow */}
        <rect x="-6" y="-20" width="12" height="32" rx="3" fill={c2} opacity="0.05"/>
      </g>
      {/* Helmet/head */}
      <circle cx="122" cy="78" r="15" fill={c1} opacity="0.85"/>
      <path d="M108,76 Q106,64 114,58 Q118,54 122,52 Q126,54 130,58 Q138,64 136,76" fill={c3} opacity="0.55"/>
      {/* Visor */}
      <rect x="110" y="74" width="24" height="6" rx="3" fill="#111010" opacity="0.4"/>
      <circle cx="118" cy="77" r="1.5" fill={c2} opacity="0.5"/>
      <circle cx="126" cy="77" r="1.5" fill={c2} opacity="0.5"/>
    </svg>
  );
}
