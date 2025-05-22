
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5,
  className 
}: StarRatingProps) {
  // Normalize rating to be between 0 and maxRating
  const normalizedRating = Math.max(0, Math.min(rating, maxRating));
  
  // Calculate the width percentage for the filled stars
  const fillPercentage = (normalizedRating / maxRating) * 100;
  
  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Background stars (empty) */}
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            className="w-5 h-5 text-gray-200" 
            fill="currentColor"
          />
        ))}
      </div>
      
      {/* Foreground stars (filled) */}
      <div 
        className="absolute top-0 left-0 overflow-hidden flex"
        style={{ width: `${fillPercentage}%` }}
      >
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star 
            key={`filled-${i}`} 
            className="w-5 h-5 text-amber-400" 
            fill="currentColor"
          />
        ))}
      </div>
      
      {/* Optional: display the numeric rating */}
      {/* <span className="ml-2 text-sm">{normalizedRating.toFixed(1)}</span> */}
    </div>
  );
}
