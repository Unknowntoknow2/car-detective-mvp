
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NoSearchResultsProps {
  query?: string;
  onClearFilters?: () => void;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  query,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-muted/20">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">No search results found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {query 
          ? `No vehicles match the search term "${query}"`
          : "No vehicles match your current filter settings"
        }
      </p>
      {onClearFilters && (
        <Button 
          onClick={onClearFilters} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default NoSearchResults;
