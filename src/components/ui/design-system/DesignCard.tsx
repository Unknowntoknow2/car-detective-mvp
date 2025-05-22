
import React from 'react';
import { cn } from '@/lib/utils';

export interface DesignCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'premium';
  className?: string;
}

const DesignCard: React.FC<DesignCardProps> = ({
  children,
  title,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'bg-white border shadow-sm',
    outline: 'bg-transparent border',
    ghost: 'bg-transparent border-none',
    premium: 'bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-sm',
  };

  return (
    <div className={cn('rounded-lg p-6', variantClasses[variant], className)}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default DesignCard;
