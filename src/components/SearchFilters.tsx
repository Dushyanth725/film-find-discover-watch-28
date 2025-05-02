
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      year: '',
      director: '',
      genre: ''
    });
    onSearch({
      query: '',
      year: '',
      director: '',
      genre: ''
    });
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          name="query"
          placeholder="Search movie titles..."
          value={filters.query}
          onChange={handleInputChange}
          className="flex-1"
        />
        <Button type="submit" className="btn-cinema">
          Search
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset} 
          className="btn-cinema-outline"
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
