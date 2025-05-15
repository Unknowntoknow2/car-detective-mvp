
import React from 'react';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface PremiumBadgeProps {
  className?: string;
}

export const PremiumBadge = ({ className }: PremiumBadgeProps) => {
  const { isPremium, isLoading } = usePremiumDealer();
  
  if (isLoading) return null;
  if (!isPremium) return null;
  
  return (
    <Badge className={cn('bg-amber-100 text-amber-800 border-amber-200', className)}>
      Premium
    </Badge>
  );
};
