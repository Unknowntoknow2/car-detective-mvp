
import { toast as sonnerToast } from 'sonner';
import * as React from 'react';

export type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
};

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      const { title, description, variant = 'default', className } = props;
      
      if (variant === 'destructive') {
        sonnerToast.error(title, description);
      } else if (variant === 'success') {
        sonnerToast.success(title, description);
      } else if (variant === 'warning') {
        sonnerToast.warning(title, description);
      } else if (variant === 'info') {
        sonnerToast.info(title, description);
      } else {
        sonnerToast(title, description);
      }
    }
  };
}

// Toast function for direct usage without the hook
export function toast(props: ToastProps) {
  const { title, description, variant = 'default', className } = props;
  
  if (variant === 'destructive') {
    sonnerToast.error(title, description);
  } else if (variant === 'success') {
    sonnerToast.success(title, description);
  } else if (variant === 'warning') {
    sonnerToast.warning(title, description);
  } else if (variant === 'info') {
    sonnerToast.info(title, description);
  } else {
    sonnerToast(title, description);
  }
}
