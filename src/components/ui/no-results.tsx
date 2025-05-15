
import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoResultsProps {
  title?: string;
  message?: string;
  searchTerm?: string;
  onClearSearch?: () => void;
  icon?: React.ReactNode;
  actionLabel?: string;
  className?: string;
}

export const NoResults: React.FC<NoResultsProps> = ({
  title = "No results found",
  message,
  searchTerm,
  onClearSearch,
  icon = <SearchX className="h-12 w-12 text-muted-foreground mb-2" />,
  actionLabel = "Clear search",
  className = "",
}) => {
  const defaultMessage = searchTerm
    ? `No results found for "${searchTerm}". Try a different search term.`
    : "No items match your filter criteria.";

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-muted/30 ${className}`}>
      {icon}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message || defaultMessage}
      </p>
      {onClearSearch && (
        <Button variant="outline" onClick={onClearSearch}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default NoResults;
