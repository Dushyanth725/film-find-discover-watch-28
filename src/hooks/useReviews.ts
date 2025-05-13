
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Review {
  id?: string;
  movie_id: number;
  rating: number;
  review_text?: string;
  media_type: 'movie' | 'tv';
  created_at?: string;
  updated_at?: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const userId = localStorage.getItem('username');

  // Load reviews from Supabase
  const loadReviews = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId) as { 
          data: Review[] | null; 
          error: any; 
        };
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setReviews(data as Review[]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add or update a review
  const saveReview = async (review: Review) => {
    if (!userId) return null;
    
    try {
      // Check if review already exists
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('movie_id', review.movie_id)
        .maybeSingle() as { 
          data: Review | null; 
          error: any; 
        };
      
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
          .single() as { 
            data: Review | null; 
            error: any; 
          };
          
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully',
        });
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
          .single() as { 
            data: Review | null; 
            error: any; 
          };
          
        toast({
          title: 'Review saved',
          description: 'Your review has been saved successfully',
        });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Update local state
      await loadReviews();
      return result.data;
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your review',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Delete a review
  const deleteReview = async (movieId: number) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId) as {
          data: any;
          error: any;
        };
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setReviews(reviews.filter(r => r.movie_id !== movieId));
      
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete your review',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Get a specific review by movie ID
  const getReview = (movieId: number): Review | undefined => {
    return reviews.find(r => r.movie_id === movieId);
  };

  // Load reviews when userId changes
  useEffect(() => {
    if (userId) {
      loadReviews();
    }
  }, [userId]);

  return {
    reviews,
    isLoading,
    saveReview,
    deleteReview,
    getReview,
    loadReviews
  };
};
