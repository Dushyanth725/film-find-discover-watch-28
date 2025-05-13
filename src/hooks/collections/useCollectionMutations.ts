
import { supabase } from '@/integrations/supabase/client';
import { CollectionResult } from './types';

// Add a movie to a collection
export const addToCollection = async (
  username: string,
  movieId: number,
  collection: 'liked' | 'watched' | 'watchlist',
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<CollectionResult<boolean>> => {
  try {
    const tableName = `${collection}_movies`;
    
    const { error } = await supabase
      .from(tableName as 'liked_movies' | 'watched_movies' | 'watchlist_movies')
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
    return { data: null, error: error as Error };
  }
};

// Remove a movie from a collection
export const removeFromCollection = async (
  username: string,
  movieId: number,
  collection: 'liked' | 'watched' | 'watchlist'
): Promise<CollectionResult<boolean>> => {
  try {
    const tableName = `${collection}_movies`;
    
    const { error } = await supabase
      .from(tableName as 'liked_movies' | 'watched_movies' | 'watchlist_movies')
      .delete()
      .eq('user_id', username)
      .eq('movie_id', movieId);
      
    if (error) throw error;
    
    // If removing from watched, also remove any reviews
    if (collection === 'watched') {
      await supabase
        .from('reviews')
        .delete()
        .eq('user_id', username)
        .eq('movie_id', movieId);
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error(`Error removing from ${collection}:`, error);
    return { data: null, error: error as Error };
  }
};

// Move a movie from watchlist to watched
export const moveToWatched = async (
  username: string,
  movieId: number,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<CollectionResult<boolean>> => {
  try {
    // Add to watched
    await addToCollection(username, movieId, 'watched', mediaType);
    
    // Remove from watchlist
    await removeFromCollection(username, movieId, 'watchlist');
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error moving to watched:', error);
    return { data: null, error: error as Error };
  }
};
