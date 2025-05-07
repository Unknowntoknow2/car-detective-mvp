
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export type CDButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'destructive';
export type CDButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-neutral-lighter text-neutral-darker hover:bg-neutral-light",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        danger: "bg-red-500 text-white hover:bg-red-600",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        xs: "h-7 px-2 rounded-md text-xs",
        sm: "h-9 px-3 rounded-md",
        md: "h-10 py-2 px-4",
        lg: "h-11 px-8",
        xl: "h-12 px-10 text-base"
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface CDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const CDButton = React.forwardRef<HTMLButtonElement, CDButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

CDButton.displayName = "CDButton";
