
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoSearchResultsProps {
  onClearFilters: () => void;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({ 
  onClearFilters 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 border border-gray-200 rounded-lg bg-gray-50 text-center">
      <div className="h-16 w-16 mb-5 bg-gray-200 rounded-full flex items-center justify-center">
        <Search className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any vehicles matching your search criteria. Try adjusting your filters or search term.
      </p>
      <Button onClick={onClearFilters} variant="outline" className="flex items-center gap-1">
        <X className="h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );
};

export default NoSearchResults;
