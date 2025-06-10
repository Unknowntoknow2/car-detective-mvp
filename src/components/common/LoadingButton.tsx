
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  loadingText = "Loading...",
  onClick,
  variant = "default",
  className,
  children,
}: LoadingButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={isLoading}
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
