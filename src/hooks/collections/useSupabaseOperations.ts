
import { supabase } from '@/integrations/supabase/client';
import { UserRating } from '@/types';

// Type declarations for our new tables
type MovieCollection = {
  id?: string;
  user_id: string;
  movie_id: number;
  media_type: 'movie' | 'tv';
};

type Review = {
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
      .from<MovieCollection>('liked_movies')
      .select('movie_id, media_type')
      .eq('user_id', username);
      
    if (likedError) throw likedError;
    
    // Load watched movies
    const { data: watched, error: watchedError } = await supabase
      .from<MovieCollection>('watched_movies')
      .select('movie_id, media_type')
      .eq('user_id', username);
      
    if (watchedError) throw watchedError;
    
    // Load watchlist movies
    const { data: watchlist, error: watchlistError } = await supabase
      .from<MovieCollection>('watchlist_movies')
      .select('movie_id, media_type')
      .eq('user_id', username);
      
    if (watchlistError) throw watchlistError;
    
    // Load reviews (for ratings)
    const { data: reviews, error: reviewsError } = await supabase
      .from<Review>('reviews')
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
      .from<MovieCollection>(tableName)
      .insert({
        user_id: username,
        movie_id: movieId,
        media_type: mediaType
      });
      
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
      .from<MovieCollection>(tableName)
      .delete()
      .eq('user_id', username)
      .eq('movie_id', movieId);
      
    if (error) throw error;
    
    // If removing from watched, also remove any reviews
    if (collection === 'watched') {
      await supabase
        .from<Review>('reviews')
        .delete()
        .eq('user_id', username)
        .eq('movie_id', movieId);
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
      .from<MovieCollection>('watched_movies')
      .select('movie_id')
      .eq('user_id', username)
      .eq('movie_id', movieId)
      .maybeSingle();
      
    // If not in watched collection, add it
    if (!watched) {
      await supabase
        .from<MovieCollection>('watched_movies')
        .insert({
          user_id: username,
          movie_id: movieId,
          media_type: mediaType
        });
    }
    
    // Add to or update the reviews table
    const { data: existingReview } = await supabase
      .from<Review>('reviews')
      .select('id')
      .eq('user_id', username)
      .eq('movie_id', movieId)
      .maybeSingle();
      
    if (existingReview) {
      // Update existing review
      const { error } = await supabase
        .from<Review>('reviews')
        .update({ rating })
        .eq('id', existingReview.id);
        
      if (error) throw error;
    } else {
      // Insert new review
      const { error } = await supabase
        .from<Review>('reviews')
        .insert({
          user_id: username,
          movie_id: movieId,
          rating,
          media_type: mediaType
        });
        
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
      .from<Review>('reviews')
      .delete()
      .eq('user_id', username)
      .eq('movie_id', movieId);
      
    if (error) throw error;
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error removing rating:', error);
    return { data: null, error };
  }
};
