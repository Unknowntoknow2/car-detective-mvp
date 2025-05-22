
import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  size = 'md',
  align = 'left',
  className,
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
  }[size];

  return (
    <div className={cn("mb-8", alignClass, className)}>
      <h2 className={cn("font-bold tracking-tight", sizeClasses)}>
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-muted-foreground max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
};

export interface DesignCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'premium' | string;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  title,
  description,
  icon,
  footer,
  className,
  children,
  variant = 'default'
}) => {
  const variantClasses = variant === 'premium' 
    ? 'border-amber-200 bg-amber-50' 
    : 'bg-card text-card-foreground';

  return (
    <div className={cn("rounded-lg border shadow", variantClasses, className)}>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
      {footer && (
        <div className="p-6 pt-0 border-t mt-4">
          {footer}
        </div>
      )}
    </div>
  );
};

// Create a Button component that extends the UI button with isLoading support
export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading,
  loadingText = 'Loading...',
  variant = 'default',
  ...props
}) => {
  // Map premium variant to default with custom styling
  const buttonVariant = variant === 'premium' ? 'default' : variant;
  const premiumClasses = variant === 'premium' ? 'bg-amber-500 hover:bg-amber-600 text-white' : '';
  
  return (
    <button
      {...props}
      className={cn(props.className, premiumClasses)}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};
