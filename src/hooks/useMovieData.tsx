
import { useState, useEffect } from 'react';
import { Movie, SearchFilters } from '@/types';

// This would typically come from an API
const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    genre: ["Drama"],
    rating: 9.3,
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    genre: ["Crime", "Drama"],
    rating: 9.2,
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    rating: 8.9,
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.8,
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    genre: ["Drama"],
    rating: 8.8,
    synopsis: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    poster: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
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
