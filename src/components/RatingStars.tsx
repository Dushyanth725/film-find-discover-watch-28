
import { useState } from 'react';
import { Star, StarHalf, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RatingStarsProps {
  initialRating?: number;
  movieId: number;
  onRate: (movieId: number, rating: number) => void;
  onDelete?: (movieId: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

const RatingStars = ({
  initialRating = 0,
  movieId,
  onRate,
  onDelete,
  size = 'md',
  readOnly = false
}: RatingStarsProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  const maxStars = 5;
  const starSizes = {
    sm: { width: 16, height: 16 },
    md: { width: 20, height: 20 },
    lg: { width: 24, height: 24 }
  };
  
  const { width, height } = starSizes[size];
  
  const handleClick = (value: number) => {
    if (readOnly) return;
    
    // If clicking on the same star, toggle between full star and half star
    if (Math.ceil(rating) === value) {
      const newRating = Math.floor(rating) === rating ? rating - 0.5 : Math.floor(rating);
      setRating(newRating);
      onRate(movieId, newRating);
    } else {
      setRating(value);
      onRate(movieId, value);
    }
  };
  
  const handleMouseEnter = (value: number) => {
    if (readOnly) return;
    setHoverRating(value);
  };
  
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };
  
  const handleHalfStarClick = (value: number) => {
    if (readOnly) return;
    const newRating = value - 0.5;
    setRating(newRating);
    onRate(movieId, newRating);
  };
  
  const handleDelete = () => {
    if (readOnly || !onDelete) return;
    onDelete(movieId);
    setRating(0);
  };
  
  const renderStar = (value: number) => {
    const displayRating = hoverRating || rating;
    const starFill = displayRating >= value ? "currentColor" : "none";
    const halfStarFill = displayRating >= value - 0.5 && displayRating < value ? "currentColor" : "none";
    
    return (
      <div className="relative inline-block" key={value}>
        {/* Half star area (left half) */}
        <div 
          className={`absolute left-0 top-0 w-1/2 h-full ${!readOnly ? 'cursor-pointer' : ''}`}
          onClick={() => handleHalfStarClick(value)}
          onMouseEnter={() => handleMouseEnter(value - 0.5)}
        >
          {displayRating === value - 0.5 && (
            <StarHalf 
              fill={halfStarFill} 
              stroke="currentColor" 
              width={width} 
              height={height} 
              className="text-secondary"
            />
          )}
        </div>
        
        {/* Full star area */}
        <div 
          className={`${!readOnly ? 'cursor-pointer' : ''}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
        >
          <Star 
            fill={starFill} 
            stroke="currentColor" 
            width={width} 
            height={height} 
            className="text-secondary"
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        {[...Array(maxStars)].map((_, i) => renderStar(i + 1))}
      </div>
      
      {!readOnly && onDelete && rating > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          className="ml-2 p-1 h-auto"
        >
          <Trash2 size={16} className="text-destructive" />
        </Button>
      )}
      
      {size !== 'sm' && rating > 0 && (
        <span className="ml-2 text-sm">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
