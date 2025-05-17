
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'neutral';
  percentage: string;
}

export function TrendIndicator({ direction, percentage }: TrendIndicatorProps) {
  if (direction === 'up') {
    return (
      <div className="flex items-center text-green-600">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">+{percentage}% Projected</span>
      </div>
    );
  } else if (direction === 'down') {
    return (
      <div className="flex items-center text-red-600">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">-{percentage}% Projected</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-gray-600">
        <span className="text-sm font-medium">Stable</span>
      </div>
    );
  }
}
