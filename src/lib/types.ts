export interface Axes {
  heartVsHead: number;
  plotVsProse: number;
  familiarVsFrontier: number;
  lightVsDark: number;
  realVsImagined: number;
}

export interface Aura {
  id: string;
  user_id: string;
  archetype: string;
  color_primary: string;
  color_secondary: string;
  color_tertiary: string;
  bio: string;
  superlative: string;
  roast: string;
  strengths: string[];
  axes: Axes;
  book_scope: string;
  spirit_book: string;
  prediction_2036: string;
  dimensions_summary: string;
  books_input: string[];
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export type TribeStatus = "empty" | "ready" | "swiping" | "reveal" | "voting" | "tiebreaker" | "leader_pick" | "reading";

export interface Tribe {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  status: TribeStatus;
  current_book_title: string | null;
  current_book_author: string | null;
  created_at: string;
}

export interface TribeMember {
  tribe_id: string;
  user_id: string;
  joined_at: string;
}

export interface DeckBook {
  title: string;
  author: string;
  genre: string;
  moodTags: string[];
  vibe: string;
}

export interface Deck {
  id: string;
  tribe_id: string;
  books: DeckBook[];
  created_at: string;
}

export interface SwipeVote {
  deck_id: string;
  user_id: string;
  book_index: number;
  liked: boolean;
}

export interface BookVote {
  deck_id: string;
  user_id: string;
  book_index: number;
  round: number;
}

export interface DiscussionQuestions {
  id: string;
  tribe_id: string;
  book_title: string;
  book_author: string;
  warm_up: string[];
  turn_up_the_heat: string[];
  go_deep: string[];
  hot_takes: string[];
  created_at: string;
}

export interface Archetype {
  id: string;
  name: string;
  creature: string;
  readerType: string;
  why: string;
  genres: string;
  exampleBooks: string[];
  bio: string;
  superlative: string;
  roast: string;
  strengths: string[];
  axes: Axes;
  compatibility: {
    bestMatch: string;
    bestDescription: string;
    tension: string;
    tensionDescription: string;
  };
  visualDirection: string;
  colorPalette: string;
}

export interface MemberWithAura {
  user_id: string;
  display_name: string;
  role: "leader" | "member";
  aura: Aura | null;
}
