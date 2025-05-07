import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export type CDButtonVariant = 
  | "default" 
  | "secondary" 
  | "outline" 
  | "destructive" 
  | "primary"
  | "danger"; // Add "danger" variant

export interface CDButtonProps {
  variant?: CDButtonVariant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  iconPosition?: "left" | "right";
}

export const CDButton = forwardRef<HTMLButtonElement, CDButtonProps>(
  ({ 
    variant = "default", 
    size = "md", 
    fullWidth = false, 
    disabled = false, 
    onClick, 
    children, 
    icon, 
    type = "button", 
    className,
    iconPosition = "left",
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variant === "outline" ? "bg-transparent border border-input hover:bg-accent hover:text-accent-foreground" : "",
          variant === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "",
          variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "",
          variant === "outline" && disabled ? "opacity-80 cursor-not-allowed" : "",
          variant === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
		  variant === "danger" ? "bg-red-500 text-white hover:bg-red-700" : "",
          size === "sm" ? "h-9 px-3 rounded-md" : "",
          size === "md" ? "h-10 px-4" : "",
          size === "lg" ? "h-11 px-8 rounded-md" : "",
          fullWidth ? "w-full" : "",
          className
        )}
        onClick={onClick}
        disabled={disabled}
        type={type}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);

CDButton.displayName = "CDButton";
