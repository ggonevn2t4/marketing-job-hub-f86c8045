
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import SearchBar from '@/components/jobs/SearchBar';
import AdvancedFilters from '@/components/jobs/AdvancedFilters';

interface JobFiltersProps {
  filters: {
    jobType?: string;
    experienceLevel?: string;
    salary?: string;
    salaryRange?: [number, number];
    featuredOnly?: boolean;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const JobFilters = ({ filters, onFilterChange, onReset }: JobFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="bg-muted/30 py-6">
      <div className="container mx-auto px-6">
        <SearchBar />
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc nâng cao'}
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4">
            <AdvancedFilters 
              filters={filters} 
              onFilterChange={onFilterChange} 
              onReset={onReset} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFilters;
