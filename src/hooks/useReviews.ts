
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { Review, fetchReviews, saveReview as saveReviewInDb, deleteReview as deleteReviewInDb } from './reviews';

export type { Review } from './reviews';

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
      const { data, error } = await fetchReviews(userId);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setReviews(data);
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
      const { data, error } = await saveReviewInDb(userId, review);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      await loadReviews();
      
      toast({
        title: review.id ? 'Review updated' : 'Review saved',
        description: review.id ? 'Your review has been updated successfully' : 'Your review has been saved successfully',
      });
      
      return data;
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
      const { error } = await deleteReviewInDb(userId, movieId);
        
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
