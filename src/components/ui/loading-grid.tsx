
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingGridProps {
  itemCount?: number;
  columns?: number;
  cardHeight?: string;
  showHeader?: boolean;
  className?: string;
}

export const LoadingGrid: React.FC<LoadingGridProps> = ({
  itemCount = 6,
  columns = 3,
  cardHeight = "h-64",
  showHeader = true,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className={`${cardHeight} w-full`}>
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingGrid;
