
import { CollectionType } from '@/types';

export const isInCollection = (
  movieId: number, 
  collection: CollectionType,
  collections: {
    liked: number[],
    watched: number[],
    watchlist: number[]
  }
): boolean => {
  if (collection === 'liked') {
    return collections.liked.includes(movieId);
  } else if (collection === 'watched') {
    return collections.watched.includes(movieId);
  } else if (collection === 'watchlist') {
    return collections.watchlist.includes(movieId);
  }
  return false;
};

export const addToCollection = (
  movieId: number, 
  collection: CollectionType,
  collections: {
    liked: number[],
    watched: number[],
    watchlist: number[]
  },
  setLiked: React.Dispatch<React.SetStateAction<number[]>>,
  setWatched: React.Dispatch<React.SetStateAction<number[]>>,
  setWatchlist: React.Dispatch<React.SetStateAction<number[]>>,
  setRatings: React.Dispatch<React.SetStateAction<import('@/types').UserRating[]>>,
  ratings: import('@/types').UserRating[]
) => {
  if (collection === 'liked') {
    if (!collections.liked.includes(movieId)) {
      setLiked([...collections.liked, movieId]);
    }
  } else if (collection === 'watched') {
    if (!collections.watched.includes(movieId)) {
      setWatched([...collections.watched, movieId]);
      // If a movie is marked as watched, remove it from watchlist
      if (collections.watchlist.includes(movieId)) {
        setWatchlist(collections.watchlist.filter(id => id !== movieId));
      }
    }
  } else if (collection === 'watchlist') {
    if (!collections.watchlist.includes(movieId)) {
      setWatchlist([...collections.watchlist, movieId]);
      // If a movie is added to watchlist, remove it from watched
      if (collections.watched.includes(movieId)) {
        setWatched(collections.watched.filter(id => id !== movieId));
        // Also remove any rating for this movie
        setRatings(ratings.filter(r => r.movieId !== movieId));
      }
    }
  }
};

export const removeFromCollection = (
  movieId: number, 
  collection: CollectionType,
  collections: {
    liked: number[],
    watched: number[],
    watchlist: number[]
  },
  setLiked: React.Dispatch<React.SetStateAction<number[]>>,
  setWatched: React.Dispatch<React.SetStateAction<number[]>>,
  setWatchlist: React.Dispatch<React.SetStateAction<number[]>>,
  setRatings: React.Dispatch<React.SetStateAction<import('@/types').UserRating[]>>,
  ratings: import('@/types').UserRating[]
) => {
  if (collection === 'liked') {
    setLiked(collections.liked.filter(id => id !== movieId));
  } else if (collection === 'watched') {
    setWatched(collections.watched.filter(id => id !== movieId));
    // Also remove any rating for this movie
    setRatings(ratings.filter(r => r.movieId !== movieId));
  } else if (collection === 'watchlist') {
    setWatchlist(collections.watchlist.filter(id => id !== movieId));
  }
};

export const moveToWatched = (
  movieId: number,
  collections: {
    liked: number[],
    watched: number[],
    watchlist: number[]
  },
  setWatched: React.Dispatch<React.SetStateAction<number[]>>,
  setWatchlist: React.Dispatch<React.SetStateAction<number[]>>
) => {
  if (collections.watchlist.includes(movieId)) {
    setWatchlist(collections.watchlist.filter(id => id !== movieId));
    if (!collections.watched.includes(movieId)) {
      setWatched([...collections.watched, movieId]);
    }
  }
};
