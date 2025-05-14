
import { NoResults } from '@/components/ui/no-results';

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

// Re-export with dealer inventory specific defaults
export const NoSearchResults = ({ searchTerm, onClearSearch }: NoSearchResultsProps) => (
  <NoResults
    title="No vehicles found"
    searchTerm={searchTerm}
    onClearSearch={onClearSearch}
    message={`No vehicles match "${searchTerm}". Try a different search term or clear your search.`}
    {...(onClearSearch && { onClearSearch, actionLabel: "Clear search" })}
  />
);

export default NoSearchResults;
