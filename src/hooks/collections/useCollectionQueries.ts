
import { supabase } from '@/integrations/supabase/client';
import { UserRating } from '@/types';
import { CollectionResult, UserCollectionsData } from './types';

// Load all user collections from Supabase
export const loadUserCollections = async (username: string): Promise<CollectionResult<UserCollectionsData>> => {
  try {
    // Load liked movies
    const { data: liked, error: likedError } = await supabase
      .from('liked_movies')
      .select('movie_id, media_type')
      .eq('user_id', username);
      
    if (likedError) throw likedError;
    
    // Load watched movies
    const { data: watched, error: watchedError } = await supabase
      .from('watched_movies')
      .select('movie_id, media_type')
      .eq('user_id', username);
      
    if (watchedError) throw watchedError;
    
    // Load watchlist movies
    const { data: watchlist, error: watchlistError } = await supabase
      .from('watchlist_movies')
      .select('movie_id, media_type')
      .eq('user_id', username);
      
    if (watchlistError) throw watchlistError;
    
    // Load reviews (for ratings)
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('movie_id, rating, media_type')
      .eq('user_id', username);
      
    if (reviewsError) throw reviewsError;
    
    // Convert to expected format
    const likedIds = liked?.map(item => item.movie_id) || [];
    const watchedIds = watched?.map(item => item.movie_id) || [];
    const watchlistIds = watchlist?.map(item => item.movie_id) || [];
    const ratings = reviews?.map(review => ({
      movieId: review.movie_id,
      rating: review.rating,
      media_type: review.media_type as 'movie' | 'tv'
    })) as UserRating[] || [];
    
    return { 
      data: {
        liked: likedIds,
        watched: watchedIds,
        watchlist: watchlistIds,
        ratings
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error loading collections:', error);
    return { data: null, error: error as Error };
  }
};
