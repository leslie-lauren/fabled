import { useState, useEffect, useRef } from "react";

const ARCHETYPES = [
  "Feral Fae","Wandering Wisp","Tome Gnome","Realm Rider",
  "Pensive Pixie","Prose Rose","Galloping Goblin","Glitch Witch",
  "Hearth Hare","Doom Bloom","Riddling Raven","Swoon Fawn"
];

const COMPAT_MAP = {
  "Feral Fae":{best:"Wandering Wisp",tension:"Prose Rose",bestDesc:"They dream what you dare to burn",tensionDesc:"Their precision threatens your beautiful chaos"},
  "Wandering Wisp":{best:"Feral Fae",tension:"Riddling Raven",bestDesc:"They ignite what you only whisper",tensionDesc:"They want debate; you want the dream"},
  "Tome Gnome":{best:"Realm Rider",tension:"Galloping Goblin",bestDesc:"You dig deep while they map wide",tensionDesc:"They read for speed, you read for sediment"},
  "Realm Rider":{best:"Tome Gnome",tension:"Pensive Pixie",bestDesc:"Together you chart the inner and outer worlds",tensionDesc:"They look inward while you look outward"},
  "Pensive Pixie":{best:"Swoon Fawn",tension:"Realm Rider",bestDesc:"You both read to understand the self",tensionDesc:"They want new worlds; you want this one, examined"},
  "Prose Rose":{best:"Riddling Raven",tension:"Feral Fae",bestDesc:"Precision meets perspective",tensionDesc:"Their recklessness offends your taste"},
  "Galloping Goblin":{best:"Doom Bloom",tension:"Tome Gnome",bestDesc:"You both crave the edge of the page",tensionDesc:"They want to linger where you want to sprint"},
  "Glitch Witch":{best:"Hearth Hare",tension:"Doom Bloom",bestDesc:"You transform what they illuminate",tensionDesc:"They stay in the dark; you bring everything into light"},
  "Hearth Hare":{best:"Glitch Witch",tension:"Wandering Wisp",bestDesc:"You illuminate what they transform",tensionDesc:"They drift where you anchor"},
  "Doom Bloom":{best:"Galloping Goblin",tension:"Glitch Witch",bestDesc:"You haunt the same literary edges",tensionDesc:"They blend everything; you want the pure dark"},
  "Riddling Raven":{best:"Prose Rose",tension:"Wandering Wisp",bestDesc:"You both dissect, from different angles",tensionDesc:"They float past the arguments you savor"},
  "Swoon Fawn":{best:"Pensive Pixie",tension:"Galloping Goblin",bestDesc:"You both believe books are about being human",tensionDesc:"They want adrenaline; you want ache"},
};

const AXES_INFO = {
  heartVsHead: { left:"Heart", right:"Head", desc:"Are you reading to feel or to think? Heart readers want to be emotionally wrecked. Head readers want to be intellectually rewired." },
  plotVsProse: { left:"Plot", right:"Prose", desc:"Are you here for what happens or how it's written? Plot readers need momentum. Prose readers will reread a single paragraph for the rhythm." },
  familiarVsFrontier: { left:"Familiar", right:"Frontier", desc:"Do you go deeper or wider? Familiar readers love their corner of the bookstore. Frontier readers would rather be confused by something new." },
  lightVsDark: { left:"Light", right:"Dark", desc:"Do you reach for warmth or weight? Light readers use books as refuge. Dark readers use books as confrontation." },
  realVsImagined: { left:"Real", right:"Imagined", desc:"This world or an invented one? Real readers stay close to what happened. Imagined readers want to leave this world entirely." },
};

const AURA_PROMPT = (books) => `You are a literary personality analyst with the wit of a roast comedian and the depth of a literature professor. You work at a whimsical fairy-tale sorting ceremony for readers.

Given someone's favorite books, generate their "Reading Aura" profile. You MUST select their archetype from this exact list:
${ARCHETYPES.map(a => `- ${a}`).join("\n")}

Archetype meanings:
- Feral Fae: Intensity addicts who read at 3am, literary adrenaline junkies
- Wandering Wisp: Atmosphere chasers, mood over plot, dreamy surrealist readers
- Tome Gnome: Layer diggers, dense historical epics, patient deep readers
- Realm Rider: World explorers, fantasy/sci-fi, expansive scope lovers
- Pensive Pixie: Self-seekers, memoir/autofiction, "who am I" readers
- Prose Rose: Craft worshippers, precise prose where every sentence earns its place
- Galloping Goblin: Adrenaline readers, thrillers/suspense, must know what happens
- Glitch Witch: Genre benders, eclectic cross-genre taste, defies categories
- Hearth Hare: Hope finders, redemptive arcs, found-family, leaves you believing
- Doom Bloom: Darkness dwellers, gothic/horror/dark academia, the uncanny
- Riddling Raven: Perspective collectors, multi-POV, moral complexity
- Swoon Fawn: Connection chasers, love stories, emotional depth, tenderness

Books: ${books.join(", ")}

Respond ONLY with valid JSON (no markdown, no backticks, no preamble):
{
  "archetype": "One from the list above that best fits",
  "colorPrimary": "A rich saturated hex color — bold and vivid, NOT too dark",
  "colorSecondary": "A complementary vivid hex accent",
  "colorTertiary": "A third hex for depth",
  "bio": "2 sentences max. Weave together what this reader type means with specific observations about their book choices. Identity-affirming, slightly mystical, like a horoscope that feels personally written.",
  "superlative": "2-3 sentences. A hyper-specific pattern observation about their book choices that feels like the universe noticed something. Start with a concrete pattern like 'Every single one of your picks...' or '4 out of 5 of your books...' then expand on what that reveals about them. Be specific and insightful.",
  "roast": "One sentence. Affectionate, pointed, specific to their actual book choices.",
  "strengths": ["Exactly 3 reader strengths, 2-4 words each"],
  "axes": {
    "heartVsHead": "integer 1-5, 1=pure emotion 5=pure intellect",
    "plotVsProse": "integer 1-5, 1=plot-driven 5=prose-obsessed",
    "familiarVsFrontier": "integer 1-5, 1=comfort reads 5=adventurous",
    "lightVsDark": "integer 1-5, 1=warm/hopeful 5=dark/heavy",
    "realVsImagined": "integer 1-5, 1=realism/nonfiction 5=fantasy/speculative"
  },
  "bookScope": "A specific real book rec for this month, framed mystically: 'This month, reach for [Title] by [Author]. [One poetic sentence on why it's calling to them right now].' Max 30 words total.",
  "spiritBook": "Just a book title + author.",
  "prediction2036": "One creative, surprising, funny sentence predicting what they'll be reading in 2036."
}`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@300;400&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseGlow{0%,100%{opacity:.35}50%{opacity:.7}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes cardReveal{0%{opacity:0;transform:scale(.92);filter:blur(8px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
`;

/* ── Creature Illustrations ── */
function CreatureArt({archetype,c1,c2,c3}) {
  const render = () => {
    switch(archetype) {
      case "Feral Fae": // Wild fairy with messy wings, sparkles
        return (<g transform="translate(50,18) scale(0.9)">
          {/* Wings (messy, asymmetric) */}
          <path d="M35,50 Q10,30 18,15 Q28,25 30,10 Q35,28 40,40" fill={c2} opacity="0.25"/>
          <path d="M65,50 Q90,25 85,12 Q78,22 80,5 Q72,25 60,40" fill={c2} opacity="0.2"/>
          <path d="M35,55 Q8,60 12,75 Q25,65 20,80 Q32,68 38,60" fill={c2} opacity="0.15"/>
          <path d="M65,55 Q92,58 90,72 Q78,62 82,78 Q70,66 62,58" fill={c2} opacity="0.12"/>
          {/* Body */}
          <ellipse cx="50" cy="62" rx="12" ry="14" fill={c1} opacity="0.8"/>
          {/* Head */}
          <circle cx="50" cy="42" r="13" fill={c1} opacity="0.85"/>
          {/* Wild hair/spikes */}
          <path d="M40,32 L35,18 L42,28" fill={c1} opacity="0.7"/>
          <path d="M48,30 L46,14 L52,26" fill={c1} opacity="0.75"/>
          <path d="M56,30 L60,16 L54,26" fill={c1} opacity="0.7"/>
          <path d="M62,34 L68,22 L58,30" fill={c1} opacity="0.65"/>
          {/* Eyes (wild, bright) */}
          <circle cx="44" cy="40" r="3.5" fill="#111010"/>
          <circle cx="56" cy="40" r="3.5" fill="#111010"/>
          <circle cx="45" cy="39" r="1.8" fill={c2} opacity="0.9"/>
          <circle cx="57" cy="39" r="1.8" fill={c2} opacity="0.9"/>
          <circle cx="45.5" cy="38.5" r="0.7" fill="#F5F0E8" opacity="0.8"/>
          <circle cx="57.5" cy="38.5" r="0.7" fill="#F5F0E8" opacity="0.8"/>
          {/* Grin */}
          <path d="M44,48 Q50,53 56,48" fill="none" stroke="#111010" strokeWidth="1" opacity="0.5"/>
          {/* Sparkles */}
          {[[20,20],[82,18],[14,55],[88,50],[30,80],[72,82]].map(([x,y],i)=>(
            <g key={i} transform={`translate(${x},${y})`}>
              <polygon points="0,-2.5 0.8,-0.8 2.5,0 0.8,0.8 0,2.5 -0.8,0.8 -2.5,0 -0.8,-0.8" fill={c2} opacity={0.5-i*0.05} transform={`scale(${0.5+i*0.12})`}/>
            </g>
          ))}
          {/* Tiny feet */}
          <ellipse cx="43" cy="76" rx="4" ry="2.5" fill={c1} opacity="0.6"/>
          <ellipse cx="57" cy="76" rx="4" ry="2.5" fill={c1} opacity="0.6"/>
        </g>);

      case "Wandering Wisp": // Glowing wisp orb with a tiny face
        return (<g transform="translate(50,22) scale(0.9)">
          {/* Outer glow rings */}
          <circle cx="50" cy="48" r="38" fill={c1} opacity="0.04"/>
          <circle cx="50" cy="48" r="28" fill={c1} opacity="0.06"/>
          <circle cx="50" cy="48" r="18" fill={c1} opacity="0.1"/>
          {/* Main orb body */}
          <circle cx="50" cy="48" r="16" fill={c1} opacity="0.65"/>
          <circle cx="50" cy="48" r="12" fill={c2} opacity="0.2"/>
          {/* Sleepy face */}
          <path d="M43,46 Q45.5,49 48,46" fill="none" stroke="#111010" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <path d="M52,46 Q54.5,49 57,46" fill="none" stroke="#111010" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <path d="M47,52 Q50,54 53,52" fill="none" stroke="#111010" strokeWidth="0.7" opacity="0.3"/>
          {/* Trailing wisps/tail */}
          <path d="M42,60 Q35,72 30,80 Q28,85 32,88" fill="none" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
          <path d="M50,62 Q48,74 45,82 Q43,88 46,92" fill="none" stroke={c1} strokeWidth="2.5" strokeLinecap="round" opacity="0.25"/>
          <path d="M58,60 Q62,70 60,78 Q58,84 62,86" fill="none" stroke={c2} strokeWidth="2" strokeLinecap="round" opacity="0.2"/>
          {/* Tiny floating particles */}
          {[[28,35],[72,32],[22,58],[78,55],[35,75],[68,72]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={1+i*0.2} fill={c2} opacity={0.35-i*0.04}/>
          ))}
        </g>);

      case "Tome Gnome": // Small gnome with pointy hat sitting on books
        return (<g transform="translate(50,15) scale(0.9)">
          {/* Stack of books */}
          <rect x="25" y="68" width="50" height="7" rx="1.5" fill={c2} opacity="0.3"/>
          <rect x="28" y="61" width="44" height="7" rx="1.5" fill={c1} opacity="0.25"/>
          <rect x="22" y="75" width="56" height="7" rx="1.5" fill={c3||c2} opacity="0.2"/>
          {/* Body sitting on books */}
          <ellipse cx="50" cy="58" rx="12" ry="10" fill={c1} opacity="0.8"/>
          {/* Head */}
          <circle cx="50" cy="42" r="11" fill={c1} opacity="0.85"/>
          {/* Pointy hat */}
          <path d="M38,38 L50,8 L62,38" fill={c2} opacity="0.6"/>
          <path d="M40,38 L50,14 L60,38" fill={c1} opacity="0.3"/>
          {/* Hat star */}
          <g transform="translate(50,18)">
            <polygon points="0,-3 1,-1 3,0 1,1 0,3 -1,1 -3,0 -1,-1" fill={c2} opacity="0.6" transform="scale(0.7)"/>
          </g>
          {/* Big round eyes */}
          <circle cx="44" cy="42" r="3.5" fill="#111010"/>
          <circle cx="56" cy="42" r="3.5" fill="#111010"/>
          <circle cx="45" cy="41" r="1.5" fill="#F5F0E8" opacity="0.8"/>
          <circle cx="57" cy="41" r="1.5" fill="#F5F0E8" opacity="0.8"/>
          {/* Big round nose */}
          <circle cx="50" cy="47" r="2.5" fill={c2} opacity="0.4"/>
          {/* Beard */}
          <path d="M42,49 Q44,56 50,60 Q56,56 58,49" fill={c1} opacity="0.3"/>
          {/* Dangling legs */}
          <rect x="43" y="65" width="4" height="8" rx="2" fill={c1} opacity="0.6"/>
          <rect x="53" y="65" width="4" height="8" rx="2" fill={c1} opacity="0.6"/>
          {/* Tiny boots */}
          <ellipse cx="45" cy="74" rx="4" ry="2" fill={c2} opacity="0.4"/>
          <ellipse cx="55" cy="74" rx="4" ry="2" fill={c2} opacity="0.4"/>
        </g>);

      case "Realm Rider": // Figure on a magical flying horse/creature
        return (<g transform="translate(45,18) scale(0.85)">
          {/* Steed body */}
          <ellipse cx="55" cy="62" rx="22" ry="14" fill={c1} opacity="0.6"/>
          {/* Steed legs */}
          <rect x="36" y="72" width="4" height="14" rx="2" fill={c1} opacity="0.5" transform="rotate(-10 38 72)"/>
          <rect x="44" y="74" width="4" height="12" rx="2" fill={c1} opacity="0.5" transform="rotate(5 46 74)"/>
          <rect x="62" y="74" width="4" height="12" rx="2" fill={c1} opacity="0.5" transform="rotate(-5 64 74)"/>
          <rect x="70" y="72" width="4" height="14" rx="2" fill={c1} opacity="0.5" transform="rotate(10 72 72)"/>
          {/* Steed neck + head */}
          <path d="M38,56 Q32,42 35,32" fill="none" stroke={c1} strokeWidth="7" strokeLinecap="round" opacity="0.65"/>
          <circle cx="34" cy="30" r="8" fill={c1} opacity="0.7"/>
          {/* Horn */}
          <line x1="34" y1="22" x2="32" y2="10" stroke={c2} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          {/* Steed eye */}
          <circle cx="31" cy="29" r="2" fill="#111010"/>
          <circle cx="31.5" cy="28.5" r="0.8" fill="#F5F0E8" opacity="0.7"/>
          {/* Mane */}
          <path d="M38,34 Q42,28 38,22 Q44,26 40,18" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.3"/>
          {/* Rider */}
          <circle cx="55" cy="40" r="8" fill={c1} opacity="0.85"/>
          <path d="M48,50 Q48,44 55,42 Q62,44 62,50 L60,58 L50,58 Z" fill={c1} opacity="0.75"/>
          {/* Rider eyes */}
          <circle cx="52" cy="39" r="1.8" fill="#111010"/>
          <circle cx="58" cy="39" r="1.8" fill="#111010"/>
          <circle cx="52.5" cy="38.5" r="0.7" fill="#F5F0E8" opacity="0.8"/>
          <circle cx="58.5" cy="38.5" r="0.7" fill="#F5F0E8" opacity="0.8"/>
          {/* Tail flowing */}
          <path d="M76,60 Q88,55 92,62 Q86,58 90,68" fill="none" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
          {/* Stars around */}
          {[[18,18],[88,22],[10,50],[95,45]].map(([x,y],i)=>(
            <g key={i} transform={`translate(${x},${y})`}><polygon points="0,-2 0.7,-0.7 2,0 0.7,0.7 0,2 -0.7,0.7 -2,0 -0.7,-0.7" fill={c2} opacity={0.35-i*0.05}/></g>
          ))}
        </g>);

      case "Pensive Pixie": // Small pixie sitting on a leaf, thinking
        return (<g transform="translate(50,20) scale(0.9)">
          {/* Leaf seat */}
          <path d="M25,72 Q50,60 75,72 Q50,78 25,72 Z" fill={c1} opacity="0.15"/>
          <line x1="50" y1="65" x2="50" y2="78" stroke={c1} strokeWidth="0.5" opacity="0.1"/>
          {/* Delicate wings */}
          <path d="M38,48 Q18,32 22,18 Q30,30 35,42" fill={c2} opacity="0.18"/>
          <path d="M62,48 Q82,32 78,18 Q70,30 65,42" fill={c2} opacity="0.15"/>
          {/* Body sitting */}
          <ellipse cx="50" cy="60" rx="10" ry="10" fill={c1} opacity="0.8"/>
          {/* Head, slightly tilted */}
          <circle cx="50" cy="42" r="12" fill={c1} opacity="0.85"/>
          {/* Soft antenna/hair wisps */}
          <path d="M44,32 Q40,20 42,14" fill="none" stroke={c2} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
          <circle cx="42" cy="13" r="2" fill={c2} opacity="0.35"/>
          <path d="M56,32 Q60,20 58,14" fill="none" stroke={c2} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
          <circle cx="58" cy="13" r="2" fill={c2} opacity="0.35"/>
          {/* Eyes looking down/thoughtful */}
          <path d="M43,42 Q45.5,45 48,42" fill="none" stroke="#111010" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
          <path d="M52,42 Q54.5,45 57,42" fill="none" stroke="#111010" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
          {/* Tiny thoughtful frown */}
          <path d="M47,49 Q50,50 53,49" fill="none" stroke="#111010" strokeWidth="0.6" opacity="0.3"/>
          {/* Hand on chin */}
          <ellipse cx="54" cy="49" rx="3" ry="2.5" fill={c1} opacity="0.7"/>
          {/* Legs dangling */}
          <path d="M44,68 L42,78" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
          <path d="M56,68 L58,78" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
          {/* Thought bubbles */}
          <circle cx="72" cy="30" r="2" fill={c2} opacity="0.2"/>
          <circle cx="78" cy="24" r="3" fill={c2} opacity="0.15"/>
          <circle cx="85" cy="16" r="4.5" fill={c2} opacity="0.1"/>
        </g>);

      case "Prose Rose": // Elegant fairy emerging from a rose
        return (<g transform="translate(50,18) scale(0.9)">
          {/* Rose petals (base) */}
          <path d="M30,70 Q38,55 50,58 Q62,55 70,70 Q60,65 50,68 Q40,65 30,70Z" fill={c1} opacity="0.25"/>
          <path d="M25,78 Q35,62 50,65 Q65,62 75,78 Q62,72 50,75 Q38,72 25,78Z" fill={c1} opacity="0.18"/>
          <path d="M20,85 Q32,70 50,73 Q68,70 80,85 Q65,78 50,80 Q35,78 20,85Z" fill={c2} opacity="0.12"/>
          {/* Figure emerging */}
          <ellipse cx="50" cy="52" rx="10" ry="10" fill={c1} opacity="0.8"/>
          <circle cx="50" cy="36" r="11" fill={c1} opacity="0.85"/>
          {/* Delicate crown of petals as hair */}
          <path d="M40,30 Q38,20 42,16 Q44,22 46,14 Q48,24 50,12 Q52,24 54,14 Q56,22 58,16 Q62,20 60,30" fill={c2} opacity="0.35"/>
          {/* Elegant eyes */}
          <path d="M43,35 L48,34 L48,37 Z" fill="#111010" opacity="0.6"/>
          <path d="M57,35 L52,34 L52,37 Z" fill="#111010" opacity="0.6"/>
          <circle cx="46.5" cy="35.5" r="0.8" fill={c2} opacity="0.7"/>
          <circle cx="53.5" cy="35.5" r="0.8" fill={c2} opacity="0.7"/>
          {/* Tiny content smile */}
          <path d="M46,41 Q50,44 54,41" fill="none" stroke="#111010" strokeWidth="0.7" opacity="0.35"/>
          {/* Leaf/vine arms */}
          <path d="M40,50 Q28,48 22,54" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
          <path d="M60,50 Q72,48 78,54" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
          {/* Floating petals */}
          {[[18,28],[82,25],[12,50],[88,48]].map(([x,y],i)=>(
            <ellipse key={i} cx={x} cy={y} rx="2.5" ry="4" fill={c2} opacity={0.2-i*0.03} transform={`rotate(${i*35} ${x} ${y})`}/>
          ))}
        </g>);

      case "Galloping Goblin": // Goblin mid-sprint with a book
        return (<g transform="translate(45,22) scale(0.9)">
          {/* Motion lines */}
          {[0,1,2].map(i=>(
            <line key={i} x1={15+i*3} y1={50+i*12} x2={28+i*3} y2={48+i*12} stroke={c2} strokeWidth="1" opacity={0.2-i*0.05} strokeLinecap="round"/>
          ))}
          {/* Body (leaning forward, running) */}
          <ellipse cx="55" cy="55" rx="13" ry="12" fill={c1} opacity="0.8" transform="rotate(-15 55 55)"/>
          {/* Head */}
          <circle cx="58" cy="38" r="13" fill={c1} opacity="0.85"/>
          {/* Big pointy ears */}
          <path d="M46,32 L30,22 L44,36" fill={c1} opacity="0.8"/>
          <path d="M70,32 L86,22 L68,36" fill={c1} opacity="0.8"/>
          <path d="M46,33 L34,25 L44,36" fill={c2} opacity="0.15"/>
          <path d="M70,33 L82,25 L68,36" fill={c2} opacity="0.15"/>
          {/* Wild excited eyes */}
          <circle cx="53" cy="36" r="4" fill="#111010"/>
          <circle cx="63" cy="36" r="4" fill="#111010"/>
          <circle cx="54" cy="35" r="2" fill="#F5F0E8" opacity="0.9"/>
          <circle cx="64" cy="35" r="2" fill="#F5F0E8" opacity="0.9"/>
          {/* Big grin */}
          <path d="M51,44 Q58,50 65,44" fill="none" stroke="#111010" strokeWidth="1.2" opacity="0.5"/>
          {/* Running legs */}
          <path d="M48,64 L36,78 L40,80" stroke={c1} strokeWidth="4" strokeLinecap="round" opacity="0.65" fill="none"/>
          <path d="M60,64 L72,75 L68,78" stroke={c1} strokeWidth="4" strokeLinecap="round" opacity="0.65" fill="none"/>
          {/* Book held overhead */}
          <rect x="42" y="18" width="14" height="10" rx="1.5" fill={c2} opacity="0.4" transform="rotate(-10 49 23)"/>
          <line x1="45" y1="21" x2="53" y2="20" stroke={c1} strokeWidth="0.5" opacity="0.3"/>
          <line x1="45" y1="24" x2="53" y2="23" stroke={c1} strokeWidth="0.5" opacity="0.3"/>
          {/* Arm holding book */}
          <path d="M50,48 L46,28" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none"/>
        </g>);

      case "Glitch Witch": // Witch with sparkly/glitchy aura
        return (<g transform="translate(50,14) scale(0.88)">
          {/* Witch hat */}
          <path d="M32,42 L50,4 L68,42" fill={c1} opacity="0.7"/>
          <ellipse cx="50" cy="42" rx="22" ry="5" fill={c1} opacity="0.6"/>
          {/* Hat band */}
          <ellipse cx="50" cy="42" rx="22" ry="5" fill={c2} opacity="0.2"/>
          {/* Hat star */}
          <g transform="translate(56,22)"><polygon points="0,-3 1,-1 3,0 1,1 0,3 -1,1 -3,0 -1,-1" fill={c2} opacity="0.5"/></g>
          {/* Head */}
          <circle cx="50" cy="50" r="12" fill={c1} opacity="0.85"/>
          {/* Body */}
          <path d="M38,60 Q38,54 50,52 Q62,54 62,60 L65,80 Q58,85 50,85 Q42,85 35,80 Z" fill={c1} opacity="0.75"/>
          {/* Cat eyes */}
          <path d="M42,48 L48,47 L48,50 Z" fill="#111010" opacity="0.7"/>
          <path d="M58,48 L52,47 L52,50 Z" fill="#111010" opacity="0.7"/>
          <circle cx="46" cy="48.5" r="0.8" fill={c2} opacity="0.8"/>
          <circle cx="54" cy="48.5" r="0.8" fill={c2} opacity="0.8"/>
          {/* Smirk */}
          <path d="M45,55 Q50,58 55,54" fill="none" stroke="#111010" strokeWidth="0.8" opacity="0.4"/>
          {/* Glitch rectangles scattered */}
          {[[20,30,8,3],[75,35,6,2],[15,65,5,2],[82,60,7,3],[25,80,4,2],[78,78,6,2]].map(([x,y,w,h],i)=>(
            <rect key={i} x={x} y={y} width={w} height={h} rx="0.5" fill={i%2===0?c2:c1} opacity={0.25-i*0.03}/>
          ))}
          {/* Wand */}
          <line x1="66" y1="65" x2="82" y2="50" stroke={c2} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          <g transform="translate(83,49)"><polygon points="0,-3 1,-1 3,0 1,1 0,3 -1,1 -3,0 -1,-1" fill={c2} opacity="0.6" transform="scale(0.8)"/></g>
        </g>);

      case "Hearth Hare": // Cozy rabbit by a small fire
        return (<g transform="translate(50,18) scale(0.9)">
          {/* Small campfire */}
          <path d="M65,78 Q62,68 65,58 Q68,65 70,56 Q72,66 68,78 Z" fill={c2} opacity="0.5"/>
          <path d="M66,78 Q64,70 66,64 Q68,68 69,62 Q70,70 68,78 Z" fill={c1} opacity="0.3"/>
          <ellipse cx="67" cy="80" rx="6" ry="2" fill={c2} opacity="0.15"/>
          {/* Glow */}
          <circle cx="67" cy="68" r="14" fill={c2} opacity="0.05"/>
          {/* Hare body (curled up cozy) */}
          <ellipse cx="45" cy="68" rx="16" ry="13" fill={c1} opacity="0.8"/>
          {/* Head */}
          <circle cx="42" cy="48" r="13" fill={c1} opacity="0.85"/>
          {/* Long ears (one up, one flopped) */}
          <ellipse cx="34" cy="26" rx="4.5" ry="16" fill={c1} opacity="0.8" transform="rotate(-10 34 26)"/>
          <ellipse cx="34" cy="26" rx="2.5" ry="12" fill={c2} opacity="0.15" transform="rotate(-10 34 26)"/>
          <path d="M50,36 Q56,20 60,24 Q58,30 52,36" fill={c1} opacity="0.7"/>
          <path d="M51,36 Q55,24 58,26 Q56,30 52,36" fill={c2} opacity="0.12"/>
          {/* Content closed eyes */}
          <path d="M36,47 Q38.5,50 41,47" fill="none" stroke="#111010" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
          <path d="M44,47 Q46.5,50 49,47" fill="none" stroke="#111010" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
          {/* Nose */}
          <circle cx="42" cy="52" r="2" fill={c2} opacity="0.35"/>
          {/* Content smile */}
          <path d="M40,54 Q42,56 44,54" fill="none" stroke="#111010" strokeWidth="0.6" opacity="0.3"/>
          {/* Little paws tucked */}
          <ellipse cx="54" cy="74" rx="5" ry="3" fill={c1} opacity="0.65"/>
          {/* Warmth lines from fire */}
          {[0,1,2].map(i=>(
            <path key={i} d={`M${72+i*4},${55-i*5} Q${74+i*4},${50-i*5} ${72+i*4},${45-i*5}`} fill="none" stroke={c2} strokeWidth="0.6" opacity={0.15-i*0.04}/>
          ))}
        </g>);

      case "Doom Bloom": // Dark flower with a cute creature peeking out
        return (<g transform="translate(50,20) scale(0.9)">
          {/* Stem */}
          <line x1="50" y1="65" x2="50" y2="88" stroke={c1} strokeWidth="2" opacity="0.3"/>
          {/* Thorns */}
          <path d="M50,72 L44,68" stroke={c1} strokeWidth="1" opacity="0.2"/>
          <path d="M50,80 L56,76" stroke={c1} strokeWidth="1" opacity="0.2"/>
          {/* Dark petals */}
          {[0,1,2,3,4,5].map(i=>{
            const a = i*60*Math.PI/180 - Math.PI/2;
            const px = 50+Math.cos(a)*18;
            const py = 48+Math.sin(a)*18;
            return <ellipse key={i} cx={px} cy={py} rx="8" ry="14" fill={c1} opacity={0.35-i*0.03}
              transform={`rotate(${i*60} ${px} ${py})`}/>;
          })}
          {/* Inner petals */}
          {[0,1,2,3,4,5].map(i=>{
            const a = (i*60+30)*Math.PI/180 - Math.PI/2;
            const px = 50+Math.cos(a)*10;
            const py = 48+Math.sin(a)*10;
            return <ellipse key={`i${i}`} cx={px} cy={py} rx="5" ry="9" fill={c2} opacity={0.2-i*0.02}
              transform={`rotate(${i*60+30} ${px} ${py})`}/>;
          })}
          {/* Cute creature in center */}
          <circle cx="50" cy="48" r="10" fill={c1} opacity="0.9"/>
          {/* Big glowing eyes */}
          <circle cx="46" cy="46" r="3.5" fill="#111010" opacity="0.7"/>
          <circle cx="54" cy="46" r="3.5" fill="#111010" opacity="0.7"/>
          <circle cx="46" cy="46" r="2" fill={c2} opacity="0.8"/>
          <circle cx="54" cy="46" r="2" fill={c2} opacity="0.8"/>
          <circle cx="46.5" cy="45.5" r="0.8" fill="#F5F0E8" opacity="0.7"/>
          <circle cx="54.5" cy="45.5" r="0.8" fill="#F5F0E8" opacity="0.7"/>
          {/* Little fangs */}
          <path d="M48,52 L47,55" stroke="#F5F0E8" strokeWidth="0.8" opacity="0.5"/>
          <path d="M52,52 L53,55" stroke="#F5F0E8" strokeWidth="0.8" opacity="0.5"/>
          {/* Leaves */}
          <path d="M35,75 Q28,70 30,62 Q34,68 35,75 Z" fill={c1} opacity="0.2"/>
          <path d="M65,72 Q72,67 70,60 Q66,65 65,72 Z" fill={c1} opacity="0.2"/>
        </g>);

      case "Riddling Raven": // Mystical raven with symbols
        return (<g transform="translate(48,18) scale(0.88)">
          {/* Wings spread */}
          <path d="M38,52 Q15,40 8,48 Q14,44 6,52 Q16,48 12,56 Q22,50 28,56" fill={c1} opacity="0.55"/>
          <path d="M62,52 Q85,40 92,48 Q86,44 94,52 Q84,48 88,56 Q78,50 72,56" fill={c1} opacity="0.55"/>
          {/* Body */}
          <ellipse cx="50" cy="58" rx="14" ry="16" fill={c1} opacity="0.8"/>
          {/* Head */}
          <circle cx="50" cy="38" r="12" fill={c1} opacity="0.85"/>
          {/* Beak */}
          <polygon points="46,42 42,48 50,46" fill={c2} opacity="0.6"/>
          {/* Eye (one, knowing) */}
          <circle cx="52" cy="36" r="3.5" fill="#111010"/>
          <circle cx="53" cy="35" r="1.5" fill={c2} opacity="0.8"/>
          <circle cx="53.5" cy="34.5" r="0.6" fill="#F5F0E8" opacity="0.7"/>
          {/* Crown feathers */}
          <path d="M44,28 L40,18 L46,24" fill={c1} opacity="0.7"/>
          <path d="M50,26 L50,14 L52,24" fill={c1} opacity="0.75"/>
          <path d="M56,28 L60,18 L54,24" fill={c1} opacity="0.7"/>
          {/* Tail feathers */}
          <path d="M44,72 L38,85 M50,74 L48,88 M56,72 L58,85" stroke={c1} strokeWidth="2.5" strokeLinecap="round" opacity="0.45" fill="none"/>
          {/* Mystical symbols floating */}
          <text x="22" y="32" fill={c2} opacity="0.2" fontSize="8" fontFamily="serif">?</text>
          <text x="76" y="28" fill={c2} opacity="0.15" fontSize="10" fontFamily="serif">?</text>
          <circle cx="82" cy="62" r="2" fill={c2} opacity="0.15"/>
          <circle cx="18" cy="65" r="1.5" fill={c2} opacity="0.12"/>
        </g>);

      case "Swoon Fawn": // Gentle deer with hearts and flowers
        return (<g transform="translate(48,16) scale(0.88)">
          {/* Body */}
          <ellipse cx="50" cy="62" rx="16" ry="16" fill={c1} opacity="0.75"/>
          {/* Neck */}
          <path d="M44,52 Q44,42 48,36" fill="none" stroke={c1} strokeWidth="10" strokeLinecap="round" opacity="0.8"/>
          {/* Head */}
          <ellipse cx="50" cy="32" rx="12" ry="10" fill={c1} opacity="0.85"/>
          {/* Small antlers with hearts */}
          <path d="M41,24 Q38,14 35,16 M38,16 Q36,10 38,8" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          <path d="M59,24 Q62,14 65,16 M62,16 Q64,10 62,8" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          {/* Big soft eyes */}
          <circle cx="45" cy="31" r="3.5" fill="#111010"/>
          <circle cx="55" cy="31" r="3.5" fill="#111010"/>
          <circle cx="46" cy="30" r="1.8" fill="#F5F0E8" opacity="0.85"/>
          <circle cx="56" cy="30" r="1.8" fill="#F5F0E8" opacity="0.85"/>
          {/* Blush */}
          <circle cx="40" cy="35" r="3" fill={c2} opacity="0.12"/>
          <circle cx="60" cy="35" r="3" fill={c2} opacity="0.12"/>
          {/* Nose */}
          <ellipse cx="50" cy="37" rx="2" ry="1.5" fill="#111010" opacity="0.4"/>
          {/* Legs */}
          <rect x="38" y="74" width="4" height="14" rx="2" fill={c1} opacity="0.6"/>
          <rect x="58" y="74" width="4" height="14" rx="2" fill={c1} opacity="0.6"/>
          {/* Tiny hearts floating */}
          {[[22,22],[78,18],[18,50],[82,45],[28,72],[74,70]].map(([x,y],i)=>(
            <path key={i} d={`M${x},${y+2} Q${x-2},${y} ${x},${y-2} Q${x+2},${y} ${x},${y+2}`} fill={c2} opacity={0.3-i*0.04}/>
          ))}
          {/* Spot on body */}
          <circle cx="55" cy="58" r="3" fill={c2} opacity="0.1"/>
          <circle cx="44" cy="64" r="2" fill={c2} opacity="0.08"/>
        </g>);

      default:
        return (<g transform="translate(50,30)"><circle cx="50" cy="50" r="20" fill={c1} opacity="0.5"/></g>);
    }
  };

  return (
    <svg viewBox="0 0 100 95" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:220,height:"auto",display:"block",margin:"0 auto"}}>
      <defs><radialGradient id="cg"><stop offset="0%" stopColor={c1} stopOpacity="0.08"/><stop offset="100%" stopColor={c1} stopOpacity="0"/></radialGradient></defs>
      <circle cx="50" cy="50" r="48" fill="url(#cg)"/>
      {render()}
    </svg>
  );
}

/* ── Axis Bar ── */
function AxisBar({leftLabel,rightLabel,value,color}) {
  const pct=((value-1)/4)*100;
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:10,color:value<=2?color:"#5A564F",fontWeight:value<=2?500:400,fontFamily:"'DM Sans',sans-serif"}}>{leftLabel}</span>
        <span style={{fontSize:10,color:value>=4?color:"#5A564F",fontWeight:value>=4?500:400,fontFamily:"'DM Sans',sans-serif"}}>{rightLabel}</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.04)",borderRadius:2,position:"relative"}}>
        <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color}30,${color}08)`,borderRadius:2,transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)"}}/>
        <div style={{position:"absolute",left:`${pct}%`,top:"50%",transform:"translate(-50%,-50%)",width:11,height:11,borderRadius:"50%",background:color,opacity:.85,boxShadow:`0 0 10px ${color}40`,transition:"left 0.8s cubic-bezier(0.34,1.56,0.64,1)"}}/>
      </div>
    </div>
  );
}

/* ── Info Modal ── */
function AxesInfoModal({onClose,c1}) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.2s ease-out"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#1A1918",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"24px 20px",maxWidth:360,width:"100%",maxHeight:"80vh",overflow:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#F5F0E8",margin:0}}>Reading Dimensions</h3>
          <span onClick={onClose} style={{color:"#5A564F",cursor:"pointer",fontSize:18,padding:"4px 8px"}}>✕</span>
        </div>
        {Object.values(AXES_INFO).map((ax,i)=>(
          <div key={i} style={{marginBottom:16,paddingBottom:i<4?16:0,borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,color:c1||"#C4956A",margin:"0 0 4px"}}>{ax.left} vs {ax.right}</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#9B958A",margin:0,lineHeight:1.5,fontWeight:300}}>{ax.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Swipeable Cards ── */
function SwipeCards({aura}) {
  const {colorPrimary:c1,colorSecondary:c2,colorTertiary:c3}=aura;
  const [idx,setIdx]=useState(0);
  const touchRef=useRef(null);
  const cards=[
    {emoji:"✨",label:"This Month's Book-Scope",content:aura.bookScope},
    {emoji:"🔥",label:"Roast",content:aura.roast},
    {emoji:"🧚",label:"Spirit Book",content:aura.spiritBook},
    {emoji:"🔮",label:"2036 Prediction",content:aura.prediction2036},
  ];
  const next=()=>setIdx(i=>(i+1)%cards.length);
  const prev=()=>setIdx(i=>(i-1+cards.length)%cards.length);
  const onTS=e=>{touchRef.current=e.touches[0].clientX};
  const onTE=e=>{if(touchRef.current===null)return;const d=touchRef.current-e.changedTouches[0].clientX;if(Math.abs(d)>40){d>0?next():prev()}touchRef.current=null};
  const onMD=e=>{touchRef.current=e.clientX};
  const onMU=e=>{if(touchRef.current===null)return;const d=touchRef.current-e.clientX;if(Math.abs(d)>40){d>0?next():prev()}touchRef.current=null};
  const card=cards[idx];
  return (
    <div style={{marginBottom:16}}>
      <div onTouchStart={onTS} onTouchEnd={onTE} onMouseDown={onMD} onMouseUp={onMU}
        style={{background:`linear-gradient(135deg,${c1}0C,${c3||c2}08)`,border:`1px solid ${c1}15`,borderRadius:16,padding:"14px 16px",textAlign:"center",cursor:"grab",userSelect:"none",minHeight:85,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5A564F",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 8px"}}>{card.emoji} {card.label}</p>
        <p style={{color:"#C8C2B8",fontSize:13,lineHeight:1.55,margin:0,fontWeight:300,fontStyle:card.label==="Spirit Book"?"italic":"normal"}}>{card.content}</p>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:8}}>
        <span onClick={prev} style={{color:"#4A463F",fontSize:14,cursor:"pointer",padding:"2px 6px",userSelect:"none"}}>‹</span>
        <div style={{display:"flex",gap:5}}>
          {cards.map((_,i)=>(
            <div key={i} onClick={()=>setIdx(i)} style={{width:i===idx?16:6,height:6,borderRadius:3,background:i===idx?c1:"rgba(255,255,255,0.08)",opacity:i===idx?0.7:0.4,cursor:"pointer",transition:"all 0.3s"}}/>
          ))}
        </div>
        <span onClick={next} style={{color:"#4A463F",fontSize:14,cursor:"pointer",padding:"2px 6px",userSelect:"none"}}>›</span>
      </div>
    </div>
  );
}

/* ── Book Input ── */
function BookInput({books,setBooks,onGenerate,loading}) {
  const [cur,setCur]=useState("");const ref=useRef(null);
  const add=()=>{const t=cur.trim();if(t&&books.length<7){setBooks([...books,t]);setCur("");ref.current?.focus()}};
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"24px",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{animation:"fadeInUp 0.8s ease-out",textAlign:"center",maxWidth:480,width:"100%"}}>
        <div style={{fontSize:48,marginBottom:8,animation:"float 4s ease-in-out infinite"}}>✦</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,40px)",fontWeight:700,color:"#F5F0E8",marginBottom:8,letterSpacing:"-0.02em"}}>Reading Aura</h1>
        <p style={{color:"#9B958A",fontSize:15,fontWeight:300,marginBottom:40}}>Enter 3-7 books you love. We'll divine your reader soul.</p>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          <input ref={ref} type="text" value={cur} onChange={e=>setCur(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}
            placeholder={books.length===0?"e.g. Normal People by Sally Rooney":"Add another..."} disabled={loading||books.length>=7}
            style={{flex:1,padding:"14px 18px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#F5F0E8",fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:"none"}}
            onFocus={e=>e.target.style.borderColor="rgba(255,255,255,0.2)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/>
          <button onClick={add} disabled={!cur.trim()||books.length>=7||loading}
            style={{padding:"14px 20px",background:cur.trim()?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:cur.trim()?"#F5F0E8":"#5A564F",fontSize:15,fontFamily:"'DM Sans',sans-serif",cursor:cur.trim()?"pointer":"default"}}>+</button>
        </div>
        {books.length>0&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:32,justifyContent:"center"}}>
            {books.map((b,i)=>(
              <div key={i} style={{animation:`fadeInUp 0.3s ease-out ${i*.05}s both`,padding:"8px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,color:"#C8C2B8",fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                <span style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b}</span>
                <span onClick={()=>!loading&&setBooks(books.filter((_,j)=>j!==i))} style={{cursor:loading?"default":"pointer",opacity:0.4,fontSize:11}}
                  onMouseEnter={e=>e.target.style.opacity=1} onMouseLeave={e=>e.target.style.opacity=0.4}>✕</span>
              </div>
            ))}
          </div>
        )}
        {books.length>=3&&(
          <button onClick={onGenerate} disabled={loading} style={{
            padding:"16px 48px",background:loading?"linear-gradient(90deg,#3D3429,#5C4F3D,#3D3429)":"linear-gradient(135deg,#C4956A,#8B6E4E)",
            backgroundSize:loading?"200% auto":"100%",border:"none",borderRadius:14,color:"#F5F0E8",fontSize:16,fontWeight:500,
            fontFamily:"'DM Sans',sans-serif",cursor:loading?"wait":"pointer",boxShadow:loading?"none":"0 4px 24px rgba(196,149,106,0.2)",
            ...(loading?{animation:"shimmer 1.5s infinite"}:{})
          }}>{loading?"Divining your aura...":"Reveal My Reading Aura"}</button>
        )}
        {books.length>0&&books.length<3&&(
          <p style={{color:"#6B655C",fontSize:13,fontStyle:"italic"}}>{3-books.length} more book{3-books.length!==1?"s":""} to unlock</p>
        )}
      </div>
    </div>
  );
}

/* ── Aura Card ── */
function AuraCard({aura,onReset}) {
  const {colorPrimary:c1,colorSecondary:c2,colorTertiary:c3}=aura;
  const compat=COMPAT_MAP[aura.archetype]||COMPAT_MAP["Glitch Witch"];
  const [showInfo,setShowInfo]=useState(false);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",minHeight:"100vh",padding:"20px 12px",fontFamily:"'DM Sans',sans-serif"}}>
      {showInfo&&<AxesInfoModal onClose={()=>setShowInfo(false)} c1={c1}/>}
      <div style={{
        animation:"cardReveal 0.8s cubic-bezier(0.16,1,0.3,1)",maxWidth:400,width:"100%",
        background:`linear-gradient(170deg,${c1}14 0%,${c2}0C 35%,#111010 50%,${c3||c2}08 75%,${c1}06 100%)`,
        border:`1px solid ${c1}20`,borderRadius:28,padding:"24px 20px 20px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-50,right:-30,width:140,height:140,background:`radial-gradient(circle,${c1}15,transparent 70%)`,borderRadius:"50%",animation:"pulseGlow 5s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,left:-20,width:100,height:100,background:`radial-gradient(circle,${c2}0D,transparent 70%)`,borderRadius:"50%",animation:"pulseGlow 6s ease-in-out infinite 2s",pointerEvents:"none"}}/>

        {/* ── Creature (hero, no emoji above) ── */}
        <div style={{position:"relative",marginBottom:4}}>
          <CreatureArt archetype={aura.archetype} c1={c1} c2={c2} c3={c3}/>
        </div>

        {/* ── Archetype Header ── */}
        <div style={{textAlign:"center",marginBottom:16}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"#F5F0E8",marginBottom:10,letterSpacing:"-0.02em"}}>{aura.archetype}</h2>
          <p style={{color:"#B8B2A8",fontSize:13,fontWeight:300,margin:"0 auto",maxWidth:340,lineHeight:1.65}}>{aura.bio}</p>
        </div>

        {/* ── Strengths ── */}
        <div style={{marginBottom:18}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5A564F",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 8px",textAlign:"center"}}>Strengths</p>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:6}}>
            {aura.strengths?.map((s,i)=>(
              <span key={i} style={{padding:"4px 11px",background:`${c1}10`,border:`1px solid ${c1}1A`,borderRadius:14,color:c1,fontSize:10,fontWeight:500,letterSpacing:"0.03em"}}>{s}</span>
            ))}
          </div>
        </div>

        {/* ── Axes with info icon ── */}
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5A564F",letterSpacing:"0.1em",textTransform:"uppercase",margin:0}}>Reading Dimensions</p>
            <span onClick={()=>setShowInfo(true)} style={{
              width:18,height:18,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.1)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:10,color:"#5A564F",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",
            }}>i</span>
          </div>
          {Object.entries(AXES_INFO).map(([key,ax])=>(
            <AxisBar key={key} leftLabel={ax.left} rightLabel={ax.right} value={aura.axes?.[key]??3} color={key.includes("head")||key.includes("prose")||key.includes("imagined")?c1:c2}/>
          ))}
        </div>

        {/* ── Book Star Gods Noticed ── */}
        <div style={{textAlign:"center",marginBottom:16,padding:"0 8px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:c1,opacity:0.6,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>✦ The Book Star Gods Noticed</p>
          <p style={{color:"#C8C2B8",fontSize:12,lineHeight:1.6,margin:0,fontWeight:300}}>{aura.superlative}</p>
        </div>

        {/* ── Compatibility ── */}
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <div style={{flex:1,background:`${c1}08`,border:`1px solid ${c1}12`,borderRadius:14,padding:"10px 12px"}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#5A564F",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 3px"}}>Best Match</p>
            <p style={{color:c1,fontSize:12,fontWeight:600,margin:"0 0 3px"}}>{compat.best}</p>
            <p style={{color:"#7A756D",fontSize:10,margin:0,lineHeight:1.4,fontStyle:"italic"}}>{compat.bestDesc}</p>
          </div>
          <div style={{flex:1,background:`${c2}08`,border:`1px solid ${c2}12`,borderRadius:14,padding:"10px 12px"}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#5A564F",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 3px"}}>Creative Tension</p>
            <p style={{color:c2,fontSize:12,fontWeight:600,margin:"0 0 3px"}}>{compat.tension}</p>
            <p style={{color:"#7A756D",fontSize:10,margin:0,lineHeight:1.4,fontStyle:"italic"}}>{compat.tensionDesc}</p>
          </div>
        </div>

        {/* ── Swipeable Cards ── */}
        <SwipeCards aura={aura}/>

        {/* Footer */}
        <div style={{textAlign:"center",paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.03)"}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:10,color:"#3D3A35",letterSpacing:"0.1em"}}>READING AURA ✦ {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:12,marginTop:24,animation:"fadeInUp 0.6s ease-out 0.3s both"}}>
        <button onClick={onReset} style={{padding:"12px 24px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#9B958A",fontSize:14,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}
          onMouseEnter={e=>{e.target.style.background="rgba(255,255,255,0.08)";e.target.style.color="#F5F0E8"}}
          onMouseLeave={e=>{e.target.style.background="rgba(255,255,255,0.05)";e.target.style.color="#9B958A"}}>Start Over</button>
        <button onClick={async()=>{try{await window.storage.set("my-reading-aura",JSON.stringify({aura,createdAt:new Date().toISOString()}));alert("Aura saved!")}catch(e){alert("Could not save.")}}}
          style={{padding:"12px 24px",background:`linear-gradient(135deg,${c1},${c2})`,border:"none",borderRadius:12,color:"#F5F0E8",fontSize:14,fontWeight:500,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",boxShadow:`0 4px 20px ${c1}30`}}>Save My Aura</button>
      </div>
    </div>
  );
}

/* ── Loading ── */
function LoadingScreen() {
  const msgs=["Consulting the book star gods...","Finding your creature...","Mapping your dimensions...","Writing your book-scope...","Preparing your roast..."];
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),2200);return()=>clearInterval(t)},[]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,rgba(196,149,106,0.15),rgba(139,110,78,0.15))",border:"1px solid rgba(196,149,106,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,animation:"float 3s ease-in-out infinite",marginBottom:24}}>✦</div>
      <p key={idx} style={{color:"#9B958A",fontSize:15,fontWeight:300,animation:"fadeInUp 0.3s ease-out"}}>{msgs[idx]}</p>
    </div>
  );
}

/* ── App ── */
export default function ReadingAura() {
  const [books,setBooks]=useState([]);
  const [aura,setAura]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [savedAura,setSavedAura]=useState(null);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("my-reading-aura");if(r?.value)setSavedAura(JSON.parse(r.value))}catch(e){}})()},[]);

  const generate=async()=>{
    setLoading(true);setError(null);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:AURA_PROMPT(books)}]}),
      });
      const data=await res.json();
      const text=data.content?.[0]?.text||"";
      setAura(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch(err){console.error(err);setError("Something went wrong. Try again?")}finally{setLoading(false)}
  };

  const reset=()=>{setBooks([]);setAura(null);setError(null)};

  return (
    <div style={{minHeight:"100vh",background:"#111010",position:"relative",overflow:"hidden"}}>
      <style>{css}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 25% 15%,rgba(196,149,106,0.03) 0%,transparent 55%),radial-gradient(ellipse at 75% 85%,rgba(139,110,78,0.03) 0%,transparent 55%)"}}/>
      {!aura&&!loading&&savedAura&&(
        <div style={{position:"fixed",top:16,right:16,zIndex:10}}>
          <button onClick={()=>setAura(savedAura.aura)} style={{padding:"10px 16px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#9B958A",fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>Saved Aura</button>
        </div>
      )}
      <div style={{position:"relative",zIndex:1}}>
        {loading?<LoadingScreen/>:aura?<AuraCard aura={aura} onReset={reset}/>:<BookInput books={books} setBooks={setBooks} onGenerate={generate} loading={loading}/>}
      </div>
      {error&&(
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",padding:"12px 24px",background:"rgba(180,80,60,0.15)",border:"1px solid rgba(180,80,60,0.25)",borderRadius:12,color:"#D4A090",fontSize:14,fontFamily:"'DM Sans',sans-serif",animation:"fadeInUp 0.3s ease-out"}}>{error}</div>
      )}
    </div>
  );
}
