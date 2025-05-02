
import { useState, useEffect } from 'react';
import { Movie, SearchFilters } from '@/types';

// Updated with more relevant movie posters
const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    genre: ["Drama"],
    rating: 9.3,
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg"
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    genre: ["Crime", "Drama"],
    rating: 9.2,
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    rating: 8.9,
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    id: 5,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.8,
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
  },
  {
    id: 6,
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    genre: ["Drama"],
    rating: 8.8,
    synopsis: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    poster: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
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

  // Convert TMDB movie to our Movie type
  const convertTMDBMovie = (tmdbMovie: any): Movie => {
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      year: new Date(tmdbMovie.release_date).getFullYear() || 0,
      director: tmdbMovie.director || "Unknown",
      genre: tmdbMovie.genres ? tmdbMovie.genres.map((g: any) => g.name) : [],
      rating: tmdbMovie.vote_average || 0,
      synopsis: tmdbMovie.overview || "No synopsis available",
      poster: tmdbMovie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster+Available"
    };
  };

  // Fetch movie details including director
  const fetchMovieDetails = async (movieId: number) => {
    try {
      // Get basic movie details
      const movieResponse = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
      );
      
      if (!movieResponse.ok) {
        throw new Error('Failed to fetch movie details');
      }
      
      const movieData = await movieResponse.json();
      
      // Find director from credits
      let director = "Unknown";
      if (movieData.credits && movieData.credits.crew) {
        const directorInfo = movieData.credits.crew.find((person: any) => person.job === "Director");
        if (directorInfo) {
          director = directorInfo.name;
        }
      }
      
      return { ...movieData, director };
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  // Search TMDB API
  const searchTMDBMovies = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch from TMDB');
      }
      
      const data = await response.json();
      
      // For the first 10 search results, fetch complete details with director info
      const detailedMoviesPromises = data.results.slice(0, 10).map((movie: any) => 
        fetchMovieDetails(movie.id)
      );
      
      const detailedMovies = await Promise.all(detailedMoviesPromises);
      const validMovies = detailedMovies.filter(Boolean).map(convertTMDBMovie);
      
      return validMovies;
    } catch (err) {
      console.error("Error searching TMDB:", err);
      setError("Error searching movies from TMDB");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const filterMovies = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      // If there's a search query, search TMDB
      if (filters.query) {
        const tmdbResults = await searchTMDBMovies(filters.query);
        setFilteredMovies(tmdbResults);
        setMovies(tmdbResults);
        return;
      }
      
      // If there's a specific year, director or genre filter
      if (filters.year || filters.director || filters.genre) {
        let results = [...movies];
        
        // Filter by year
        if (filters.year && filters.year !== '') {
          const year = parseInt(filters.year);
          if (!isNaN(year)) {
            results = results.filter(movie => movie.year === year);
          }
        }
        
        // Filter by director
        if (filters.director && filters.director !== '') {
          const director = filters.director.toLowerCase();
          results = results.filter(movie => 
            movie.director.toLowerCase().includes(director)
          );
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
        
        setFilteredMovies(results);
      } else {
        // No filters, show default movies
        setFilteredMovies(SAMPLE_MOVIES);
      }
      
      setError(null);
    } catch (err) {
      setError("Error filtering movies");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch movie by ID
  const getMovieById = async (id: number): Promise<Movie | undefined> => {
    // First check local movies
    const localMovie = movies.find(movie => movie.id === id);
    if (localMovie) {
      return localMovie;
    }
    
    // If not found locally, try to fetch from TMDB
    try {
      const movieData = await fetchMovieDetails(id);
      if (movieData) {
        return convertTMDBMovie(movieData);
      }
    } catch (error) {
      console.error("Error fetching movie by ID:", error);
    }
    
    return undefined;
  };

  // In a real application, this would fetch from an API
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setMovies(SAMPLE_MOVIES);
      setFilteredMovies(SAMPLE_MOVIES);
      setIsLoading(false);
    }, 500);
  }, []);

  return { 
    movies: filteredMovies, 
    isLoading, 
    error, 
    filterMovies,
    getMovieById
  };
};
