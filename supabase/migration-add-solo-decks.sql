-- Solo "For You" recommendation decks (single-user discovery, no tribe)
-- Run this in the Supabase SQL Editor.

create table if not exists public.solo_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  books jsonb not null default '[]',
  liked jsonb not null default '[]', -- array of liked book indices into books
  created_at timestamptz default now()
);

create index if not exists idx_solo_decks_user on public.solo_decks(user_id);

-- RLS: all access is via service-role API routes, but enable RLS defensively
-- and allow users to read/write only their own rows.
alter table public.solo_decks enable row level security;

create policy "Users read own solo decks" on public.solo_decks
  for select using (auth.uid() = user_id);
create policy "Users insert own solo decks" on public.solo_decks
  for insert with check (auth.uid() = user_id);
create policy "Users update own solo decks" on public.solo_decks
  for update using (auth.uid() = user_id);
