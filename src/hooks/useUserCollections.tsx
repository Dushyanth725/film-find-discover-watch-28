
import { useState, useEffect } from 'react';
import { CollectionType, UserRating } from '@/types';
import { jsonToUserRatings } from '@/types/supabase';
import { loadFromLocalStorage, saveToLocalStorage } from './collections/useLocalStorage';
import { loadUserDataFromSupabase, createUserCollection, updateUserCollection } from './collections/useSupabaseOperations';
import { isInCollection as checkInCollection, addToCollection as addTo, removeFromCollection as removeFrom, moveToWatched as moveTo } from './collections/useCollectionOperations';
import { addRating as addRatingTo, removeRating as removeRatingFrom, getRating as getUserRating } from './collections/useRatingOperations';

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
      const { data, error } = await loadUserDataFromSupabase(username);
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create a new record
          const storedData = loadFromLocalStorage();

          // Create new record with localStorage data
          const { error: insertError } = await createUserCollection(
            username,
            storedData.liked,
            storedData.watched,
            storedData.watchlist,
            storedData.ratings
          );

          if (insertError) {
            console.error('Error inserting user data:', insertError);
          }

          setLiked(storedData.liked);
          setWatched(storedData.watched);
          setWatchlist(storedData.watchlist);
          setRatings(storedData.ratings);
        } else {
          console.error('Error loading user data:', error);
          // Fallback to localStorage
          loadFromLocalStorageData();
        }
      } else if (data) {
        // Use data from Supabase
        setLiked(data.liked || []);
        setWatched(data.watched || []);
        setWatchlist(data.watchlist || []);
        setRatings(data.ratings ? jsonToUserRatings(data.ratings) : []);

        // Update localStorage with Supabase data
        saveToLocalStorage(
          data.liked || [],
          data.watched || [],
          data.watchlist || [],
          data.ratings ? jsonToUserRatings(data.ratings) : []
        );
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      // Fallback to localStorage
      loadFromLocalStorageData();
    }
  };

  // Load collections from localStorage as fallback
  const loadFromLocalStorageData = () => {
    const storedData = loadFromLocalStorage();
    setLiked(storedData.liked);
    setWatched(storedData.watched);
    setWatchlist(storedData.watchlist);
    setRatings(storedData.ratings);
  };

  // Save to Supabase and localStorage
  const saveUserData = async () => {
    if (!userId) {
      // If not logged in, just save to localStorage
      return;
    }

    try {
      const { error } = await updateUserCollection(
        userId,
        liked,
        watched,
        watchlist,
        ratings
      );

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

  // Collection operations using imported functions
  const collections = { liked, watched, watchlist };
  
  return {
    collections,
    ratings,
    addToCollection: (movieId: number, collection: CollectionType) => 
      addTo(movieId, collection, collections, setLiked, setWatched, setWatchlist, setRatings, ratings),
    
    removeFromCollection: (movieId: number, collection: CollectionType) => 
      removeFrom(movieId, collection, collections, setLiked, setWatched, setWatchlist, setRatings, ratings),
    
    isInCollection: (movieId: number, collection: CollectionType) => 
      checkInCollection(movieId, collection, collections),
    
    moveToWatched: (movieId: number) => 
      moveTo(movieId, collections, setWatched, setWatchlist),
    
    addRating: (movieId: number, rating: number, media_type: 'movie' | 'tv' = 'movie') => 
      addRatingTo(movieId, rating, media_type, ratings, setRatings, watched, setWatched, watchlist, setWatchlist),
    
    removeRating: (movieId: number) => 
      removeRatingFrom(movieId, ratings, setRatings),
    
    getRating: (movieId: number) => 
      getUserRating(movieId, ratings)
  };
};
