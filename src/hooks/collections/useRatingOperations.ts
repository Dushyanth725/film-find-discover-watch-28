
import { UserRating } from '@/types';

export const addRating = (
  movieId: number, 
  rating: number, 
  media_type: 'movie' | 'tv',
  ratings: UserRating[],
  setRatings: React.Dispatch<React.SetStateAction<UserRating[]>>,
  watched: number[],
  setWatched: React.Dispatch<React.SetStateAction<number[]>>,
  watchlist: number[],
  setWatchlist: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const existingRating = ratings.find(r => r.movieId === movieId);
  
  if (existingRating) {
    // Update existing rating
    setRatings(ratings.map(r => 
      r.movieId === movieId ? { ...r, rating } : r
    ));
  } else {
    // Add new rating
    setRatings([...ratings, { movieId, rating, media_type }]);
  }
  
  // If a movie is rated, add it to watched list if not already there
  if (!watched.includes(movieId)) {
    setWatched([...watched, movieId]);
    
    // Remove from watchlist if present
    if (watchlist.includes(movieId)) {
      setWatchlist(watchlist.filter(id => id !== movieId));
    }
  }
};

export const removeRating = (
  movieId: number,
  ratings: UserRating[],
  setRatings: React.Dispatch<React.SetStateAction<UserRating[]>>
) => {
  setRatings(ratings.filter(r => r.movieId !== movieId));
};

export const getRating = (
  movieId: number,
  ratings: UserRating[]
): number | undefined => {
  const ratingObj = ratings.find(r => r.movieId === movieId);
  return ratingObj ? ratingObj.rating : undefined;
};
