
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface DesignCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  className?: string;
  title?: string; // Make title optional
}

export const DesignCard: React.FC<DesignCardProps> = ({
  children,
  variant = 'default',
  className,
  title,
}) => {
  // Apply different styles based on variant
  const variantStyles = {
    default: 'bg-white border border-border',
    outlined: 'border border-border bg-transparent',
    elevated: 'shadow-md bg-white',
    filled: 'bg-muted',
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      {title && (
        <div className="px-5 py-3 border-b font-medium">
          {title}
        </div>
      )}
      <CardContent className={cn("p-5", !title && "pt-5")}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DesignCard;
