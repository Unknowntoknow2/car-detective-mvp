
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export const LoadingSpinner = ({ size = 'md', className, message }: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div role="status" className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClass[size])} />
      {message && (
        <p className="text-sm text-muted-foreground mt-2">{message}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "ghost";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const LoadingButton = ({
  isLoading = false,
  loadingText = "Loading...",
  onClick,
  variant = "default",
  className,
  children,
  disabled = false,
  type = "button",
}: LoadingButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
      disabled={isLoading || disabled}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

interface LoadingGridProps {
  itemCount?: number;
  columns?: number;
  cardHeight?: string;
  showHeader?: boolean;
  className?: string;
}

export const LoadingGrid = ({
  itemCount = 6,
  columns = 3,
  cardHeight = "h-64",
  showHeader = true,
  className = "",
}: LoadingGridProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      {showHeader && (
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}

      <div
        className={cn("grid gap-6", {
          "grid-cols-1": columns === 1,
          "grid-cols-1 md:grid-cols-2": columns === 2,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": columns === 4,
        })}
      >
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className={cn(cardHeight, "w-full")}>
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState = ({ 
  message = "Loading...", 
  size = 'md',
  className 
}: LoadingStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <LoadingSpinner size={size} message={message} />
    </div>
  );
};

// Export individual components for backward compatibility
export { LoadingSpinner as Spinner } from './UnifiedLoadingSystem';
