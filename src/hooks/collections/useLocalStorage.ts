
import { UserRating } from '@/types';

// Load collections from localStorage
export const loadFromLocalStorage = () => {
  const storedLiked = localStorage.getItem('liked');
  const storedWatched = localStorage.getItem('watched');
  const storedWatchlist = localStorage.getItem('watchlist');
  const storedRatings = localStorage.getItem('ratings');

  return {
    liked: storedLiked ? JSON.parse(storedLiked) : [],
    watched: storedWatched ? JSON.parse(storedWatched) : [],
    watchlist: storedWatchlist ? JSON.parse(storedWatchlist) : [],
    ratings: storedRatings ? JSON.parse(storedRatings) : []
  };
};

// Save collections to localStorage
export const saveToLocalStorage = (
  liked: number[], 
  watched: number[], 
  watchlist: number[], 
  ratings: UserRating[]
) => {
  localStorage.setItem('liked', JSON.stringify(liked));
  localStorage.setItem('watched', JSON.stringify(watched));
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  localStorage.setItem('ratings', JSON.stringify(ratings));
};
