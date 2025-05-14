
import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  variant?: 'silver' | 'gold' | 'platinum';
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({ variant = 'gold', size = 'md' }: PremiumBadgeProps) {
  const badgeColors = {
    silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
    gold: 'bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-900',
    platinum: 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'
  };
  
  const badgeSizes = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-0.5 px-2',
    lg: 'text-base py-1 px-3'
  };
  
  return (
    <span className={cn(
      'rounded-md font-semibold inline-flex items-center',
      badgeColors[variant],
      badgeSizes[size]
    )}>
      <span className="mr-1">★</span> Premium Dealer
    </span>
  );
}

// Default export for main component use
export default PremiumBadge;
