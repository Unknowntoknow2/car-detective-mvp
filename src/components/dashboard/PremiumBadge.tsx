
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PremiumBadgeProps {
  className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ className }) => {
  return (
    <Badge variant="secondary" className={className}>
      Premium
    </Badge>
  );
};

export default PremiumBadge;
