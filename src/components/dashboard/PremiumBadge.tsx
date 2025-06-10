
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PremiumBadgeProps {
  className?: string;
  small?: boolean;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ className, small }) => {
  return (
    <Badge variant="secondary" className={`${small ? 'text-xs px-2 py-1' : ''} ${className || ''}`}>
      Premium
    </Badge>
  );
};

export default PremiumBadge;
