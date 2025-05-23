
import { Movie } from '@/types';
import RatingStars from './RatingStars';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  userRating?: number;
  showRating?: boolean;
}

const MovieCard = ({ movie, onClick, userRating, showRating = false }: MovieCardProps) => {
  return (
    <div 
      className="movie-card cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden border border-border animate-fade-in"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">{movie.year}</span>
            <span className="text-cinema-gold font-bold">★ {movie.rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Media type badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {movie.media_type === 'movie' ? 'Movie' : 'TV'}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-lg line-clamp-1">{movie.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {movie.director}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {movie.genre.slice(0, 2).map((g, index) => (
            <span 
              key={index} 
              className="text-xs bg-muted px-2 py-1 rounded-full"
            >
              {g}
            </span>
          ))}
          {movie.genre.length > 2 && (
            <span className="text-xs bg-muted px-2 py-1 rounded-full">+{movie.genre.length - 2}</span>
          )}
        </div>
        
        {/* User rating (if available) */}
        {showRating && userRating && userRating > 0 && (
          <div className="mt-2 border-t pt-2 border-border">
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-1">Your rating:</span>
              <RatingStars 
                initialRating={userRating} 
                movieId={movie.id}
                onRate={() => {}} 
                readOnly={true}
                size="sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
