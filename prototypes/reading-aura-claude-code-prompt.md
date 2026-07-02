# Reading Aura - Claude Code Project Prompt

## What We're Building
A standalone webapp called "Reading Aura" that generates a mystical reader personality profile. Users input 3-7 books they love and get sorted into one of 12 whimsical fairy-fantasy reader archetypes, each with a unique creature illustration, reading dimension analysis, compatibility info, and rotating bonus content. The card output should feel screenshot-worthy and Instagram-shareable.

This is step one of a larger "book club meets dating app" concept. Future features: club creation with invite codes, blind book swiping (dating-app style matching on books), and AI-generated discussion questions. Architect with that in mind but only build the Reading Aura generator for now.

## Tech Stack
- **Next.js 14+ (App Router)** - deploys to Vercel with zero config
- **React** with Tailwind CSS
- **Anthropic API** via server-side API route (NEVER expose API key client-side)
- **localStorage** for saving auras (will add database later for clubs)

## Architecture

### Routes
- `/` - Landing + book input screen
- `/aura` - Aura card result

### API Route
- `/api/generate-aura` - POST endpoint
  - Accepts `{ books: string[] }`
  - Calls Anthropic API (claude-sonnet-4-20250514, max_tokens: 1200)
  - Returns parsed JSON aura object
  - Uses `ANTHROPIC_API_KEY` from env

---

## The 12 Archetypes

Each archetype has a unique name, creature illustration (whimsical SVG), and reader personality:

| Archetype | Creature | Reader Type |
|---|---|---|
| Feral Fae | Wild fairy with messy wings + sparkles | Intensity addicts, 3am finishers, literary adrenaline |
| Wandering Wisp | Glowing orb with trailing wisps + particles | Atmosphere chasers, mood over plot, surrealist |
| Tome Gnome | Gnome with pointy hat sitting on book stack | Layer diggers, dense epics, patient deep readers |
| Realm Rider | Small figure riding a unicorn with stars | World explorers, fantasy/sci-fi, expansive scope |
| Pensive Pixie | Pixie sitting on leaf with thought bubbles | Self-seekers, memoir/autofiction, introspective |
| Prose Rose | Elegant fairy emerging from rose petals | Craft worshippers, precise prose, sentence-level beauty |
| Galloping Goblin | Goblin sprinting with book held overhead | Adrenaline readers, thrillers, must know what happens |
| Glitch Witch | Witch with hat + wand, glitch rectangles floating | Genre benders, eclectic cross-genre, defies categories |
| Hearth Hare | Cozy rabbit curled up by a small campfire | Hope finders, redemptive arcs, found family |
| Doom Bloom | Cute creature with glowing eyes peeking from dark flower | Darkness dwellers, gothic, horror, dark academia |
| Riddling Raven | Mystical raven with floating question marks | Perspective collectors, multi-POV, moral complexity |
| Swoon Fawn | Gentle deer with tiny hearts floating around | Connection chasers, love stories, emotional depth |

### Compatibility Matrix (hardcoded)

```
Feral Fae: best=Wandering Wisp ("They dream what you dare to burn"), tension=Prose Rose ("Their precision threatens your beautiful chaos")
Wandering Wisp: best=Feral Fae ("They ignite what you only whisper"), tension=Riddling Raven ("They want debate; you want the dream")
Tome Gnome: best=Realm Rider ("You dig deep while they map wide"), tension=Galloping Goblin ("They read for speed, you read for sediment")
Realm Rider: best=Tome Gnome ("Together you chart the inner and outer worlds"), tension=Pensive Pixie ("They look inward while you look outward")
Pensive Pixie: best=Swoon Fawn ("You both read to understand the self"), tension=Realm Rider ("They want new worlds; you want this one, examined")
Prose Rose: best=Riddling Raven ("Precision meets perspective"), tension=Feral Fae ("Their recklessness offends your taste")
Galloping Goblin: best=Doom Bloom ("You both crave the edge of the page"), tension=Tome Gnome ("They want to linger where you want to sprint")
Glitch Witch: best=Hearth Hare ("You transform what they illuminate"), tension=Doom Bloom ("They stay in the dark; you bring everything into light")
Hearth Hare: best=Glitch Witch ("You illuminate what they transform"), tension=Wandering Wisp ("They drift where you anchor")
Doom Bloom: best=Galloping Goblin ("You haunt the same literary edges"), tension=Glitch Witch ("They blend everything; you want the pure dark")
Riddling Raven: best=Prose Rose ("You both dissect, from different angles"), tension=Wandering Wisp ("They float past the arguments you savor")
Swoon Fawn: best=Pensive Pixie ("You both believe books are about being human"), tension=Galloping Goblin ("They want adrenaline; you want ache")
```

---

## Reading Dimensions (5 Axes)

Rendered as sliding bars with a glowing dot indicator. Include an "i" info button that opens a modal explaining each dimension.

| Axis Key | Left Label | Right Label | Description (shown in info modal) |
|---|---|---|---|
| heartVsHead | Heart | Head | Are you reading to feel or to think? Heart readers want to be emotionally wrecked. Head readers want to be intellectually rewired. |
| plotVsProse | Plot | Prose | Are you here for what happens or how it's written? Plot readers need momentum. Prose readers will reread a single paragraph for the rhythm. |
| familiarVsFrontier | Familiar | Frontier | Do you go deeper or wider? Familiar readers love their corner of the bookstore. Frontier readers would rather be confused by something new. |
| lightVsDark | Light | Dark | Do you reach for warmth or weight? Light readers use books as refuge. Dark readers use books as confrontation. |
| realVsImagined | Real | Imagined | This world or an invented one? Real readers stay close to what happened. Imagined readers want to leave this world entirely. |

Each axis is an integer 1-5. The active side's label highlights in the aura color. The dot glows.

---

## Anthropic Prompt

Use this prompt for the API call (insert the user's books):

```
You are a literary personality analyst with the wit of a roast comedian and the depth of a literature professor. You work at a whimsical fairy-tale sorting ceremony for readers.

Given someone's favorite books, generate their "Reading Aura" profile. You MUST select their archetype from this exact list:
- Feral Fae
- Wandering Wisp
- Tome Gnome
- Realm Rider
- Pensive Pixie
- Prose Rose
- Galloping Goblin
- Glitch Witch
- Hearth Hare
- Doom Bloom
- Riddling Raven
- Swoon Fawn

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

Books: {books joined by comma}

Respond ONLY with valid JSON (no markdown, no backticks, no preamble):
{
  "archetype": "One from the list above that best fits",
  "colorPrimary": "A rich saturated hex color — bold and vivid, NOT too dark",
  "colorSecondary": "A complementary vivid hex accent",
  "colorTertiary": "A third hex for depth",
  "bio": "2 sentences max. Weave together what this reader type means with specific observations about their book choices. Identity-affirming, slightly mystical, like a horoscope that feels personally written.",
  "superlative": "2-3 sentences. A hyper-specific pattern observation about their book choices that feels like the universe noticed something. Start with a concrete pattern like 'Every single one of your picks...' or '4 out of 5 of your books...' then expand on what that reveals about them.",
  "roast": "One sentence. Affectionate, pointed, specific to their actual book choices.",
  "strengths": ["Exactly 3 reader strengths, 2-4 words each"],
  "axes": {
    "heartVsHead": "integer 1-5, 1=pure emotion 5=pure intellect",
    "plotVsProse": "integer 1-5, 1=plot-driven 5=prose-obsessed",
    "familiarVsFrontier": "integer 1-5, 1=comfort reads 5=adventurous",
    "lightVsDark": "integer 1-5, 1=warm/hopeful 5=dark/heavy",
    "realVsImagined": "integer 1-5, 1=realism/nonfiction 5=fantasy/speculative"
  },
  "bookScope": "A specific real book rec for this month, framed mystically: 'This month, reach for [Title] by [Author]. [One poetic sentence why].' Max 30 words.",
  "spiritBook": "Just a book title + author.",
  "prediction2036": "One creative, surprising, funny sentence predicting what they'll be reading in 2036."
}
```

---

## Card Layout (top to bottom)

1. **Creature illustration** - SVG hero, rendered in aura colors, unique per archetype. No emoji above it. This is the visual anchor.
2. **Archetype name** - large Playfair Display serif
3. **Bio** - 2-sentence paragraph, DM Sans light weight
4. **"Strengths"** label + 3 pill tags in aura color
5. **Reading Dimensions** - 5 axis bars with "i" info button. Sliding dot on a track, active label highlights.
6. **"The Book Star Gods Noticed"** - 2-3 sentence superlative section
7. **Compatibility** - two cards side by side: "Best Match" and "Creative Tension", each with archetype name + one-line poetic description
8. **Swipeable cards** - horizontal swipe with dot navigation + arrows, cycling through:
   - ✨ This Month's Book-Scope
   - 🔥 Roast
   - 🧚 Spirit Book
   - 🔮 2036 Prediction
9. **Footer** - "READING AURA ✦ 2026"

## Design System

### Vibe
Mystical fairy-fantasy meets modern. Dark, warm, intimate. Tarot reading energy. NOT generic AI aesthetic.

### Colors
- Background: `#111010` (near-black with warmth)
- Primary text: `#F5F0E8` (warm off-white)
- Secondary text: `#B8B2A8`, `#C8C2B8` (warm grays)
- Muted: `#9B958A`, `#6B655C`, `#5A564F`, `#4A463F`, `#3D3A35`
- CTA gradient: `#C4956A` to `#8B6E4E` (warm gold)
- Card backgrounds use the AI-generated aura colors at very low opacity (4-14%)
- Borders use aura colors at ~12-20% opacity
- Ambient glow orbs in corners using aura colors

### Typography
- Display/headings: Playfair Display (serif)
- Body: DM Sans (weights 300, 400, 500, 600)
- Labels/mono: JetBrains Mono (tiny section labels, uppercase, letter-spaced)
- Load from Google Fonts

### Card Container
- max-width: 400px
- border-radius: 28px
- Gradient background using all three aura colors
- 1px border in primary aura color at ~12% opacity
- Ambient radial gradient orbs (pulsing animation) in corners

### Creature Illustrations
- SVG-based, whimsical, hand-drawn feeling
- Each archetype has a completely unique creature/scene
- Rendered in the three aura colors
- Centered, ~200-220px max width
- Soft radial gradient glow behind creature

### Axis Bars
- Track: 4px height, rgba(255,255,255,0.04) background
- Dot: 11px, filled with aura color, box-shadow glow
- Gradient fill from left to dot position
- Left/right labels: the active side highlights in aura color with fontWeight 500

### Swipeable Cards
- Touch/mouse drag support (40px threshold)
- Dot navigation (active dot is wider, colored)
- Arrow buttons on sides
- Subtle gradient background using aura colors
- Min-height to prevent layout shift

### Animations
- Card reveal: scale 0.92 to 1, blur 8px to 0, 0.8s cubic-bezier
- Fade-in-up for sequential elements
- Float animation on loading icon
- Pulse glow on ambient orbs
- Shimmer on generate button during loading

### Loading Screen
Cycle messages: "Consulting the book star gods...", "Finding your creature...", "Mapping your dimensions...", "Writing your book-scope...", "Preparing your roast..."

### Info Modal
- Fixed overlay with dark backdrop
- Lists all 5 axes with name + description
- Close button top right
- Rounded card container

---

## Deployment
- Configure for Vercel
- `.env.example` with `ANTHROPIC_API_KEY=your_key_here`
- README with setup instructions (assume non-technical user)

## Future Architecture (don't build yet, don't block)
- **Clubs**: Users create/join clubs with invite codes. Members have auras.
- **Book swiping**: AI generates ~15 books as blind vibe descriptions matched to the group's combined auras. Members swipe yes/no. Mutual matches surface.
- **Discussion mode**: AI generates layered questions after the group reads a book.
- Will eventually need a database (Supabase or similar) and auth. Keep data access loosely coupled to localStorage so it can be swapped.
