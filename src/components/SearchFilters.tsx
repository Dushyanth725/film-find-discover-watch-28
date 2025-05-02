
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchFilters as SearchFiltersType } from '@/types';

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersType) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFiltersType>({
    query: '',
    year: '',
    director: '',
    genre: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      await onSearch(filters);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = async () => {
    const emptyFilters = {
      query: '',
      year: '',
      director: '',
      genre: ''
    };
    
    setFilters(emptyFilters);
    setIsSearching(true);
    try {
      await onSearch(emptyFilters);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          name="query"
          placeholder="Search movie titles from TMDB..."
          value={filters.query}
          onChange={handleInputChange}
          className="flex-1"
        />
        <Button 
          type="submit" 
          className="btn-cinema"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset} 
          className="btn-cinema-outline"
          disabled={isSearching}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="year" className="text-sm font-medium block mb-1">
            Year
          </label>
          <Input
            id="year"
            name="year"
            placeholder="e.g., 1994"
            value={filters.year}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="director" className="text-sm font-medium block mb-1">
            Director
          </label>
          <Input
            id="director"
            name="director"
            placeholder="e.g., Christopher Nolan"
            value={filters.director}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="genre" className="text-sm font-medium block mb-1">
            Genre (comma separated)
          </label>
          <Input
            id="genre"
            name="genre"
            placeholder="e.g., Action, Thriller"
            value={filters.genre}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchFilters;
