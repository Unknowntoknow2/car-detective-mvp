
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'subtle' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
}

export function PremiumBadge({
  variant = 'default',
  size = 'md',
  icon = true,
  className,
  children,
  ...props
}: PremiumBadgeProps) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "bg-primary/10 text-primary border-primary/40",
    subtle: "bg-primary/5 text-primary",
    gold: "bg-amber-100 text-amber-800 border-amber-300",
  };
  
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "px-3 py-1",
  };
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "flex items-center gap-1 font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <BadgeCheck className="h-3.5 w-3.5" />}
      {children || "Premium"}
    </Badge>
  );
}
