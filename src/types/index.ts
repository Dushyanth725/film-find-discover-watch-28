
export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string[];
  rating: number;
  synopsis: string;
  poster: string;
  media_type?: 'movie' | 'tv';
  cast?: Person[];
  crew?: Person[];
}

export interface Person {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path?: string | null;
}

export interface User {
  username: string;
  password: string;
  liked: number[];
  watched: number[];
  watchlist: number[];
  ratings: UserRating[];
}

export type CollectionType = 'liked' | 'watched' | 'watchlist';

export interface SearchFilters {
  query: string;
  year: string;
  director: string;
  genre: string;
  media_type?: 'movie' | 'tv' | null;
}

export interface UserRating {
  movieId: number;
  rating: number;
  media_type: 'movie' | 'tv';
}
