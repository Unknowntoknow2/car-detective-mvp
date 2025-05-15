
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h2 className="mt-4 text-xl font-semibold">Loading valuation...</h2>
      <p className="mt-2 text-muted-foreground">This may take a few moments</p>
    </div>
  );
};

export default LoadingState;
