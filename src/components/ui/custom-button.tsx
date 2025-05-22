
import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<ShadcnButtonProps, 'asChild'> {
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  disabled,
  className,
  ...props
}) => {
  return (
    <ShadcnButton
      className={cn(className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  );
};

// Additional variant for premium
export const PremiumButton: React.FC<ButtonProps> = ({ className, ...props }) => (
  <Button
    className={cn("bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700", className)}
    {...props}
  />
);
