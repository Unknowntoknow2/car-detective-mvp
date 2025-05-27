
import * as React from 'react';
import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
};

export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  if (variant === 'destructive') {
    sonnerToast.error(title, {
      description,
    });
  } else if (variant === 'success') {
    sonnerToast.success(title, {
      description,
    });
  } else {
    sonnerToast(title, {
      description,
    });
  }
};

export const useToast = () => {
  return { toast };
};
