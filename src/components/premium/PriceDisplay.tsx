
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ className, size = 'md' }: PriceDisplayProps) {
  const price = 29.99;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-bold", sizeClasses[size])}>
        ${price}
      </span>
      <Badge variant="outline" className="bg-primary/10 text-primary">
        One-time
      </Badge>
    </div>
  );
}
