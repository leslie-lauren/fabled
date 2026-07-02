# Fabled

**A whimsical book club.** Discover your reading aura, form a tribe with friends, swipe on AI-curated blind book descriptions, and discuss your reads with AI-generated conversation prompts.

Fabled is a mobile-first web app that turns reading taste into a mystical, shareable identity — and then uses it to help small groups of friends decide what to read together.

> Discover your reading aura. Swipe on books blind. Discuss with your tribe.

---

## What it does

**🔮 Reading Aura** — Enter a handful of books you love and an LLM generates your reading personality: one of 12 archetypes, a three-color aura, a short bio, and your position on five reading dimensions. Each archetype renders as a unique, hand-built SVG illustration tinted in your personal aura colors.

**👥 Tribes** — Create or join a tribe with a 6-character invite code. Tribes are small reading groups that move through a shared loop together.

**🃏 Blind Swipe Decks** — The app generates a deck of book descriptions with titles and authors hidden, so the group votes on the *writing and premise* rather than the cover or the hype. Members swipe, then matches are revealed.

**💬 AI Discussion** — Once a tribe has read a pick, Fabled generates conversation prompts tailored to the book and the group.

### The core loop

```
Generate aura → Create / join a tribe → Swipe a blind deck → Reveal matches → Vote → Read → Discuss → Repeat
```

### The 12 archetypes

The Archivist · The Nocturne · The Wanderer · The Oracle · The Cartographer · The Scribe · The Sentinel · The Heretic · The Ember · The Revenant · The Seer · The Conjurer

Each is scored across five axes: **Heart↔Head**, **Plot↔Prose**, **Familiar↔Frontier**, **Light↔Dark**, and **Real↔Imagined**, with best-match and creative-tension pairings between archetypes.

---

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** — Postgres, auth, and realtime
- **Anthropic API** (Claude) for aura generation, deck curation, and discussion prompts — called only from server-side API routes, never exposed to the client
- **Vercel** for hosting
- **html2canvas** for shareable aura cards

## Architecture

```
src/
  app/
    api/              Server-side routes (auth, aura generation, tribes, swipe, vote, discussion)
    aura/             Aura generation + profile views
    tribes/           Create, join, swipe, reveal, discuss
    welcome/ home/    Onboarding and dashboard
  components/
    aura/             Aura card, axis bars, share card, info modals
    characters/       12 unique SVG archetype illustrations
    swipe/            Swipe deck UI
    layout/ ui/       Navigation and shared primitives
  data/               Archetype definitions + AI prompt templates
  lib/                Supabase client, types, tribe helpers
supabase/             Schema + migrations
prototypes/           Early design explorations (JSX)
```

Every Claude call lives behind a Next.js route handler in `src/app/api/` so the API key stays server-side. Aura generation, blind-deck curation, and discussion prompts are all structured LLM calls.

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# then fill in the values (see below)

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Server-side Claude calls (aura, decks, discussion) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side privileged Supabase access |

Database schema and migrations live in [`supabase/`](supabase/).

---

## Status

Active personal project — the core aura, tribe, swipe, and discussion flows are built. Not yet open to contributions.

Built by [Leslie Busick](https://github.com/leslie-lauren).
