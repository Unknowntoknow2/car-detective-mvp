
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonSelectProps {
  className?: string;
  label?: string;
}

export const SkeletonSelect: React.FC<SkeletonSelectProps> = ({ className, label }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-2 bg-red-300 rounded-full animate-pulse" />
        </div>
      )}
      <div className="relative">
        <div className="h-[40px] w-full bg-gray-100 border border-gray-200 rounded-md animate-pulse">
          <div className="flex items-center justify-between h-full px-3">
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonSelect;
