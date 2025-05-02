
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

export const useMovieData = () => {
  const [movies, setMovies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterMovies = (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      let results = [...movies];
      
      // Filter by title/query with fuzzy matching
      if (filters.query) {
        const query = filters.query.toLowerCase();
        results = results.filter(movie => 
          movie.title.toLowerCase().includes(query)
        );
      }
      
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
      setError(null);
    } catch (err) {
      setError("Error filtering movies");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch movie by ID
  const getMovieById = (id: number): Movie | undefined => {
    return movies.find(movie => movie.id === id);
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
