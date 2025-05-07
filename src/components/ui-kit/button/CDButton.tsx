
import React from 'react';
import { cn } from '@/utils/cn';

export type CDButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'danger' | 'link' | 'ghost';
export type CDButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon';

export interface CDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CDButtonVariant;
  size?: CDButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  className?: string;
}

/**
 * Button component that follows the design system
 */
const CDButton = React.forwardRef<HTMLButtonElement, CDButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading = false, disabled, children, ...props }, ref) => {
    // Base button styles
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      link: 'text-primary underline-offset-4 hover:underline',
      ghost: 'hover:bg-accent hover:text-accent-foreground'
    };
    
    // Size styles
    const sizeStyles = {
      default: 'h-10 px-4 py-2 text-sm',
      xs: 'h-8 px-2.5 text-xs',
      sm: 'h-9 px-3 text-xs',
      lg: 'h-11 px-8 text-base',
      icon: 'h-10 w-10'
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isLoading && 'cursor-not-allowed opacity-70',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

CDButton.displayName = 'CDButton';

export default CDButton;
