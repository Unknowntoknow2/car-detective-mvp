import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion, MotionProps } from 'framer-motion';

// Redefine the variant to match what Button accepts
export interface CDButtonProps extends Omit<ButtonProps, 'asChild' | 'variant'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingText?: string;
  block?: boolean; // Use instead of fullWidth
  ariaLabel?: string;
  children: React.ReactNode;
  motionProps?: Omit<MotionProps, keyof React.HTMLAttributes<HTMLButtonElement>>;
}

export const CDButton = React.forwardRef<HTMLButtonElement, CDButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className = '',
      icon,
      iconPosition = 'left',
      loading = false,
      loadingText = 'Loading...',
      block = false,
      ariaLabel,
      children,
      motionProps,
      ...props
    },
    ref
  ) => {
    const getSizeClass = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1 text-xs';
        case 'md':
          return 'px-4 py-2 text-sm';
        case 'lg':
          return 'px-6 py-3 text-base';
        default:
          return 'px-4 py-2 text-sm';
      }
    };

    const buttonContent = (
      <>
        {loading ? (
          <>
            <span className="animate-spin mr-2">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {loadingText}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
          </>
        )}
      </>
    );

    const buttonClasses = `
      ${getSizeClass()}
      ${block ? 'w-full' : ''}
      ${className}
      transition-colors duration-200
      ${loading ? 'opacity-70 cursor-not-allowed' : ''}
    `;

    // If motion props are provided, wrap with motion.button - but don't use for animation
    if (motionProps) {
      return (
        <motion.div {...motionProps}>
          <Button
            ref={ref}
            className={buttonClasses}
            disabled={loading || props.disabled}
            aria-label={ariaLabel}
            type={props.type || 'button'}
            variant={variant}
            {...props}
          >
            {buttonContent}
          </Button>
        </motion.div>
      );
    }

    // Otherwise, use regular Button
    return (
      <Button
        ref={ref}
        className={buttonClasses}
        disabled={loading || props.disabled}
        aria-label={ariaLabel}
        type={props.type || 'button'}
        variant={variant}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  }
);

CDButton.displayName = 'CDButton';
