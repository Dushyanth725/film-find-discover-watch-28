
export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string[];
  rating: number;
  synopsis: string;
  poster: string;
}

export interface User {
  username: string;
  password: string;
  liked: number[];
  watched: number[];
  watchlist: number[];
}

export type CollectionType = 'liked' | 'watched' | 'watchlist';

export interface SearchFilters {
  query: string;
  year: string;
  director: string;
  genre: string;
}
