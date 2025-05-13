
import { supabase } from '@/integrations/supabase/client';
import { Review, ReviewResult } from './types';

export const saveReview = async (userId: string, review: Review): Promise<ReviewResult<Review>> => {
  try {
    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', review.movie_id)
      .maybeSingle();
    
    let result;
    
    if (existingReview) {
      // Update existing review
      result = await supabase
        .from('reviews')
        .update({
          rating: review.rating,
          review_text: review.review_text,
          media_type: review.media_type,
        })
        .eq('id', existingReview.id)
        .select()
        .single();
    } else {
      // Insert new review
      result = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          movie_id: review.movie_id,
          rating: review.rating,
          review_text: review.review_text,
          media_type: review.media_type,
        })
        .select()
        .single();
    }
    
    if (result.error) {
      throw result.error;
    }
    
    return { data: result.data as Review, error: null };
  } catch (error) {
    console.error('Error saving review:', error);
    return { data: null, error: error as Error };
  }
};

export const deleteReview = async (userId: string, movieId: number): Promise<ReviewResult<boolean>> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);
      
    if (error) {
      throw error;
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { data: null, error: error as Error };
  }
};
