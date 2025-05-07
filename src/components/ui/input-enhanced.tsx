
// ✅ TS check passed
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  error?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "filled" | "outline" | "ghost";
  success?: boolean;
  helperText?: string;
}

const InputEnhanced = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error, 
    icon, 
    trailingIcon, 
    size = "default", 
    variant = "default",
    success,
    helperText,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: "h-8 px-3 py-1 text-sm",
      default: "h-10 px-4 py-2",
      lg: "h-12 px-4 py-2 text-base",
    }

    const variantClasses = {
      default: "border border-input bg-background",
      filled: "border border-input bg-muted",
      outline: "border-2 border-input bg-transparent",
      ghost: "border-0 bg-transparent shadow-none",
    }

    const stateClasses = {
      error: "border-destructive focus-visible:ring-destructive text-destructive",
      success: "border-success-DEFAULT focus-visible:ring-success-DEFAULT",
    }

    return (
      <div className="w-full space-y-1.5">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              "flex w-full rounded-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              sizeClasses[size],
              variantClasses[variant],
              error && stateClasses.error,
              success && stateClasses.success,
              icon && "pl-10",
              trailingIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {trailingIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {trailingIcon}
            </div>
          )}
        </div>
        
        {helperText && (
          <p className={cn(
            "text-xs",
            error ? "text-destructive" : 
            success ? "text-success-DEFAULT" : 
            "text-muted-foreground"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

InputEnhanced.displayName = "InputEnhanced"

export { InputEnhanced }
