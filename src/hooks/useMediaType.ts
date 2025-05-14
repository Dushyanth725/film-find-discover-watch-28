
import { useState, useEffect } from 'react';
import { SAMPLE_MOVIES } from '@/utils/tmdb/sample-data';

export const useMediaType = () => {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  
  // Set the current media type
  const setCurrentMediaType = (type: 'movie' | 'tv') => {
    setMediaType(type);
  };
  
  // Get sample movies filtered by media type
  const getSampleMovies = () => {
    return SAMPLE_MOVIES.filter(movie => movie.media_type === mediaType);
  };
  
  return {
    mediaType,
    setMediaType: setCurrentMediaType,
    getSampleMovies
  };
};
