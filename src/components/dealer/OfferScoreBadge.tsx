
import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface OfferScoreBadgeProps {
  label?: string;
  insight?: string;
  score: number;
  recommendation?: 'excellent' | 'good' | 'fair' | 'below_market';
  isBestOffer?: boolean;
}

export const OfferScoreBadge: React.FC<OfferScoreBadgeProps> = ({
  label,
  insight,
  score,
  recommendation,
  isBestOffer = false,
}) => {
  const getVariant = () => {
    if (isBestOffer) return 'default';
    
    switch (recommendation) {
      case 'excellent':
        return 'default';
      case 'good':
        return 'secondary';
      case 'fair':
        return 'outline';
      case 'below_market':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getLabel = () => {
    if (label) return label;
    
    switch (recommendation) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'below_market':
        return 'Below Market';
      default:
        return `${score}% Match`;
    }
  };

  return (
    <Badge variant={getVariant()}>
      {getLabel()}
    </Badge>
  );
};

export default OfferScoreBadge;
