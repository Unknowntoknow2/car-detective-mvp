
import React from 'react';
import { BadgeCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumBadge } from '@/components/ui/premium-badge';

interface PremiumDealerBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function PremiumDealerBadge({ 
  size = 'md', 
  className,
  showText = true 
}: PremiumDealerBadgeProps) {
  return (
    <PremiumBadge 
      variant="gold"
      size={size}
      className={cn("gap-1", className)}
    >
      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
      {showText && "Premium Dealer"}
    </PremiumBadge>
  );
}

// Re-export the PremiumBadge component for use in other dealer components
export { PremiumBadge };
