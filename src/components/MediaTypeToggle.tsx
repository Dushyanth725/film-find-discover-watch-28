
import { Film, Tv } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface MediaTypeToggleProps {
  mediaType: 'movie' | 'tv';
  onChange: (value: 'movie' | 'tv') => void;
}

const MediaTypeToggle = ({ mediaType, onChange }: MediaTypeToggleProps) => {
  const handleValueChange = (value: string) => {
    if (value === 'movie' || value === 'tv') {
      onChange(value);
    }
  };
  
  return (
    <ToggleGroup 
      type="single" 
      value={mediaType} 
      onValueChange={handleValueChange}
      className="border rounded-md"
    >
      <ToggleGroupItem value="movie" aria-label="Movie mode">
        <Film className="h-4 w-4 mr-2" />
        Movies
      </ToggleGroupItem>
      <ToggleGroupItem value="tv" aria-label="TV series mode">
        <Tv className="h-4 w-4 mr-2" />
        TV Series
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default MediaTypeToggle;
