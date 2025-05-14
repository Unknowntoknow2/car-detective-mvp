
import { SearchAndFilterBar as ReusableSearchAndFilterBar } from '@/components/ui/search-and-filter-bar';

// Re-export with dealer-specific defaults
export const SearchAndFilterBar = (props) => (
  <ReusableSearchAndFilterBar
    searchPlaceholder="Search by make, model, or year..."
    {...props}
  />
);

export default SearchAndFilterBar;
