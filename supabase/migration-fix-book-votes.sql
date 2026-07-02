-- Fix book_votes table: primary key must include book_index
-- to allow multiple book approvals per user per deck.
-- Run this in the Supabase SQL Editor.

-- Drop existing primary key and re-create with book_index included
ALTER TABLE public.book_votes DROP CONSTRAINT book_votes_pkey;
ALTER TABLE public.book_votes ADD PRIMARY KEY (deck_id, user_id, book_index);

-- Verify
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'book_votes';
