
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NoSearchResultsProps {
  query: string;
  onClear: () => void;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({ query, onClear }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 bg-muted/30 p-4 rounded-full">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        No vehicles matching "<span className="font-medium">{query}</span>" were found.
        Try a different search term or clear your search.
      </p>
      <Button variant="outline" onClick={onClear}>
        <X className="h-4 w-4 mr-2" />
        Clear Search
      </Button>
    </div>
  );
};

export default NoSearchResults;
