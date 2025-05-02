
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieData } from '@/hooks/useMovieData';
import { useUserCollections } from '@/hooks/useUserCollections';
import { Movie, CollectionType } from '@/types';
import Navbar from '@/components/Navbar';
import SearchFilters from '@/components/SearchFilters';
import MovieCard from '@/components/MovieCard';
import MovieDetail from '@/components/MovieDetail';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { movies, isLoading, filterMovies, getMovieById } = useMovieData();
  const { collections, addToCollection, removeFromCollection, isInCollection, moveToWatched } = useUserCollections();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeCollection, setActiveCollection] = useState<CollectionType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
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

  // Filter movies based on active collection
  const filteredMovies = activeCollection
    ? movies.filter(movie => collections[activeCollection].includes(movie.id))
    : movies;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold">Discover Movies</h2>
          
          <div className="w-full sm:w-auto">
            <Select 
              onValueChange={(value) => handleCollectionSelect(value as CollectionType | 'all')} 
              defaultValue="all"
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Movies</SelectItem>
                <SelectItem value="liked">Liked Movies</SelectItem>
                <SelectItem value="watched">Watched Movies</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!activeCollection && (
          <div className="mb-6">
            <SearchFilters onSearch={filterMovies} />
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
                    ? `No movies in your ${activeCollection} list yet.` 
                    : 'No movies found matching your search criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="relative">
                    <MovieCard 
                      movie={movie} 
                      onClick={() => handleMovieSelect(movie)} 
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
              <MovieDetail 
                movie={selectedMovie}
                onBack={handleBackToList}
                onAddToCollection={handleAddToCollection}
                onRemoveFromCollection={handleRemoveFromCollection}
                isInCollection={isInCollection}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
