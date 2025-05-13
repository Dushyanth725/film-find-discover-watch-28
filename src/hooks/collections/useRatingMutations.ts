
import { supabase } from '@/integrations/supabase/client';
import { CollectionResult } from './types';
import { addToCollection } from './useCollectionMutations';

// Add/update a rating
export const saveRating = async (
  username: string,
  movieId: number,
  rating: number,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<CollectionResult<boolean>> => {
  try {
    // Check if already in watched collection
    const { data: watched } = await supabase
      .from('watched_movies')
      .select('movie_id')
      .eq('user_id', username)
      .eq('movie_id', movieId)
      .maybeSingle();
      
    // If not in watched collection, add it
    if (!watched) {
      await addToCollection(username, movieId, 'watched', mediaType);
    }
    
    // Add to or update the reviews table
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', username)
      .eq('movie_id', movieId)
      .maybeSingle();
      
    if (existingReview) {
      // Update existing review
      const { error } = await supabase
        .from('reviews')
        .update({ rating })
        .eq('id', existingReview.id);
        
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
        });
        
      if (error) throw error;
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error saving rating:', error);
    return { data: null, error: error as Error };
  }
};

// Remove a rating
export const removeRating = async (
  username: string,
  movieId: number
): Promise<CollectionResult<boolean>> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', username)
      .eq('movie_id', movieId);
      
    if (error) throw error;
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error removing rating:', error);
    return { data: null, error: error as Error };
  }
};
