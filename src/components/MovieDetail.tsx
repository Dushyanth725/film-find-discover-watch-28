
import { Movie, CollectionType, Person } from '@/types';
import { Button } from '@/components/ui/button';
import RatingStars from './RatingStars';
import { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';

interface MovieDetailProps {
  movie: Movie;
  onBack: () => void;
  onAddToCollection: (movieId: number, collection: CollectionType) => void;
  onRemoveFromCollection: (movieId: number, collection: CollectionType) => void;
  isInCollection: (movieId: number, collection: CollectionType) => boolean;
  onRate?: (movieId: number, rating: number) => void;
  onDeleteRating?: (movieId: number) => void;
  userRating?: number;
  onPersonClick?: (person: Person) => void;
}

const MovieDetail = ({
  movie,
  onBack,
  onAddToCollection,
  onRemoveFromCollection,
  isInCollection,
  onRate,
  onDeleteRating,
  userRating,
  onPersonClick
}: MovieDetailProps) => {
  const [showCast, setShowCast] = useState(true);
  
  const handleCollectionAction = (collection: CollectionType) => {
    if (isInCollection(movie.id, collection)) {
      onRemoveFromCollection(movie.id, collection);
    } else {
      onAddToCollection(movie.id, collection);
    }
  };
  
  const handlePersonClick = (person: Person) => {
    if (onPersonClick) {
      onPersonClick(person);
    }
  };
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-cinema-red hover:underline"
      >
        <ArrowLeft width={20} height={20} />
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
            <p>
              <span className="font-semibold">
                {movie.media_type === 'movie' ? 'Directed by:' : 'Created by:'}
              </span> 
              <button 
                onClick={() => handlePersonClick({ id: 0, name: movie.director })}
                className="ml-1 text-foreground hover:underline focus:outline-none"
              >
                {movie.director}
              </button>
            </p>
            <p>
              <span className="font-semibold">Year:</span> {movie.year}
            </p>
            <p>
              <span className="font-semibold">Genre:</span>{' '}
              {movie.genre.join(', ')}
            </p>
            {onRate && isInCollection(movie.id, 'watched') && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="font-semibold">Your Rating:</span>
                <RatingStars 
                  initialRating={userRating || 0} 
                  movieId={movie.id} 
                  onRate={onRate}
                  onDelete={onDeleteRating}
                  size="md"
                />
              </div>
            )}
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
              disabled={isInCollection(movie.id, 'watched')}
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
      
      {/* Cast & Crew Section */}
      {(movie.cast?.length || movie.crew?.length) && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Cast & Crew</h3>
            <div className="flex gap-2">
              <Button 
                variant={showCast ? "secondary" : "outline"} 
                onClick={() => setShowCast(true)}
                size="sm"
              >
                Cast
              </Button>
              <Button 
                variant={!showCast ? "secondary" : "outline"} 
                onClick={() => setShowCast(false)}
                size="sm"
              >
                Crew
              </Button>
            </div>
          </div>
          
          {showCast ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.cast?.map((person) => (
                <div 
                  key={`cast-${person.id}`}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden bg-muted mb-2">
                    {person.profile_path ? (
                      <img 
                        src={person.profile_path} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <User size={30} />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movie.crew?.map((person) => (
                <div 
                  key={`crew-${person.id}-${person.job}`}
                  className="flex flex-col items-center text-center cursor-pointer"
                  onClick={() => handlePersonClick(person)}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden bg-muted mb-2">
                    {person.profile_path ? (
                      <img 
                        src={person.profile_path} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <User size={30} />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.job}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
