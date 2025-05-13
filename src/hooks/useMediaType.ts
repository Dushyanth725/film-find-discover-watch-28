
import { useState, useEffect } from 'react';
import { SAMPLE_MOVIES } from '@/utils/tmdb/sample-data';
import { Movie } from '@/types';

// Top-rated TV series to feature on the homepage
const TOP_RATED_SERIES: Movie[] = [
  {
    id: 1396,
    title: "Breaking Bad",
    year: 2008,
    director: "Vince Gilligan",
    genre: ["Crime", "Drama", "Thriller"],
    rating: 9.5,
    synopsis: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    media_type: "tv"
  },
  {
    id: 1398,
    title: "The Wire",
    year: 2002,
    director: "David Simon",
    genre: ["Crime", "Drama", "Thriller"],
    rating: 9.3,
    synopsis: "Baltimore drug scene, seen through the eyes of drug dealers and law enforcement.",
    poster: "https://image.tmdb.org/t/p/w500/4lbclFySvugI51fwsyxBTOm4DqK.jpg",
    media_type: "tv"
  },
  {
    id: 1399,
    title: "The Sopranos",
    year: 1999,
    director: "David Chase",
    genre: ["Crime", "Drama"],
    rating: 9.2,
    synopsis: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state.",
    poster: "https://image.tmdb.org/t/p/w500/6ooZBMyaQnRkLLRq2SUr1IgPjlM.jpg",
    media_type: "tv"
  },
  {
    id: 19885,
    title: "Sherlock",
    year: 2010,
    director: "Mark Gatiss, Steven Moffat",
    genre: ["Crime", "Drama", "Mystery"],
    rating: 9.0,
    synopsis: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.",
    poster: "https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9sutZvIl5hGY.jpg",
    media_type: "tv"
  },
  {
    id: 60574,
    title: "Peaky Blinders",
    year: 2013,
    director: "Steven Knight",
    genre: ["Crime", "Drama"],
    rating: 8.7,
    synopsis: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.",
    poster: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    media_type: "tv"
  }
];

export const useMediaType = () => {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  
  // Set the current media type
  const setCurrentMediaType = (type: 'movie' | 'tv') => {
    setMediaType(type);
  };
  
  // Get sample media filtered by media type
  const getSampleMedia = () => {
    if (mediaType === 'tv') {
      return TOP_RATED_SERIES;
    } else {
      return SAMPLE_MOVIES.filter(movie => movie.media_type === 'movie' || !movie.media_type);
    }
  };
  
  return {
    mediaType,
    setMediaType: setCurrentMediaType,
    getSampleMedia
  };
};
