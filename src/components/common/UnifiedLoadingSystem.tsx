
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({ 
  isLoading = false, 
  loadingText = "Loading...", 
  children, 
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button 
      disabled={disabled || isLoading} 
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg";
}

export function LoadingSpinner({ size = "default" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  );
}

export function LoadingGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 animate-pulse">
      {children}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function LoadingState({ message = "Loading...", size = "default", className }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className || ''}`}>
      <LoadingSpinner size={size} />
      <span className="ml-2 text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

// Alias for backward compatibility
export const Spinner = LoadingSpinner;
