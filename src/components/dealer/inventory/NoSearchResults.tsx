
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({ 
  searchTerm, 
  onClearSearch 
}) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-background mt-6">
      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No Matching Vehicles</h3>
      <p className="text-muted-foreground mb-6">
        No vehicles match your search for "{searchTerm}".
      </p>
      <Button variant="outline" onClick={onClearSearch}>
        Clear Search
      </Button>
    </div>
  );
};
