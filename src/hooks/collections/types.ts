
import { Json } from '@/integrations/supabase/types';
import { UserRating } from '@/types';

// Collection-related types
export type MovieCollection = {
  id?: string;
  user_id: string;
  movie_id: number;
  media_type: 'movie' | 'tv';
};

// Review-related types
export type Review = {
  id?: string;
  user_id: string;
  movie_id: number;
  rating: number;
  review_text?: string;
  media_type: 'movie' | 'tv';
  created_at?: string;
  updated_at?: string;
};

// UserCollections response type
export interface UserCollectionsData {
  liked: number[];
  watched: number[];
  watchlist: number[];
  ratings: UserRating[];
}

export interface CollectionResult<T> {
  data: T | null;
  error: Error | null;
}
