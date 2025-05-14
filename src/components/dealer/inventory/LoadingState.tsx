
import { LoadingGrid } from '@/components/ui/loading-grid';

// Re-export with dealer inventory specific defaults
export const LoadingState = (props) => (
  <LoadingGrid
    itemCount={6}
    columns={3}
    cardHeight="h-64"
    showHeader={true}
    {...props}
  />
);

export default LoadingState;
