
import { toast as sonnerToast } from 'sonner';
import * as React from 'react';

export type ToastProps = {
  description?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
};

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      const { description, variant = 'default', className } = props;
      
      if (variant === 'destructive') {
        sonnerToast.error(description);
      } else if (variant === 'success') {
        sonnerToast.success(description);
      } else if (variant === 'warning') {
        sonnerToast.warning(description);
      } else if (variant === 'info') {
        sonnerToast.info(description);
      } else {
        sonnerToast(description);
      }
    }
  };
}

// Toast function for direct usage without the hook
export function toast(props: ToastProps) {
  const { description, variant = 'default', className } = props;
  
  if (variant === 'destructive') {
    sonnerToast.error(description);
  } else if (variant === 'success') {
    sonnerToast.success(description);
  } else if (variant === 'warning') {
    sonnerToast.warning(description);
  } else if (variant === 'info') {
    sonnerToast.info(description);
  } else {
    sonnerToast(description);
  }
}
