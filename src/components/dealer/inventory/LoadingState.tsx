
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="hidden md:flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex justify-end gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-primary mr-2 animate-spin" />
        <span className="text-muted-foreground">Loading your inventory...</span>
      </div>
    </div>
  );
};

export default LoadingState;
