
// TMDB API Constants
const TMDB_API_KEY = "3456c6a647ebec2c9855eccc51be348d";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Fetch movie/TV show details including director and cast/crew
export const fetchMediaDetails = async (id: number, type: 'movie' | 'tv') => {
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
export const searchTMDB = async (query: string, type: 'movie' | 'tv') => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from TMDB`);
    }
    
    const data = await response.json();
    return data.results.slice(0, 10);
  } catch (err) {
    console.error(`Error searching TMDB for ${type}:`, err);
    return [];
  }
};

// Search for a director's filmography
export const searchDirector = async (directorName: string, type: 'movie' | 'tv') => {
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
    return creditsData.crew.filter((credit: any) => {
      if (type === 'movie') {
        return credit.media_type === 'movie' && credit.job === 'Director';
      } else {
        return credit.media_type === 'tv' && 
              (credit.job === 'Creator' || credit.job === 'Executive Producer');
      }
    }).slice(0, 20);
  } catch (err) {
    console.error('Error searching director:', err);
    return [];
  }
};
