
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieData } from '@/hooks/useMovieData';
import { useUserCollections } from '@/hooks/useUserCollections';
import { Movie, CollectionType, Person } from '@/types';
import Navbar from '@/components/Navbar';
import SearchFilters from '@/components/SearchFilters';
import MovieCard from '@/components/MovieCard';
import MovieDetail from '@/components/MovieDetail';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MediaTypeToggle from '@/components/MediaTypeToggle';

const Dashboard = () => {
  const { movies, isLoading, filterMovies, getMovieById, mediaType, setMediaType } = useMovieData();
  const { 
    collections, 
    addToCollection, 
    removeFromCollection, 
    isInCollection, 
    moveToWatched,
    ratings,
    addRating,
    removeRating,
    getRating
  } = useUserCollections();
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeCollection, setActiveCollection] = useState<CollectionType | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleMovieSelect = async (movie: Movie) => {
    setIsLoadingDetails(true);
    try {
      // Fetch full movie details if needed
      const fullMovieDetails = await getMovieById(movie.id, movie.media_type);
      if (fullMovieDetails) {
        setSelectedMovie(fullMovieDetails);
      } else {
        setSelectedMovie(movie);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setSelectedMovie(movie);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleBackToList = () => {
    setSelectedMovie(null);
  };

  const handleCollectionSelect = (value: CollectionType | 'all') => {
    if (value === 'all') {
      setActiveCollection(null);
      setSelectedMovie(null);
    } else {
      setActiveCollection(value);
      setSelectedMovie(null);
    }
  };

  const handleAddToCollection = (movieId: number, collection: CollectionType) => {
    addToCollection(movieId, collection);
    toast({
      title: 'Added to collection',
      description: `Movie added to your ${collection} list`,
    });
  };

  const handleRemoveFromCollection = (movieId: number, collection: CollectionType) => {
    removeFromCollection(movieId, collection);
    toast({
      title: 'Removed from collection',
      description: `Movie removed from your ${collection} list`,
    });
  };

  const handleMoveToWatched = (movieId: number) => {
    moveToWatched(movieId);
    toast({
      title: 'Moved to watched',
      description: 'Movie moved to your watched list',
    });
  };

  const handleRate = (movieId: number, rating: number) => {
    addRating(movieId, rating, mediaType);
    toast({
      title: 'Rating saved',
      description: `You rated this ${mediaType === 'movie' ? 'movie' : 'TV series'} ${rating} stars`,
    });
  };

  const handleDeleteRating = (movieId: number) => {
    removeRating(movieId);
    toast({
      title: 'Rating removed',
      description: `Your rating has been removed`,
    });
  };

  const handlePersonClick = async (person: Person) => {
    if (!person.name) return;
    
    toast({
      title: 'Searching filmography',
      description: `Looking for works by ${person.name}`,
    });
    
    await filterMovies({
      query: '',
      year: '',
      director: person.name,
      genre: '',
      media_type: mediaType
    });
    
    setSelectedMovie(null);
  };

  const handleMediaTypeChange = (type: 'movie' | 'tv') => {
    setMediaType(type);
    setSelectedMovie(null);
  };

  // Filter movies based on active collection and media type
  const filteredMovies = activeCollection
    ? movies.filter(movie => 
        collections[activeCollection].includes(movie.id) && 
        (!movie.media_type || movie.media_type === mediaType)
      )
    : movies.filter(movie => !movie.media_type || movie.media_type === mediaType);

  const handleSearch = async (filters: any) => {
    await filterMovies(filters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <MediaTypeToggle mediaType={mediaType} onChange={handleMediaTypeChange} />
          </div>
          
          <div className="w-full sm:w-auto">
            <Select 
              onValueChange={(value) => handleCollectionSelect(value as CollectionType | 'all')} 
              defaultValue="all"
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {mediaType === 'movie' ? 'Movies' : 'TV Series'}</SelectItem>
                <SelectItem value="liked">Liked</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!activeCollection && (
          <div className="mb-6">
            <SearchFilters onSearch={handleSearch} mediaType={mediaType} />
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Movie list */}
          <div className={`w-full ${selectedMovie ? 'lg:w-1/3' : 'lg:w-full'}`}>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-muted-foreground">Loading...</div>
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl font-bold text-muted-foreground">----</p>
                <p className="text-muted-foreground mt-2">
                  {activeCollection 
                    ? `No ${mediaType === 'movie' ? 'movies' : 'TV series'} in your ${activeCollection} list yet.` 
                    : `No ${mediaType === 'movie' ? 'movies' : 'TV series'} found matching your search criteria.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="relative">
                    <MovieCard 
                      movie={movie} 
                      onClick={() => handleMovieSelect(movie)}
                      userRating={getRating(movie.id)}
                      showRating={isInCollection(movie.id, 'watched')}
                    />
                    
                    {activeCollection === 'watchlist' && (
                      <div className="absolute top-2 right-2 z-10 bg-card rounded-full p-1 shadow-md border border-border">
                        <Checkbox
                          id={`watched-${movie.id}`}
                          checked={isInCollection(movie.id, 'watched')}
                          onCheckedChange={() => handleMoveToWatched(movie.id)}
                        />
                        <Label htmlFor={`watched-${movie.id}`} className="sr-only">
                          Mark as watched
                        </Label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right column: Movie details */}
          {selectedMovie && (
            <div className="w-full lg:w-2/3">
              {isLoadingDetails ? (
                <div className="flex justify-center items-center h-64 border border-border rounded-lg bg-card">
                  <div className="text-xl text-muted-foreground">Loading details...</div>
                </div>
              ) : (
                <MovieDetail 
                  movie={selectedMovie}
                  onBack={handleBackToList}
                  onAddToCollection={handleAddToCollection}
                  onRemoveFromCollection={handleRemoveFromCollection}
                  isInCollection={isInCollection}
                  onRate={handleRate}
                  onDeleteRating={handleDeleteRating}
                  userRating={getRating(selectedMovie.id)}
                  onPersonClick={handlePersonClick}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
