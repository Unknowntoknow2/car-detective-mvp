
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  badge?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  className,
  align = 'left',
  badge,
  size = 'md',
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const sizeClasses = {
    sm: 'mb-4',
    md: 'mb-8',
    lg: 'mb-10',
  };

  const titleSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className={cn(sizeClasses[size], alignClasses[align], className, 'max-w-3xl')}>
      <div className="flex items-center gap-3">
        <h2 className={cn("font-bold tracking-tight", titleSizeClasses[size])}>{title}</h2>
        {badge && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-3 text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
