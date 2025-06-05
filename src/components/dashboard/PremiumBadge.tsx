
import React from 'react';
import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PremiumBadgeProps {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  variant = 'default', 
  size = 'default' 
}) => {
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Crown className="h-3 w-3" />
      Premium
    </Badge>
  );
};
