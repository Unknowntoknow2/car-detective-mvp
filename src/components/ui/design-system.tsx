
import React from 'react';
import { cn } from "@/lib/utils";

export interface DesignCardProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outlined' | 'glass' | 'elevated';
  className?: string;
  title?: string; // Make title optional
}

export const DesignCard: React.FC<DesignCardProps> = ({ 
  children, 
  variant = 'solid', 
  className,
  title
}) => {
  const variantClasses = {
    'solid': 'bg-card text-card-foreground shadow-sm',
    'outlined': 'border border-border bg-background',
    'glass': 'backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10',
    'elevated': 'bg-white dark:bg-black shadow-lg'
  };

  return (
    <div className={cn('rounded-lg p-6', variantClasses[variant], className)}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  badge?: string; // Added badge property
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  align = 'left',
  size = 'md',
  className,
  badge
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className={cn(alignClasses[align], sizeClasses[size], className)}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <h2 className={cn(
          "font-bold tracking-tight",
          size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
        )}>
          {title}
        </h2>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className={cn(
          "text-muted-foreground",
          size === 'lg' ? 'text-lg' : 'text-base'
        )}>
          {description}
        </p>
      )}
    </div>
  );
};
