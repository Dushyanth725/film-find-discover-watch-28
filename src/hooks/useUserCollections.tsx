
import { useState, useEffect } from 'react';
import { CollectionType } from '@/types';

export const useUserCollections = () => {
  const [liked, setLiked] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);

  // Load collections from localStorage on mount
  useEffect(() => {
    const storedLiked = localStorage.getItem('liked');
    const storedWatched = localStorage.getItem('watched');
    const storedWatchlist = localStorage.getItem('watchlist');

    if (storedLiked) setLiked(JSON.parse(storedLiked));
    if (storedWatched) setWatched(JSON.parse(storedWatched));
    if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
  }, []);

  // Save collections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Add movie to collection
  const addToCollection = (movieId: number, collection: CollectionType) => {
    if (collection === 'liked') {
      if (!liked.includes(movieId)) {
        setLiked([...liked, movieId]);
      }
    } else if (collection === 'watched') {
      if (!watched.includes(movieId)) {
        setWatched([...watched, movieId]);
        // If a movie is marked as watched, remove it from watchlist
        if (watchlist.includes(movieId)) {
          setWatchlist(watchlist.filter(id => id !== movieId));
        }
      }
    } else if (collection === 'watchlist') {
      if (!watchlist.includes(movieId)) {
        setWatchlist([...watchlist, movieId]);
      }
    }
  };

  // Remove movie from collection
  const removeFromCollection = (movieId: number, collection: CollectionType) => {
    if (collection === 'liked') {
      setLiked(liked.filter(id => id !== movieId));
    } else if (collection === 'watched') {
      setWatched(watched.filter(id => id !== movieId));
    } else if (collection === 'watchlist') {
      setWatchlist(watchlist.filter(id => id !== movieId));
    }
  };

  // Check if movie is in collection
  const isInCollection = (movieId: number, collection: CollectionType): boolean => {
    if (collection === 'liked') {
      return liked.includes(movieId);
    } else if (collection === 'watched') {
      return watched.includes(movieId);
    } else if (collection === 'watchlist') {
      return watchlist.includes(movieId);
    }
    return false;
  };

  // Move from watchlist to watched
  const moveToWatched = (movieId: number) => {
    if (watchlist.includes(movieId)) {
      setWatchlist(watchlist.filter(id => id !== movieId));
      if (!watched.includes(movieId)) {
        setWatched([...watched, movieId]);
      }
    }
  };

  return {
    collections: { liked, watched, watchlist },
    addToCollection,
    removeFromCollection,
    isInCollection,
    moveToWatched
  };
};
