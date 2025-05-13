
import { supabase } from '@/integrations/supabase/client';
import { Review, ReviewResult } from './types';

export const fetchReviews = async (userId: string): Promise<ReviewResult<Review[]>> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return { data: data as Review[], error: null };
  } catch (error) {
    console.error('Error loading reviews:', error);
    return { data: null, error: error as Error };
  }
};

export const fetchReview = async (userId: string, movieId: number): Promise<ReviewResult<Review>> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return { data: data as Review, error: null };
  } catch (error) {
    console.error('Error fetching review:', error);
    return { data: null, error: error as Error };
  }
};
