
import { supabase } from '@/integrations/supabase/client';
import { UserRating } from '@/types';

// Type declarations for our new tables
export type MovieCollection = {
  id?: string;
  user_id: string;
  movie_id: number;
  media_type: 'movie' | 'tv';
};

export type Review = {
  id?: string;
  user_id: string;
  movie_id: number;
  rating: number;
  review_text?: string;
  media_type: 'movie' | 'tv';
};

// Load all user collections from Supabase
export const loadUserCollections = async (username: string) => {
  try {
    // Load liked movies
    const { data: liked, error: likedError } = await supabase
      .from('liked_movies')
      .select('movie_id, media_type')
      .eq('user_id', username) as { 
        data: MovieCollection[] | null; 
        error: any; 
      };
      
    if (likedError) throw likedError;
    
    // Load watched movies
    const { data: watched, error: watchedError } = await supabase
      .from('watched_movies')
      .select('movie_id, media_type')
      .eq('user_id', username) as { 
        data: MovieCollection[] | null; 
        error: any; 
      };
      
    if (watchedError) throw watchedError;
    
    // Load watchlist movies
    const { data: watchlist, error: watchlistError } = await supabase
      .from('watchlist_movies')
      .select('movie_id, media_type')
      .eq('user_id', username) as { 
        data: MovieCollection[] | null; 
        error: any; 
      };
      
    if (watchlistError) throw watchlistError;
    
    // Load reviews (for ratings)
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('movie_id, rating, media_type')
      .eq('user_id', username) as { 
        data: Review[] | null; 
        error: any; 
      };
      
    if (reviewsError) throw reviewsError;
    
    // Convert to expected format
    const likedIds = liked?.map(item => item.movie_id) || [];
    const watchedIds = watched?.map(item => item.movie_id) || [];
    const watchlistIds = watchlist?.map(item => item.movie_id) || [];
    const ratings = reviews?.map(review => ({
      movieId: review.movie_id,
      rating: review.rating,
      media_type: review.media_type
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
    return { data: null, error };
  }
};

// Add a movie to a collection
export const addToCollection = async (
  username: string,
  movieId: number,
  collection: 'liked' | 'watched' | 'watchlist',
  mediaType: 'movie' | 'tv' = 'movie'
) => {
  try {
    const tableName = `${collection}_movies`;
    
    const { error } = await supabase
      .from(tableName)
      .insert({
        user_id: username,
        movie_id: movieId,
        media_type: mediaType
      }) as { data: any; error: any };
      
    if (error) {
      // If error is due to unique constraint, it's not a real error
      if (error.code === '23505') { // unique_violation
        return { data: true, error: null };
      }
      throw error;
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error(`Error adding to ${collection}:`, error);
    return { data: null, error };
  }
};

// Remove a movie from a collection
export const removeFromCollection = async (
  username: string,
  movieId: number,
  collection: 'liked' | 'watched' | 'watchlist'
) => {
  try {
    const tableName = `${collection}_movies`;
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('user_id', username)
      .eq('movie_id', movieId) as { data: any; error: any };
      
    if (error) throw error;
    
    // If removing from watched, also remove any reviews
    if (collection === 'watched') {
      await supabase
        .from('reviews')
        .delete()
        .eq('user_id', username)
        .eq('movie_id', movieId) as { data: any; error: any };
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error(`Error removing from ${collection}:`, error);
    return { data: null, error };
  }
};

// Add/update a rating
export const saveRating = async (
  username: string,
  movieId: number,
  rating: number,
  mediaType: 'movie' | 'tv' = 'movie'
) => {
  try {
    // Check if already in watched collection
    const { data: watched } = await supabase
      .from('watched_movies')
      .select('movie_id')
      .eq('user_id', username)
      .eq('movie_id', movieId)
      .maybeSingle() as { data: MovieCollection | null; error: any };
      
    // If not in watched collection, add it
    if (!watched) {
      await supabase
        .from('watched_movies')
        .insert({
          user_id: username,
          movie_id: movieId,
          media_type: mediaType
        }) as { data: any; error: any };
    }
    
    // Add to or update the reviews table
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', username)
      .eq('movie_id', movieId)
      .maybeSingle() as { data: Review | null; error: any };
      
    if (existingReview) {
      // Update existing review
      const { error } = await supabase
        .from('reviews')
        .update({ rating })
        .eq('id', existingReview.id) as { data: any; error: any };
        
      if (error) throw error;
    } else {
      // Insert new review
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: username,
          movie_id: movieId,
          rating,
          media_type: mediaType
        }) as { data: any; error: any };
        
      if (error) throw error;
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error saving rating:', error);
    return { data: null, error };
  }
};

// Remove a rating
export const removeRating = async (
  username: string,
  movieId: number
) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', username)
      .eq('movie_id', movieId) as { data: any; error: any };
      
    if (error) throw error;
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error removing rating:', error);
    return { data: null, error };
  }
};
