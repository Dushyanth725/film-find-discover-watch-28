
import { Movie, Person } from '@/types';

// Process cast data
export const processCast = (cast: any[]): Person[] => {
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
export const processCrew = (crew: any[]): Person[] => {
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

// Convert TMDB movie to our Movie type
export const convertTMDBMovie = (tmdbMovie: any, type: 'movie' | 'tv'): Movie => {
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
