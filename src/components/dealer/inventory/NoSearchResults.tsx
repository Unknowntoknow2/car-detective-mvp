
import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoSearchResultsProps {
  query: string;
  onClear: () => void;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  query,
  onClear
}) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-muted/30">
      <div className="flex justify-center mb-4">
        <div className="bg-muted/50 p-4 rounded-full">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any vehicles matching "<span className="font-medium">{query}</span>".
        Try a different search term or clear your search.
      </p>
      <Button variant="outline" onClick={onClear}>Clear Search</Button>
    </div>
  );
};

export default NoSearchResults;
