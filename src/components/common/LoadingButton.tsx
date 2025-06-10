
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "ghost";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function LoadingButton({
  isLoading = false,
  loadingText = "Loading...",
  onClick,
  variant = "default",
  className,
  children,
  disabled = false,
}: LoadingButtonProps) {
  return (
    <Button
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
}

export default LoadingButton;
