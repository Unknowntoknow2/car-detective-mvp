
import { toast as sonnerToast } from 'sonner';
import * as React from 'react';

export type ToastProps = {
  description?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
};

export function useToast() {
  return {
    toast: ({ description, variant = 'default' }: ToastProps) => {
      if (variant === 'destructive') {
        sonnerToast.error(description);
      } else if (variant === 'success') {
        sonnerToast.success(description);
      } else {
        sonnerToast(description);
      }
    }
  };
}

// Toast function for direct usage without the hook
export function toast(props: ToastProps) {
  const { description, variant = 'default' } = props;
  
  if (variant === 'destructive') {
    sonnerToast.error(description);
  } else if (variant === 'success') {
    sonnerToast.success(description);
  } else {
    sonnerToast(description);
  }
}
