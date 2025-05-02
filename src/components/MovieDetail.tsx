
import { Movie, CollectionType } from '@/types';
import { Button } from '@/components/ui/button';

interface MovieDetailProps {
  movie: Movie;
  onBack: () => void;
  onAddToCollection: (movieId: number, collection: CollectionType) => void;
  onRemoveFromCollection: (movieId: number, collection: CollectionType) => void;
  isInCollection: (movieId: number, collection: CollectionType) => boolean;
}

const MovieDetail = ({
  movie,
  onBack,
  onAddToCollection,
  onRemoveFromCollection,
  isInCollection
}: MovieDetailProps) => {
  const handleCollectionAction = (collection: CollectionType) => {
    if (isInCollection(movie.id, collection)) {
      onRemoveFromCollection(movie.id, collection);
    } else {
      onAddToCollection(movie.id, collection);
    }
  };
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-cinema-red hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Back
      </button>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 rounded-lg overflow-hidden border border-border">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <span className="text-cinema-gold font-bold text-xl">★ {movie.rating.toFixed(1)}</span>
          </div>
          
          <div className="mt-2 space-y-2 text-muted-foreground">
            <p><span className="font-semibold">Directed by:</span> {movie.director}</p>
            <p><span className="font-semibold">Year:</span> {movie.year}</p>
            <p>
              <span className="font-semibold">Genre:</span>{' '}
              {movie.genre.join(', ')}
            </p>
          </div>
          
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
            <p className="text-sm leading-relaxed break-words whitespace-normal">{movie.synopsis}</p>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              variant={isInCollection(movie.id, 'liked') ? 'secondary' : 'outline'}
              onClick={() => handleCollectionAction('liked')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInCollection(movie.id, 'liked') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {isInCollection(movie.id, 'liked') ? 'Liked' : 'Like'}
            </Button>
            
            <Button
              variant={isInCollection(movie.id, 'watched') ? 'secondary' : 'outline'}
              onClick={() => handleCollectionAction('watched')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInCollection(movie.id, 'watched') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {isInCollection(movie.id, 'watched') ? 'Watched' : 'Mark as Watched'}
            </Button>
            
            <Button
              variant={isInCollection(movie.id, 'watchlist') ? 'secondary' : 'outline'}
              onClick={() => handleCollectionAction('watchlist')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInCollection(movie.id, 'watchlist') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {isInCollection(movie.id, 'watchlist') ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
