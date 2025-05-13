
export interface Review {
  id?: string;
  movie_id: number;
  rating: number;
  review_text?: string;
  media_type: 'movie' | 'tv';
  created_at?: string;
  updated_at?: string;
}

export interface ReviewResult<T> {
  data: T | null;
  error: Error | null;
}
