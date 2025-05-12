import { useState, useEffect } from 'react';
import { CollectionType, UserRating } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { UserCollectionsTable, userRatingsToJson, jsonToUserRatings } from '@/types/supabase';

export const useUserCollections = () => {
  const [liked, setLiked] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user ID on mount
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setUserId(username);
      loadUserData(username);
    }
  }, []);

  // Load user data from Supabase
  const loadUserData = async (username: string) => {
    try {
      const { data, error } = await supabase
        .from('user_collections')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create a new record
          const storedLiked = localStorage.getItem('liked');
          const storedWatched = localStorage.getItem('watched');
          const storedWatchlist = localStorage.getItem('watchlist');
          const storedRatings = localStorage.getItem('ratings');

          const likedData = storedLiked ? JSON.parse(storedLiked) : [];
          const watchedData = storedWatched ? JSON.parse(storedWatched) : [];
          const watchlistData = storedWatchlist ? JSON.parse(storedWatchlist) : [];
          const ratingsData = storedRatings ? JSON.parse(storedRatings) : [];

          // Create new record with localStorage data
          const { error: insertError } = await supabase.from('user_collections').insert({
            username,
            liked: likedData,
            watched: watchedData,
            watchlist: watchlistData,
            ratings: userRatingsToJson(ratingsData)
          });

          if (insertError) {
            console.error('Error inserting user data:', insertError);
          }

          setLiked(likedData);
          setWatched(watchedData);
          setWatchlist(watchlistData);
          setRatings(ratingsData);
        } else {
          console.error('Error loading user data:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        }
      } else if (data) {
        // Use data from Supabase
        setLiked(data.liked || []);
        setWatched(data.watched || []);
        setWatchlist(data.watchlist || []);
        setRatings(data.ratings ? jsonToUserRatings(data.ratings) : []);

        // Update localStorage with Supabase data
        localStorage.setItem('liked', JSON.stringify(data.liked || []));
        localStorage.setItem('watched', JSON.stringify(data.watched || []));
        localStorage.setItem('watchlist', JSON.stringify(data.watchlist || []));
        localStorage.setItem('ratings', JSON.stringify(data.ratings ? jsonToUserRatings(data.ratings) : []));
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      // Fallback to localStorage
      loadFromLocalStorage();
    }
  };

  // Load collections from localStorage as fallback
  const loadFromLocalStorage = () => {
    const storedLiked = localStorage.getItem('liked');
    const storedWatched = localStorage.getItem('watched');
    const storedWatchlist = localStorage.getItem('watchlist');
    const storedRatings = localStorage.getItem('ratings');

    if (storedLiked) setLiked(JSON.parse(storedLiked));
    if (storedWatched) setWatched(JSON.parse(storedWatched));
    if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
    if (storedRatings) setRatings(JSON.parse(storedRatings));
  };

  // Save to Supabase and localStorage
  const saveUserData = async () => {
    if (!userId) {
      // If not logged in, just save to localStorage
      return;
    }

    try {
      const { error } = await supabase
        .from('user_collections')
        .upsert({
          username: userId,
          liked,
          watched,
          watchlist,
          ratings: userRatingsToJson(ratings)
        }, {
          onConflict: 'username'
        });

      if (error) {
        console.error('Error saving user data:', error);
      }
    } catch (error) {
      console.error('Error in saveUserData:', error);
    }
  };

  // Save collections to localStorage and Supabase whenever they change
  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(liked));
    saveUserData();
  }, [liked]);

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
    saveUserData();
  }, [watched]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    saveUserData();
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
    saveUserData();
  }, [ratings]);

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
        // If a movie is added to watchlist, remove it from watched
        if (watched.includes(movieId)) {
          setWatched(watched.filter(id => id !== movieId));
          // Also remove any rating for this movie
          setRatings(ratings.filter(r => r.movieId !== movieId));
        }
      }
    }
  };

  // Remove movie from collection
  const removeFromCollection = (movieId: number, collection: CollectionType) => {
    if (collection === 'liked') {
      setLiked(liked.filter(id => id !== movieId));
    } else if (collection === 'watched') {
      setWatched(watched.filter(id => id !== movieId));
      // Also remove any rating for this movie
      setRatings(ratings.filter(r => r.movieId !== movieId));
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

  // Rating functions
  const addRating = (movieId: number, rating: number, media_type: 'movie' | 'tv' = 'movie') => {
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

  const removeRating = (movieId: number) => {
    setRatings(ratings.filter(r => r.movieId !== movieId));
  };

  const getRating = (movieId: number): number | undefined => {
    const ratingObj = ratings.find(r => r.movieId === movieId);
    return ratingObj ? ratingObj.rating : undefined;
  };

  return {
    collections: { liked, watched, watchlist },
    ratings,
    addToCollection,
    removeFromCollection,
    isInCollection,
    moveToWatched,
    addRating,
    removeRating,
    getRating
  };
};
