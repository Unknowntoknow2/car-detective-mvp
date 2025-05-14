
import React from 'react';
import { Sparkles } from 'lucide-react';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
}

export const PremiumBadge = ({ className }: PremiumBadgeProps) => {
  const { isPremium, isLoading } = usePremiumDealer();
  
  if (isLoading || !isPremium) return null;
  
  return (
    <div className={cn("flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white", className)}>
      <Sparkles className="h-3 w-3 mr-1" />
      Premium
    </div>
  );
};

// Export for other components to use
export { PremiumBadge };
