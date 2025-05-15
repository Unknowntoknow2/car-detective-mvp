
import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';

interface PremiumBadgeProps {
  variant?: 'default' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PremiumBadge({ 
  variant = 'default', 
  size = 'md',
  className 
}: PremiumBadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20",
    outline: "bg-transparent text-primary border border-primary",
    gold: "bg-amber-100 text-amber-800 border border-amber-300",
  };
  
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };
  
  return (
    <div className={cn(
      "rounded-full inline-flex items-center font-medium",
      variants[variant],
      sizes[size],
      className
    )}>
      <BadgeCheck className="h-3.5 w-3.5 mr-1" />
      Premium
    </div>
  );
}
