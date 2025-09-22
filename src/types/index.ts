export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Session {
  id: string;
  code: string;
  created_at: string;
  genre_id: number | null;
  status: 'waiting' | 'active' | 'completed';
  user_a_id: string;
  user_b_id: string | null;
}

export interface Swipe {
  id: string;
  session_id: string;
  user_id: string;
  movie_id: number;
  action: 'like' | 'pass';
  created_at: string;
}

export interface Match {
  id: string;
  session_id: string;
  movie_id: number;
  created_at: string;
  movie?: Movie;
}

export interface User {
  id: string;
  name: string;
  session_id: string;
  is_ready: boolean;
}
