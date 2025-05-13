
import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/hooks/useReviews';
import RatingStars from './RatingStars';
import { ArrowLeft } from 'lucide-react';

interface ReviewFormProps {
  movie: Movie;
  initialReview?: Review;
  onSave: (review: Review) => void;
  onCancel: () => void;
  onDelete?: (movieId: number) => void;
}

const ReviewForm = ({
  movie,
  initialReview,
  onSave,
  onCancel,
  onDelete
}: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(initialReview?.rating || 0);
  const [reviewText, setReviewText] = useState<string>(initialReview?.review_text || '');
  
  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setReviewText(initialReview.review_text || '');
    }
  }, [initialReview]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      movie_id: movie.id,
      rating,
      review_text: reviewText,
      media_type: movie.media_type || 'movie'
    });
  };
  
  const handleRatingChange = (movieId: number, newRating: number) => {
    setRating(newRating);
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(movie.id);
    }
  };
  
  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onCancel}
          className="flex items-center gap-1 text-cinema-red hover:underline"
        >
          <ArrowLeft width={16} height={16} />
          Back to Movie
        </button>
        
        <h2 className="text-xl font-bold">
          {initialReview ? "Edit Your Review" : "Write Your Review"}
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full rounded-lg border border-border"
          />
        </div>
        
        <div className="w-full md:w-3/4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{movie.title}</h3>
              <p className="text-muted-foreground">
                {movie.media_type === 'movie' ? 'Directed by:' : 'Created by:'} {movie.director} • {movie.year}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="font-medium">Your Rating:</label>
              <RatingStars 
                initialRating={rating} 
                movieId={movie.id} 
                onRate={handleRatingChange}
                size="lg"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="review-text" className="font-medium">Your Review:</label>
              <Textarea 
                id="review-text"
                placeholder="What did you think about this movie?"
                rows={6}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <div>
                {initialReview && onDelete && (
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete Review
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit"
                  disabled={rating === 0}
                >
                  Save Review
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
