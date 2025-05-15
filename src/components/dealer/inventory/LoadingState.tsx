
import React from 'react';
import { Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface LoadingStateProps {
  itemCount: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ itemCount = 3 }) => {
  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <Loader className="h-6 w-6 text-primary animate-spin mr-2" />
        <p className="text-muted-foreground">Loading inventory...</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(itemCount).fill(0).map((_, index) => (
          <div key={index} className="rounded-lg border border-border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LoadingState;
