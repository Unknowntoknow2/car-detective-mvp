
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'gold';
  className?: string;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className,
  removable = false,
  onRemove
}) => {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-input',
    destructive: 'bg-red-500 text-white',
    gold: 'bg-yellow-500 text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-xs hover:text-red-300"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Badge;
