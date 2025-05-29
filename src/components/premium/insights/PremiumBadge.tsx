
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export function PremiumBadge() {
  return (
    <div className="absolute top-4 right-4 z-10">
      <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 border-amber-300 shadow-md px-3 py-1 text-sm font-semibold">
        <Crown className="h-4 w-4 mr-1" />
        Premium Valuation
      </Badge>
    </div>
  );
}
