
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  itemCount?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  itemCount = 6 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="border rounded-xl overflow-hidden">
          {/* Image placeholder */}
          <Skeleton className="w-full h-48" />
          
          <div className="p-4 space-y-4">
            {/* Title */}
            <div className="flex justify-between">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-20" />
            </div>
            
            {/* Price and details */}
            <div className="flex justify-between items-start">
              <Skeleton className="h-8 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
