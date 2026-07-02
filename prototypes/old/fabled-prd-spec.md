# Fabled: Complete Product Requirements + Technical Spec

**For Claude Code. This is the single source of truth for building the app.**

## Product Overview

**Name:** Fabled
**Tagline:** A whimsical book club
**Secondary line:** Discover your reading aura. Swipe on books blind. Discuss with your tribe.

**What it is:** A mobile-friendly web app (NOT a native app) where readers discover their mystical reading personality, form tribes with friends, swipe on AI-curated blind book descriptions, and discuss their reads with AI-generated conversation prompts.

**Platform:** Responsive web app optimized for mobile. Must work great on phones. Shareable via URL. No app store.

**Core loop:** Generate aura → Join/create tribe → Swipe on blind book deck → Reveal matches → Vote → Read → Discuss → Repeat

---

## Tech Stack

- **Next.js 14+ (App Router)** — deploys to Vercel
- **React** with Tailwind CSS
- **Anthropic API** via server-side API routes (claude-sonnet-4-20250514, NEVER expose API key client-side)
- **Supabase** for database + auth + realtime
- **Vercel** for hosting
- **Google Fonts**: Playfair Display, DM Sans, JetBrains Mono

---

## The 12 Archetypes

Each archetype has a detailed SVG character illustration that renders in the user's personal aura colors (3-color system: primary, secondary, tertiary). The illustrations are mystical robed figures with atmospheric effects — NOT cartoonish.

| Archetype | Emoji | Visual Description | Reader Type | The Why | Genres + Examples |
|---|---|---|---|---|---|
| **The Archivist** | 📚 | Robed figure at a towering stone desk, ancient books orbiting in rings like planetary systems. Celestial dust drifts between the volumes. | Layer diggers, annotators, re-readers | Reads to accumulate and connect. Treats books as a system, not a pastime. Probably has a spreadsheet. | Dense literary fiction, historical epics, classics. Pachinko, Middlemarch, A Gentleman in Moscow |
| **The Nocturne** | 🌙 | Figure engulfed in swirling dark pages, full moon behind them, wide consuming eyes. Dissolves at the edges into ink and shadow. | 3am finishers, intensity addicts, one-sitting readers | Reads to feel something so big it can't be ignored. Emotional extremity is the point, not a side effect. | Psychological fiction, dark literary fiction. A Little Life, Gone Girl, The Secret History |
| **The Wanderer** | 🌫️ | Cloaked figure in a mist-filled corridor of floating, drifting pages. The mist is made of text. Movement without destination. | Atmosphere chasers, mood readers, slow burn loyalists | Doesn't care what happens — cares how it feels to be inside the book. Plot is just an excuse for texture. | Magical realism, literary surrealism. Piranesi, Wind-Up Bird Chronicle, The Night Circus |
| **The Oracle** | 🔮 | Seated figure, still and centered. A glowing orb before them made of compressed pages and text — dense as a collapsed star. | Memoir readers, autofiction devotees, self-seekers | Reads to understand themselves. Every book is held up like a mirror. Underlines sentences that feel personally prophetic. | Memoir, autofiction, personal essays. Crying in H Mart, Normal People, On Earth We're Briefly Gorgeous |
| **The Cartographer** | 🗺️ | Figure whose coat and hands are star charts bleeding into fantasy terrain. A person who is also a map. | World-builders, lore devotees, fantasy and sci-fi loyalists | Reads to go somewhere that doesn't exist. The bigger and more intricate the world, the better. Reads the appendices. | Epic fantasy, hard sci-fi. Dune, The Left Hand of Darkness, The Name of the Wind |
| **The Scribe** | ✍️ | Figure in profile, fully absorbed, writing with a quill. The words left behind are luminous — starlight trails left by the text itself. | Craft worshippers, slow readers, prose-first people | Reads a paragraph three times not because they didn't understand it, but because they loved it. The how matters more than the what. | Quiet literary fiction, Booker-adjacent. Never Let Me Go, Remains of the Day, Gilead |
| **The Sentinel** | 🛡️ | Armored figure mid-sprint, armor covered in text like an illuminated manuscript. A glowing bound volume as both weapon and shield. | Adrenaline readers, plot-first, always-has-a-theory | Reads to find out what happens. Patience for description is limited. Will spoil themselves and not apologize. | Thrillers, sci-fi action, propulsive fiction. Dark Matter, Project Hail Mary, Gone Girl |
| **The Heretic** | 💥 | Figure holding a cracked spine. Prismatic light explodes from the fractures — the breaking is generative, not destructive. | Genre benders, contrarians, anti-canon readers | Allergic to hype. Reads across categories with zero loyalty to any. Will tell you why the beloved book was actually mid. | Literary sci-fi, experimental fiction. Cloud Atlas, Slaughterhouse-Five, Station Eleven |
| **The Ember** | 🔥 | Quiet figure cradling a small flame in cupped hands — precious, almost extinguished. Books arranged like a nest, not a tower. | Hope-seekers, redemption arc devotees, comfort readers | Uses books as evidence that things turn out okay. Not naive — just needs the light at the end. Cries at the good parts. | Uplifting literary fiction, narrative nonfiction. A Man Called Ove, Educated, The Midnight Library |
| **The Revenant** | 👁️ | Translucent figure half-merged with a dark tome. Shadow tendrils extend like roots — organic, deliberate. | Gothic devotees, horror readers, darkness dwellers | Reads toward the uncomfortable on purpose. Finds catharsis in dread. Suspicious of books that wrap up too neatly. | Gothic fiction, horror, Southern Gothic. Mexican Gothic, Beloved, Haunting of Hill House |
| **The Seer** | 🌀 | Figure with a third eye barely open — quiet perception, not blazing power. Faces orbit subtly like memories or dreams. | Multi-POV collectors, empathy readers, perspective maximalists | Reads to inhabit lives nothing like their own. Gets frustrated by single-perspective narratives. Always asking whose story isn't being told. | Multi-POV literary fiction, postcolonial literature. Americanah, The Sympathizer, A Visit from the Goon Squad |
| **The Conjurer** | 💫 | Two books touching spine-to-spine, hearts forming in the space between. The figure has stepped back to watch the connection happen. | Romance devotees, connection chasers, relationship-first readers | Reads for the relationship at the center. Will forgive weak plot if the emotional core is real. | Romance, love stories, relationship-driven literary fiction. Call Me by Your Name, Pride and Prejudice, The Time Traveler's Wife |

### Compatibility Matrix

Each archetype has a "Best Match" and "Creative Tension" pairing with a one-line poetic description.

```
The Nocturne: best=The Wanderer ("They build the atmosphere you burn through"), tension=The Scribe ("Their restraint is the opposite of your consumption")
The Wanderer: best=The Nocturne ("They ignite what you only whisper"), tension=The Seer ("They want debate; you want the dream")
The Archivist: best=The Cartographer ("You dig deep while they map wide"), tension=The Sentinel ("They read for speed, you read for sediment")
The Cartographer: best=The Archivist ("Together you chart the inner and outer worlds"), tension=The Oracle ("They look inward while you look outward")
The Oracle: best=The Conjurer ("You both read to understand the self"), tension=The Cartographer ("They want new worlds; you want this one, examined")
The Scribe: best=The Seer ("Precision meets perspective"), tension=The Nocturne ("Their recklessness offends your taste")
The Sentinel: best=The Revenant ("You both crave the edge of the page"), tension=The Archivist ("They want to linger where you want to sprint")
The Heretic: best=The Ember ("You transform what they illuminate"), tension=The Revenant ("They stay in the dark; you break everything open")
The Ember: best=The Heretic ("You illuminate what they transform"), tension=The Wanderer ("They drift where you anchor")
The Revenant: best=The Sentinel ("You haunt the same literary edges"), tension=The Heretic ("They blend everything; you want the pure dark")
The Seer: best=The Scribe ("You both dissect, from different angles"), tension=The Wanderer ("They float past the arguments you savor")
The Conjurer: best=The Oracle ("You both believe books are about being human"), tension=The Sentinel ("They want adrenaline; you want ache")
```

---

## Character Illustrations

All 12 characters are provided as detailed SVG React components in the prototype files (fabled-characters-batch1.jsx and fabled-characters-batch2.jsx). Each illustration:

- Accepts three color props: c1 (primary), c2 (secondary), c3 (tertiary) — these come from each user's AI-generated aura
- Uses robed mystical figures with atmospheric effects (particles, glows, gradients, tendrils)
- Renders in a 240x280 viewBox
- Must be extracted from the prototype files and used as the character components in the real app
- Each archetype's illustration is completely unique

---

## Reading Dimensions (5 Axes)

Rendered as sliding bars with a glowing dot. "i" info button opens a modal with descriptions.

| Key | Left | Right | Description |
|---|---|---|---|
| heartVsHead | Heart | Head | Are you reading to feel or to think? Heart readers want to be emotionally wrecked. Head readers want to be intellectually rewired. |
| plotVsProse | Plot | Prose | Are you here for what happens or how it's written? Plot readers need momentum. Prose readers will reread a single paragraph for the rhythm. |
| familiarVsFrontier | Familiar | Frontier | Do you go deeper or wider? Familiar readers love their corner of the bookstore. Frontier readers would rather be confused by something new. |
| lightVsDark | Light | Dark | Do you reach for warmth or weight? Light readers use books as refuge. Dark readers use books as confrontation. |
| realVsImagined | Real | Imagined | This world or an invented one? Real readers stay close to what happened. Imagined readers want to leave this world entirely. |

---

## User Stories

### Story 1: New User, No Aura

1. Visits fabled app URL for the first time
2. Sees welcome screen with branding + "Discover Your Aura" CTA
3. Creates account (email + display name, or magic link). Minimal and fast.
4. Enters 3-7 books they love
5. AI generates reading aura (archetype, creature, bio, axes, strengths, etc.)
6. Sees full aura card, saves it
7. Prompted with: "Create a Tribe" or "Join a Tribe" (invite code input)

**Edge cases:**
- If arriving via invite link (fabled.app/join/CODE), store the code, route through onboarding/aura first, then auto-join
- If AI call fails, show error + retry. Don't lose book inputs.

### Story 2: Creating a Tribe

1. Taps "Create New Tribe" from home
2. Enters tribe name (max 30 chars)
3. Gets unique 6-character invite code + shareable link
4. Native share sheet (Web Share API) for sending via text/email
5. Returns to home with tribe in "waiting for members" state
6. Minimum 2 members (including creator) to generate a deck

### Story 3: Joining a Tribe

1. Via link: shows tribe name + member count + "Join?" CTA
2. Via code: enters on join screen
3. If no account yet: onboarding + aura generation first, then auto-join
4. Tribe members see real-time notification of new member

**Edge cases:**
- Invalid code: "This code doesn't exist."
- Full tribe (12 max): "This tribe is full."
- Already a member: "You're already in this tribe."
- User can be in up to 5 tribes

### Story 4: The Swipe Cycle

#### 4a: Deck Generation
- Any member triggers "Generate New Deck" (when 2+ members, "ready" state)
- AI analyzes all members' auras, generates 15 blind book descriptions
- Each card: 2-3 sentence vibe description (no title/author/cover), genre tag, 2-3 mood tags
- No sensory metaphors (no "smells like", "feels like")
- Mix: 8-9 in shared taste, 3-4 stretches, 2-3 wild cards
- Never repeat previously served books
- All members notified, tribe enters "swiping" state

#### 4b: Swiping
- Intro screen explains blind mechanic, shows members
- One card at a time, swipe right=yes, left=nah, or use buttons
- "YES"/"NAH" labels appear on drag
- Progress dots (green=yes, red=nah)
- After finishing: "Done! Waiting for your tribe..."
- Real-time status: who's done, who's swiping
- All done (or timeout) → reveal unlocks

**Edge cases:**
- Close app mid-swipe: progress saved server-side, resume later
- 48hr timeout: reveal unlocks with whoever finished. Unfinished members marked "didn't vote"
- New member joins mid-swipe: gets current deck, votes count
- Min 2 must finish for meaningful reveal

#### 4c: Reveal
- Books revealed one by one, staggered animation, sorted by match strength
- Tiers: "Everyone loved this" (100%), "Strong match" (75%+), "Split decision" (50-74%), "Niche pick" (<50%)
- Each card: title, author, genre, mood tags, who voted what
- "Vote for Next Read" CTA

#### 4d: Voting
- Each member taps one book
- Real-time tally
- 24hr timeout, winning book becomes "currently reading"

### Story 5: Discussion Mode

- Available when tribe has a "currently reading" book
- Any member can open anytime
- AI generates questions specific to the book
- Four tiers:
  - ☀️ **Warm Up** (3 questions) — easy starters, character preferences
  - 🔥 **Turn Up the Heat** (3 questions) — spicy, unhinged, dating-app energy ("who would you swipe right on", "biggest red flag character", "which characters should hook up")
  - 🌀 **Go Deep** (3 questions) — philosophical, thematic
  - 💣 **Hot Take** — controversial AI opinion, "Another Hot Take" button
- Swipeable cards with dot/arrow navigation within each tier
- All member names tappable to view auras
- Questions persist and remain accessible

### Story 6: Viewing Auras

- Tap any member name ANYWHERE in the app to see their aura
- Modal slides up: creature avatar, archetype name, bio, strengths
- "View Full Aura" link to complete profile
- Close on X or backdrop tap

**Where names appear (ALL must be tappable):**
Home screen, swipe intro, waiting room, reveal screen, discussion mode, tribe settings

### Story 7: Managing Your Aura

- Full aura card from "My Aura" in bottom nav
- "Regenerate" button with warning: "This updates your aura across all tribes."
- Takes you back to book input

### Story 8: Multiple Tribes

- Home shows all tribes with current state
- "Tribes" tab shows list view
- Leave tribe via settings (confirm dialog)
- Max 5 tribes per user
- Leaving: votes remain for in-progress cycles, user disappears from list
- Tribe drops below 2: enters "waiting" state

---

## State Machine (Per Tribe)

```
EMPTY (< 2 members)
  → user joins → READY (if 2+)

READY (2+ members, no active deck)
  → "Generate Deck" → SWIPING

SWIPING (deck generated)
  → all finish → REVEAL
  → 48hr timeout (2+ finished) → REVEAL

REVEAL (books revealed)
  → vote CTA → VOTING

VOTING (picking next read)
  → all vote or 24hr timeout → READING

READING (book selected, discussion available)
  → "Generate New Deck" → SWIPING
```

---

## Aura Card Layout (top to bottom)

1. **Character illustration** — SVG hero in user's aura colors. No emoji above it.
2. **Archetype name** — large Playfair Display serif
3. **Bio** — 2 sentence paragraph, DM Sans light
4. **"Strengths"** label + 3 pill tags
5. **Reading Dimensions** — 5 axis sliding bars with "i" info modal
6. **"The Book Star Gods Noticed"** — 2-3 sentence superlative
7. **Compatibility** — "Best Match" + "Creative Tension" side by side, each with archetype name + one-line description
8. **Swipeable bonus cards** — dot navigation, cycling through:
   - ✨ This Month's Book-Scope
   - 🔥 Roast
   - 🧚 Spirit Book
   - 🔮 2036 Prediction
9. **Footer** — "READING AURA ✦ 2026"

---

## AI Prompts

### Aura Generation

```
You are a literary personality analyst with the wit of a roast comedian and the depth of a literature professor. You work at a mystical sorting ceremony for readers.

Given someone's favorite books, generate their "Reading Aura" profile. You MUST select their archetype from this exact list:
- The Archivist
- The Nocturne
- The Wanderer
- The Oracle
- The Cartographer
- The Scribe
- The Sentinel
- The Heretic
- The Ember
- The Revenant
- The Seer
- The Conjurer

Archetype meanings:
- The Archivist: Layer diggers, annotators, re-readers. Reads to accumulate and connect.
- The Nocturne: 3am finishers, intensity addicts. Reads to feel something so big it can't be ignored.
- The Wanderer: Atmosphere chasers, mood readers. Doesn't care what happens — cares how it feels.
- The Oracle: Memoir readers, self-seekers. Reads to understand themselves.
- The Cartographer: World-builders, lore devotees. Reads to go somewhere that doesn't exist.
- The Scribe: Craft worshippers, prose-first. Reads a paragraph three times because they loved it.
- The Sentinel: Adrenaline readers, plot-first. Reads to find out what happens.
- The Heretic: Genre benders, contrarians. Allergic to hype, reads across categories.
- The Ember: Hope-seekers, comfort readers. Uses books as evidence things turn out okay.
- The Revenant: Gothic devotees, darkness dwellers. Reads toward the uncomfortable on purpose.
- The Seer: Multi-POV collectors, empathy readers. Reads to inhabit lives nothing like their own.
- The Conjurer: Romance devotees, connection chasers. Reads for the relationship at the center.

Books: {books joined by comma}

Respond ONLY with valid JSON (no markdown, no backticks, no preamble):
{
  "archetype": "One from the list",
  "colorPrimary": "A rich saturated hex — bold, vivid, NOT too dark",
  "colorSecondary": "A complementary vivid hex accent",
  "colorTertiary": "A third hex for depth",
  "bio": "2 sentences max. Weave together what this reader type means with specific observations about their book choices. Identity-affirming, slightly mystical.",
  "superlative": "2-3 sentences. Hyper-specific pattern observation. Start with a concrete pattern then expand.",
  "roast": "One sentence. Affectionate, pointed, specific.",
  "strengths": ["Exactly 3 reader strengths, 2-4 words each"],
  "axes": {
    "heartVsHead": "integer 1-5",
    "plotVsProse": "integer 1-5",
    "familiarVsFrontier": "integer 1-5",
    "lightVsDark": "integer 1-5",
    "realVsImagined": "integer 1-5"
  },
  "bookScope": "Real book rec framed mystically: 'This month, reach for [Title] by [Author]. [One sentence why].' Max 30 words.",
  "spiritBook": "Book title + author.",
  "prediction2036": "One creative funny sentence predicting what they'll read in 2036."
}
```

### Deck Generation

```
You are a literary matchmaker for a reading tribe. Given the reading auras of all tribe members, generate a curated deck of 15 books.

Tribe members:
{For each member: name, archetype, axes values, strengths}

Previously served books (do NOT repeat): {list}

Generate 15 books. Mix: 8-9 in shared taste, 3-4 stretches, 2-3 wild cards.

Vibe descriptions: 2-3 sentences, evocative, specific, slightly playful. NO sensory metaphors ("smells like", "feels like"). Do not reveal title/author/cover.

Respond ONLY with valid JSON:
{
  "books": [
    {
      "title": "Actual title",
      "author": "Actual author",
      "genre": "Genre tag",
      "moodTags": ["2-3 mood tags"],
      "vibe": "2-3 sentence blind description"
    }
  ]
}
```

### Discussion Questions

```
Generate book club discussion questions for a reading tribe. Should feel like they were written by the most interesting person at the book club, not a high school English teacher.

Book: {title} by {author}

Respond ONLY with valid JSON:
{
  "warmUp": ["3 easy starters"],
  "turnUpTheHeat": ["3 spicy, unhinged questions. Dating-app energy. Who would you swipe right on, biggest red flag character, which characters should hook up. Fun and provocative."],
  "goDeep": ["3 philosophical/thematic questions. Genuinely thoughtful."],
  "hotTakes": ["5 controversial opinions the AI fully commits to. Arguable, conversation-sparking."]
}
```

---

## Design System

### Vibe
Mystical, dark, warm, intimate. Tarot reading at a cool bookstore. NOT generic AI aesthetic.

### Colors
- Background: `#111010`
- Primary text: `#F5F0E8`
- Secondary text: `#B8B2A8`, `#C8C2B8`
- Muted: `#9B958A`, `#7A756D`, `#6B655C`, `#5A564F`, `#4A463F`, `#3D3A35`
- CTA gradient: `#C4956A` to `#8B6E4E`
- Success: `#6BCB77`
- Error: `#E85D5D`
- Cards: AI-generated aura colors at 4-14% opacity
- Borders: aura colors at 12-20% opacity

### Typography
- Display: Playfair Display (serif)
- Body: DM Sans (300-600)
- Labels: JetBrains Mono (tiny, uppercase, letter-spaced)

### Components
- Cards: border-radius 18-28px, gradient backgrounds
- Buttons: 12-14px radius, gradient primary, ghost secondary
- Pills: 12-20px radius, low-opacity fill + border
- Modals: dark backdrop 75%, popIn animation
- Bottom nav: fixed, gradient fade

### Animations
- Card reveal: scale 0.92→1, blur 8→0
- Fade-in-up with stagger
- Pop-in for modals
- Float for loading
- Pulse glow for ambient orbs
- Shake for hot takes

---

## Database Schema (Supabase)

### users
id (uuid PK), email, display_name, created_at

### auras
id (uuid PK), user_id (FK), archetype, color_primary, color_secondary, color_tertiary, bio, superlative, roast, strengths (jsonb), axes (jsonb), book_scope, spirit_book, prediction_2036, books_input (jsonb), created_at

### tribes
id (uuid PK), name, invite_code (unique, 6 chars), created_by (FK), status (enum: empty/ready/swiping/reveal/voting/reading), current_book_title, current_book_author, created_at

### tribe_members
tribe_id (FK), user_id (FK), joined_at, PK(tribe_id, user_id)

### decks
id (uuid PK), tribe_id (FK), books (jsonb), created_at

### swipe_votes
deck_id (FK), user_id (FK), book_index (int), liked (bool), PK(deck_id, user_id, book_index)

### book_votes
tribe_id (FK), deck_id (FK), user_id (FK), book_index (int), PK(tribe_id, deck_id, user_id)

### discussion_questions
id (uuid PK), tribe_id (FK), book_title, book_author, warm_up (jsonb), turn_up_the_heat (jsonb), go_deep (jsonb), hot_takes (jsonb), created_at

### tribe_book_history
tribe_id (FK), book_title, book_author, completed_at

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| /api/generate-aura | POST | Generate aura from books |
| /api/tribes | POST | Create tribe |
| /api/tribes/join | POST | Join by invite code |
| /api/tribes/[id] | GET | Tribe details + members |
| /api/tribes/[id]/generate-deck | POST | Generate swipe deck |
| /api/tribes/[id]/swipe | POST | Submit swipe vote |
| /api/tribes/[id]/reveal | GET | Reveal data |
| /api/tribes/[id]/vote | POST | Vote for next read |
| /api/tribes/[id]/discussion | GET/POST | Get or generate discussion Qs |
| /api/users/[id]/aura | GET | Get user's aura |

---

## Prototype Files (Visual Reference)

These artifacts establish the UX patterns. Extract the design language, layout, and interaction patterns from them:

- **reading-aura.jsx** — Aura generation flow + full aura card
- **swipe-deck.jsx** — Swipe mechanic, waiting room, reveal screen
- **discussion-mode.jsx** — Tiered questions, hot takes
- **fabled-home.jsx** — Home screen, tribe display, navigation
- **fabled-characters-batch1.jsx** — SVG illustrations for: The Nocturne, The Archivist, The Wanderer, The Conjurer
- **fabled-characters-batch2.jsx** — SVG illustrations for: The Oracle, The Cartographer, The Scribe, The Sentinel, The Heretic, The Ember, The Revenant, The Seer

---

## MVP vs. Post-MVP

### MVP (build now)
- Aura generation
- Tribe creation + join via code/link
- Swipe deck generation + swiping
- Reveal with match tiers
- Voting
- Discussion mode with AI questions
- Member aura viewing (tappable names everywhere)
- Home screen with tribe state
- Mobile-responsive design
- Basic auth (email + password)

### Post-MVP
- Push notifications
- Past reads archive
- Aura comparison (side by side)
- Social sharing (generate shareable image of aura card)
- Multiple deck sizes
- "Reading now" progress tracking
- Desktop layout optimization
- OAuth (Google, Apple)

---

## Non-Technical Setup Guide

Here's exactly what you (the human) need to do. Claude Code handles all the coding.

### One-Time Setup (before starting Claude Code)

1. **Install Claude Code** — If you haven't already, follow the instructions at docs.anthropic.com for installing Claude Code on your computer. You'll need Node.js installed (Claude Code will tell you if you don't).

2. **Create a Supabase account** — Go to supabase.com and sign up (free tier is fine). Create a new project. Name it "fabled" or whatever you like. Save these values from your project settings:
   - Project URL (looks like https://xxxxx.supabase.co)
   - Anon/public key (a long string starting with "eyJ...")
   - Service role key (another long string, keep this secret)

3. **Create a Vercel account** — Go to vercel.com and sign up (free tier is fine). You'll connect it to your code later.

4. **Get your Anthropic API key** — Go to console.anthropic.com. Create an API key if you don't have one. Save it.

### Building with Claude Code

1. Open your terminal (Terminal app on Mac)
2. Navigate to where you want the project: type `cd ~/Desktop` and press Enter (or wherever you want it)
3. Type `claude` and press Enter to start Claude Code
4. Paste this entire document as your prompt
5. Claude Code will ask you questions along the way. Answer them. It's usually yes/no stuff.
6. When it asks for environment variables, provide:
   - ANTHROPIC_API_KEY = your Anthropic key
   - NEXT_PUBLIC_SUPABASE_URL = your Supabase project URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = your Supabase anon key
   - SUPABASE_SERVICE_ROLE_KEY = your Supabase service role key

### Deploying

1. Claude Code will tell you when to deploy
2. Install Vercel CLI if needed: Claude Code will handle this
3. Run `vercel` in your terminal when prompted
4. Follow the Vercel prompts (link to your account, name the project)
5. In the Vercel dashboard (vercel.com), go to your project → Settings → Environment Variables
6. Add all four environment variables listed above
7. Redeploy: `vercel --prod`
8. Your app is live at the URL Vercel gives you

### If Something Breaks

- Paste the error message back into Claude Code. It will fix it.
- If Claude Code seems stuck, type "continue" or describe what you're seeing.
- If the app loads but something looks wrong, take a screenshot, paste it into Claude chat (not Claude Code), and describe the issue.
