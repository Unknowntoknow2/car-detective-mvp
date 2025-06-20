
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  className,
  size = 'md',
  showValue = false
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const iconSize = sizeClasses[size];
  const normalizedRating = (rating / maxRating) * 5; // Convert to 5-star scale
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(normalizedRating);
        const isHalfFilled = starValue === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
        
        return (
          <Star
            key={index}
            className={cn(
              iconSize,
              isFilled 
                ? "fill-yellow-400 text-yellow-400"
                : isHalfFilled
                ? "fill-yellow-200 text-yellow-400"
                : "fill-gray-200 text-gray-300"
            )}
          />
        );
      })}
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  );
}
