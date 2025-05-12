
import { useState, useEffect } from 'react';
import { Movie, SearchFilters, Person } from '@/types';

// Updated with both movies and TV series samples
const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    genre: ["Drama"],
    rating: 9.3,
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    genre: ["Crime", "Drama"],
    rating: 9.2,
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    rating: 8.9,
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 5,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.8,
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    media_type: "movie"
  },
  {
    id: 6,
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    genre: ["Drama"],
    rating: 8.8,
    synopsis: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    poster: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    media_type: "movie"
  },
];

// TMDB API key
const TMDB_API_KEY = "3456c6a647ebec2c9855eccc51be348d";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const useMovieData = () => {
  const [movies, setMovies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');

  // Convert TMDB movie to our Movie type
  const convertTMDBMovie = (tmdbMovie: any, type: 'movie' | 'tv'): Movie => {
    return {
      id: tmdbMovie.id,
      title: type === 'movie' ? tmdbMovie.title : tmdbMovie.name,
      year: new Date(type === 'movie' ? tmdbMovie.release_date : tmdbMovie.first_air_date).getFullYear() || 0,
      director: tmdbMovie.director || "Unknown",
      genre: tmdbMovie.genres ? tmdbMovie.genres.map((g: any) => g.name) : [],
      rating: tmdbMovie.vote_average || 0,
      synopsis: tmdbMovie.overview || "No synopsis available",
      poster: tmdbMovie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster+Available",
      media_type: type,
      cast: tmdbMovie.credits?.cast ? processCast(tmdbMovie.credits.cast) : undefined,
      crew: tmdbMovie.credits?.crew ? processCrew(tmdbMovie.credits.crew) : undefined
    };
  };

  // Process cast data
  const processCast = (cast: any[]): Person[] => {
    return cast.slice(0, 10).map(person => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profile_path: person.profile_path ? 
        `https://image.tmdb.org/t/p/w200${person.profile_path}` : 
        null
    }));
  };

  // Process crew data
  const processCrew = (crew: any[]): Person[] => {
    return crew
      .filter(person => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job))
      .map(person => ({
        id: person.id,
        name: person.name,
        job: person.job,
        profile_path: person.profile_path ? 
          `https://image.tmdb.org/t/p/w200${person.profile_path}` : 
          null
      }));
  };

  // Set the current media type
  const setCurrentMediaType = (type: 'movie' | 'tv') => {
    setMediaType(type);
    // Reset filters when changing media type
    filterMovies({ query: '', year: '', director: '', genre: '', media_type: type });
  };

  // Fetch movie/TV show details including director and cast/crew
  const fetchMediaDetails = async (id: number, type: 'movie' | 'tv') => {
    try {
      // Get basic details
      const response = await fetch(
        `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} details`);
      }
      
      const data = await response.json();
      
      // Find director from credits
      let director = "Unknown";
      if (data.credits && data.credits.crew) {
        const directorInfo = data.credits.crew.find((person: any) => 
          person.job === "Director" || 
          (type === 'tv' && person.job === "Creator")
        );
        if (directorInfo) {
          director = directorInfo.name;
        } else if (type === 'tv' && data.created_by && data.created_by.length > 0) {
          director = data.created_by[0].name;
        }
      }
      
      return { ...data, director };
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      return null;
    }
  };

  // Search TMDB API for movies or TV shows
  const searchTMDB = async (query: string, type: 'movie' | 'tv') => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from TMDB`);
      }
      
      const data = await response.json();
      
      // For the first 10 search results, fetch complete details
      const detailedMediaPromises = data.results.slice(0, 10).map((item: any) => 
        fetchMediaDetails(item.id, type)
      );
      
      const detailedMedia = await Promise.all(detailedMediaPromises);
      const validMedia = detailedMedia.filter(Boolean).map(item => convertTMDBMovie(item, type));
      
      return validMedia;
    } catch (err) {
      console.error(`Error searching TMDB for ${type}:`, err);
      setError(`Error searching ${type === 'movie' ? 'movies' : 'TV shows'} from TMDB`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Search for a director's filmography
  const searchDirector = async (directorName: string, type: 'movie' | 'tv') => {
    setIsLoading(true);
    try {
      // First search for the director
      const personResponse = await fetch(
        `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(directorName)}`
      );
      
      if (!personResponse.ok) {
        throw new Error('Failed to search for person');
      }
      
      const personData = await personResponse.json();
      
      if (personData.results.length === 0) {
        return [];
      }
      
      // Get the first matching person's ID
      const directorId = personData.results[0].id;
      
      // Get their credits
      const creditsResponse = await fetch(
        `${TMDB_BASE_URL}/person/${directorId}/combined_credits?api_key=${TMDB_API_KEY}`
      );
      
      if (!creditsResponse.ok) {
        throw new Error('Failed to fetch person credits');
      }
      
      const creditsData = await creditsResponse.json();
      
      // Filter by media type and job (director for movies, creator for TV)
      const directorCredits = creditsData.crew.filter((credit: any) => {
        if (type === 'movie') {
          return credit.media_type === 'movie' && credit.job === 'Director';
        } else {
          return credit.media_type === 'tv' && 
                 (credit.job === 'Creator' || credit.job === 'Executive Producer');
        }
      });
      
      // Get details for each credit
      const detailedCreditsPromises = directorCredits
        .slice(0, 20)
        .map((credit: any) => fetchMediaDetails(credit.id, credit.media_type));
      
      const detailedCredits = await Promise.all(detailedCreditsPromises);
      return detailedCredits
        .filter(Boolean)
        .map((item: any) => convertTMDBMovie(item, type));
      
    } catch (err) {
      console.error('Error searching director:', err);
      setError('Error searching director filmography');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const filterMovies = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      // Use the provided media_type or fall back to the current state
      const type = filters.media_type || mediaType;
      
      // If there's a search query, search TMDB
      if (filters.query) {
        const tmdbResults = await searchTMDB(filters.query, type);
        setFilteredMovies(tmdbResults);
        setMovies(tmdbResults);
        return;
      }
      
      // If searching specifically for a director
      if (filters.director && filters.director !== '') {
        const directorResults = await searchDirector(filters.director, type);
        if (directorResults.length > 0) {
          setFilteredMovies(directorResults);
          setMovies(directorResults);
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
      const mediaType = type || mediaType;
      const movieData = await fetchMediaDetails(id, mediaType);
      
      if (movieData) {
        return convertTMDBMovie(movieData, mediaType);
      }
      
      // If not found with current media type and type wasn't explicitly provided, try the other type
      if (!type) {
        const otherType = mediaType === 'movie' ? 'tv' : 'movie';
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
