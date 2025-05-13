
import { useState, useEffect } from 'react';
import { CollectionType, UserRating } from '@/types';
import { loadFromLocalStorage, saveToLocalStorage } from './collections/useLocalStorage';
import { 
  loadUserCollections, 
  addToCollection as addToCollectionInSupabase, 
  removeFromCollection as removeFromCollectionInSupabase,
  saveRating as saveRatingInSupabase,
  removeRating as removeRatingInSupabase
} from './collections/useSupabaseOperations';
import { 
  isInCollection as checkInCollection, 
  addToCollection as addTo, 
  removeFromCollection as removeFrom, 
  moveToWatched as moveTo 
} from './collections/useCollectionOperations';
import { 
  addRating as addRatingTo, 
  removeRating as removeRatingFrom, 
  getRating as getUserRating 
} from './collections/useRatingOperations';
import { useToast } from './use-toast';

export const useUserCollections = () => {
  const [liked, setLiked] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

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
    setLoading(true);
    try {
      const { data, error } = await loadUserCollections(username);
      
      if (error) {
        console.error('Error loading user collections:', error);
        loadFromLocalStorageData();
      } else if (data) {
        // Use data from Supabase
        setLiked(data.liked || []);
        setWatched(data.watched || []);
        setWatchlist(data.watchlist || []);
        setRatings(data.ratings || []);

        // Update localStorage with Supabase data
        saveToLocalStorage(
          data.liked || [],
          data.watched || [],
          data.watchlist || [],
          data.ratings || []
        );
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      loadFromLocalStorageData();
    } finally {
      setLoading(false);
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

  // Handle add to collection with Supabase persistence
  const handleAddToCollection = async (movieId: number, collection: CollectionType, media_type: 'movie' | 'tv' = 'movie') => {
    if (!userId) {
      // Just update local state if not logged in
      const collections = { liked, watched, watchlist };
      addTo(movieId, collection, collections, setLiked, setWatched, setWatchlist, setRatings, ratings);
      return;
    }

    // Update Supabase
    const { error } = await addToCollectionInSupabase(userId, movieId, collection, media_type);
    
    if (error) {
      console.error(`Error adding to ${collection}:`, error);
      toast({
        title: 'Error',
        description: `Failed to add to your ${collection} collection`,
        variant: 'destructive',
      });
    } else {
      // Update local state
      const collections = { liked, watched, watchlist };
      addTo(movieId, collection, collections, setLiked, setWatched, setWatchlist, setRatings, ratings);
      
      // Special handling for watchlist -> watched transition
      if (collection === 'watched' && collections.watchlist.includes(movieId)) {
        await removeFromCollectionInSupabase(userId, movieId, 'watchlist');
      }

      toast({
        title: 'Success',
        description: `Added to your ${collection} collection`,
      });
    }
  };

  // Handle remove from collection with Supabase persistence
  const handleRemoveFromCollection = async (movieId: number, collection: CollectionType) => {
    if (!userId) {
      // Just update local state if not logged in
      const collections = { liked, watched, watchlist };
      removeFrom(movieId, collection, collections, setLiked, setWatched, setWatchlist, setRatings, ratings);
      return;
    }

    // Update Supabase
    const { error } = await removeFromCollectionInSupabase(userId, movieId, collection);
    
    if (error) {
      console.error(`Error removing from ${collection}:`, error);
      toast({
        title: 'Error',
        description: `Failed to remove from your ${collection} collection`,
        variant: 'destructive',
      });
    } else {
      // Update local state
      const collections = { liked, watched, watchlist };
      removeFrom(movieId, collection, collections, setLiked, setWatched, setWatchlist, setRatings, ratings);
      
      toast({
        title: 'Success',
        description: `Removed from your ${collection} collection`,
      });
    }
  };

  // Handle move to watched with Supabase persistence
  const handleMoveToWatched = async (movieId: number, media_type: 'movie' | 'tv' = 'movie') => {
    if (!userId) {
      // Just update local state if not logged in
      const collections = { liked, watched, watchlist };
      moveTo(movieId, collections, setWatched, setWatchlist);
      return;
    }

    // Add to watched in Supabase
    await addToCollectionInSupabase(userId, movieId, 'watched', media_type);
    
    // Remove from watchlist in Supabase
    await removeFromCollectionInSupabase(userId, movieId, 'watchlist');
    
    // Update local state
    const collections = { liked, watched, watchlist };
    moveTo(movieId, collections, setWatched, setWatchlist);
    
    toast({
      title: 'Success',
      description: 'Moved to your watched collection',
    });
  };

  // Handle add rating with Supabase persistence
  const handleAddRating = async (movieId: number, rating: number, media_type: 'movie' | 'tv' = 'movie') => {
    if (!userId) {
      // Just update local state if not logged in
      addRatingTo(movieId, rating, media_type, ratings, setRatings, watched, setWatched, watchlist, setWatchlist);
      return;
    }

    // Update Supabase
    const { error } = await saveRatingInSupabase(userId, movieId, rating, media_type);
    
    if (error) {
      console.error('Error saving rating:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your rating',
        variant: 'destructive',
      });
    } else {
      // Update local state
      addRatingTo(movieId, rating, media_type, ratings, setRatings, watched, setWatched, watchlist, setWatchlist);
      
      toast({
        title: 'Rating saved',
        description: `You rated this ${rating} stars`,
      });
    }
  };

  // Handle remove rating with Supabase persistence
  const handleRemoveRating = async (movieId: number) => {
    if (!userId) {
      // Just update local state if not logged in
      removeRatingFrom(movieId, ratings, setRatings);
      return;
    }

    // Update Supabase
    const { error } = await removeRatingInSupabase(userId, movieId);
    
    if (error) {
      console.error('Error removing rating:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove your rating',
        variant: 'destructive',
      });
    } else {
      // Update local state
      removeRatingFrom(movieId, ratings, setRatings);
      
      toast({
        title: 'Rating removed',
        description: 'Your rating has been removed',
      });
    }
  };

  // Save to localStorage on state changes
  useEffect(() => {
    saveToLocalStorage(liked, watched, watchlist, ratings);
  }, [liked, watched, watchlist, ratings]);

  // Collection operations
  const collections = { liked, watched, watchlist };
  
  return {
    collections,
    ratings,
    loading,
    addToCollection: handleAddToCollection,
    removeFromCollection: handleRemoveFromCollection,
    isInCollection: (movieId: number, collection: CollectionType) => 
      checkInCollection(movieId, collection, collections),
    moveToWatched: handleMoveToWatched,
    addRating: handleAddRating,
    removeRating: handleRemoveRating,
    getRating: (movieId: number) => getUserRating(movieId, ratings),
    refreshCollections: () => userId && loadUserData(userId)
  };
};
