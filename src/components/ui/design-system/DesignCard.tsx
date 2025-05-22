
import React from 'react';
import { cn } from '@/lib/utils';

export interface DesignCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'outline' | 'premium' | string;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  children,
  className,
  title,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'border border-border bg-background/50 hover:bg-background/80';
      case 'premium':
        return 'border border-amber-200 bg-amber-50/50 hover:bg-amber-50/80 text-amber-900';
      default:
        return 'bg-white border border-border shadow-sm hover:shadow';
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all duration-200',
        getVariantStyles(),
        className
      )}
    >
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export default DesignCard;
