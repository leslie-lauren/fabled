-- Fabled Database Schema
-- Run this in the Supabase SQL Editor

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  created_at timestamptz default now()
);

-- Auras
create table if not exists public.auras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  archetype text not null,
  color_primary text not null,
  color_secondary text not null,
  color_tertiary text not null,
  bio text not null,
  superlative text not null,
  roast text not null,
  strengths jsonb not null default '[]',
  axes jsonb not null default '{}',
  book_scope text not null default '',
  spirit_book text not null default '',
  prediction_2036 text not null default '',
  books_input jsonb not null default '[]',
  created_at timestamptz default now()
);

create index if not exists idx_auras_user_id on public.auras(user_id);

-- Tribes
create table if not exists public.tribes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 30),
  invite_code text unique not null check (char_length(invite_code) = 6),
  created_by uuid not null references public.users(id),
  status text not null default 'empty' check (status in ('empty', 'ready', 'swiping', 'reveal', 'voting', 'reading')),
  current_book_title text,
  current_book_author text,
  created_at timestamptz default now()
);

create index if not exists idx_tribes_invite_code on public.tribes(invite_code);

-- Tribe Members
create table if not exists public.tribe_members (
  tribe_id uuid not null references public.tribes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('leader', 'member')),
  joined_at timestamptz default now(),
  primary key (tribe_id, user_id)
);

create index if not exists idx_tribe_members_user on public.tribe_members(user_id);

-- Decks
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  tribe_id uuid not null references public.tribes(id) on delete cascade,
  books jsonb not null default '[]',
  created_at timestamptz default now()
);

create index if not exists idx_decks_tribe_id on public.decks(tribe_id);

-- Swipe Votes
create table if not exists public.swipe_votes (
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  book_index integer not null check (book_index >= 0 and book_index <= 14),
  liked boolean not null,
  primary key (deck_id, user_id, book_index)
);

-- Book Votes (vote for next read)
create table if not exists public.book_votes (
  tribe_id uuid not null references public.tribes(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  book_index integer not null,
  primary key (deck_id, user_id, book_index)
);

-- Discussion Questions
create table if not exists public.discussion_questions (
  id uuid primary key default gen_random_uuid(),
  tribe_id uuid not null references public.tribes(id) on delete cascade,
  book_title text not null,
  book_author text not null,
  warm_up jsonb not null default '[]',
  turn_up_the_heat jsonb not null default '[]',
  go_deep jsonb not null default '[]',
  hot_takes jsonb not null default '[]',
  created_at timestamptz default now()
);

create index if not exists idx_discussion_tribe on public.discussion_questions(tribe_id);

-- Tribe Book History
create table if not exists public.tribe_book_history (
  tribe_id uuid not null references public.tribes(id) on delete cascade,
  book_title text not null,
  book_author text not null,
  completed_at timestamptz default now(),
  primary key (tribe_id, book_title, book_author)
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.auras enable row level security;
alter table public.tribes enable row level security;
alter table public.tribe_members enable row level security;
alter table public.decks enable row level security;
alter table public.swipe_votes enable row level security;
alter table public.book_votes enable row level security;
alter table public.discussion_questions enable row level security;
alter table public.tribe_book_history enable row level security;

-- RLS Policies: users can read all, write own
create policy "Users can read all users" on public.users for select using (true);
create policy "Users can insert own row" on public.users for insert with check (auth.uid() = id);
create policy "Users can update own row" on public.users for update using (auth.uid() = id);

-- Auras: read all, write own
create policy "Anyone can read auras" on public.auras for select using (true);
create policy "Users can insert own aura" on public.auras for insert with check (auth.uid() = user_id);
create policy "Users can update own aura" on public.auras for update using (auth.uid() = user_id);
create policy "Users can delete own aura" on public.auras for delete using (auth.uid() = user_id);

-- Tribes: read all, create own
create policy "Anyone can read tribes" on public.tribes for select using (true);
create policy "Users can create tribes" on public.tribes for insert with check (auth.uid() = created_by);
create policy "Tribe creator can update" on public.tribes for update using (auth.uid() = created_by);

-- Tribe members: read all, join/leave own
create policy "Anyone can read members" on public.tribe_members for select using (true);
create policy "Users can join tribes" on public.tribe_members for insert with check (auth.uid() = user_id);
create policy "Users can leave tribes" on public.tribe_members for delete using (auth.uid() = user_id);

-- Decks: read if member of tribe
create policy "Members can read decks" on public.decks for select using (
  exists (select 1 from public.tribe_members where tribe_id = decks.tribe_id and user_id = auth.uid())
);
create policy "Members can create decks" on public.decks for insert with check (
  exists (select 1 from public.tribe_members where tribe_id = decks.tribe_id and user_id = auth.uid())
);

-- Swipe votes: member access
create policy "Members can read swipe votes" on public.swipe_votes for select using (
  exists (
    select 1 from public.decks d
    join public.tribe_members tm on tm.tribe_id = d.tribe_id
    where d.id = swipe_votes.deck_id and tm.user_id = auth.uid()
  )
);
create policy "Users can insert own swipe votes" on public.swipe_votes for insert with check (auth.uid() = user_id);

-- Book votes: member access
create policy "Members can read book votes" on public.book_votes for select using (
  exists (select 1 from public.tribe_members where tribe_id = book_votes.tribe_id and user_id = auth.uid())
);
create policy "Users can insert own book votes" on public.book_votes for insert with check (auth.uid() = user_id);

-- Discussion questions: member access
create policy "Members can read discussions" on public.discussion_questions for select using (
  exists (select 1 from public.tribe_members where tribe_id = discussion_questions.tribe_id and user_id = auth.uid())
);
create policy "Members can create discussions" on public.discussion_questions for insert with check (
  exists (select 1 from public.tribe_members where tribe_id = discussion_questions.tribe_id and user_id = auth.uid())
);

-- Book history: member access
create policy "Members can read book history" on public.tribe_book_history for select using (
  exists (select 1 from public.tribe_members where tribe_id = tribe_book_history.tribe_id and user_id = auth.uid())
);
create policy "Members can insert book history" on public.tribe_book_history for insert with check (
  exists (select 1 from public.tribe_members where tribe_id = tribe_book_history.tribe_id and user_id = auth.uid())
);

-- Enable realtime for key tables
alter publication supabase_realtime add table public.tribe_members;
alter publication supabase_realtime add table public.tribes;
alter publication supabase_realtime add table public.swipe_votes;
alter publication supabase_realtime add table public.book_votes;
