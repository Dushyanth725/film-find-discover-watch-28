
import { useState, useEffect } from 'react';
import { Movie, SearchFilters } from '@/types';
import { fetchMediaDetails, searchTMDB, searchDirector } from '@/utils/tmdb/api';
import { convertTMDBMovie } from '@/utils/tmdb/converters';
import { useMediaType } from '@/hooks/useMediaType';
import { SAMPLE_MOVIES } from '@/utils/tmdb/sample-data';

export const useMovieData = () => {
  const { mediaType, setMediaType: setCurrentMediaType, getSampleMovies } = useMediaType();
  const [movies, setMovies] = useState<Movie[]>(getSampleMovies());
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(getSampleMovies());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get detailed media info from TMDB API
  const getDetailedMediaInfo = async (results: any[], type: 'movie' | 'tv'): Promise<Movie[]> => {
    try {
      // For the first 10 search results, fetch complete details
      const detailedMediaPromises = results.map(item => fetchMediaDetails(item.id, type));
      const detailedMedia = await Promise.all(detailedMediaPromises);
      const validMedia = detailedMedia
        .filter(Boolean)
        .map(item => convertTMDBMovie(item, type));
      
      return validMedia;
    } catch (error) {
      console.error("Error getting detailed media:", error);
      return [];
    }
  };

  // Filter movies based on provided search filters
  const filterMovies = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      // Use the provided media_type or fall back to the current state
      const type = filters.media_type || mediaType;
      
      // If there's a search query, search TMDB
      if (filters.query) {
        const tmdbResults = await searchTMDB(filters.query, type);
        const detailedResults = await getDetailedMediaInfo(tmdbResults, type);
        setFilteredMovies(detailedResults);
        setMovies(detailedResults);
        return;
      }
      
      // If searching specifically for a director
      if (filters.director && filters.director !== '') {
        const directorResults = await searchDirector(filters.director, type);
        if (directorResults.length > 0) {
          const detailedResults = await getDetailedMediaInfo(directorResults, type);
          setFilteredMovies(detailedResults);
          setMovies(detailedResults);
          return;
        }
      }
      
      // If there's a specific year or genre filter
      if (filters.year || filters.genre) {
        let results = [...movies];
        
        // Filter by year
        if (filters.year && filters.year !== '') {
          const year = parseInt(filters.year);
          if (!isNaN(year)) {
            results = results.filter(movie => movie.year === year);
          }
        }
        
        // Filter by genre (comma separated)
        if (filters.genre && filters.genre !== '') {
          const genres = filters.genre.toLowerCase().split(',').map(g => g.trim());
          results = results.filter(movie => 
            genres.some(genre => 
              movie.genre.some(g => g.toLowerCase().includes(genre))
            )
          );
        }
        
        // Filter by media type
        results = results.filter(movie => movie.media_type === type);
        
        setFilteredMovies(results);
      } else {
        // No specific filters, just filter by media type
        const defaultResults = SAMPLE_MOVIES.filter(movie => movie.media_type === type);
        setFilteredMovies(defaultResults);
        setMovies(defaultResults);
      }
      
      setError(null);
    } catch (err) {
      setError("Error filtering media");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch movie/TV show by ID
  const getMovieById = async (id: number, type?: 'movie' | 'tv'): Promise<Movie | undefined> => {
    // First check local movies
    const localMovie = movies.find(movie => movie.id === id);
    if (localMovie) {
      return localMovie;
    }
    
    // If not found locally, try to fetch from TMDB
    try {
      // If type is not provided, try both movie and TV
      const mediaTypeToUse = type || mediaType;
      const movieData = await fetchMediaDetails(id, mediaTypeToUse);
      
      if (movieData) {
        return convertTMDBMovie(movieData, mediaTypeToUse);
      }
      
      // If not found with current media type and type wasn't explicitly provided, try the other type
      if (!type) {
        const otherType = mediaTypeToUse === 'movie' ? 'tv' : 'movie';
        const alternativeData = await fetchMediaDetails(id, otherType);
        if (alternativeData) {
          return convertTMDBMovie(alternativeData, otherType);
        }
      }
    } catch (error) {
      console.error("Error fetching media by ID:", error);
    }
    
    return undefined;
  };

  // Initialize with the current media type
  useEffect(() => {
    setIsLoading(true);
    // Filter movies by media type
    const filteredByType = SAMPLE_MOVIES.filter(movie => movie.media_type === mediaType);
    setMovies(filteredByType);
    setFilteredMovies(filteredByType);
    setIsLoading(false);
  }, [mediaType]);

  return { 
    movies: filteredMovies, 
    isLoading, 
    error, 
    filterMovies,
    getMovieById,
    mediaType,
    setMediaType: setCurrentMediaType
  };
};
