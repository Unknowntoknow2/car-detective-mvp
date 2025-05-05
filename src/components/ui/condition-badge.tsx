
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, XCircleIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

type ConditionLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;

interface ConditionBadgeProps {
  condition: ConditionLevel;
  confidenceScore?: number;
  className?: string;
}

export function ConditionBadge({ 
  condition, 
  confidenceScore = 0, 
  className 
}: ConditionBadgeProps) {
  if (!condition) return null;
  
  const isVerified = confidenceScore >= 70;
  
  // Determine style based on condition level
  const getVariant = () => {
    if (!isVerified) return "outline";
    
    switch (condition) {
      case 'Excellent':
        return "default";
      case 'Good':
        return "secondary";
      case 'Fair':
        return "outline";
      case 'Poor':
        return "outline";
      default:
        return "outline";
    }
  };
  
  return (
    <Badge 
      variant={getVariant()} 
      className={cn(
        "flex items-center gap-1.5",
        !isVerified && "text-gray-500 border-gray-300",
        condition === 'Excellent' && isVerified && "bg-green-500 hover:bg-green-600",
        condition === 'Good' && isVerified && "bg-blue-500 hover:bg-blue-600",
        condition === 'Fair' && isVerified && "border-amber-500 text-amber-600",
        condition === 'Poor' && isVerified && "border-red-500 text-red-600",
        className
      )}
    >
      {isVerified ? (
        <CheckCircleIcon className="h-3.5 w-3.5" />
      ) : (
        <XCircleIcon className="h-3.5 w-3.5" />
      )}
      
      {isVerified ? (
        `AI Verified: ${condition}`
      ) : (
        `AI Unverified (Low Confidence)`
      )}
    </Badge>
  );
}
