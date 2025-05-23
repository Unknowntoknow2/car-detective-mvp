
import { toast as sonnerToast, ExternalToast } from 'sonner';
import * as React from 'react';

export type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
};

// Convert our app's ToastProps to Sonner's ExternalToast format
const convertToExternalToast = (props: ToastProps): [string | React.ReactNode, ExternalToast?] => {
  const { title, description, variant = 'default', className } = props;
  
  return [
    title || '', 
    { 
      description,
      className
    }
  ];
};

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      const { variant = 'default' } = props;
      const [message, options] = convertToExternalToast(props);
      
      if (variant === 'destructive') {
        sonnerToast.error(message, options);
      } else if (variant === 'success') {
        sonnerToast.success(message, options);
      } else if (variant === 'warning') {
        sonnerToast.warning(message, options);
      } else if (variant === 'info') {
        sonnerToast.info(message, options);
      } else {
        sonnerToast(message, options);
      }
    }
  };
}

// Toast function for direct usage without the hook
export function toast(props: ToastProps) {
  const { variant = 'default' } = props;
  const [message, options] = convertToExternalToast(props);
  
  if (variant === 'destructive') {
    sonnerToast.error(message, options);
  } else if (variant === 'success') {
    sonnerToast.success(message, options);
  } else if (variant === 'warning') {
    sonnerToast.warning(message, options);
  } else if (variant === 'info') {
    sonnerToast.info(message, options);
  } else {
    sonnerToast(message, options);
  }
}
