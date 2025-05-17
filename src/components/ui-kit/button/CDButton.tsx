
import React from 'react';
import { cn } from '@/utils/cn';

export type CDButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'danger' | 'link' | 'ghost' | 'default';
export type CDButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon';

export interface CDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CDButtonVariant;
  size?: CDButtonSize;
  isLoading?: boolean;
  loading?: boolean; // Added for backward compatibility
  disabled?: boolean;
  asChild?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | string;
  block?: boolean;
  ariaLabel?: string;
}

/**
 * Button component that follows the design system
 */
const CDButton = React.forwardRef<HTMLButtonElement, CDButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'default', 
    isLoading = false, 
    loading = false, // For backward compatibility
    disabled, 
    children, 
    icon,
    iconPosition = 'left',
    block = false,
    ariaLabel,
    ...props 
  }, ref) => {
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
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary', // Same as primary for backward compatibility
    };
    
    // Size styles
    const sizeStyles = {
      default: 'h-10 px-4 py-2 text-sm',
      xs: 'h-8 px-2.5 text-xs',
      sm: 'h-9 px-3 text-xs',
      lg: 'h-11 px-8 text-base',
      icon: 'h-10 w-10'
    };

    // For backwards compatibility - prioritize isLoading over loading
    const isButtonLoading = isLoading || loading;
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          block && 'w-full',
          isButtonLoading && 'cursor-not-allowed opacity-70',
          className
        )}
        disabled={disabled || isButtonLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isButtonLoading ? (
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
          <>
            {icon && iconPosition === 'left' && (
              <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="ml-2">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

CDButton.displayName = 'CDButton';

export default CDButton;
